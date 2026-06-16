# Findings — Test Strategy Agent

---

## Project Constitution
- CLAUDE.md is the Project Constitution (equivalent to gemini.md in other BLAST projects).
- TestStrategyFormat.md defines the 21-section Test Strategy structure.
- RICEPOT_framework.md defines the QA role, instructions, parameters, and tone.

---

## Test Strategy Structure (21 sections — TestStrategyFormat.md)
1. Document Control
2. Introduction / Background
3. Objective
4. Scope (In Scope / Out of Scope)
5. Test Levels & Types
6. Focus Areas / Quality Attributes
7. Test Approach
8. Test Environment(s)
9. Test Data Management
10. Tools & Technology
11. Roles & Responsibilities
12. Schedule & Milestones
13. Deliverables
14. Entry, Exit, Suspension & Resumption Criteria
15. Defect Management
16. Test Metrics & KPIs
17. Risks & Mitigation
18. Assumptions & Dependencies
19. Communication & Reporting
20. Domain-Specific Considerations
21. Approval & Sign-off

---

## RICEPOT Rules (from RICEPOT_framework.md)
- Role: Senior QA Functional Tester, 15+ yrs, functional + non-functional
- No hallucination: never invent endpoints, error codes, or behavior not in provided context
- Determinism: same input → same output
- Missing info → use exactly: "Insufficient information to determine." or [INSERT VALUE] placeholder
- Tone: Technical, precise, enterprise-grade

---

## JIRA API
- REST API v3: GET {JIRA_URL}/rest/api/3/issue/{id}
- Auth: Basic base64(email:token)
- Description is in Atlassian Document Format (ADF) — must be flattened to plain text before LLM use
- Search endpoint: POST /rest/api/3/search/jql (the older GET /rest/api/2/search returns 410 Gone)

---

## Input Sources (from Objective)
1. JIRA ID — fetched live from Jira Cloud
2. Plain text — pasted directly in UI
3. .txt / .md file — uploaded in UI

---

## GROQ
- OpenAI-compatible endpoint: https://api.groq.com/openai/v1/chat/completions
- Auth: Bearer GROQ_KEY
- Recommended model: llama-3.3-70b-versatile (or per CLAUDE.md: openai/gpt-oss-120b FREE)

---

## Confirmed Constraints (Phase 1 complete)
- Input: JIRA ID only (live fetch) — plain text / file upload deferred
- GROQ model: llama-3.3-70b-versatile
- Sections: all 21 — strict, no skipping
- Sparse input: [INSERT VALUE] / TBD placeholders — never hallucinate
- UI: dark + light mode toggle
- Output: rendered on screen (download optional, not primary deliverable)
