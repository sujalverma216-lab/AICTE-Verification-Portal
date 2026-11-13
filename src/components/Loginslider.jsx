import { useEffect, useState } from 'react';
import pic1 from '../assets/Slides/pic1.svg';
import pic2 from '../assets/Slides/pic2.jpeg';
import pic3 from '../assets/Slides/pic3.jpeg';
import pic4 from '../assets/Slides/pic4.jpeg';

/*
  Slider settings
  SLIDE_MS   : how long each slide stays before moving on (milliseconds)
  SLIDE_ANIM : how long the slide movement takes (set in login.css as --slide-anim)
*/
const SLIDE_MS = 2500;

/*
  Images are loaded automatically from  src/assets/slides/
  Put your own images (png, jpg, webp, svg) in that folder. They are shown in file-name order,
  so name them 1-first.png, 2-second.png, 3-third.png ... No code change is needed.
*/
const found = import.meta.glob('../assets/slides/*.{png,jpg,jpeg,webp,avif,svg}', { eager: true, import: 'default' });
const IMAGES = Object.entries(found)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url);

// Captions are matched to images by position (first caption goes with the first image).
const CAPTIONS = [
  { title: 'Submit your application', text: 'Choose the category, see the checklist and upload your documents online.' },
  { title: 'Automated preliminary checks', text: 'Completeness, expiry, name consistency and duplicates are checked in moments.' },
  { title: 'Verification with issuing sources', text: 'Where an authorized source is available, results are recorded with the source and time.' },
  { title: 'Human review and audit trail', text: 'Officials review the evidence and decide. Every action is logged.' },
];
const FALLBACK = { title: 'AICTE Application Verification Portal', text: 'Evidence-based checks that support official review.' };

export default function LoginSlider() {
  const n = IMAGES.length;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const go = (k) => setI(((k % n) + n) % n);

  // Moves to the next slide automatically. The timer restarts after any manual change.
  useEffect(() => {
    if (!playing || n < 2) return undefined;
    const t = setTimeout(() => setI((p) => (p + 1) % n), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, playing, n]);

  if (!n) return <p className="slider-empty">Add images to src/assets/slides/ to show them here.</p>;

  const caption = CAPTIONS[i] || FALLBACK;
  // Position of each slide relative to the current one. New slides enter from the left and move right.
  const stateOf = (k) => {
    const d = (((k - i) % n) + n) % n;
    if (d === 0) return 'active';
    if (d === 1) return 'enter';
    if (d === n - 1) return 'exit';
    return 'wait';
  };

  return (
    <div className="slider" role="region" aria-roledescription="carousel" aria-label="About the portal">
      <div className="slider-stage">
        {IMAGES.map((src, k) => (
          <img key={src} src={src} alt={(CAPTIONS[k] || FALLBACK).title} className={`slide ${stateOf(k)}`} aria-hidden={k !== i} draggable="false" />
        ))}
        {playing && n > 1 && <span key={i} className="slider-progress" style={{ animationDuration: `${SLIDE_MS}ms` }} />}
      </div>

      <div className="slider-caption" key={`c${i}`} aria-live={playing ? 'off' : 'polite'}>
        <h2>{caption.title}</h2>
        <p>{caption.text}</p>
      </div>

      {n > 1 && (
        <div className="slider-controls">
          <button type="button" className="slider-arrow" onClick={() => go(i - 1)} aria-label="Previous slide">‹</button>
          <div className="slider-dots">
            {IMAGES.map((src, k) => (
              <button key={src} type="button" className={k === i ? 'on' : ''} onClick={() => go(k)} aria-label={`Show slide ${k + 1}`} aria-current={k === i} />
            ))}
          </div>
          <button type="button" className="slider-arrow" onClick={() => go(i + 1)} aria-label="Next slide">›</button>
          <button type="button" className="slider-arrow slider-play" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}>{playing ? '❚❚' : '▶'}</button>
        </div>
      )}
    </div>
  );
}