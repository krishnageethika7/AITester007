import { fetchJiraIssue } from '../tools/jiraClient.js';
import { generateTestPlan } from '../tools/groqClient.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const { issue_key, jiraUrl, email, token, groqKey } = req.body ?? {};

  if (!issue_key) return res.status(400).json({ error: 'issue_key is required.' });
  if (!jiraUrl || !email || !token || !groqKey)
    return res.status(400).json({ error: 'Missing settings: jiraUrl, email, token, or groqKey.' });

  try {
    const jiraData = await fetchJiraIssue({ jiraUrl, email, token, issueKey: issue_key });
    const test_plan_markdown = await generateTestPlan({ groqKey, jiraData });
    return res.status(200).json({ ...jiraData, test_plan_markdown });
  } catch (err) {
    const status = err.status ?? 500;
    return res.status(status).json({ error: err.message });
  }
}
