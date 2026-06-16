import express from 'express';
import cors    from 'cors';
import fs      from 'fs';
import path    from 'path';
import { fileURLToPath } from 'url';
import { fetchJiraIssue }   from './tools/jiraClient.js';
import { generateStrategy } from './tools/testStrategy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app       = express();
const PORT      = process.env.PORT ?? 8787;
const isProd    = process.env.NODE_ENV === 'production';

app.use(cors({ origin: isProd ? false : 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

// Serve built SPA in production
if (isProd) {
  const dist = path.join(__dirname, 'frontend', 'dist');
  app.use(express.static(dist));
}

function mergeConfig(body) {
  return {
    jiraUrl: body.config?.jiraUrl   || process.env.JIRA_URL,
    email:   body.config?.jiraEmail || process.env.JIRA_EMAIL,
    token:   body.config?.jiraToken || process.env.JIRA_API_TOKEN || process.env.JIRA_TOKEN,
    groqKey: body.config?.groqKey   || process.env.GROQ_KEY,
  };
}

// POST /api/generate
app.post('/api/generate', async (req, res) => {
  const { jiraId } = req.body ?? {};
  const cfg = mergeConfig(req.body);

  if (!jiraId)              return res.status(400).json({ error: 'jiraId is required.' });
  if (!cfg.jiraUrl || !cfg.email || !cfg.token || !cfg.groqKey)
    return res.status(400).json({ error: 'Missing config: jiraUrl, jiraEmail, jiraToken, or groqKey.' });

  try {
    const issue    = await fetchJiraIssue({ jiraUrl: cfg.jiraUrl, email: cfg.email, token: cfg.token, issueKey: jiraId });
    const markdown = await generateStrategy({ groqKey: cfg.groqKey, issue });
    return res.json({ issue, markdown });
  } catch (err) {
    const status = err.status ?? 500;
    return res.status(status).json({ error: err.message });
  }
});

// POST /api/save
app.post('/api/save', (req, res) => {
  const { jiraId, markdown } = req.body ?? {};
  if (!jiraId || !markdown) return res.status(400).json({ error: 'jiraId and markdown required.' });

  const outputDir = path.join(__dirname, 'output');
  fs.mkdirSync(outputDir, { recursive: true });
  const file = path.join(outputDir, `test-strategy-${jiraId}.md`);
  fs.writeFileSync(file, markdown, 'utf-8');
  return res.json({ saved: true, path: `output/test-strategy-${jiraId}.md` });
});

// SPA catch-all (production)
if (isProd) {
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`[server] http://localhost:${PORT}  (${isProd ? 'production' : 'dev'})`));
