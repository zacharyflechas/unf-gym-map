import { useEffect, useRef } from 'react';
import { zoneName } from '../matching.js';

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

  const searchQuery = machine.youtubeSearch || `how to use ${machine.name} proper form`;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

  return (
    <div className={`overlay ${closing ? 'is-closing' : ''}`} onClick={onClose}>
      <aside
        className="detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="detail-header">
          <div>
            <p className="detail-zone">{zoneName(machine.zone)}</p>
            <h2 id="detail-title">{machine.name}</h2>
          </div>
          <button ref={closeRef} className="close-btn" onClick={onClose} aria-label="Close details">
            ✕
          </button>
        </header>

        <div className="detail-body">
          <div className="muscles">
            <div>
              <h3>Primary</h3>
              <ul className="tag-list">
                {machine.muscles.primary.map((m) => (
                  <li key={m} className="tag tag-primary">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            {machine.muscles.secondary.length > 0 && (
              <div>
                <h3>Secondary</h3>
                <ul className="tag-list">
                  {machine.muscles.secondary.map((m) => (
                    <li key={m} className="tag">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <h3>Video tutorial</h3>
          {machine.youtubeId ? (
            <div className="video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${machine.youtubeId}?rel=0`}
                title={`${machine.name} tutorial video`}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : (
            <a className="yt-search" href={searchUrl} target="_blank" rel="noopener noreferrer">
              ▶ Search YouTube for a “{machine.name}” tutorial
            </a>
          )}

          <h3>How to</h3>
          <ol className="steps">
            {machine.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>

          {machine.tips?.length > 0 && (
            <>
              <h3>Tips</h3>
              <ul className="tips">
                {machine.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </>
          )}
          <p className="disclaimer">
            General guidance only. Start light, and ask Rec Center staff if you’re unsure how to use a machine.
          </p>
        </div>
      </aside>
    </div>
  );
}
