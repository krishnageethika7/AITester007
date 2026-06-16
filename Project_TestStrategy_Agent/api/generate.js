import { fetchJiraIssue }   from '../tools/jiraClient.js';
import { generateStrategy } from '../tools/testStrategy.js';

function mergeConfig(body) {
  return {
    jiraUrl: body.config?.jiraUrl   || process.env.JIRA_URL,
    email:   body.config?.jiraEmail || process.env.JIRA_EMAIL,
    token:   body.config?.jiraToken || process.env.JIRA_API_TOKEN || process.env.JIRA_TOKEN,
    groqKey: body.config?.groqKey   || process.env.GROQ_KEY,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed.' });

  const { jiraId } = req.body ?? {};
  const cfg = mergeConfig(req.body);

  if (!jiraId) return res.status(400).json({ error: 'jiraId is required.' });
  if (!cfg.jiraUrl || !cfg.email || !cfg.token || !cfg.groqKey)
    return res.status(400).json({ error: 'Missing config: jiraUrl, jiraEmail, jiraToken, or groqKey.' });

  try {
    const issue    = await fetchJiraIssue({ jiraUrl: cfg.jiraUrl, email: cfg.email, token: cfg.token, issueKey: jiraId });
    const markdown = await generateStrategy({ groqKey: cfg.groqKey, issue });
    return res.status(200).json({ issue, markdown });
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}
