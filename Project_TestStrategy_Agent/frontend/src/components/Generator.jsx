import { useState, useEffect } from 'react';
import { generateStrategy } from '../lib/api.js';
import TestStrategyView from './TestStrategyView.jsx';

const STEPS = [
  'Connecting to JIRA',
  'Fetching ticket data',
  'Generating 21-section strategy',
  'Building document',
];

export default function Generator({ config, configured, onOpenSettings }) {
  const [jiraId,  setJiraId]  = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [result,  setResult]  = useState(null);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!loading) { setStepIdx(0); return; }
    const ids = [1, 2, 3].map(i =>
      setTimeout(() => setStepIdx(i), i * 5000)
    );
    return () => ids.forEach(clearTimeout);
  }, [loading]);

  async function handleGenerate(e) {
    e.preventDefault();
    const key = jiraId.trim().toUpperCase();
    if (!key) return;
    if (!configured) { onOpenSettings(); return; }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateStrategy({ jiraId: key, config });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ── Hero: no result yet ──────────────────────── */
  if (!result && !loading && !error) {
    return (
      <div className="generator">
        {!configured && (
          <div className="banner banner--warn">
            ⚠ API keys not configured.{' '}
            <button className="link-btn" onClick={onOpenSettings}>Open Settings →</button>
          </div>
        )}
        <div className="hero">
          <div className="hero-icon">📋</div>
          <h1 className="hero-title">Generate Your<br />Test Strategy</h1>
          <p className="hero-desc">
            Enter a JIRA ticket ID to generate a comprehensive 21-section QA Test Strategy
            powered by Groq AI — ready to download as Markdown.
          </p>
          <form className="hero-form" onSubmit={handleGenerate}>
            <div className="hero-input-row">
              <input
                className="hero-input"
                placeholder="Enter JIRA ID — e.g. SCRUM-5"
                value={jiraId}
                onChange={e => setJiraId(e.target.value)}
                autoFocus
              />
              <button className="btn-primary" type="submit" disabled={!jiraId.trim()}>
                Generate →
              </button>
            </div>
          </form>
          <div className="hero-tags">
            <span className="hero-tag">21 Sections</span>
            <span className="hero-tag">Groq AI</span>
            <span className="hero-tag">JIRA Fetch</span>
            <span className="hero-tag">Download .md</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Active: loading or result ────────────────── */
  return (
    <div className="generator">
      {!configured && (
        <div className="banner banner--warn">
          ⚠ API keys not configured.{' '}
          <button className="link-btn" onClick={onOpenSettings}>Open Settings →</button>
        </div>
      )}

      <form className="search-bar" onSubmit={handleGenerate}>
        <input
          className="search-input"
          placeholder="Enter JIRA ID — e.g. SCRUM-5"
          value={jiraId}
          onChange={e => setJiraId(e.target.value)}
          disabled={loading}
        />
        <button className="search-btn" type="submit" disabled={!jiraId.trim() || loading}>
          {loading ? 'Generating…' : 'Generate →'}
        </button>
      </form>

      {error && (
        <div className="banner banner--error">✖ {error}</div>
      )}

      {loading && (
        <div className="loading">
          <div className="loading-rings">
            <div className="ring ring-1" />
            <div className="ring ring-2" />
            <div className="ring ring-3" />
          </div>
          <div className="loading-steps">
            {STEPS.map((label, i) => {
              const cls = i < stepIdx
                ? 'loading-step loading-step--done'
                : i === stepIdx
                  ? 'loading-step loading-step--active'
                  : 'loading-step';
              const prefix = i < stepIdx ? '✓' : i === stepIdx ? '◉' : '○';
              return (
                <div key={label} className={cls}>
                  <span className="step-dot" />
                  {prefix} {label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result && !loading && (
        <TestStrategyView issue={result.issue} markdown={result.markdown} />
      )}
    </div>
  );
}
