import { useEffect, useMemo, useState } from 'react';
import { MACHINES, MUSCLE_GROUPS } from './data/gymData.js';
import { machineMatches, zoneName } from './matching.js';
import GymMap from './components/GymMap.jsx';
import MachineDetail from './components/MachineDetail.jsx';

const idFromHash = () => {
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  return MACHINES.some((m) => m.id === id) ? id : null;
};

export default function App() {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState(null);
  const [selectedId, setSelectedId] = useState(idFromHash);

  // Keep selection in the URL hash so a machine can be linked / bookmarked (e.g. a QR code on the machine).
  useEffect(() => {
    const onHash = () => setSelectedId(idFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const select = (id) => {
    setSelectedId(id);
    const url = id ? `#${id}` : window.location.pathname + window.location.search;
    window.history.replaceState(null, '', url);
  };

  const filtering = query.trim() !== '' || muscle !== null;
  const matchedIds = useMemo(
    () => new Set(MACHINES.filter((m) => machineMatches(m, query, muscle)).map((m) => m.id)),
    [query, muscle],
  );
  const selected = MACHINES.find((m) => m.id === selectedId) ?? null;
  const listed = MACHINES.filter((m) => matchedIds.has(m.id));

  return (
    <div className="app">
      <div className="proto-banner" role="note">
        Prototype — example layout, not the actual UNF gym floor plan.
      </div>

      <header className="header">
        <div className="header-inner">
          <h1>
            Rec Center <span>Gym Map</span>
          </h1>
          <p className="subtitle">Tap a machine to see muscles worked, how-to steps and a video.</p>
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
          <div className="map-scroll">
            <GymMap
              machines={MACHINES}
              matchedIds={matchedIds}
              filtering={filtering}
              selectedId={selectedId}
              onSelect={select}
            />
          </div>
          <p className="map-hint">Swipe sideways to see the whole floor on small screens.</p>
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
        Student prototype · Not affiliated with or endorsed by UNF · Videos are third-party YouTube content.
      </footer>

      {selected && <MachineDetail machine={selected} onClose={() => select(null)} />}
    </div>
  );
}
