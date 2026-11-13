import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePortal } from '../context/PortalContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function ReviewWorkspace() {
  const { id } = useParams();
  const { getApp, recordAction } = usePortal();
  const nav = useNavigate();
  const app = getApp(id);
  const [action, setAction] = useState('review');
  const [note, setNote] = useState('');
  if (!app) return <p>Application not found. <Link to="/official">Return to queue</Link></p>;
  const submit = () => { recordAction(id, action, note); nav('/official'); };
  return (
    <section>
      <Link to="/official" className="back">Back to application queue</Link>
      <div className="title-row"><h1>{app.institution}</h1><StatusBadge status={app.status} /></div>
      <p className="muted">{app.id} · {app.category}</p>

      <div className="panel">
        <h2>Documents and extracted fields</h2>
        <div className="table-wrap"><table>
          <thead><tr><th>Document</th><th>File</th><th>Institution name</th><th>Valid until</th></tr></thead>
          <tbody>{app.docs.map((d) => <tr key={d.type}><td>{d.type}</td><td>{d.file || 'Not received'}</td><td>{app.institution}</td><td>{d.validUntil || 'Not applicable'}</td></tr>)}</tbody>
        </table></div>
        <p className="muted small">Extracted values are simulated in this prototype. A production build would read them from scanned documents with OCR.</p>
      </div>

      <div className="panel">
        <h2>Validation findings and evidence</h2>
        {app.findings.map((f) => (
          <div key={f.id} className={`finding sev-${f.sev.toLowerCase()}`}>
            <strong>{f.title}</strong> <span className="tag">{f.sev}</span>
            <p>{f.why}</p><p className="muted small">Evidence: {f.evidence}</p>
          </div>
        ))}
        {!app.findings.length && <p className="muted">No findings.</p>}
      </div>

      <div className="panel">
        <h2>Next action</h2>
        {[['request', 'Request evidence'], ['manual', 'Refer for manual verification or inspection'], ['review', 'Record review']].map(([v, l]) => (
          <label key={v} className="radio"><input type="radio" name="act" checked={action === v} onChange={() => setAction(v)} /> {l}</label>
        ))}
        <label className="field">Notes<textarea rows="3" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Record the request, reason or review outcome" /></label>
        <button className="btn btn-primary" onClick={submit}>Update status and audit trail</button>
      </div>

      <div className="panel">
        <h2>Audit trail</h2>
        <ul className="audit">{app.audit.map((a, i) => <li key={i}><span>{a.t}</span> <b>{a.who}</b>: {a.msg}</li>)}</ul>
      </div>
    </section>
  );
}
