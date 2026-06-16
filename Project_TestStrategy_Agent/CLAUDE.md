CLAUDE.md — Project Constitution
Single source of architectural truth. CLAUDE.md is law; the planning files (task_plan.md, findings.md, progress.md) are memory.

---
## Approved Blueprint ✅ (2026-06-09)
| Question | Answer |
|---|---|
| North Star | Enter JIRA ID → Generate → View full 21-section Test Strategy on screen |
| GROQ Model | llama-3.3-70b-versatile |
| Primary Input | JIRA ID (live fetch from Jira Cloud) |
| UI Style | Dark + Light mode toggle |
| Section Coverage | All 21 sections — strict, no skipping |
| Sparse Input Rule | Fill missing fields with [INSERT VALUE] or TBD — never guess |
---

1. Mission
Test Strategy Buddy — a lightweight React app + Express proxy that takes Jira config + a GROQ key in Settings, accepts a Jira ID or a plain-text / .txt / .md requirement, fetches the requirement, and auto-generates a formal 21-section QA Test Strategy rendered on screen and downloadable as Markdown. UI supports dark and light mode.

1b. Developer Quick Reference
Commands (npm; no test or lint setup exists in this repo):

npm run dev — concurrently runs the Express proxy (node server.js, port 8787) and Vite (port 5173, auto-opens browser). Develop here: Vite proxies /api/* → 8787.
npm run server / npm run client — run either half alone.
npm run build — Vite emits dist/. With dist/ present, server.js serves the SPA itself, so npm start (NODE_ENV=production node server.js) runs the whole app on port 8787 with no Vite.
npm run handshake [JIRA-ID] — smoke-test live creds against Jira + GROQ before trusting the full pipeline. Reads .env, defaults to TICKET-ID-101, exits non-zero on failure. Run this first after adding .env keys (JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN|JIRA_TOKEN, GROQ_KEY).
Request flow (one place to trace end-to-end): src/components/Generator.jsx → src/lib/api.js (POST /api/generate) → server.js mergeConfig (UI config overrides .env) → branch: context present → tools/contextSource.js; else jiraId → tools/jiraClient.js → tools/testStrategy.js generateStrategy (GROQ JSON) → renderMarkdown (deterministic) → response { issue, strategy, markdown }. POST /api/save writes output/test-strategy-<id>.md.

Two server implementations, shared tools — keep them in sync:

server.js — the Express dev/prod proxy (the one npm run dev uses).
api/*.js — Vercel serverless mirrors (config.js, generate.js, save.js) for deployment. Both import the same tools/ modules, so domain logic lives only in tools/ — edit there, not in the two route layers.
Frontend: index.html → src/main.jsx → src/App.jsx (tabs: Generate / Settings; theme via data-theme on <html>, persisted to localStorage). Config (Jira creds + GROQ key) is held in localStorage key blast.strategy.config and sent in each request body — .env is only the server-side fallback.

2. Integrations
Service	Use	Endpoint	Auth
Jira Cloud	Fetch issue	GET {JIRA_URL}/rest/api/3/issue/{id}	Basic base64(email:token)
GROQ	Generate strategy	POST https://api.groq.com/openai/v1/chat/completions	Bearer GROQ_KEY
Model: openai/gpt-oss-120b (FREE).
Why a proxy: Jira Cloud REST blocks browser CORS; the proxy also keeps the token off the client.
3. Data Schema (Input / Output) — ✅ CONFIRMED
3a. Config (from .env defaults, overridable in Settings UI)
{ "jiraUrl": "https://your-domain.atlassian.net", "jiraEmail": "you@example.com",
  "jiraToken": "ATATT...", "groqKey": "gsk_..." }
.env keys: JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN (or JIRA_TOKEN), GROQ_KEY.

3b. Generate request (frontend → proxy)
{ "jiraId": "TICKET-ID-101", "config": { "...": "see 3a (optional; falls back to .env)" } }
or { "context": "<pasted requirement / .txt / .md text>", "config": { } }.

3c. Normalized issue (proxy internal — same shape for Jira and Context paths)
{ "key": "TICKET-ID-101", "summary": "string", "description": "string (ADF flattened)",
  "issueType": "string", "status": "string", "priority": "string",
  "components": ["string"], "labels": ["string"], "fixVersions": ["string"],
  "reporter": "string", "assignee": "string | null" }
3d. Test Strategy payload (GROQ JSON output → deterministic Markdown)
21-section model aligned with TEST_STRATEGY_TEMPLATE.md. Keys: documentControl, revisionHistory[], introduction, objective, scope{inScope[],outOfScope[]}, testLevels[], focusAreas[], testApproach[], testEnvironments[], testDataManagement[], tools[], roles{teamSize,durationMonths,entries[]}, schedule{items[],milestones[],buffer,estimationBasis}, deliverables[], criteria{entry[],exit[],suspension[],resumption[]}, defectManagement{lifecycle,severity[],priority[],triageCadence,sla,tracker}, metrics[], risks[], assumptionsDependencies{assumptions[],dependencies[]}, communication[], domainConsiderations[], approvals[].

Full key/type detail lives in SCHEMA_HINT in tools/testStrategy.js. Governance sections the requirement is silent on (test levels, defect lifecycle/severity/priority, metrics, entry/exit/suspension/resumption, tools, roles) default to standard QA values defined in tools/testStrategy.js. Output rendered in UI + downloadable to output/test-strategy-<id>.md.

4. Behavioral Rules
Tone: formal, professional QA.
Native template only: strategy sections come from built-in QA knowledge encoded in tools/testStrategy.js — no external skill dependency.
Do Not fabricate: where the requirement is silent on project-specific facts, emit TBD; never invent Jira data.
Deterministic boundary: GROQ produces content (JSON); Markdown rendering and file I/O are deterministic code in tools/ / server.js.
Secrets: tokens live in .env / Settings only; never logged, never committed.
5. Architectural Invariants (A.N.T. 3-layer)
Layer 1 — Architecture (architecture/): Markdown SOPs for jira-fetch, groq-generate, test-strategy-template.
Layer 2 — Navigation: server.js routes request → jiraClient/contextSource → testStrategy(groqClient) → response. Vercel mirror in api/.
Layer 3 — Tools (tools/): atomic JS engines — jiraClient.js, groqClient.js, contextSource.js, testStrategy.js, handshake.js.
Source of truth: single Jira issue (live fetch) or pasted requirement. No linked issues.
Delivery: on-screen render + local .md download; optional output/ save in dev.
.tmp/ for intermediates; output/ for deliverable strategies.
6. Maintenance Log
2026-06-06: Initial build. Adapted from the working test-plan-generator-agent (22-section Test Plan) into a 21-section Test Strategy generator per TEST_STRATEGY_TEMPLATE.md. Reused jiraClient.js, groqClient.js, contextSource.js, handshake.js, Settings.jsx, lib/api.js, vite.config.js, main.jsx ~verbatim. New domain core tools/testStrategy.js + view src/components/TestStrategyView.jsx. Added dark/light theme toggle (data-theme on <html>, persisted to localStorage).
Express pinned to v4; catch-all route uses regex /^(?!\/api).*/ (express 5 breaks app.get('*')).
Live API path unverified until .env creds added → run npm run handshake <JIRA-ID>.
Self-anneal protocol: on a tool failure, read the error, patch the tools/ file, re-test, then record the learning in the matching architecture/*.md.

2026-06-09: Phase 5 COMPLETE — Deployed to Vercel.
- Live URL: https://test-strategy-agent-xi.vercel.app
- Deployment ID: dpl_9ytf8pNZkq7zs7f7si4XKxhF8FsH
- Inspect: https://vercel.com/krishnageethika-s-projects2/test-strategy-agent/9ytf8pNZkq7zs7f7si4XKxhF8FsH
- Build: 288 modules, 1.90s (Washington D.C., iad1 region)
- Self-Anneal: First deploy rejected "project name must be lowercase" → fixed with --name test-strategy-agent flag
- All 6 BLAST phases complete ✅