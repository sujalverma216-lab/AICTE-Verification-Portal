import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortal } from '../context/PortalContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function OfficialDashboard() {
  const { apps } = usePortal();
  const [q, setQ] = useState('');
  const [st, setSt] = useState('All');
  const queue = apps.filter((a) => a.status !== 'Draft');
  const statuses = ['All', ...new Set(queue.map((a) => a.status))];
  const rows = queue.filter((a) => (st === 'All' || a.status === st) && (a.id + a.institution).toLowerCase().includes(q.toLowerCase()));
  const open = (a) => a.findings.length;
  return (
    <section>
      <h1>Official dashboard</h1>
      <div className="summary">
        <div><b>{queue.length}</b><span>applications in queue</span></div>
        <div><b>{queue.filter((a) => a.status === 'Human review required').length}</b><span>awaiting human review</span></div>
        <div><b>{queue.reduce((s, a) => s + open(a), 0)}</b><span>total findings</span></div>
      </div>
      <div className="toolbar">
        <input aria-label="Search applications" placeholder="Search by application ID or institution" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Filter by status" value={st} onChange={(e) => setSt(e.target.value)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Application</th><th>Institution</th><th>Category</th><th>Findings</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td><td>{a.institution}</td><td>{a.category}</td><td>{a.findings.length}</td>
                <td><StatusBadge status={a.status} /></td>
                <td><Link className="btn btn-small" to={`/official/review/${a.id}`}>Open review</Link></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="6" className="muted">No applications match the current search or filter.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
