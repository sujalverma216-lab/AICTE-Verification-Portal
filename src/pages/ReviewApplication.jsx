import { useNavigate, useParams } from 'react-router-dom';
import { usePortal, CHECKLISTS } from '../context/PortalContext.jsx';

export default function ReviewApplication() {
  const { id } = useParams();
  const { getApp, submitApp } = usePortal();
  const nav = useNavigate();
  const app = getApp(id);
  if (!app) return <p>Application not found.</p>;
  const received = (t) => app.docs.find((d) => d.type === t && d.file);
  const missing = CHECKLISTS[app.category].filter((t) => !received(t));
  return (
    <section className="narrow">
      <h1>Review application</h1>
      <div className="panel">
        <h2>Details</h2>
        <dl className="defs"><dt>Application</dt><dd>{app.id}</dd><dt>Institution</dt><dd>{app.institution}</dd><dt>Category</dt><dd>{app.category}</dd>
          <dt>Contact</dt><dd>{app.details.contact || 'Not provided'}</dd><dt>Email</dt><dd>{app.details.email || 'Not provided'}</dd><dt>Session</dt><dd>{app.details.session}</dd></dl>
      </div>
      <div className="panel">
        <h2>Documents</h2>
        <ul className="checklist">{CHECKLISTS[app.category].map((t) => <li key={t} className={received(t) ? 'done' : 'missing'}>{t}: {received(t) ? received(t).file : 'not uploaded'}</li>)}</ul>
        {missing.length > 0 && <p className="warn-text">{missing.length} required document(s) not uploaded. You can still submit; the validation report will list the gaps.</p>}
      </div>
      <h2>Ready to submit?</h2>
      <div className="row">
        <button className="btn btn-primary" onClick={() => { submitApp(id); nav(`/institution/status/${id}`); }}>Yes, submit application</button>
        <button className="btn" onClick={() => nav(`/institution/apply/${id}`)}>No, go back and edit</button>
      </div>
    </section>
  );
}
