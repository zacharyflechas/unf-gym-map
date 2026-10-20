import { BASE } from '../layout.js';

const pts = (points) => points.map(([x, y]) => `${x},${y}`).join(' ');
const average = (points, i) => points.reduce((sum, p) => sum + p[i], 0) / points.length;

/**
 * The traced floor plan: recreation area, rooms, facilities, stairs, balcony and structural columns.
 * Drawn inside a parent <svg> whose units are feet. Shared by the public map and the dev editor.
 */
export default function BaseMap() {
  return (
    <g className="base-map" aria-hidden="true">
      <defs>
        <pattern id="stair-hatch" width="1.5" height="1.5" patternUnits="userSpaceOnUse">
          <rect width="1.5" height="1.5" fill="#fff" />
          <line x1="0" y1="0" x2="0" y2="1.5" stroke="#9aa5b1" strokeWidth="0.4" />
        </pattern>
      </defs>
      <polygon className="base-balcony" points={pts(BASE.balcony)} />
      <polygon className="base-rec" points={pts(BASE.recArea)} />
      {BASE.rooms.map((room, i) => (
        <polygon key={`room-${i}`} className="base-room" points={pts(room)} />
      ))}
      {BASE.facilities.map((f, i) => (
        <polygon key={`fac-${i}`} className="base-facility" points={pts(f.points)} />
      ))}
      {BASE.stairs.map((s) => (
        <rect key={s.id} className="base-stair" x={s.x} y={s.y} width={s.width} height={s.height} />
      ))}
      {BASE.columns.map((c) =>
        c.shape === 'square' ? (
          <rect key={c.id} className="base-column" x={c.x - 0.9} y={c.y - 0.9} width="1.8" height="1.8" />
        ) : (
          <circle key={c.id} className="base-column" cx={c.x} cy={c.y} r="1" />
        ),
      )}
      <text className="base-label" x={average(BASE.balcony, 0)} y={average(BASE.balcony, 1)} textAnchor="middle">
        Balcony
      </text>
    </g>
  );
}
