import os
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

JIRA_BASE_URL = os.getenv("JIRA_BASE_URL", "").rstrip("/")
JIRA_EMAIL = os.getenv("JIRA_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")

def verify_jira(issue_key="VWO-48"):
    url = f"{JIRA_BASE_URL}/rest/api/3/issue/{issue_key}"
    response = requests.get(
        url,
        auth=(JIRA_EMAIL, JIRA_API_TOKEN),
        headers={"Accept": "application/json"},
        timeout=10
    )
    if response.status_code == 200:
        data = response.json()
        print(f"[OK] JIRA connection successful.")
        print(f"     Issue: {data['key']} — {data['fields']['summary']}")
        print(f"     Type:  {data['fields']['issuetype']['name']}")
        print(f"     Status: {data['fields']['status']['name']}")
        return data
    else:
        print(f"[FAIL] JIRA returned {response.status_code}: {response.text}")
        return None

if __name__ == "__main__":
    verify_jira()
