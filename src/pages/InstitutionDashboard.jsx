import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function InstitutionDashboard() {
  const { apps } = usePortal();
  const nav = useNavigate();
  return (
    <section>
      <div className="title-row">
        <h1>Institution dashboard</h1>
        <button className="btn btn-primary" onClick={() => nav('/institution/new')}>Create new application</button>
      </div>
      <p className="muted">Application status shown here is the same status officials see.</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Application</th><th>Institution</th><th>Category</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td><td>{a.institution}</td><td>{a.category}</td><td><StatusBadge status={a.status} /></td>
                <td><Link className="btn btn-small" to={a.status === 'Draft' ? `/institution/apply/${a.id}` : `/institution/status/${a.id}`}>{a.status === 'Draft' ? 'Continue draft' : 'View status'}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
