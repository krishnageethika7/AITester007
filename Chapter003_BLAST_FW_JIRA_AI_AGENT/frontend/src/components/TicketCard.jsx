const STATUS_COLORS = {
  'To Do': '#6b7280',
  'In Progress': '#3b82f6',
  'Done': '#22c55e',
  'In Review': '#f59e0b',
};

export default function TicketCard({ data }) {
  const { jira_id, summary, issue_type, status, priority, reporter, assignee, labels } = data;
  const statusColor = STATUS_COLORS[status] ?? '#6b7280';

  return (
    <div className="ticket-card">
      <div className="ticket-card__header">
        <span className="ticket-id">{jira_id}</span>
        <span className="ticket-type">{issue_type}</span>
        <span className="ticket-status" style={{ borderColor: statusColor, color: statusColor }}>{status}</span>
      </div>
      <p className="ticket-summary">{summary}</p>
      <div className="ticket-meta">
        {priority && <span className="meta-chip">🔼 {priority}</span>}
        {reporter && <span className="meta-chip">👤 {reporter}</span>}
        {assignee && assignee !== 'Unassigned' && <span className="meta-chip">🎯 {assignee}</span>}
        {labels.map(l => <span key={l} className="meta-chip meta-chip--label">{l}</span>)}
      </div>
    </div>
  );
}
