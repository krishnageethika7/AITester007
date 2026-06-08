import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function TestPlanView({ issueKey, markdown }) {
  function handleDownload() {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-plan-${issueKey}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="test-plan-view">
      <div className="test-plan-view__header">
        <h2>Generated Test Plan</h2>
        <button className="btn-download" onClick={handleDownload}>
          ↓ Download .md
        </button>
      </div>
      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
