/**
 * DEV-ONLY layout editor. Opened with ?edit=1 while running `npm run dev` (add &level=3f for the track).
 * It is loaded through a dynamic import in main.jsx behind import.meta.env.DEV, so it is never
 * part of the production build (the build check greps dist/ for LAYOUT_EDITOR_MARKER).
 *
 * Workflow: move/label items here → Export JSON → replace src/data/layout-<level>.json →
 * `npm run validate` → commit / open a PR. See README → "Updating the layout".
 */
import { useEffect, useRef, useState } from 'react';
import { MACHINES } from '../data/gymData.js';
import BaseMap from '../components/BaseMap.jsx';
import { LEVELS, levelById } from '../levels.js';
import { viewBoxOf, itemTransform } from '../layout.js';
import { FORMAT_VERSION, SOURCE_VALUES, STATUS_VALUES, validateLayout } from '../layoutSchema.js';
import { KNOWN_ZONES } from '../legend.js';
import './editor.css';

// The build check searches dist/ for this exact string; it must only ever exist in editor code.
const LAYOUT_EDITOR_MARKER = 'LAYOUT_EDITOR_MARKER';

// Underlay images: every .jpg/.png/.webp in dev-assets/ shows up in the underlay dropdown.
// dev-assets/ is git-ignored and NOT in public/, so only the dev server can serve these files;
// they are never copied into dist/. You can also pick any image file from disk (e.g. a LiDAR top-down export).
const DEV_IMAGES = import.meta.glob('../../dev-assets/*.{jpg,jpeg,png,webp}', { query: '?url', import: 'default', eager: true });
const fileName = (path) => path.split('/').pop();
// Known placements (feet). The straightened official plan is 5 px per foot with the base map's origin.
const KNOWN_PLACEMENTS = { 'plan-2f-straightened.jpg': { x: 0, y: 0, width: 2774 / 5 } };

const NUDGE = 0.5; // feet per arrow-key press
const BIG_NUDGE = 5; // feet per Shift + arrow-key press
const MACHINE_IDS = MACHINES.map((m) => m.id);

const round1 = (n) => Math.round(n * 10) / 10;
const unique = (values) => [...new Set(values.filter(Boolean))].sort();
const today = () => new Date().toISOString().slice(0, 10);
const storageKey = (levelId) => `layout-${levelId}-draft`; // edits are kept in localStorage so a reload doesn't lose them

/** Turn a pointer position (screen pixels) into map coordinates (feet) using the SVG's own transform. */
function toFeet(svg, event) {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(svg.getScreenCTM().inverse());
}

function loadItems(level) {
  const saved = localStorage.getItem(storageKey(level.id));
  return saved ? JSON.parse(saved) : level.items;
}

/** Next free id with the level's prefix, e.g. "i172" when the highest id is "i171". */
function nextId(items, prefix) {
  const numbers = items.map((it) => Number(it.id.replace(/\D/g, '')) || 0);
  return `${prefix}${String(Math.max(0, ...numbers) + 1).padStart(3, '0')}`;
}

