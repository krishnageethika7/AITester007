import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (no dotenv dependency yet)
function loadEnv() {
  try {
    const raw = readFileSync(resolve(__dirname, '../.env'), 'utf-8');
    raw.split('\n').forEach(line => {
      const [k, ...v] = line.trim().split('=');
      if (k && v.length) process.env[k] = v.join('=');
    });
  } catch { /* .env optional */ }
}

loadEnv();

const JIRA_URL   = process.env.JIRA_URL?.replace(/\/$/, '');
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_TOKEN = process.env.JIRA_API_TOKEN ?? process.env.JIRA_TOKEN;
const GROQ_KEY   = process.env.GROQ_KEY;
const ISSUE_KEY  = process.argv[2] ?? 'SCRUM-5';

let passed = 0;
let failed = 0;

async function checkJira() {
  process.stdout.write(`[JIRA]  Fetching ${ISSUE_KEY} from ${JIRA_URL} ... `);
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');
  const res = await fetch(`${JIRA_URL}/rest/api/3/issue/${ISSUE_KEY}`, {
    headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
  });
  if (res.ok) {
    const d = await res.json();
    console.log(`OK — "${d.fields.summary}" [${d.fields.issuetype.name}]`);
    passed++;
  } else {
    console.log(`FAIL ${res.status}: ${await res.text()}`);
    failed++;
  }
}

async function checkGroq() {
  process.stdout.write(`[GROQ]  Pinging llama-3.3-70b-versatile ... `);
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Reply with: LINK OK' }],
      max_tokens: 10,
    }),
  });
  if (res.ok) {
    const d = await res.json();
    console.log(`OK — "${d.choices[0].message.content.trim()}"`);
    passed++;
  } else {
    console.log(`FAIL ${res.status}: ${await res.text()}`);
    failed++;
  }
}

(async () => {
  console.log('\n=== Test Strategy Agent — Phase 2 Handshake ===\n');
  await checkJira();
  await checkGroq();
  console.log(`\n${passed === 2 ? '✅ PASS' : '❌ FAIL'} — ${passed}/2 connections OK\n`);
  process.exit(failed > 0 ? 1 : 0);
})();
