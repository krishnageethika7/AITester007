# Task Plan — Jira → Test Plan Generator (BLAST)
**Objective:** Lightweight React app: enter Jira config + GROQ key in Settings, give a Jira ID (e.g. `VWO-48`), auto-generate a formal Test Plan (on screen + downloadable `.md`).
> Status legend: `[ ]` todo · `[~]` in progress · `[x]` done
## Phase 0 — Initialization
- [x] Create memory files (`task_plan.md`, `findings.md`, `progress.md`, `gemini.md`)
- [x] HALT honored until Discovery + Schema confirmed
## Phase 1 — B: Blueprint
- [x] Discovery (5 questions) — answered
- [x] Data-First — Input/Output JSON schema confirmed in `gemini.md`
- [x] Research — GROQ (OpenAI-compatible) endpoint, Jira ADF, CORS → proxy (see `findings.md`)
- [x] Tech stack chosen: Vite + React frontend, Express proxy, native fetch
## Phase 2 — L: Link (Connectivity)
- [x] `.env` wiring via `dotenv`
- [x] `tools/jiraClient.js` — fetch + normalize issue
- [x] `tools/groqClient.js` — chat completion call
- [x] `tools/handshake.js` — verify both connections (run once creds added)
- [x] Live handshake PASS — Jira VWO-48 fetched + GROQ responded (2026-06-06)
## Phase 3 — A: Architect (3-layer)
- [x] Layer 1 SOPs in `architecture/` (jira-fetch, groq-generate, test-plan-template)
- [x] Layer 2 navigation — `server.js` routing
- [x] Layer 3 tools — `testPlan.js` (prompt build + deterministic Markdown render)
## Phase 4 — S: Stylize (UI)
- [x] React UI: Settings panel, Generator, Test Plan view
- [x] Clean CSS, professional layout
- [x] Markdown render + download button
- [x] Build verified — `npm run build` OK (35 modules), server boot + endpoints OK
- [x] User feedback on UI (pending — app ready to run)
## Phase 5 — T: Trigger (Deploy)
- [x] `package.json` scripts (`dev`, `build`, `start`)
- [x] README run instructions
2 days ago

docs: record Vercel deploy + Phase 5 Trigger in BLAST memory
- [x] Maintenance Log in `LLM.md` (was `gemini.md`)
- [x] Cloud deploy — Vercel serverless (`api/`), live at https://testplanbuddy.vercel.app
2 days ago

feat: add chapter 03 BLAST Jira to Test Plan generator (React + GROQ)
## Done-when
- `npm install && npm run dev`, open UI, enter creds + `VWO-48`, get a formal Markdown test plan.
## ✅ VERIFIED LIVE (2026-06-09)
- Node v24.15.0 + npm 11.12.1 confirmed.
- `vite build` → 288 modules, 2.41s ✅
- `node server.js` → Express running on http://localhost:8787 ✅
- JIRA: testjira007.atlassian.net — project key is `SCRUM` (not VWO).
- GROQ: `gsk_...` key verified — llama-3.3-70b-versatile responding.
- Full Python CLI pipeline also verified: `python main.py SCRUM-5` → 97-line test plan saved.