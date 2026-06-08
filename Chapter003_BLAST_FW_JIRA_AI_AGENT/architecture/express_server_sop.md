# SOP: Express Server (API Bridge)
**Layer 2 — Navigation**

## Goal
Sit between the React frontend and external APIs (JIRA, GROQ). Keeps API keys server-side (never exposed to browser).

## Endpoints

### POST /api/generate
- **Input:** `{ issue_key, jiraUrl, email, token, groqKey }`
- **Process:** call jiraClient → call groqClient → return combined result
- **Output:** `{ jira_id, summary, issue_type, status, priority, reporter, assignee, labels, test_plan_markdown }`
- **Errors:** 400 if issue_key missing; 404 if JIRA returns 404; 500 for any other failure

### POST /api/save
- **Input:** `{ issue_key, markdown }`
- **Process:** write to `output/test-plan-{issue_key}.md`
- **Output:** `{ saved: true, path: "output/test-plan-SCRUM-5.md" }`

## Invariants
- Server runs on port **8787**.
- CORS: allow `http://localhost:5173` only.
- Never log credentials to console.
- All errors return JSON `{ error: "message" }`, never HTML.
