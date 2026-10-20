import { MAP_WIDTH, MAP_HEIGHT, ZONES, ENTRANCE } from '../data/gymData.js';

const R = 30; // marker radius in map units

/** Decorative top-down equipment "footprints" drawn behind each marker, by zone. */
function Footprint({ machine }) {
  const { x, y, zone } = machine;
  const common = { className: 'footprint' };
  switch (zone) {
    case 'cardio':
      return <rect {...common} x={x - 34} y={y - 62} width={68} height={124} rx={12} />;
    case 'racks':
      return (
        <g>
          <rect x={x - 62} y={y - 80} width={124} height={160} rx={6} className="footprint" />
          <line x1={x - 75} y1={y - 50} x2={x + 75} y2={y - 50} className="bar" />
        </g>
      );
    case 'cables':
      return <rect {...common} x={x - 90} y={y - 70} width={180} height={140} rx={10} />;
    case 'free-weights':
      return <rect {...common} x={x - 85} y={y - 72} width={170} height={144} rx={10} />;
    default:
      return <rect {...common} x={x - 58} y={y - 58} width={116} height={116} rx={14} />;
  }
}

export default function GymMap({ machines, matchedIds, filtering, selectedId, onSelect }) {
  return (
    <svg
      className="gym-map"
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT + 30}`}
      role="img"
      aria-label="Top-down example gym floor map with clickable machines"
    >
      <defs>
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
        <g key={z.id} className="zone-group" style={{ '--i': i }}>
          <rect x={z.x} y={z.y} width={z.width} height={z.height} rx="14" fill={z.color} className="zone" />
          <text x={z.x + 14} y={z.y + 26} className="zone-label">
            {z.name.toUpperCase()}
          </text>
        </g>
      ))}

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
              {m.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
