import { useEffect, useRef } from 'react';
import { zoneName } from '../matching.js';
import MuscleDiagram from './MuscleDiagram.jsx';
import VideoCard from './VideoCard.jsx';

const NO_REGION = ['Cardio', 'Mobility']; // muscles the body diagram can't show; listed as text

export default function MachineDetail({ machine, closing = false, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    document.body.classList.add('no-scroll');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [machine.id, onClose]);

  const { primary, secondary } = machine.muscles;
  const extras = [...primary, ...secondary].filter((m) => NO_REGION.includes(m));

  return (
    <div className={`overlay ${closing ? 'is-closing' : ''}`} onClick={onClose}>
      <div className="detail" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" aria-hidden="true" />
        <div className="detail-header">
          <div>
            <p className="detail-zone">{zoneName(machine.zone)}</p>
            <h2 id="detail-title">{machine.name}</h2>
          </div>
          <button ref={closeRef} className="close-btn" onClick={onClose} aria-label="Close details">
            ✕
          </button>
        </div>

        <div className="detail-body">
          <section className="card" aria-labelledby="muscles-title">
            <h3 id="muscles-title">Muscles worked</h3>
            <div className="muscle-card">
              <MuscleDiagram muscles={machine.muscles} />
              <div className="muscle-lists">
                <h4>
                  <span className="key key-primary" aria-hidden="true" /> Primary
                </h4>
                <ul className="tag-list">
                  {primary.map((m) => (
                    <li key={m} className="tag tag-primary">
                      {m}
                    </li>
                  ))}
                </ul>
                {secondary.length > 0 && (
                  <>
                    <h4>
                      <span className="key key-secondary" aria-hidden="true" /> Secondary
                    </h4>
                    <ul className="tag-list">
                      {secondary.map((m) => (
                        <li key={m} className="tag">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {extras.length > 0 && <p className="muscle-note">Also: {extras.join(', ')} (not shown on the body).</p>}
              </div>
            </div>
          </section>

          {machine.video && <VideoCard key={machine.id} video={machine.video} machineName={machine.name} />}

          <section className="card" aria-labelledby="steps-title">
            <h3 id="steps-title">How to</h3>
            <ol className="steps">
              {machine.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </section>

          {machine.tips?.length > 0 && (
            <section className="card" aria-labelledby="tips-title">
              <h3 id="tips-title">Tips</h3>
              <ul className="tips">
                {machine.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </section>
          )}

          <p className="disclaimer">
            General guidance only. Start light, and ask Rec Center staff if you’re unsure how to use a machine. The map layout is
            approximate and still being verified.
          </p>
        </div>
      </div>
    </div>
  );
}
