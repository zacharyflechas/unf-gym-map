import BaseMap from './BaseMap.jsx';
import { viewBoxOf, itemTransform, typeGroup, zoneLabels } from '../layout.js';

/**
 * Public floor map. Everything is in feet: the base map comes from base-<level>.json and each
 * item from layout-<level>.json, drawn as a rectangle (or circle) at its real size and angle.
 */
export default function GymMap({ base, items, matchedIds, filtering, isSelected, onSelect }) {
  const labels = zoneLabels(items);
  return (
    <svg className="gym-map" viewBox={viewBoxOf(base.view)} role="img" aria-label="Floor map of the 2nd-floor gym with clickable equipment">
      <BaseMap base={base} />

      {items.map((item, i) => {
        const matched = matchedIds.has(item.id);
        const state = filtering ? (matched ? 'is-match' : 'is-dim') : '';
        const w = item.width;
        const d = item.depth;
        return (
          <g
            key={item.id}
            className={`item item-${typeGroup(item.type)} ${state} ${isSelected(item) ? 'is-selected' : ''}`}
            transform={itemTransform(item)}
            style={{ '--i': i }}
            role="button"
            tabIndex={0}
            aria-label={`${item.name}${filtering && matched ? ' (matches search)' : ''}`}
            onClick={() => onSelect(item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(item.id);
              }
            }}
          >
            {/* invisible, slightly bigger hit area so small items are easier to tap */}
            <rect className="item-hit" x={-w / 2 - 1.5} y={-d / 2 - 1.5} width={w + 3} height={d + 3} />
            {item.type === 'round-item' ? (
              <ellipse className="item-shape" rx={w / 2} ry={d / 2} />
            ) : (
              <rect className="item-shape" x={-w / 2} y={-d / 2} width={w} height={d} rx="0.5" />
            )}
          </g>
        );
      })}

      {labels.map((l) => (
        <text key={l.zone} className="zone-label" x={l.x} y={l.y} textAnchor="middle">
          {l.zone.replace(/\s*\(.*\)$/, '') /* drop "(…)" details to keep labels short */}
        </text>
      ))}
    </svg>
  );
}
