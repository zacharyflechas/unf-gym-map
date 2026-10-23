import { memo, useCallback, useEffect, useRef } from 'react';
import BaseMap from './BaseMap.jsx';
import { MapIconDefs, iconFor } from './MapIcons.jsx';
import { itemTransform, zoneLabels } from '../layout.js';
import { legendGroupOf } from '../legend.js';
import { usePanZoom } from '../usePanZoom.js';

const LABEL_PX = 11; // zone labels stay this size on screen at every zoom
const ICON_MIN_SCALE = 3; // show machine icons once a foot is at least 3 px on screen
const FOCUS_ZOOM = 3; // zoom (× whole-floor view) when a machine is tapped
const DRAWER_PX = 460; // desktop detail drawer width (see .detail in styles.css)

/**
 * Zone labels that fit: biggest zones first, and a label that would overlap one already placed
 * is skipped. Sizes are in feet, so zooming in makes room for more labels.
 */
function placeLabels(items, scale) {
  const size = LABEL_PX / scale;
  const placed = [];
  const sorted = zoneLabels(items).sort((a, b) => b.count - a.count);
  for (const l of sorted) {
    const text = l.zone.replace(/\s*\(.*\)$/, ''); // drop "(…)" details to keep labels short
    // rough text box: bold letters are about 0.7 × the font size wide
    const w = text.length * size * 0.7;
    const box = { x: l.x - w / 2, y: l.y - size * 1.1, w, h: size * 1.5 };
    const overlaps = placed.some((p) => box.x < p.box.x + p.box.w && p.box.x < box.x + box.w && box.y < p.box.y + p.box.h && p.box.y < box.y + box.h);
    if (!overlaps) placed.push({ ...l, text, box });
  }
  return { labels: placed, size };
}

/**
 * The equipment. Memoized so panning (which only changes the viewBox) doesn't re-render 160+ items.
 */
const Items = memo(function Items({ items, matchedIds, filtering, selectedIds, onTap }) {
  return items.map((item, i) => {
    const matched = matchedIds.has(item.id);
    const state = filtering ? (matched ? 'is-match' : 'is-dim') : '';
    const selected = selectedIds.has(item.id);
    const w = item.width;
    const d = item.depth;
    const round = item.type === 'round-item';
    const icon = iconFor(item.type);
    const iconSize = Math.min(w, d) * 0.8;
    return (
      <g
        key={item.id}
        className={`item zone-${legendGroupOf(item).id} ${state} ${selected ? 'is-selected' : ''}`}
        transform={itemTransform(item)}
        style={{ '--i': i }}
        role="button"
        tabIndex={0}
        aria-label={`${item.name}${filtering && matched ? ' (matches)' : ''}`}
        aria-pressed={selected}
        onClick={() => onTap(item.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onTap(item.id, { keyboard: true });
          }
        }}
      >
        {/* invisible, slightly bigger hit area so small items are easier to tap */}
        <rect className="item-hit" x={-w / 2 - 1.5} y={-d / 2 - 1.5} width={w + 3} height={d + 3} />
        {/* still gold glow behind search matches (no pulsing) */}
        {state === 'is-match' && <rect className="item-glow" x={-w / 2 - 1} y={-d / 2 - 1} width={w + 2} height={d + 2} rx="1.2" />}
        {round ? (
          <ellipse className="item-shape" rx={w / 2} ry={d / 2} />
        ) : (
          <rect className="item-shape" x={-w / 2} y={-d / 2} width={w} height={d} rx="0.5" />
        )}
        {icon && (
          // counter-rotated so the icon stays upright
          <use className="item-icon" href={`#icon-${icon}`} x={-iconSize / 2} y={-iconSize / 2} width={iconSize} height={iconSize} transform={`rotate(${-item.rotation})`} />
        )}
      </g>
    );
  });
});

/**
 * Public floor map with pan & zoom. Everything is in feet: the base map comes from base-<level>.json
 * and each item from layout-<level>.json, drawn at its real size and angle.
 */
export default function GymMap({ level, matchedIds, filtering, selectedIds, focusItem, onSelect }) {
  const pz = usePanZoom(level.base.view);
  const { wasDrag, animateTo, camera, size } = pz;

  // A tap that was really the end of a drag/pinch must not open a machine.
  const onTap = useCallback(
    (id, { keyboard = false } = {}) => {
      if (keyboard || !wasDrag()) onSelect(id);
    },
    [onSelect, wasDrag],
  );

  // Glide to the tapped machine; glide back to the earlier view when the panel closes.
  const viewBefore = useRef(null);
  useEffect(() => {
    const cam = camera.current;
    if (!cam || !size.w) return;
    if (focusItem) {
      viewBefore.current ??= cam;
      const fit = Math.min(size.w / level.base.view.width, size.h / level.base.view.height);
      const scale = Math.max(cam.scale, fit * FOCUS_ZOOM);
      // On desktop the drawer covers the right side of the window: aim at the middle of what's left.
      const box = pz.svgRef.current.getBoundingClientRect();
      const hidden = Math.max(0, box.right - (window.innerWidth - DRAWER_PX));
      const narrow = window.innerWidth <= 700;
      const targetX = narrow ? size.w / 2 : (size.w - hidden) / 2;
      const targetY = narrow ? size.h * 0.4 : size.h / 2;
      animateTo({ scale, cx: focusItem.x + (size.w / 2 - targetX) / scale, cy: focusItem.y + (size.h / 2 - targetY) / scale });
    } else if (viewBefore.current) {
      animateTo(viewBefore.current);
      viewBefore.current = null;
    }
  }, [focusItem, size, level, animateTo, camera, pz.svgRef]);

  const { labels, size: labelSize } = placeLabels(level.items, pz.scale);
  const view = level.base.view;

  return (
    <div className="map-frame">
      <svg
        ref={pz.svgRef}
        className={`gym-map ${pz.scale >= ICON_MIN_SCALE ? 'show-icons' : ''}`}
        viewBox={pz.viewBox}
        style={{ '--map-aspect': `${view.width} / ${view.height}` }}
        tabIndex={0}
        role="group"
        aria-label={`${level.name} map. Arrow keys pan, plus and minus zoom, 0 resets. Tab to reach each machine.`}
        {...pz.handlers}
      >
        <MapIconDefs />
        <BaseMap base={level.base} />
        <Items items={level.items} matchedIds={matchedIds} filtering={filtering} selectedIds={selectedIds} onTap={onTap} />
        {labels.map((l) => (
          <text key={l.zone} className="zone-label" x={l.x} y={l.y} textAnchor="middle" style={{ fontSize: labelSize, strokeWidth: labelSize / 4 }}>
            {l.text}
          </text>
        ))}
      </svg>

      <div className="map-controls">
        <button className="map-btn" onClick={pz.zoomIn} aria-label="Zoom in">
          +
        </button>
        <button className="map-btn" onClick={pz.zoomOut} aria-label="Zoom out">
          −
        </button>
        <button className="map-btn" onClick={pz.reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
