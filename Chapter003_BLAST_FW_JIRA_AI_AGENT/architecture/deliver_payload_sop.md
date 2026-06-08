# SOP: Deliver Payload
**Tool:** `tools/deliver_payload.py`

## Goal
Save the generated Markdown test plan to disk as the final deliverable.

## Inputs
| Field | Type | Example |
|---|---|---|
| `issue_key` | string | `SCRUM-5` |
| `markdown_content` | string | Full Markdown test plan |

## Process
1. Write content to `.tmp/test_plan_{issue_key}.md` (intermediate).
2. Copy from `.tmp/` to project root as `test_plan_{issue_key}.md` (final deliverable).
3. Print the absolute path of the saved file.

## Edge Cases
- **`.tmp/` does not exist**: Create it before writing.
- **File already exists**: Overwrite silently (re-runs should always produce fresh output).

## Invariants
- Intermediate always goes to `.tmp/` first.
- Final output filename format: `test_plan_{issue_key}.md` (e.g., `test_plan_SCRUM-5.md`).
- Never deliver an empty file — validate `len(markdown_content.strip()) > 0` before writing.
