import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchJiraIssue } from './tools/jiraClient.js';
import { generateTestPlan } from './tools/groqClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { issue_key, jiraUrl, email, token, groqKey } = req.body;

  if (!issue_key) return res.status(400).json({ error: 'issue_key is required.' });
  if (!jiraUrl || !email || !token || !groqKey)
    return res.status(400).json({ error: 'Missing settings: jiraUrl, email, token, or groqKey.' });

  try {
    const jiraData = await fetchJiraIssue({ jiraUrl, email, token, issueKey: issue_key });
    const test_plan_markdown = await generateTestPlan({ groqKey, jiraData });
    res.json({ ...jiraData, test_plan_markdown });
  } catch (err) {
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message });
  }
});

app.post('/api/save', (req, res) => {
  const { issue_key, markdown } = req.body;
  if (!issue_key || !markdown) return res.status(400).json({ error: 'issue_key and markdown required.' });

  const outputDir = path.join(__dirname, 'output');
  fs.mkdirSync(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `test-plan-${issue_key}.md`);
  fs.writeFileSync(filePath, markdown, 'utf-8');
  res.json({ saved: true, path: `output/test-plan-${issue_key}.md` });
});

const PORT = 8787;
app.listen(PORT, () => console.log(`[server] Express running on http://localhost:${PORT}`));
