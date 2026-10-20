import { MAP_WIDTH, MAP_HEIGHT, ZONES, ENTRANCE } from '../data/gymData.js';

const R = 30; // marker radius in map units

/** Decorative top-down "footprints" drawn behind each marker, sized by zone. */
const FOOTPRINT = {
  machines: [96, 90],
  cardio: [60, 84],
  cozy: [96, 90],
  playground: [96, 90],
  'free-weights': [130, 90],
  crossprey: [96, 90],
};

function Footprint({ machine }) {
  if (machine.zone === 'racks') return null; // rack outlines are drawn by <RackRows>
  const [w, h] = FOOTPRINT[machine.zone] ?? [96, 96];
  return <rect className="footprint" x={machine.x - w / 2} y={machine.y - h / 2} width={w} height={h} rx={12} />;
}

/** Nine half-rack outlines in two facing rows (as seen in public photos) — decorative. */
function RackRows({ zone }) {
  if (!zone) return null;
  const left = zone.x + 22;
  const right = zone.x + zone.width - 62;
  const racks = [];
  for (let i = 0; i < 5; i++) racks.push({ x: right, y: zone.y + 50 + i * 62 });
  for (let i = 0; i < 4; i++) racks.push({ x: left, y: zone.y + 80 + i * 62 });
  return (
    <g className="rack-rows" aria-hidden="true">
      <rect x={right + 44} y={zone.y + 40} width="10" height={zone.height - 80} className="window-strip" />
      {racks.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width="40" height="44" rx="4" className="rack" />
          <rect x={i < 5 ? r.x - 34 : r.x + 44} y={r.y + 4} width="30" height="36" rx="3" className="platform" />
        </g>
      ))}
    </g>
  );
}

const LOC_LABEL = { high: '', medium: 'approx. location', low: 'location: guess' };

export default function GymMap({ machines, matchedIds, filtering, selectedId, onSelect }) {
  return (
    <svg
      className="gym-map"
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT + 30}`}
      role="img"
      aria-label="Top-down example gym floor map with clickable machines"
    >
      <defs>
        <pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill="#F3F4F6" />
          <line x1="0" y1="0" x2="0" y2="14" stroke="#D5DBE1" strokeWidth="5" />
        </pattern>
        <pattern id="floor" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#F7F9FB" />
          <path d="M40 0H0V40" fill="none" stroke="#E4E9EE" strokeWidth="1" />
        </pattern>
        {/* Pre-baked soft glow (radial gradient) — animating its opacity/scale is far cheaper than animating a blur filter. */}
        <radialGradient id="glow">
          <stop offset="45%" stopColor="#F2B705" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#F2B705" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F2B705" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* floor + walls */}
      <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#floor)" />
      <rect x="4" y="4" width={MAP_WIDTH - 8} height={MAP_HEIGHT - 8} className="wall" />

      {/* entrance gap */}
      <rect x={ENTRANCE.x - 60} y={MAP_HEIGHT - 10} width="120" height="14" fill="#F7F9FB" />
      <text x={ENTRANCE.x} y={MAP_HEIGHT + 22} className="entrance-label" textAnchor="middle">
        ▲ {ENTRANCE.label}
      </text>

      {/* zones */}
      {ZONES.map((z, i) => (
        <g key={z.id} className={`zone-group zone-${z.kind ?? 'floor'}`} style={{ '--i': i }}>
          <rect
            x={z.x}
            y={z.y}
            width={z.width}
            height={z.height}
            rx="14"
            fill={z.kind === 'void' ? 'url(#hatch)' : z.color}
            className="zone"
          />
          <text x={z.x + 14} y={z.y + 26} className="zone-label">
            {(z.label ?? z.name).toUpperCase()}
          </text>
          {LOC_LABEL[z.locationConfidence] && (
            <text x={z.x + 14} y={z.y + 44} className="zone-conf">
              {LOC_LABEL[z.locationConfidence]}
            </text>
          )}
        </g>
      ))}

      <RackRows zone={ZONES.find((z) => z.id === 'racks')} />

      {/* footprints */}
      {machines.map((m, i) => (
        <g key={`fp-${m.id}`} className="footprint-group" style={{ '--i': i }}>
          <Footprint machine={m} />
        </g>
      ))}

      {/* markers */}
      {machines.map((m, i) => {
        const matched = matchedIds.has(m.id);
        const state = filtering ? (matched ? 'is-match' : 'is-dim') : '';
        const isSel = m.id === selectedId;
        return (
          <g
            key={m.id}
            className={`marker ${state} ${isSel ? 'is-selected' : ''}`}
            transform={`translate(${m.x} ${m.y})`}
            style={{ '--i': i }}
            role="button"
            tabIndex={0}
            aria-label={`${m.name}${filtering && matched ? ' (matches filter)' : ''}`}
            onClick={() => onSelect(m.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(m.id);
              }
            }}
          >
            {filtering && matched && <circle r={R + 22} className="glow" fill="url(#glow)" />}
            <g className="marker-pop">
              <ellipse className="lift-shadow" cx="0" cy={R - 4} rx={R - 6} ry="8" />
              <g className="marker-lift">
                <circle r={R + 14} className="hit" />
                <circle r={R} className="marker-dot" />
                <circle r={R - 9} className="marker-sheen" />
                <text className="marker-short" textAnchor="middle" dy="0.35em">
                  {m.short}
                </text>
              </g>
            </g>
            <text className="marker-name" textAnchor="middle" y={R + 20}>
              {m.mapLabel ?? m.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
