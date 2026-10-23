/**
 * DEV-ONLY layout editor. Opened with ?edit=1 while running `npm run dev`.
 * It is loaded through a dynamic import in main.jsx behind import.meta.env.DEV, so it is never
 * part of the production build (the build check greps dist/ for LAYOUT_EDITOR_MARKER).
 *
 * Workflow: move/label items here → Export JSON → replace src/data/layout-2f.json → open a PR.
 */
import { useEffect, useRef, useState } from 'react';
import fileLayout from '../data/layout-2f.json';
import { MACHINES } from '../data/gymData.js';
import BaseMap from '../components/BaseMap.jsx';
import { VIEW, VIEW_BOX, itemTransform, typeGroup } from '../layout.js';
import './editor.css';

// The build check searches dist/ for this exact string; it must only ever exist in editor code.
const LAYOUT_EDITOR_MARKER = 'LAYOUT_EDITOR_MARKER';

// Straightened official plan. It lives in dev-assets/ (git-ignored and NOT in public/), so only the
// dev server can serve it; it is never copied into dist/. The image is 5 px per foot with the same
// top-left origin as the base map, so it lines up when drawn at its size in feet.
const UNDERLAY = { url: '/dev-assets/plan-2f-straightened.jpg', widthFt: 2774 / 5, heightFt: 1042 / 5 };

const STORAGE_KEY = 'layout-2f-draft'; // edits are kept in localStorage so a reload doesn't lose them
const NUDGE = 0.5; // feet per arrow-key press
const BIG_NUDGE = 5; // feet per Shift + arrow-key press

const round1 = (n) => Math.round(n * 10) / 10;
const unique = (values) => [...new Set(values.filter(Boolean))].sort();

/** Turn a pointer position (screen pixels) into map coordinates (feet) using the SVG's own transform. */
function toFeet(svg, event) {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(svg.getScreenCTM().inverse());
}

function loadItems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : fileLayout.items;
}

/** Next free id, e.g. "i169" when the highest id is "i168". */
function nextId(items) {
  const numbers = items.map((it) => Number(it.id.replace(/\D/g, '')) || 0);
  return `i${String(Math.max(0, ...numbers) + 1).padStart(3, '0')}`;
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
  const [items, setItems] = useState(loadItems);
  const [selectedId, setSelectedId] = useState(null);
  const [showUnderlay, setShowUnderlay] = useState(true);
  const [underlayOpacity, setUnderlayOpacity] = useState(0.5);
  const svgRef = useRef(null);
  const drag = useRef(null); // while dragging: { mode: 'move', id, dx, dy } or { mode: 'rotate', id }

  const selected = items.find((it) => it.id === selectedId) ?? null;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

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
      id: nextId(items),
      name: 'New item',
      type: 'machine',
      zone: selected?.zone ?? '',
      x: round1(VIEW.x + VIEW.width / 2),
      y: round1(VIEW.y + VIEW.height / 2),
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
    if (!window.confirm('Throw away all edits and go back to src/data/layout-2f.json?')) return;
    setItems(fileLayout.items);
    setSelectedId(null);
  }

  /** Download the current layout as layout-2f.json (same shape as the file in src/data/). */
  function exportJson() {
    const json = JSON.stringify({ ...fileLayout, items }, null, 2) + '\n';
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'layout-2f.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  const counts = fileLayout.statusValues.map((s) => `${items.filter((it) => it.status === s).length} ${s}`).join(' · ');

  return (
    <div className="editor" data-marker={LAYOUT_EDITOR_MARKER}>
      <header className="editor-bar">
        <strong>Layout editor (dev only)</strong>
        <label>
          <input type="checkbox" checked={showUnderlay} onChange={(e) => setShowUnderlay(e.target.checked)} /> Official plan
          underlay
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
        <button onClick={addItem}>Add item</button>
        <button onClick={deleteSelected} disabled={!selected}>
          Delete item
        </button>
        <button onClick={resetToFile}>Reset</button>
        <button className="primary" onClick={exportJson}>
          Export JSON
        </button>
        <span className="hint">
          Drag to move · drag the dot to rotate (Shift = 15° steps) · arrow keys nudge 0.5 ft (Shift = 5 ft) · {counts}
        </span>
      </header>

      <div className="editor-main">
        <svg
          ref={svgRef}
          className="editor-map"
          viewBox={VIEW_BOX}
          onPointerDown={() => setSelectedId(null)}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <BaseMap />
          {showUnderlay && (
            <image
              href={UNDERLAY.url}
              x="0"
              y="0"
              width={UNDERLAY.widthFt}
              height={UNDERLAY.heightFt}
              opacity={underlayOpacity}
              pointerEvents="none"
            />
          )}

          {items.map((item) => (
            <g
              key={item.id}
              data-id={item.id}
              className={`ed-item item-${typeGroup(item.type)} status-${item.status} ${item.id === selectedId ? 'is-selected' : ''}`}
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
              <Field label="Name">
                <input value={selected.name} onChange={(e) => edit('name', e.target.value)} />
              </Field>
              <Field label="Type">
                <input list="types" value={selected.type} onChange={(e) => edit('type', e.target.value)} />
              </Field>
              <Field label="Zone">
                <input list="zones" value={selected.zone} onChange={(e) => edit('zone', e.target.value)} />
              </Field>
              <Field label="Status">
                <select value={selected.status} onChange={(e) => edit('status', e.target.value)}>
                  {fileLayout.statusValues.map((s) => (
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
