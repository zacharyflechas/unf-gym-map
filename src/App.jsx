import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MACHINES, FACILITY } from './data/gymData.js';
import { zoneName } from './matching.js';
import { applyFilters, matchSummary } from './filters.js';
import { LEGEND, legendGroupOf } from './legend.js';
import { LEVEL as level, LAYOUT_ERRORS } from './levels.js';
import GymMap from './components/GymMap.jsx';
import MachineDetail from './components/MachineDetail.jsx';
import ItemDetail from './components/ItemDetail.jsx';

const CLOSE_MS = 260; // keep in sync with the exit animation in styles.css

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const isNarrow = () => window.matchMedia?.('(max-width: 700px)').matches;
const machineById = (id) => MACHINES.find((m) => m.id === id) ?? null;

// URL: #<id> holds the open item (e.g. #i131) or machine (e.g. #treadmill).
const idFromHash = () => {
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  return MACHINES.some((m) => m.id === id) || level.items.some((it) => it.id === id) ? id : null;
};

const writeUrl = (id) => window.history.replaceState(null, '', `${window.location.pathname}${id ? `#${id}` : ''}`);

export default function App() {
  const [query, setQuery] = useState('');
  const [zoneId, setZoneId] = useState(null); // tapped legend group, or null
  const [view, setView] = useState('map'); // 'map' or 'list'
  const [selectedId, setSelectedId] = useState(idFromHash);
  const [closing, setClosing] = useState(false);
  const mapRef = useRef(null);
  const closeTimer = useRef(null);

  // Keep the selection in the URL hash so a machine can be linked / bookmarked (e.g. a QR code on it).
  useEffect(() => {
    const onHash = () => setSelectedId(idFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const select = useCallback(
    (id) => {
      clearTimeout(closeTimer.current);
      setClosing(false);
      setSelectedId(id);
      writeUrl(id);
    },
    [],
  );

  // Play the exit animation (sheet/drawer out, map glides back) before unmounting the panel.
  const closePanel = useCallback(() => {
    if (reducedMotion()) return select(null);
    setClosing(true);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => select(null), CLOSE_MS);
  }, [select]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const { filtering, itemIds, machineList } = useMemo(
    () => applyFilters({ items: level.items, machines: MACHINES, query, zoneId }),
    [query, zoneId],
  );
  const zones = LEGEND.filter((g) => level.items.some((it) => legendGroupOf(it).id === g.id));
  const zoneLabel = LEGEND.find((g) => g.id === zoneId)?.label ?? null;
  const summary = matchSummary({ query, zoneLabel, machineCount: machineList.length, itemCount: itemIds.size, totalMachines: MACHINES.length });

  // selectedId is an item id (tapped on the map) or a machine id (picked from the list).
  // selectedItem: the item to glide to. selectedMachine: the machine info to show, if any.
  const selectedItem =
    level.items.find((it) => it.id === selectedId) ?? level.items.find((it) => it.machineId && it.machineId === selectedId) ?? null;
  const selectedMachine = machineById(selectedId) ?? machineById(selectedItem?.machineId);
  // Highlight the tapped item, plus every item of the same machine (e.g. all treadmills).
  const selectedIds = useMemo(
    () =>
      new Set(
        level.items
          .filter((it) => it.id === selectedItem?.id || (selectedMachine && it.machineId === selectedMachine.id))
          .map((it) => it.id),
      ),
    [selectedItem, selectedMachine],
  );
  const focusItem = view === 'map' && !closing ? selectedItem : null;

  // On phones, bring the map to the top of the screen so the machine shows above the bottom sheet.
  useEffect(() => {
    if (!focusItem || !mapRef.current || !isNarrow()) return;
    const banner = document.querySelector('.proto-banner')?.offsetHeight ?? 0;
    const top = mapRef.current.getBoundingClientRect().top + window.scrollY - banner - 8;
    window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, [focusItem]);

  const clearAll = () => {
    setQuery('');
    setZoneId(null);
  };

  return (
    <div className="app">
      {import.meta.env.DEV && LAYOUT_ERRORS.length > 0 && (
        <div className="dev-errors" role="alert">
          Layout file problems (dev only, see console): {LAYOUT_ERRORS.join(' · ')}
        </div>
      )}
      <aside className="proto-banner" aria-label="Layout notice">
        Layout approximate, being verified.{' '}
        <a href={FACILITY.feedbackUrl} target="_blank" rel="noopener noreferrer">
          Spot something wrong? Tell us
        </a>
      </aside>

      <header className="header">
        <div className="header-inner">
          <div className="title-block">
            <h1>
              {FACILITY.name} <span>Map</span>
            </h1>
            <p className="subtitle">
              {FACILITY.campus} · {FACILITY.building}. Tap a machine for muscles worked and how-to steps.
            </p>
          </div>
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
              placeholder="Search machines or muscles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search machines or muscles"
            />
            {filtering && (
              <button className="clear-btn" onClick={clearAll}>
                Clear
              </button>
            )}
          </div>

          <div className="legend-filter" role="group" aria-label="Filter by zone">
            {zones.map((g) => (
              <button
                key={g.id}
                className={`zone-chip zone-${g.id}`}
                aria-pressed={zoneId === g.id}
                onClick={() => setZoneId(zoneId === g.id ? null : g.id)}
              >
                <span className="zone-swatch" aria-hidden="true" />
                {g.label}
              </button>
            ))}
          </div>

          <p className="result-count" aria-live="polite">
            {summary}
          </p>
        </section>

        <div className="toolbar">
          <button className="view-btn" aria-pressed={view === 'list'} onClick={() => setView(view === 'map' ? 'list' : 'map')}>
            {view === 'map' ? 'List view' : 'Map view'}
          </button>
        </div>

        {view === 'map' ? (
          <section className="map-card" aria-label={`${level.name} map`} ref={mapRef}>
            <GymMap
              level={level}
              matchedIds={itemIds}
              filtering={filtering}
              selectedIds={selectedIds}
              focusItem={focusItem}
              onSelect={select}
            />
            <p className="map-hint">Drag to move around · pinch, scroll or use + / − to zoom.</p>
            <p className="legend">
              <span>
                <strong>Layout approximate, being verified:</strong> traced from the official floor plan and placed from a student’s sketch.{' '}
                Positions and names may change.
              </span>
              <span>Red = restrooms / staff areas · Striped = stairs · Dots = building columns.</span>
            </p>
          </section>
        ) : (
          <section className="list-card" aria-label="Machine list">
            <h2>{filtering ? 'Matching machines' : 'All machines'}</h2>
            {machineList.length === 0 ? (
              <p className="empty">No machines match. Try another search or clear the filter.</p>
            ) : (
              <ul className="machine-list">
                {machineList.map((m) => (
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
        )}
      </main>

      <footer className="footer">
        Student-made draft · Not affiliated with or endorsed by UNF · Info from public UNF pages, UNF Spinnaker and photos · Videos are third-party YouTube content unless marked Coach Zach.
      </footer>

      {selectedMachine ? (
        <MachineDetail machine={selectedMachine} closing={closing} onClose={closePanel} />
      ) : (
        selectedItem && <ItemDetail item={selectedItem} closing={closing} onClose={closePanel} />
      )}
    </div>
  );
}
