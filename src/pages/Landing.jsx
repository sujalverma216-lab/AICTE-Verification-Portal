import { Link } from 'react-router-dom';
import landingpic from '../assets/Slides/landingpic.png';
import '../pages/Landing.css';

const ICONS = {
  list: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  alert: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  rules: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
};
const Icon = ({ name }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name].split(' M').map((d, i) => <path key={i} d={(i ? 'M' : '') + d} />)}
  </svg>
);

const FEATURES = [
  ['list', 'Completeness checks', 'Loads the checklist for the application category and flags missing documents and incomplete fields.'],
  ['file', 'Document reading', 'Extracts institution names, reference numbers and dates so they can be compared across documents.'],
  ['alert', 'Anomaly flags', 'Highlights duplicates, mismatched identifiers and unusual dates. Flags are indicators, not proof.'],
  ['shield', 'Source verification', 'Records the source, time and result of each check. An unavailable source goes to manual confirmation.'],
  ['rules', 'Compliance checklists', 'Compares applications with configurable, versioned checklists approved by authorized staff.'],
  ['clock', 'Audit trail', 'Logs rules applied, records checked, findings and every official action with a timestamp.'],
];
const STEPS = [
  ['Select category', 'Pick the application type and view its document checklist.'],
  ['Submit documents', 'Fill in details and upload certificates and records.'],
  ['Automated checks', 'Completeness, expiry, consistency and duplicates are checked.'],
  ['Official review', 'Officials examine each finding alongside its evidence.'],
  ['Final decision', 'The competent authority decides. The record is kept.'],
];
const FAQ = [
  ['Does the portal approve or reject applications?', 'No. It prepares an evidence-linked report. Statutory scrutiny, inspections and final decisions remain with competent AICTE authorities.'],
  ['What does a flag mean?', 'A flag marks something that needs a person to look, such as an expired certificate or a name that differs between documents. It is not a finding of forgery or misconduct.'],
  ['What if an issuing authority cannot be reached?', 'The check is marked Source Unavailable or Verification Pending and routed for manual confirmation. It is never treated as a compliance failure by itself.'],
  ['Can photos prove infrastructure compliance?', 'Not on their own. Images can show visible gaps, and cases may still need further evidence or a physical inspection.'],
];

export default function Landing() {
  return (
    <div className="ln">
      <section className="ln-hero">
        <div className="ln-hero-in">
          <div>
            <span className="ln-badge">Application validation and verification</span>
            <h1>Review applications on evidence, not guesswork</h1>
            <p className="ln-lead">
              A decision-support portal for technical institutions and AICTE officials. It checks completeness, compares
              documents, records verification results and presents a clear report. People make every decision.
            </p>
            <div className="row">
              <Link to="/login" className="btn btn-primary btn-lg">Sign in to the portal</Link>
              
            </div>
            <ul className="ln-trust">
              <li>Human decisions</li><li>Evidence-linked findings</li><li>Complete audit trail</li>
            </ul>
          </div>
          <div className="ln-hero-visual">
            <img src={landingpic} alt="AICTE verification portal secure access illustration" />
          </div>
        </div>
      </section>

      <section className="ln-sec">
        <h2>What the portal does</h2>
        <p className="ln-sub">Five preliminary checks that save officials time, with every result tied to its evidence.</p>
        <div className="ln-grid">
          {FEATURES.map(([ic, t, d]) => (
            <article className="ln-card" key={t}><span className="ln-ic"><Icon name={ic} /></span><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>

      <section className="ln-sec ln-tint" id="how">
        <h2>How an application moves through the portal</h2>
        <ol className="ln-steps">
          {STEPS.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
        </ol>
      </section>

    

      <section className="ln-sec ln-tint">
        <h2>Frequently asked questions</h2>
        <div className="ln-faq">
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </section>

      <section className="ln-cta">
        <h2>Ready to begin?</h2>
        <p>Sign in with your registered email and select your role.</p>
        <Link to="/login" className="btn btn-gold btn-lg">Sign in</Link>
      </section>
    </div>
  );
}
