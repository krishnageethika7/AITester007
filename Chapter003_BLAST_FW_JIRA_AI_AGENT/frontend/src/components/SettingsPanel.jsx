import { useState } from 'react';

export default function SettingsPanel({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    jiraUrl: initial.jiraUrl ?? '',
    email: initial.email ?? '',
    token: initial.token ?? '',
    groqKey: initial.groqKey ?? '',
  });

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const valid = form.jiraUrl && form.email && form.token && form.groqKey;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>API Settings</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <p className="settings-note">Stored locally in your browser. Never sent to any server except your own.</p>

        <div className="field-group">
          <label>JIRA Base URL</label>
          <input placeholder="https://yourcompany.atlassian.net/" value={form.jiraUrl}
            onChange={e => set('jiraUrl', e.target.value)} />
        </div>
        <div className="field-group">
          <label>JIRA Email</label>
          <input placeholder="you@company.com" value={form.email}
            onChange={e => set('email', e.target.value)} />
        </div>
        <div className="field-group">
          <label>JIRA API Token</label>
          <input type="password" placeholder="ATATT3x..." value={form.token}
            onChange={e => set('token', e.target.value)} />
        </div>
        <div className="field-group">
          <label>Groq API Key</label>
          <input type="password" placeholder="gsk_..." value={form.groqKey}
            onChange={e => set('groqKey', e.target.value)} />
        </div>

        <button className="btn-primary" disabled={!valid} onClick={() => onSave(form)}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
