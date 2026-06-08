import os
import time
from groq import Groq
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are a senior QA engineer. Your job is to generate a complete, professional Test Plan in Markdown format based on a JIRA ticket.

Rules:
- Use the Formal QA Template (Objective, Scope, Out-of-Scope, Test Cases, Risks).
- Always include all four test case types: Positive (happy path), Negative (error/invalid input), Edge Cases (boundary/unusual), and API-level.
- Every test case must have: ID, Type, Title, Preconditions, Steps (numbered), Expected Result.
- Do NOT invent requirements not present in the ticket. If information is missing, flag it in the Risks section.
- Be specific and concrete — no placeholder text like "TBD" or "Enter valid data".
- Format test cases as a Markdown table or structured list."""

USER_PROMPT_TEMPLATE = """Generate a complete Test Plan for the following JIRA ticket.

---
JIRA ID: {jira_id}
Issue Type: {issue_type}
Summary: {summary}
Status: {status}
Priority: {priority}
Reporter: {reporter}
Assignee: {assignee}
Labels: {labels}

Description:
{description}

Acceptance Criteria:
{acceptance_criteria}
---

Produce the full Test Plan now."""


def generate_test_plan(jira_data: dict, retries: int = 1) -> str:
    prompt = USER_PROMPT_TEMPLATE.format(
        jira_id=jira_data.get("jira_id", ""),
        issue_type=jira_data.get("issue_type", ""),
        summary=jira_data.get("summary", ""),
        status=jira_data.get("status", ""),
        priority=jira_data.get("priority", "N/A"),
        reporter=jira_data.get("reporter", ""),
        assignee=jira_data.get("assignee", "Unassigned"),
        labels=", ".join(jira_data.get("labels", [])) or "None",
        description=jira_data.get("description", "") or "No description provided.",
        acceptance_criteria=jira_data.get("acceptance_criteria", "") or "Not specified.",
    )

    for attempt in range(retries + 1):
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
                max_tokens=4096,
            )
            return response.choices[0].message.content
        except Exception as e:
            if attempt < retries:
                print(f"[WARN] Groq attempt {attempt + 1} failed: {e}. Retrying in 10s...")
                time.sleep(10)
            else:
                raise RuntimeError(f"Groq generation failed after {retries + 1} attempts: {e}")


if __name__ == "__main__":
    sample = {
        "jira_id": "SCRUM-5",
        "issue_type": "Story",
        "summary": "Create a new transaction page",
        "status": "To Do",
        "priority": "Medium",
        "reporter": "Test User",
        "assignee": "Unassigned",
        "labels": [],
        "description": "As a user, I want to create a new transaction page so that I can record financial transactions.",
        "acceptance_criteria": "",
    }
    print(generate_test_plan(sample))
