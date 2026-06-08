# SOP: Generate Test Plan via LLM
**Tool:** `tools/generate_test_plan.py`

## Goal
Send JIRA ticket data to Groq (llama-3.3-70b-versatile) and receive a structured Markdown test plan.

## Inputs
| Field | Type | Source |
|---|---|---|
| `jira_data` | dict | Output of `fetch_jira.py` |

## Process
1. Build a prompt using `jira_data` — inject summary, description, issue type.
2. Include explicit format instructions: Formal QA Template with Objective, Scope, Out-of-Scope, Test Cases table, Risks.
3. Mandate coverage of all four test types: Positive, Negative, Edge, API-level.
4. Call Groq chat completions API with `llama-3.3-70b-versatile`.
5. Return raw Markdown string from the model response.

## Prompt Rules
- Always instruct the model: "Do not invent requirements not present in the ticket."
- Always instruct: "If data is missing, flag it in the Risks section."
- Keep system prompt and user prompt separated.

## Edge Cases
- **Empty description**: Proceed with summary only; note in Risks that description was absent.
- **Groq timeout**: Retry once with a 10s delay. If still failing, raise exception.
- **Model response not in Markdown**: Accept as-is; deliver_payload will still save it.

## Invariants
- Model: always `llama-3.3-70b-versatile`.
- Temperature: 0.3 (deterministic enough for QA output, some creativity for edge cases).
- Max tokens: 4096.
