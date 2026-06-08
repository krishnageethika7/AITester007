import os
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

JIRA_BASE_URL = os.getenv("JIRA_BASE_URL", "").rstrip("/")
JIRA_EMAIL = os.getenv("JIRA_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")


def _adf_to_text(node: dict | None) -> str:
    """Recursively flatten Atlassian Document Format to plain text."""
    if not node:
        return ""
    node_type = node.get("type", "")
    text = ""
    if node_type == "text":
        text = node.get("text", "")
    elif node_type in ("paragraph", "heading", "blockquote", "listItem"):
        text = "".join(_adf_to_text(c) for c in node.get("content", [])) + "\n"
    elif node_type in ("bulletList", "orderedList"):
        text = "".join(_adf_to_text(c) for c in node.get("content", []))
    elif node_type == "hardBreak":
        text = "\n"
    elif node_type in ("doc", "panel"):
        text = "".join(_adf_to_text(c) for c in node.get("content", []))
    else:
        text = "".join(_adf_to_text(c) for c in node.get("content", []))
    return text


def fetch_jira(issue_key: str) -> dict:
    url = f"{JIRA_BASE_URL}/rest/api/3/issue/{issue_key}"
    response = requests.get(
        url,
        auth=(JIRA_EMAIL, JIRA_API_TOKEN),
        headers={"Accept": "application/json"},
        timeout=10
    )
    if response.status_code == 404:
        raise ValueError(f"Issue '{issue_key}' not found or no permission.")
    if response.status_code != 200:
        raise RuntimeError(f"JIRA API error {response.status_code}: {response.text}")

    raw = response.json()
    fields = raw.get("fields", {})

    description_adf = fields.get("description")
    description_text = _adf_to_text(description_adf).strip() if description_adf else ""

    # Try common custom field names for acceptance criteria
    acceptance_criteria = ""
    for key, val in fields.items():
        if isinstance(val, str) and "acceptance" in key.lower():
            acceptance_criteria = val
        elif isinstance(val, dict) and "acceptance" in key.lower():
            acceptance_criteria = _adf_to_text(val).strip()

    return {
        "jira_id": raw.get("key", issue_key),
        "summary": fields.get("summary", ""),
        "description": description_text,
        "acceptance_criteria": acceptance_criteria,
        "issue_type": fields.get("issuetype", {}).get("name", ""),
        "status": fields.get("status", {}).get("name", ""),
        "priority": (fields.get("priority") or {}).get("name", ""),
        "labels": fields.get("labels", []),
        "reporter": (fields.get("reporter") or {}).get("displayName", ""),
        "assignee": (fields.get("assignee") or {}).get("displayName", "Unassigned"),
    }


if __name__ == "__main__":
    import json
    data = fetch_jira("SCRUM-5")
    print(json.dumps(data, indent=2))
