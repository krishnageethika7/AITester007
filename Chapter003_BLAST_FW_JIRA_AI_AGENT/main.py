import sys
from tools.fetch_jira import fetch_jira
from tools.generate_test_plan import generate_test_plan
from tools.deliver_payload import deliver_payload


def run(issue_key: str):
    print(f"\n{'='*50}")
    print(f" JIRA Test Plan Generator")
    print(f"{'='*50}")

    print(f"\n[1/3] Fetching JIRA ticket: {issue_key}...")
    jira_data = fetch_jira(issue_key)
    print(f"      Summary : {jira_data['summary']}")
    print(f"      Type    : {jira_data['issue_type']}")
    print(f"      Status  : {jira_data['status']}")

    print(f"\n[2/3] Generating test plan via Groq (llama-3.3-70b-versatile)...")
    markdown = generate_test_plan(jira_data)
    print(f"      Generated {len(markdown.splitlines())} lines.")

    print(f"\n[3/3] Delivering payload...")
    output_path = deliver_payload(issue_key, markdown)

    print(f"\n{'='*50}")
    print(f" Done! Test plan saved to:")
    print(f" {output_path}")
    print(f"{'='*50}\n")


if __name__ == "__main__":
    key = sys.argv[1] if len(sys.argv) > 1 else "SCRUM-5"
    run(key)
