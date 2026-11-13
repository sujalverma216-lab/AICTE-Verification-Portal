import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePortal } from '../context/PortalContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function ValidationStatus() {
  const { id } = useParams();
  const { getApp } = usePortal();
  const nav = useNavigate();
  const app = getApp(id);
  if (!app) return <p>Application not found.</p>;
  const actionRequired = app.status === 'Evidence requested';
  const latest = app.notes[0];
  return (
    <section>
      <Link to="/institution" className="back">Back to dashboard</Link>
      <div className="title-row"><h1>Validation status</h1><StatusBadge status={app.status} /></div>
      <p className="muted">{app.id} · {app.institution}</p>
      <div className="panel">
        <h2>Findings and missing items</h2>
        {app.findings.filter((f) => f.sev !== 'Info').map((f) => (
          <div key={f.id} className={`finding sev-${f.sev.toLowerCase()}`}><strong>{f.title}</strong><p>{f.why}</p></div>
        ))}
        {!app.findings.some((f) => f.sev !== 'Info') && <p className="muted">No missing items or discrepancies were flagged.</p>}
        <p className="muted small">Findings are preliminary. An official reviews each case; a flag is not a finding of misconduct.</p>
      </div>
      <div className="panel">
        <h2>Action required?</h2>
        {actionRequired ? (
          <>
            <p>Yes. An official has requested additional evidence{latest?.note ? `: “${latest.note}”` : '.'}</p>
            <button className="btn btn-primary" onClick={() => nav(`/institution/apply/${id}`)}>Rectify or upload additional evidence</button>
          </>
        ) : (
          <>
            <p>No action is needed now. The application is waiting for review or has been reviewed.</p>
            <button className="btn" onClick={() => nav('/institution')}>Track application status</button>
          </>
        )}
      </div>
    </section>
  );
}
