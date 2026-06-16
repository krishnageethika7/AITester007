# SOP: Generate Test Strategy via GROQ
**Tool:** `tools/testStrategy.js` → `tools/groqClient.js`

## Goal
Convert a normalised JIRA issue into a complete 21-section QA Test Strategy in Markdown.

## Inputs
| Field | Type | Source |
|---|---|---|
| `groqKey` | string | .env / Settings UI |
| `issue` | object | Output of jiraClient.js |

## Process
1. `testStrategy.js` builds a structured system prompt (21-section contract) + user prompt (ticket data).
2. Calls `groqClient.js` → `POST https://api.groq.com/openai/v1/chat/completions`.
3. Returns raw Markdown string — all rendering is the model's output directly.

## Prompt Rules
- All 21 sections must be listed in the system prompt as mandatory.
- Where ticket data is absent → instruct model to emit `[INSERT VALUE]` or `TBD` — never hallucinate.
- Formal, declarative, third-person tone. No "I", no hedging.
- Tables for: Document Control, Environments, Tools, Roles, Risks, Sign-off.

## Edge Cases
- **Sparse description** → strategy still generated; missing fields emit `[INSERT VALUE]`.
- **GROQ timeout / 5xx** → retry once after 5s; if still failing, propagate error.
- **Section count < 21** → Self-Anneal: treat as tool failure, refine prompt, re-test, log in this SOP.

## Invariants
- Model: `llama-3.3-70b-versatile`, temperature 0.3, max_tokens 8192.
- GROQ key never logged.
