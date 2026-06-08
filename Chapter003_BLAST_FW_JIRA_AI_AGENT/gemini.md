# gemini.md — Project Constitution
# JIRA AI Test Plan Agent

> This file is LAW. Update only when: a schema changes, a rule is added, or architecture is modified.

---

## Data Schema

### Input Shape
```json
{
  "jira_id": "VWO-48"
}
```

### Intermediate Shape (Raw JIRA Payload)
```json
{
  "jira_id": "VWO-48",
  "summary": "string",
  "description": "string (Atlassian Document Format or plain text)",
  "acceptance_criteria": "string (if present in description or custom field)",
  "issue_type": "Story | Bug | Task | Sub-task",
  "status": "string",
  "priority": "string",
  "labels": ["string"],
  "reporter": "string",
  "assignee": "string"
}
```

### Output Shape (Final Test Plan — saved as Markdown file)
```json
{
  "jira_id": "VWO-48",
  "summary": "string",
  "test_plan": {
    "objective": "string",
    "scope": "string",
    "out_of_scope": "string",
    "test_cases": [
      {
        "id": "TC-001",
        "type": "Positive | Negative | Edge | API",
        "title": "string",
        "preconditions": "string",
        "steps": ["string"],
        "expected_result": "string"
      }
    ],
    "risks": "string"
  }
}
```

---

## Behavioral Rules

1. **Format**: Formal QA Template — structured sections: Objective, Scope, Test Cases table, Out-of-Scope, Risks.
2. **Coverage**: Every test plan MUST include all four types — Positive (happy path), Negative (error/invalid), Edge cases, and API-level test cases.
3. **No placeholders**: All test case fields must be concrete and specific to the JIRA ticket content. Do not use "TBD" or generic filler.
4. **Delivery**: Save final output as a `.md` file locally in `.tmp/` during generation, then copy to the project root as `test_plan_<JIRA_ID>.md`.
5. **LLM**: Use Groq (`llama-3.3-70b-versatile`) for test plan generation.
6. **Source**: JIRA Cloud via REST API v3 using Basic Auth (email + API token).
7. **Do Not**: Do not invent requirements not present in the JIRA ticket. If data is missing, flag it clearly in the Risks section.

---

## Architectural Invariants

> To be defined after Phase 2 Link phase.

---

---

## React UI Layer (v2)

### Approved Blueprint ✅ (2026-06-09)
| Question | Answer |
|---|---|
| North Star | User types a JIRA ID → clicks Generate → sees JIRA metadata + rendered test plan on screen |
| Backend Bridge | FastAPI (Python) wrapping existing tools/ |
| UI Data | JIRA ticket metadata + rendered Markdown test plan |
| Style | Dark mode, clean custom CSS, no heavy UI frameworks |

### React UI Data Schema

#### API Request (Frontend → FastAPI)
```json
{ "issue_key": "SCRUM-5" }
```

#### API Response (FastAPI → Frontend)
```json
{
  "jira_id": "SCRUM-5",
  "summary": "string",
  "issue_type": "string",
  "status": "string",
  "priority": "string",
  "reporter": "string",
  "assignee": "string",
  "labels": ["string"],
  "test_plan_markdown": "string (full Markdown)"
}
```

#### UI State Shape (React)
```json
{
  "issueKey": "SCRUM-5",
  "loading": false,
  "error": null,
  "result": { /* API Response shape above */ }
}
```

### React UI Behavioral Rules
1. **Single page** — no routing, no multi-page. One input, one results area.
2. **Settings panel** — user enters JIRA base URL, email, API token, and GROQ key in a settings panel (not hardcoded in .env for the UI layer).
3. **Dark mode** — professional dark background, clean accent colors.
4. **Rendered Markdown** — use `react-markdown` + `remark-gfm` to render the test plan.
5. **Download button** — allow user to download the generated test plan as a `.md` file.
6. **Loading state** — show spinner while generating (Groq can take 3-8s).
7. **Error state** — show clear error message if JIRA ID not found or API fails.
8. **Lightweight** — Vite + React only. No Redux, no router, no TypeScript. react-markdown for rendering.

### React UI Architectural Invariants
- **Backend**: Express.js server on port **8787** (proxies JIRA + GROQ calls, avoids CORS).
- **Frontend**: Vite dev server on port **5173** — proxies `/api` → `http://localhost:8787`.
- **API endpoint**: `POST /api/generate` with `{ issue_key, jiraUrl, email, token, groqKey }`.
- **Save endpoint**: `POST /api/save` — writes output to `output/test-plan-{key}.md`.
- **Frontend dir**: `frontend/`
- **Server file**: `server.js` (project root of React app)
- **GROQ**: Uses OpenAI-compatible endpoint — `https://api.groq.com/openai/v1/chat/completions`.
- **No Python bridge** — JIRA and GROQ calls are made from Express.js in JavaScript.

---

## Maintenance Log

### 2026-06-09 — Vercel Production Deploy
| Item | Detail |
|---|---|
| Live URL | https://testplangenerator-one.vercel.app |
| Inspect | https://vercel.com/krishnageethika-s-projects2/testplangenerator |
| Deployment ID | dpl_6cuMayvxWimh4SBmRGgpNyMJEG2q |
| Region | Washington D.C. (iad1) |
| Serverless fns | api/generate.js, api/save.js |
| Runtime | Node.js 20.x (auto-detected) |
| Self-Annealing | Fixed: removed explicit runtime version from vercel.json (was causing `invalid version` error) |

### 2026-06-09 — React UI v1 shipped
| Item | Detail |
|---|---|
| Build | Vite 5.4.21 — 288 modules, 2.41s ✅ |
| Server | Express on :8787 — boots cleanly ✅ |
| Frontend | React 18 + react-markdown v9 + remark-gfm ✅ |
| CSS | 7.08 kB dark mode stylesheet ✅ |
| Node version | v24.15.0 |
| npm version | 11.12.1 |

### Known Constraints
- GROQ model: `llama-3.3-70b-versatile` — temperature 0.3, max 4096 tokens.
- Credentials stored in browser `localStorage` (key: `jira_tp_settings`) — never sent to any third party.
- Express CORS allows `http://localhost:5173` only.
- To run: open two terminals — `node server.js` (port 8787) + `cd frontend && npx vite` (port 5173).
- Or from root: `npm run dev` (runs both via concurrently).
