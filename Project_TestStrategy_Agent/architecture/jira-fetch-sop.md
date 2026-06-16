# SOP: Fetch JIRA Issue
**Tool:** `tools/jiraClient.js`

## Goal
Retrieve a JIRA issue by key and return a normalised flat object for the strategy generator.

## Inputs
| Field | Type | Example |
|---|---|---|
| `jiraUrl` | string | `https://testjira007.atlassian.net` |
| `email` | string | `user@example.com` |
| `token` | string | `ATATT3x...` |
| `issueKey` | string | `SCRUM-5` |

## Process
1. Call `GET {jiraUrl}/rest/api/3/issue/{issueKey}` with `Authorization: Basic base64(email:token)`.
2. Flatten `fields.description` from ADF (Atlassian Document Format) to plain text via `adfToText()`.
3. Return normalised issue shape (see CLAUDE.md §3c).

## Edge Cases
- **404** → throw `{ message, status: 404 }` so the server returns HTTP 404 to the client.
- **ADF description** → recursively walk content nodes; never pass raw JSON to GROQ.
- **Null fields** → default to empty string; never `null` or `undefined` downstream.

## Invariants
- REST API v3 only (v2 returns 410 Gone).
- Auth: Basic only. Token never logged.
