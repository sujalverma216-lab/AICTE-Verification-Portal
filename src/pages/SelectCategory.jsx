import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortal, CHECKLISTS } from '../context/PortalContext.jsx';

export default function SelectCategory() {
  const { createApp } = usePortal();
  const nav = useNavigate();
  const [cat, setCat] = useState(Object.keys(CHECKLISTS)[0]);
  const [inst, setInst] = useState('');
  return (
    <section className="narrow">
      <h1>Select application category</h1>
      <label className="field">Institution name<input value={inst} onChange={(e) => setInst(e.target.value)} placeholder="Name as on the authorized record" /></label>
      <label className="field">Application category
        <select value={cat} onChange={(e) => setCat(e.target.value)}>{Object.keys(CHECKLISTS).map((c) => <option key={c}>{c}</option>)}</select>
      </label>
      <div className="panel">
        <h2>Applicable document checklist</h2>
        <ul className="checklist">{CHECKLISTS[cat].map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
      <button className="btn btn-primary" disabled={!inst.trim()} onClick={() => nav(`/institution/apply/${createApp(cat, inst.trim())}`)}>Continue to application details</button>
    </section>
  );
}
