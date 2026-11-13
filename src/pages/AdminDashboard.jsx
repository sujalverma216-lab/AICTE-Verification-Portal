import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortal } from '../context/PortalContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function AdminDashboard() {
  const { apps } = usePortal();
  const [q, setQ] = useState('');
  const [st, setSt] = useState('All');
  
  // Example admin-level filtering logic (e.g., viewing all system applications or administrative statuses)
  const statuses = ['All', ...new Set(apps.map((a) => a.status))];
  const rows = apps.filter((a) => 
    (st === 'All' || a.status === st) && 
    (a.id + (a.institution || '') + (a.category || '')).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <section>
      <h1>Admin Dashboard</h1>
      <div className="summary">
        <div><b>{apps.length}</b><span>total system applications</span></div>
        <div><b>{apps.filter((a) => a.status === 'Active' || a.status === 'Approved').length}</b><span>active / approved</span></div>
        <div><b>{apps.filter((a) => a.status === 'Human review required' || a.status === 'Pending').length}</b><span>pending attention</span></div>
      </div>
      <div className="toolbar">
        <input 
          aria-label="Search applications or institutions" 
          placeholder="Search by ID, institution, or category..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
        />
        <select 
          aria-label="Filter by status" 
          value={st} 
          onChange={(e) => setSt(e.target.value)}
        >
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Application</th>
              <th>Institution</th>
              <th>Category</th>
              <th>Findings</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.institution}</td>
                <td>{a.category}</td>
                <td>{a.findings?.length || 0}</td>
                <td><StatusBadge status={a.status} /></td>
                <td>
                  <Link className="btn btn-small" to={`/admin/review/${a.id}`}>Manage</Link>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="6" className="muted">No records match the current search or filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}