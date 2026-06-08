# SOP: Fetch JIRA Ticket
**Tool:** `tools/fetch_jira.py`

## Goal
Retrieve a JIRA issue by key and return a clean, flat dict ready for LLM consumption.

## Inputs
| Field | Type | Example |
|---|---|---|
| `issue_key` | string | `SCRUM-5` |

## Process
1. Call `GET /rest/api/3/issue/{issue_key}` with Basic Auth (email + API token).
2. Extract fields: `summary`, `description` (ADF), `issuetype`, `status`, `priority`, `labels`, `reporter`, `assignee`, `acceptance_criteria` (custom field if present).
3. Convert ADF description to plain text via `_adf_to_text()` helper.
4. Return structured dict (see Output Shape in gemini.md).

## Edge Cases
- **404**: Issue does not exist or no permission — raise `ValueError` with clear message.
- **ADF description**: Must flatten nested `content` nodes to readable text. Never pass raw ADF JSON to the LLM.
- **Missing fields**: Default to empty string, never `None`, to avoid downstream KeyErrors.

## Invariants
- Always use REST API v3.
- Auth is Basic (email:token), never OAuth for this project.
- Never log or print the API token.