/** Where an underlay image sits on the map, in feet. Height follows the image's own aspect ratio. */
function defaultPlacement(name, view) {
  return KNOWN_PLACEMENTS[name] ?? { x: view.x, y: view.y, width: view.width };
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function LayoutEditor() {
  const [levelId, setLevelId] = useState(() => levelById(new URLSearchParams(window.location.search).get('level')).id);
  const level = levelById(levelId);
  const view = level.base.view;

  const [items, setItems] = useState(() => loadItems(level));
  const [source, setSource] = useState(level.meta.source ?? 'sketch');
  const [selectedId, setSelectedId] = useState(null);

  const devImageNames = Object.keys(DEV_IMAGES).map(fileName);
  const [underlay, setUnderlay] = useState(() => {
    const name = devImageNames.find((n) => n.includes(level.id)) ?? devImageNames[0];
    return name ? { name, url: DEV_IMAGES[`../../dev-assets/${name}`], ...defaultPlacement(name, view) } : null;
  });
  const [aspect, setAspect] = useState(null); // image height / width, read when the image loads
  const [showUnderlay, setShowUnderlay] = useState(true);
  const [underlayOpacity, setUnderlayOpacity] = useState(0.5);

  const svgRef = useRef(null);
  const drag = useRef(null); // while dragging: { mode: 'move', id, dx, dy } or { mode: 'rotate', id }

  const selected = items.find((it) => it.id === selectedId) ?? null;
  const differsFromFile = JSON.stringify(items) !== JSON.stringify(level.items);
  const check = validateLayout({ meta: level.meta, items }, { machineIds: MACHINE_IDS, base: level.base, knownZones: KNOWN_ZONES });

  useEffect(() => {
    localStorage.setItem(storageKey(levelId), JSON.stringify(items));
  }, [items, levelId]);

  // Read the underlay image's real size so its height in feet keeps the right proportions.
  const underlayUrl = underlay?.url;
  useEffect(() => {
    if (!underlayUrl) return;
    const img = new Image();
    img.onload = () => setAspect(img.naturalHeight / img.naturalWidth);
    img.src = underlayUrl;
  }, [underlayUrl]);

  function switchLevel(id) {
    const next = levelById(id);
    setLevelId(next.id);
    setItems(loadItems(next));
    setSource(next.meta.source ?? 'sketch');
    setSelectedId(null);
    const url = new URL(window.location.href);
    url.searchParams.set('level', next.id);
    window.history.replaceState(null, '', url);
  }

  function chooseDevImage(name) {
    if (!name) return setUnderlay(null);
    setUnderlay({ name, url: DEV_IMAGES[`../../dev-assets/${name}`], ...defaultPlacement(name, view) });
  }

  function chooseImageFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    // A blob: URL only lives in this tab; nothing is uploaded or saved anywhere.
    setUnderlay({ name: file.name, url: URL.createObjectURL(file), ...defaultPlacement(file.name, view) });
  }

  const updateItem = (id, changes) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...changes } : it)));
  const edit = (field, value) => updateItem(selected.id, { [field]: value });
  const editNumber = (field) => (e) => edit(field, e.target.value === '' ? 0 : Number(e.target.value));

  // ---------- drag to move, drag the handle to rotate ----------
  function startMove(e, item) {
    e.stopPropagation(); // don't let the map background deselect it
    setSelectedId(item.id);
    const p = toFeet(svgRef.current, e);
    // remember where on the item we grabbed it, so it doesn't jump to the pointer
    drag.current = { mode: 'move', id: item.id, dx: p.x - item.x, dy: p.y - item.y };
    svgRef.current.setPointerCapture(e.pointerId); // keep getting moves even if the pointer leaves the item
  }

  function startRotate(e, item) {
    e.stopPropagation();
    drag.current = { mode: 'rotate', id: item.id };
    svgRef.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    const d = drag.current;
    if (!d) return;
    const p = toFeet(svgRef.current, e);
    if (d.mode === 'move') {
      updateItem(d.id, { x: round1(p.x - d.dx), y: round1(p.y - d.dy) });
    } else {
      const item = items.find((it) => it.id === d.id);
      // Angle from the item's center to the pointer. +90 because the handle sits straight "up" (-y) at 0°.
      let degrees = (Math.atan2(p.y - item.y, p.x - item.x) * 180) / Math.PI + 90;
      if (e.shiftKey) degrees = Math.round(degrees / 15) * 15;
      updateItem(d.id, { rotation: (Math.round(degrees) + 360) % 360 });
    }
  }

  const endDrag = () => {
    drag.current = null;
  };

  // ---------- arrow keys nudge the selected item ----------
  useEffect(() => {
    function onKey(e) {
      if (!selectedId || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      const step = e.shiftKey ? BIG_NUDGE : NUDGE;
      const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      const move = moves[e.key];
      if (!move) return;
      e.preventDefault(); // stop the page from scrolling
      setItems((prev) =>
        prev.map((it) => (it.id === selectedId ? { ...it, x: round1(it.x + move[0]), y: round1(it.y + move[1]) } : it)),
      );
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  // ---------- toolbar actions ----------
  function addItem() {
    const item = {
      id: nextId(items, level.id === '2f' ? 'i' : 't'),
      name: 'New item',
      type: 'machine',
      zone: selected?.zone ?? '',
      x: round1(view.x + view.width / 2),
      y: round1(view.y + view.height / 2),
      rotation: 0,
      width: 4,
      depth: 5,
      status: 'guess',
      notes: '',
    };
    setItems([...items, item]);
    setSelectedId(item.id);
  }

  function deleteSelected() {
    if (!selected || !window.confirm(`Delete "${selected.name}"?`)) return;
    setItems(items.filter((it) => it.id !== selected.id));
    setSelectedId(null);
  }

  function resetToFile() {
    if (!window.confirm(`Throw away all edits and go back to src/data/layout-${level.id}.json?`)) return;
    setItems(level.items);
    setSelectedId(null);
  }

  /** Download the current layout as layout-<level>.json, with a meta block and today's date. */
  function exportJson() {
    if (check.errors.length > 0 && !window.confirm(`${check.errors.length} problem(s):\n\n${check.errors.join('\n')}\n\nExport anyway?`)) {
      return;
    }
    const meta = { ...level.meta, version: FORMAT_VERSION, updated: today(), source, units: 'ft', floor: level.label };
    const json = JSON.stringify({ meta, items }, null, 2) + '\n';
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `layout-${level.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const counts = STATUS_VALUES.map((s) => `${items.filter((it) => it.status === s).length} ${s}`).join(' · ');

  return (
    <div className="editor" data-marker={LAYOUT_EDITOR_MARKER}>
      <header className="editor-bar">
        <strong>Layout editor (dev only)</strong>
        <select value={levelId} onChange={(e) => switchLevel(e.target.value)} aria-label="Level">
          {LEVELS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <button onClick={addItem}>Add item</button>
        <button onClick={deleteSelected} disabled={!selected}>
          Delete item
        </button>
        <button onClick={resetToFile}>Reset</button>
        <label>
          Source{' '}
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            {SOURCE_VALUES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <button className="primary" onClick={exportJson}>
          Export JSON
        </button>
        <span className="hint">
          {counts} · {differsFromFile ? 'unsaved edits (not in the file yet)' : 'same as the file'} ·{' '}
          <span className={check.errors.length ? 'bad' : ''} title={[...check.errors, ...check.warnings].join('\n')}>
            {check.errors.length} errors, {check.warnings.length} warnings
          </span>
        </span>
      </header>

      <div className="editor-bar underlay-bar">
        <label>
          <input type="checkbox" checked={showUnderlay} onChange={(e) => setShowUnderlay(e.target.checked)} /> Underlay
        </label>
        <select value={devImageNames.includes(underlay?.name) ? underlay.name : ''} onChange={(e) => chooseDevImage(e.target.value)} aria-label="Underlay image">
          <option value="">{underlay && !devImageNames.includes(underlay.name) ? underlay.name : 'none'}</option>
          {devImageNames.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <label className="file-pick">
          Pick image file… <input type="file" accept="image/*" onChange={chooseImageFile} />
        </label>
        <input
          type="range"
          min="0.1"
          max="0.9"
          step="0.1"
          value={underlayOpacity}
          disabled={!showUnderlay}
          onChange={(e) => setUnderlayOpacity(Number(e.target.value))}
          aria-label="Underlay opacity"
        />
        {underlay &&
          ['x', 'y', 'width'].map((f) => (
            <label key={f}>
              {f} ft{' '}
              <input
                className="small-num"
                type="number"
                step="0.5"
                value={round1(underlay[f])}
                onChange={(e) => setUnderlay({ ...underlay, [f]: Number(e.target.value) })}
              />
            </label>
          ))}
        <span className="hint">Drag to move · drag the dot to rotate (Shift = 15° steps) · arrow keys nudge 0.5 ft (Shift = 5 ft)</span>
      </div>

      <div className="editor-main">
        <svg
          ref={svgRef}
          className="editor-map"
          viewBox={viewBoxOf(view)}
          onPointerDown={() => setSelectedId(null)}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <BaseMap base={level.base} />
          {showUnderlay && underlay && aspect && (
            <image
              href={underlay.url}
              x={underlay.x}
              y={underlay.y}
              width={underlay.width}
              height={underlay.width * aspect}
              opacity={underlayOpacity}
              pointerEvents="none"
            />
          )}

          {items.map((item) => (
            <g
              key={item.id}
              data-id={item.id}
              className={`ed-item status-${item.status} ${item.id === selectedId ? 'is-selected' : ''}`}
              transform={itemTransform(item)}
              onPointerDown={(e) => startMove(e, item)}
            >
              {item.type === 'round-item' ? (
                <ellipse rx={item.width / 2} ry={item.depth / 2} />
              ) : (
                <rect x={-item.width / 2} y={-item.depth / 2} width={item.width} height={item.depth} />
              )}
              <text className="ed-num" textAnchor="middle" dy="0.35em">
                {Number(item.id.replace(/\D/g, '')) || item.id}
              </text>
            </g>
          ))}

          {selected && (
            <g transform={itemTransform(selected)}>
              <line className="rotate-arm" x1="0" y1={-selected.depth / 2} x2="0" y2={-selected.depth / 2 - 4} />
              <circle
                className="rotate-handle"
                cy={-selected.depth / 2 - 4}
                r="1.6"
                onPointerDown={(e) => startRotate(e, selected)}
              />
            </g>
          )}
        </svg>

        <aside className="editor-panel">
          {!selected ? (
            <p>Click an item to edit it. Numbers match questions-2f.md.</p>
          ) : (
            <>
              <h2>{selected.id}</h2>
              <Field label="Name (required)">
                <input value={selected.name} required onChange={(e) => edit('name', e.target.value)} />
                {!selected.name.trim() && <small className="bad">A name is required.</small>}
              </Field>
              <Field label="Type">
                <input list="types" value={selected.type} onChange={(e) => edit('type', e.target.value)} />
              </Field>
              <Field label="Zone">
                <input list="zones" value={selected.zone} onChange={(e) => edit('zone', e.target.value)} />
              </Field>
              <Field label="Status">
                <select value={selected.status} onChange={(e) => edit('status', e.target.value)}>
                  {STATUS_VALUES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Machine info (muscles, how-to)">
                <select value={selected.machineId ?? ''} onChange={(e) => edit('machineId', e.target.value || undefined)}>
                  <option value="">none</option>
                  {MACHINES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="field-row">
                {['x', 'y', 'rotation', 'width', 'depth'].map((f) => (
                  <Field key={f} label={f === 'rotation' ? 'rot °' : `${f} ft`}>
                    <input type="number" step="0.5" value={selected[f]} onChange={editNumber(f)} />
                  </Field>
                ))}
              </div>
              <Field label="Notes">
                <textarea rows="5" value={selected.notes} onChange={(e) => edit('notes', e.target.value)} />
              </Field>
            </>
          )}
          <datalist id="types">
            {unique(items.map((it) => it.type)).map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
          <datalist id="zones">
            {unique(items.map((it) => it.zone)).map((z) => (
              <option key={z} value={z} />
            ))}
          </datalist>
        </aside>
      </div>
    </div>
  );
}
