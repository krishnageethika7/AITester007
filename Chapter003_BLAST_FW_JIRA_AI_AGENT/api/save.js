// On Vercel the filesystem is ephemeral — client-side download (blob URL in TestPlanView.jsx) is the delivery mechanism.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const { issue_key } = req.body ?? {};
  return res.status(200).json({ saved: true, path: `test-plan-${issue_key ?? 'unknown'}.md` });
}
