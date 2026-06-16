# Task Plan — Test Strategy Agent (BLAST)
**Objective:** Lightweight React app — takes Jira config + GROQ key in Settings, accepts a Jira ID / plain text / .txt / .md input, fetches the requirement, and auto-generates a formal 21-section QA Test Strategy rendered on screen and downloadable as Markdown.
> Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Phase 0 — Initialization
- [x] Confirm existing files: BLAST.md, CLAUDE.md, RICEPOT_framework.md, TestStrategyFormat.md, TestStrategyObjective.md
- [x] Create task_plan.md (this file)
- [x] Create findings.md
- [x] Create progress.md
- [x] HALT honored — no code until Discovery + Schema confirmed

---

## Phase 1 — B: Blueprint
- [x] Discovery (5 questions) — answered ✅
- [x] Data-First — Input/Output JSON schema confirmed in CLAUDE.md ✅
- [x] Research — BLAST + RICEPOT frameworks reviewed ✅

---

## Phase 2 — L: Link (Connectivity)
- [x] .env setup with JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN, GROQ_KEY ✅
- [x] tools/handshake.js — verify both connections ✅
- [x] Live handshake PASS — SCRUM-5 fetched + GROQ responded ✅

---

## Phase 3 — A: Architect (3-layer)
- [x] Layer 1 SOPs in architecture/ (jira-fetch-sop.md, groq-generate-sop.md, test-strategy-template.md) ✅
- [x] Layer 2 navigation — server.js (Express :8787, /api/generate, /api/save) ✅
- [x] Layer 3 tools — jiraClient.js, groqClient.js, testStrategy.js (21-section SYSTEM_PROMPT) ✅

---

## Phase 4 — S: Stylize (UI)
- [x] React UI: App.jsx (tabs), Generator.jsx, Settings.jsx, TestStrategyView.jsx ✅
- [x] Dark + light mode toggle (data-theme on <html>, persisted to localStorage) ✅
- [x] Markdown render (react-markdown + remark-gfm) + blob download button ✅
- [x] Build verified — 288 modules, 1.89s ✅

---

## Phase 5 — T: Trigger (Deploy)
- [x] package.json scripts (dev, server, client, build, start, handshake) ✅
- [x] Vercel serverless — api/generate.js, api/save.js ✅
- [x] vercel.json — installCommand, buildCommand, outputDirectory, rewrites ✅
- [x] Deployed: https://test-strategy-agent-xi.vercel.app ✅
- [x] Self-Anneal: uppercase project name error fixed with --name flag ✅
- [x] Maintenance Log updated in CLAUDE.md ✅

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

**Next step:** Phase 2 — Link (set up .env, verify JIRA + GROQ connections)
