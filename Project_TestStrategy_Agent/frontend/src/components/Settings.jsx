import { useState } from 'react';

export default function Settings({ initial, onSave }) {
  const [form, setForm] = useState({
    jiraUrl:   initial.jiraUrl   ?? '',
    jiraEmail: initial.jiraEmail ?? '',
    jiraToken: initial.jiraToken ?? '',
    groqKey:   initial.groqKey   ?? '',
  });

  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.jiraUrl && form.jiraEmail && form.jiraToken && form.groqKey;

  return (
    <div className="settings">
      <div className="settings-header">
        <h2 className="settings-title">API Settings</h2>
        <p className="settings-note">
          Stored in your browser's localStorage only — sent solely to your own proxy, never to third parties.
        </p>
      </div>

      <div className="settings-card">
        <div className="settings-card-label">Jira Cloud</div>

        <div className="field-group">
          <label>Base URL</label>
          <input
            placeholder="https://yourcompany.atlassian.net"
            value={form.jiraUrl}
            onChange={e => set('jiraUrl', e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={form.jiraEmail}
            onChange={e => set('jiraEmail', e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>API Token</label>
          <input
            type="password"
            placeholder="ATATT3x…"
            value={form.jiraToken}
            onChange={e => set('jiraToken', e.target.value)}
          />
          <span className="field-hint">id.atlassian.com → Security → API tokens</span>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-label">Groq</div>

        <div className="field-group">
          <label>API Key</label>
          <input
            type="password"
            placeholder="gsk_…"
            value={form.groqKey}
            onChange={e => set('groqKey', e.target.value)}
          />
          <span className="field-hint">console.groq.com/keys — free tier available</span>
        </div>
      </div>

      <button className="btn-primary" disabled={!valid} onClick={() => onSave(form)}>
        Save & Return to Generator
      </button>
    </div>
  );
}
