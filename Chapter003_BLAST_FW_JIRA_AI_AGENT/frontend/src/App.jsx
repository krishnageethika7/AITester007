import { useState } from 'react';
import SettingsPanel from './components/SettingsPanel.jsx';
import SearchBar from './components/SearchBar.jsx';
import TicketCard from './components/TicketCard.jsx';
import TestPlanView from './components/TestPlanView.jsx';

const STORAGE_KEY = 'jira_tp_settings';

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}; }
  catch { return {}; }
}

export default function App() {
  const [settings, setSettings] = useState(loadSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  function saveSettings(s) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    setSettings(s);
    setShowSettings(false);
  }

  const settingsComplete = settings.jiraUrl && settings.email && settings.token && settings.groqKey;

  async function handleGenerate(issueKey) {
    if (!settingsComplete) { setShowSettings(true); return; }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue_key: issueKey, ...settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Unknown error');
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="logo">⚡ TestPlan AI</span>
          <span className="tagline">JIRA → Test Plan in seconds</span>
        </div>
        <button
          className={`btn-settings ${!settingsComplete ? 'btn-settings--warn' : ''}`}
          onClick={() => setShowSettings(s => !s)}
        >
          {settingsComplete ? '⚙ Settings' : '⚙ Configure API Keys'}
        </button>
      </header>

      {showSettings && (
        <SettingsPanel initial={settings} onSave={saveSettings} onClose={() => setShowSettings(false)} />
      )}

      <main className="app-main">
        <SearchBar onGenerate={handleGenerate} loading={loading} settingsComplete={settingsComplete} />

        {error && (
          <div className="error-banner">
            <span className="error-icon">✖</span> {error}
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Fetching ticket and generating test plan via Groq…</p>
          </div>
        )}

        {result && !loading && (
          <div className="results">
            <TicketCard data={result} />
            <TestPlanView issueKey={result.jira_id} markdown={result.test_plan_markdown} />
          </div>
        )}
      </main>
    </div>
  );
}
