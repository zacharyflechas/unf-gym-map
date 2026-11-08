const pts = (points) => points.map(([x, y]) => `${x},${y}`).join(' ');
const average = (points, i) => points.reduce((sum, p) => sum + p[i], 0) / points.length;

/**
 * The floor itself, from a base-<level>.json file (units = feet): outline, rooms, facilities,
 * stairs, balcony, columns, and for the track level the track ring and the overlook opening.
 * Every part except "outline" is optional, so a base traced from a scan can start small.
 * Drawn inside a parent <svg>. Shared by the public map and the dev editor.
 */
export default function BaseMap({ base }) {
  const { rooms = [], facilities = [], stairs = [], columns = [], openings = [], balcony, track, entrance } = base;
  return (
    <g className="base-map" aria-hidden="true">
      <defs>
        <pattern id="stair-hatch" width="1.5" height="1.5" patternUnits="userSpaceOnUse">
          <rect className="hatch-bg" width="1.5" height="1.5" />
          <line className="hatch-line" x1="0" y1="0" x2="0" y2="1.5" />
        </pattern>
        {/* dot grid on the floor: one dot every 4 ft */}
        <pattern id="floor-dots" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle className="floor-dot" cx="2" cy="2" r="0.3" />
        </pattern>
      </defs>
      {balcony && <polygon className="base-balcony" points={pts(balcony)} />}
      <polygon className="base-rec" points={pts(base.outline)} />
      <polygon className="base-dots" points={pts(base.outline)} />
      {rooms.map((room, i) => (
        <polygon key={`room-${i}`} className="base-room" points={pts(room)} />
      ))}
      {facilities.map((f, i) => (
        <polygon key={`fac-${i}`} className="base-facility" points={pts(f.points)} />
      ))}
      {openings.map((o) => (
        <polygon key={o.name} className="base-opening" points={pts(o.points)} />
      ))}
      {track && (
        // The track is the ring between two polygons ("evenodd" leaves the inner one empty).
        <path className="base-track" fillRule="evenodd" d={`M${pts(track.outer)}Z M${pts(track.inner)}Z`} />
      )}
      {stairs.map((s) => (
        <rect
          key={s.id}
          className="base-stair"
          x={s.x}
          y={s.y}
          width={s.width}
          height={s.height}
          transform={s.rotation ? `rotate(${s.rotation} ${s.x + s.width / 2} ${s.y + s.height / 2})` : undefined}
        />
      ))}
      {columns.map((c) =>
        c.shape === 'square' ? (
          <rect key={c.id} className="base-column" x={c.x - 0.9} y={c.y - 0.9} width="1.8" height="1.8" />
        ) : (
          <circle key={c.id} className="base-column" cx={c.x} cy={c.y} r="1" />
        ),
      )}
      {balcony && (
        <text className="base-label" x={average(balcony, 0)} y={average(balcony, 1)} textAnchor="middle">
          Balcony
        </text>
      )}
      {entrance && (
        // Only drawn once base.entrance is set (it is null until we confirm where the entrance is).
        <g className="entrance" transform={`translate(${entrance.x} ${entrance.y})`}>
          <circle r="2.2" />
          <text y="-3.5" textAnchor="middle">
            {entrance.label ?? 'Entrance'}
          </text>
        </g>
      )}
      {openings.map((o) => (
        <text key={o.name} className="base-label" x={average(o.points, 0)} y={average(o.points, 1)} textAnchor="middle">
          {o.name}
        </text>
      ))}
    </g>
  );
}
