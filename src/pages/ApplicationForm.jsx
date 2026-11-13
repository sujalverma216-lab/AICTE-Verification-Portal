import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePortal, CHECKLISTS } from '../context/PortalContext.jsx';

export default function ApplicationForm() {
  const { id } = useParams();
  const { getApp, saveDraft } = usePortal();
  const nav = useNavigate();
  const app = getApp(id);
  const [details, setDetails] = useState(app?.details || {});
  const [docs, setDocs] = useState(app?.docs || []);
  if (!app) return <p>Application not found.</p>;
  const doc = (t) => docs.find((d) => d.type === t) || { type: t, file: '', validUntil: '' };
  const setDoc = (t, patch) => setDocs((p) => [...p.filter((d) => d.type !== t), { ...doc(t), ...patch }]);
  const next = () => { saveDraft(id, details, docs); nav(`/institution/review/${id}`); };
  return (
    <section className="narrow">
      <h1>Application details</h1>
      <p className="muted">{app.id} · {app.institution} · {app.category}</p>
      <div className="panel">
        <h2>Fill application details</h2>
        <label className="field">Contact person<input value={details.contact || ''} onChange={(e) => setDetails({ ...details, contact: e.target.value })} /></label>
        <label className="field">Official email<input type="email" value={details.email || ''} onChange={(e) => setDetails({ ...details, email: e.target.value })} /></label>
        <label className="field">Academic session<input value={details.session || ''} onChange={(e) => setDetails({ ...details, session: e.target.value })} /></label>
      </div>
      <div className="panel">
        <h2>Upload documents</h2>
        {CHECKLISTS[app.category].map((t) => (
          <div key={t} className="upload-row">
            <strong>{t}</strong>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setDoc(t, { file: e.target.files[0]?.name || '' })} aria-label={`Upload ${t}`} />
            {doc(t).file && <span className="muted small">Selected: {doc(t).file}</span>}
            <label className="small">Valid until (if shown on the document)<input type="date" value={doc(t).validUntil} onChange={(e) => setDoc(t, { validUntil: e.target.value })} /></label>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={next}>Review application</button>
    </section>
  );
}
