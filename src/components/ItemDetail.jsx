import { useEffect, useRef } from 'react';

/**
 * Detail panel for a map item that has no machine info linked yet (no machineId).
 * Uses the same drawer / bottom-sheet styles as MachineDetail.
 */
export default function ItemDetail({ item, closing = false, onClose }) {
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
  }, [item.id, onClose]);

  return (
    <div className={`overlay ${closing ? 'is-closing' : ''}`} onClick={onClose}>
      <aside className="detail" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" aria-hidden="true" />
        <header className="detail-header">
          <div>
            <p className="detail-zone">{item.zone}</p>
            <h2 id="detail-title">{item.name}</h2>
          </div>
          <button ref={closeRef} className="close-btn" onClick={onClose} aria-label="Close details">
            ✕
          </button>
        </header>
        <div className="detail-body">
          <section className="card">
            <p>No how-to info for this item yet.</p>
          </section>
          <p className="disclaimer">The layout is approximate and still being verified, so names and positions may change.</p>
        </div>
      </aside>
    </div>
  );
}
