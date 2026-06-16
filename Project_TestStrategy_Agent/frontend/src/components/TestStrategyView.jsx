import ReactMarkdown from 'react-markdown';
import remarkGfm    from 'remark-gfm';

const STATUS_COLOR = {
  'To Do':       { color: '#a1a1aa', border: '#3f3f46' },
  'In Progress': { color: '#38bdf8', border: '#0ea5e9' },
  'In Review':   { color: '#f59e0b', border: '#d97706' },
  'Done':        { color: '#22c55e', border: '#16a34a' },
};

function IssueCard({ issue }) {
  const { color, border } = STATUS_COLOR[issue.status] ?? { color: '#a1a1aa', border: '#3f3f46' };

  return (
    <div className="issue-card">
      <div className="issue-card__left">
        <div className="issue-key-row">
          <span className="issue-key">{issue.key}</span>
          <span className="issue-type-badge">{issue.issueType}</span>
        </div>
        <p className="issue-summary">{issue.summary}</p>
        <div className="issue-meta">
          {issue.priority   && <span className="chip">⬆ {issue.priority}</span>}
          {issue.reporter   && <span className="chip">👤 {issue.reporter}</span>}
          {issue.assignee   && <span className="chip">🎯 {issue.assignee}</span>}
          {issue.labels.map(l     => <span key={l} className="chip chip--label">{l}</span>)}
          {issue.components.map(c => <span key={c} className="chip">{c}</span>)}
        </div>
      </div>

      <div className="issue-card__right">
        <span
          className="issue-status-pill"
          style={{ color, borderColor: border, backgroundColor: `${border}18` }}
        >
          {issue.status}
        </span>
        {issue.fixVersions?.length > 0 && (
          <span className="chip">🏷 {issue.fixVersions[0]}</span>
        )}
      </div>
    </div>
  );
}

export default function TestStrategyView({ issue, markdown }) {
  const sectionCount = (markdown.match(/^## /gm) ?? []).length;

  function download() {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `test-strategy-${issue.key}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="strategy-view">
      <IssueCard issue={issue} />

      <div className="strategy-doc">
        <div className="strategy-toolbar">
          <div className="strategy-title">
            Test Strategy — {issue.key}
            <span className="sections-badge">{sectionCount} sections</span>
          </div>
          <div className="strategy-toolbar__right">
            <button className="btn-download" onClick={download}>
              ↓ Download .md
            </button>
          </div>
        </div>

        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
