import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MACHINES, MUSCLE_GROUPS, MAP_WIDTH, MAP_HEIGHT, FACILITY } from './data/gymData.js';
import { machineMatches, zoneName } from './matching.js';
import GymMap from './components/GymMap.jsx';
import MachineDetail from './components/MachineDetail.jsx';

const ZOOM = 1.7; // how far the map zooms toward a tapped machine
const MAP_VIEW_H = MAP_HEIGHT + 30; // must match the SVG viewBox height in GymMap
const CLOSE_MS = 260; // keep in sync with the exit animation in styles.css

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const isNarrow = () => window.matchMedia?.('(max-width: 700px)').matches;

/**
 * CSS transform that zooms the map toward a machine. Uses percentages of the map's own
 * box so no layout measurement is needed; clamped so the map never pans past its edges.
 */
function zoomTransform(machine) {
  if (!machine) return undefined;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  // On desktop the drawer covers the right side, so aim the machine a bit left of center.
  const targetX = isNarrow() ? 50 : 38;
  const fx = (machine.x / MAP_WIDTH) * 100;
  const fy = (machine.y / MAP_VIEW_H) * 100;
  const tx = clamp(targetX - ZOOM * fx, 100 - 100 * ZOOM, 0);
  // On phones only the top of the map peeks out above the bottom sheet, so aim higher.
  const targetY = isNarrow() ? 24 : 45;
  const ty = clamp(targetY - ZOOM * fy, 100 - 100 * ZOOM, 0);
  return `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${ZOOM})`;
}

const idFromHash = () => {
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  return MACHINES.some((m) => m.id === id) ? id : null;
};

export default function App() {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState(null);
  const [selectedId, setSelectedId] = useState(idFromHash);
  const [closing, setClosing] = useState(false);
  const scrollRef = useRef(null);
  const closeTimer = useRef(null);

  // Keep selection in the URL hash so a machine can be linked / bookmarked (e.g. a QR code on the machine).
  useEffect(() => {
    const onHash = () => setSelectedId(idFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const select = useCallback((id) => {
    clearTimeout(closeTimer.current);
    setClosing(false);
    setSelectedId(id);
    const url = id ? `#${id}` : window.location.pathname + window.location.search;
    window.history.replaceState(null, '', url);
  }, []);

  // Play the exit animation (sheet/drawer out, map zooms back) before unmounting the panel.
  const closePanel = useCallback(() => {
    if (reducedMotion()) return select(null);
    setClosing(true);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => select(null), CLOSE_MS);
  }, [select]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const filtering = query.trim() !== '' || muscle !== null;
  const matchedIds = useMemo(
    () => new Set(MACHINES.filter((m) => machineMatches(m, query, muscle)).map((m) => m.id)),
    [query, muscle],
  );
  const selected = MACHINES.find((m) => m.id === selectedId) ?? null;
  const listed = MACHINES.filter((m) => matchedIds.has(m.id));
  const zoomed = selected && !closing && !reducedMotion() ? selected : null;

  // On phones: bring the map to the top of the page (it peeks out above the bottom sheet)
  // and scroll it sideways so the tapped machine is in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (!selected || !el || !isNarrow()) return;
    const behavior = reducedMotion() ? 'auto' : 'smooth';
    const banner = document.querySelector('.proto-banner')?.offsetHeight ?? 0;
    const top = el.getBoundingClientRect().top + window.scrollY - banner - 8;
    window.scrollTo({ top, behavior });
    if (el.scrollWidth > el.clientWidth) {
      const left = (selected.x / MAP_WIDTH) * el.scrollWidth - el.clientWidth / 2;
      el.scrollTo({ left, behavior });
    }
  }, [selected]);

  return (
    <div className="app">
      <div className="proto-banner" role="note">
        Draft layout based on public info — may not match the actual UNF gym.{' '}
        <a href={FACILITY.feedbackUrl} target="_blank" rel="noopener noreferrer">
          Help us fix it!
        </a>
      </div>

      <header className="header">
        <div className="header-inner">
          <h1>
            {FACILITY.name} <span>Map</span>
          </h1>
          <p className="subtitle">
            {FACILITY.campus} · {FACILITY.building}. Tap a machine for muscles worked, how-to steps and a video.
          </p>
        </div>
      </header>

      <main className="main">
        <section className="controls" aria-label="Search and filter">
          <div className="search">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search machines or muscles (e.g. “row”, “glutes”)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search machines or muscles"
            />
            {filtering && (
              <button
                className="clear-btn"
                onClick={() => {
                  setQuery('');
                  setMuscle(null);
                }}
              >
                Clear
              </button>
            )}
          </div>
          <div className="chips" role="group" aria-label="Filter by muscle group">
            {MUSCLE_GROUPS.map((g) => (
              <button
                key={g}
                className={`chip ${muscle === g ? 'chip-active' : ''}`}
                aria-pressed={muscle === g}
                onClick={() => setMuscle(muscle === g ? null : g)}
              >
                {g}
              </button>
            ))}
          </div>
          <p className="result-count" aria-live="polite">
            {filtering
              ? `${matchedIds.size} of ${MACHINES.length} machines match — highlighted on the map`
              : `${MACHINES.length} machines`}
          </p>
        </section>

        <section className="map-card" aria-label="Gym floor map">
          <div className="map-scroll" ref={scrollRef}>
            <div className="map-stage">
              <div className={`map-zoom ${zoomed ? 'is-zoomed' : ''}`} style={{ transform: zoomTransform(zoomed) }}>
                <GymMap
                  machines={MACHINES}
                  matchedIds={matchedIds}
                  filtering={filtering}
                  selectedId={selectedId}
                  onSelect={select}
                />
              </div>
            </div>
          </div>
          <p className="map-hint">Swipe sideways to see the whole floor on small screens.</p>
          <p className="legend">
            <span>
              <strong>Draft:</strong> equipment is from public sources; most positions are guesses (“location: guess”).
            </span>
            <span>Dashed green = outdoor balcony · Hatched = open atrium.</span>
          </p>
        </section>

        <section className="list-card" aria-label="Machine list">
          <h2>{filtering ? 'Matching machines' : 'All machines'}</h2>
          {listed.length === 0 ? (
            <p className="empty">No machines match. Try another search or clear the filter.</p>
          ) : (
            <ul className="machine-list">
              {listed.map((m) => (
                <li key={m.id}>
                  <button className="machine-row" onClick={() => select(m.id)}>
                    <span className="row-badge">{m.short}</span>
                    <span className="row-text">
                      <strong>{m.name}</strong>
                      <small>
                        {zoneName(m.zone)} · {m.muscles.primary.join(', ')}
                      </small>
                    </span>
                    <span className="row-chevron" aria-hidden="true">
                      ›
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="footer">
        Student-made draft · Not affiliated with or endorsed by UNF · Info from public UNF pages, UNF Spinnaker and photos · Videos are third-party YouTube content.
      </footer>

      {selected && <MachineDetail machine={selected} closing={closing} onClose={closePanel} />}
    </div>
  );
}
