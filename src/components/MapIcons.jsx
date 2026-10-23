/**
 * Eight small machine-type icons, drawn once as <symbol>s and reused with <use> on every item.
 * 24×24 line drawings; the stroke color comes from CSS (`color` on the <use>).
 */
const ICONS = {
  cardio: 'M2 12h5l2-5 4 10 2-5h7',
  machine: 'M7 3h10v18H7z M7 8h10 M7 13h10 M12 13v5',
  rack: 'M5 3v18 M19 3v18 M2 8h20 M2 21h6 M16 21h6',
  cable: 'M12 3a2 2 0 1 0 0.01 0 M12 7v9 M7 16h10 M7 16v4 M17 16v4',
  dumbbell: 'M6 7v10 M18 7v10 M3 10v4 M21 10v4 M6 12h12',
  bench: 'M3 10h18 M6 10v8 M18 10v8 M9 10V7h6v3',
  rig: 'M4 21V4h16v17 M4 9h16 M9 9v5 M15 9v5',
  mat: 'M3 8h18v8H3z M8 8v8 M13 8v8',
};

/** Which icon each layout `type` gets. Types not listed (desk, round items) get none. */
const ICON_FOR_TYPE = {
  treadmill: 'cardio',
  elliptical: 'cardio',
  stairclimber: 'cardio',
  bike: 'cardio',
  machine: 'machine',
  'leg-machine': 'machine',
  rack: 'rack',
  smith: 'rack',
  'cable-station': 'cable',
  'db-rack': 'dumbbell',
  bench: 'bench',
  rig: 'rig',
  'unknown-station': 'rig',
  'stretch-item': 'mat',
};
export const iconFor = (type) => ICON_FOR_TYPE[type] ?? null;

export function MapIconDefs() {
  return (
    <defs>
      {Object.entries(ICONS).map(([name, d]) => (
        <symbol key={name} id={`icon-${name}`} viewBox="0 0 24 24">
          <path d={d} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
      ))}
    </defs>
  );
}
