import { useState } from 'react';
import Generator from './components/Generator.jsx';
import Settings  from './components/Settings.jsx';

const CONFIG_KEY = 'blast.strategy.config';
const THEME_KEY  = 'blast.strategy.theme';

function loadConfig() {
  try { return JSON.parse(localStorage.getItem(CONFIG_KEY)) ?? {}; }
  catch { return {}; }
}

export default function App() {
  const [tab,    setTab]    = useState('generate');
  const [config, setConfig] = useState(loadConfig);
  const [theme,  setTheme]  = useState(
    () => localStorage.getItem(THEME_KEY) ?? 'dark'
  );

  function saveConfig(c) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(c));
    setConfig(c);
    setTab('generate');
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    setTheme(next);
  }

  const configured = !!(config.jiraUrl && config.jiraEmail && config.jiraToken && config.groqKey);

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="header-icon">🛡</span>
          <span className="header-logo">StrategyAI</span>
          <span className="header-badge">21 sections</span>
        </div>

        <div className="header-actions">
          <nav className="tabs">
            <button
              className={`tab ${tab === 'generate' ? 'tab--active' : ''}`}
              onClick={() => setTab('generate')}
            >
              Generate
            </button>
            <button
              className={`tab ${tab === 'settings' ? 'tab--active' : ''}`}
              onClick={() => setTab('settings')}
            >
              {configured ? '⚙ Settings' : '⚠ Configure'}
            </button>
          </nav>
          <button className="btn-icon" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
            {theme === 'dark' ? '☀' : '🌙'}
          </button>
        </div>
      </header>

      <main className="main">
        {tab === 'generate' && (
          <Generator config={config} configured={configured} onOpenSettings={() => setTab('settings')} />
        )}
        {tab === 'settings' && (
          <Settings initial={config} onSave={saveConfig} />
        )}
      </main>

      <footer className="footer">
        StrategyAI — BLAST Framework · Powered by Groq llama-3.3-70b-versatile
      </footer>
    </div>
  );
}
