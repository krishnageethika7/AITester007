# Findings — JIRA AI Test Plan Agent

## Research & Discoveries

> To be populated during Phase 1 research and Phase 2 Link verification.

---

## JIRA API Notes
- JIRA REST API v3: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
- Auth: API Token (Basic Auth) or OAuth 2.0
- Key endpoint: GET /rest/api/3/issue/{issueIdOrKey}

## Constraints
> To be filled as discovered.

## Helpful Resources
> To be filled after Phase 1 research.

---

## Phase v2: React UI — Findings

### Environment
- JIRA Cloud: REST API v3, `/rest/api/3/search/jql` (POST) is the current search endpoint — `/rest/api/2/search` returns 410 Gone.
- Groq SDK: `groq` Python package, model `llama-3.3-70b-versatile`, temperature 0.3 works well.
- ADF (Atlassian Document Format): Must be recursively flattened before passing to LLM — raw ADF is unreadable JSON.

### React UI Constraints (confirmed Phase 1 + Phase 2)
- Node.js / npm: NOT INSTALLED — Phase 2 Link is broken. Must install Node.js LTS before scaffolding.
- Architecture pivot: FastAPI dropped → Express.js on port 8787. All API calls (JIRA + GROQ) done in JavaScript. No Python bridge needed for the UI layer.
- GROQ JS: Use OpenAI-compatible endpoint `https://api.groq.com/openai/v1/chat/completions` with `Authorization: Bearer {GROQ_API_KEY}`.
- Vercel deployment: Express server is NOT deployable as-is. Must convert to Vercel serverless functions in `api/` directory.
- Vercel serverless: handler signature `export default async function handler(req, res)`. Body auto-parsed from JSON.
- Vercel `/api/save`: filesystem is read-only on Vercel — save endpoint returns success but actual download is client-side blob (already implemented in TestPlanView.jsx).
- Vercel CORS: not needed — frontend and API share the same domain on Vercel.
- Vercel project name: `testplangenerator` → deploys to testplangenerator.vercel.app.
- FastAPI: Already available (Python env has dependencies installed).
- react-markdown: v9.x — import pattern: `import ReactMarkdown from 'react-markdown'` + `remark-gfm` plugin.
- Vite proxy: `/api` → `http://localhost:8000` via `vite.config.js server.proxy`.
- FastAPI CORS: `allow_origins=["http://localhost:5173"]` required.
- Ports: FastAPI = 8000, Vite = 5173.
