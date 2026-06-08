import { useState } from 'react';

export default function SearchBar({ onGenerate, loading, settingsComplete }) {
  const [issueKey, setIssueKey] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const key = issueKey.trim().toUpperCase();
    if (key) onGenerate(key);
  }

  const canSubmit = issueKey.trim().length > 0 && !loading;

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        className="search-input"
        placeholder="Enter JIRA ID — e.g. SCRUM-5"
        value={issueKey}
        onChange={e => setIssueKey(e.target.value)}
        disabled={loading}
        autoFocus
      />
      <button className="btn-primary btn-generate" type="submit" disabled={!canSubmit}>
        {loading ? 'Generating…' : !settingsComplete ? 'Configure Keys First' : 'Generate Test Plan'}
      </button>
    </form>
  );
}
