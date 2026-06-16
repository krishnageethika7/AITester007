function adfToText(node) {
  if (!node) return '';
  const { type, content = [], text = '' } = node;
  if (type === 'text') return text;
  if (type === 'hardBreak') return '\n';
  const children = content.map(adfToText).join('');
  if (['paragraph', 'heading', 'listItem', 'blockquote'].includes(type)) return children + '\n';
  return children;
}

export async function fetchJiraIssue({ jiraUrl, email, token, issueKey }) {
  const base = jiraUrl.replace(/\/$/, '');
  const auth = Buffer.from(`${email}:${token}`).toString('base64');

  const res = await fetch(`${base}/rest/api/3/issue/${issueKey}`, {
    headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
  });

  if (res.status === 404) throw Object.assign(new Error(`Issue '${issueKey}' not found or no permission.`), { status: 404 });
  if (!res.ok) throw new Error(`JIRA API error ${res.status}: ${await res.text()}`);

  const raw = await res.json();
  const f = raw.fields ?? {};

  return {
    key:         raw.key,
    summary:     f.summary ?? '',
    description: f.description ? adfToText(f.description).trim() : '',
    issueType:   f.issuetype?.name ?? '',
    status:      f.status?.name ?? '',
    priority:    f.priority?.name ?? '',
    components:  (f.components ?? []).map(c => c.name),
    labels:      f.labels ?? [],
    fixVersions: (f.fixVersions ?? []).map(v => v.name),
    reporter:    f.reporter?.displayName ?? '',
    assignee:    f.assignee?.displayName ?? null,
  };
}
