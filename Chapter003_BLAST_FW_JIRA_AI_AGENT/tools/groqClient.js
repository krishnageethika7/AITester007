import fetch from 'node-fetch';

const SYSTEM_PROMPT = `You are a senior QA engineer. Generate a complete, professional Test Plan in Markdown format from a JIRA ticket.

Rules:
- Formal QA Template: Objective, Scope, Out-of-Scope, Test Cases, Risks.
- Include all four types: Positive (happy path), Negative (error/invalid), Edge Cases, API-level.
- Every test case must have: ID, Type, Title, Preconditions, Steps (numbered), Expected Result.
- Do NOT invent requirements not in the ticket. Flag missing info in Risks.
- Be specific — no placeholders like "TBD".`;

export async function generateTestPlan({ groqKey, jiraData }) {
  const userPrompt = `Generate a complete Test Plan for this JIRA ticket:

JIRA ID: ${jiraData.jira_id}
Type: ${jiraData.issue_type}
Summary: ${jiraData.summary}
Status: ${jiraData.status}
Priority: ${jiraData.priority || 'N/A'}
Reporter: ${jiraData.reporter}
Assignee: ${jiraData.assignee}
Labels: ${jiraData.labels.join(', ') || 'None'}

Description:
${jiraData.description || 'No description provided.'}

Produce the full Test Plan now.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) throw new Error(`GROQ error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return data.choices[0].message.content;
}
