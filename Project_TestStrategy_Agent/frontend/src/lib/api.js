export async function generateStrategy({ jiraId, config }) {
  const res = await fetch('/api/generate', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ jiraId, config }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Generation failed.');
  return data;
}
