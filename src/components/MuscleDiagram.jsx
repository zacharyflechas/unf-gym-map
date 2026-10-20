/**
 * Front and back body outline with the machine's muscles filled in:
 * primary muscles in the strong color, secondary in a lighter tint (Spec 02).
 *
 * Shapes are simple hand-drawn paths in a 120 × 240 box per figure. Only the LEFT half is drawn;
 * each shape is drawn again mirrored, so both sides always match.
 */

// Body regions, left half only. Coordinates: x 0–60 (60 = middle of the body), y 0–240.
const FRONT = {
  shoulders: 'M28 46 Q34 40 44 43 L42 56 Q33 58 27 56 Z',
  chest: 'M45 46 Q53 44 59 46 L59 66 Q51 69 44 64 Z',
  core: 'M46 70 L59 70 L59 114 L49 112 Q45 92 46 70 Z',
  arms: 'M26 60 L36 60 L35 92 L26 92 Z M24 96 L34 96 L32 128 L23 128 Z',
  hips: 'M47 114 L59 116 L59 132 L52 130 Z',
  quads: 'M39 120 L51 128 L57 136 L56 176 L42 176 Q38 150 39 120 Z',
  calves: 'M42 184 L55 184 L54 222 L45 222 Z',
};
const BACK = {
  shoulders: FRONT.shoulders,
  back: 'M44 44 Q52 40 59 38 L59 112 L49 112 L49 92 L46 60 Z',
  lats: 'M38 58 L46 60 L48 96 L40 88 Z',
  arms: FRONT.arms,
  glutes: 'M40 116 Q50 112 59 116 L59 136 Q48 140 40 132 Z',
  hamstrings: 'M40 138 L58 140 L56 176 L42 176 Z',
  calves: 'M42 184 L55 184 L54 222 L45 222 Z',
};
// Parts that are never highlighted (head, neck, hands, knees, feet): just the outline.
const NEUTRAL = 'M60 4 a14 15 0 1 0 0.01 0 Z M53 33 L59 33 L59 40 L53 40 Z M22 130 L32 130 L31 142 L21 141 Z M43 177 L56 177 L55 184 L42 184 Z M45 223 L54 223 L56 232 L42 232 Z';

/** Muscle names in gymData.js → body regions. "Cardio" and "Mobility" have no region (shown as text). */
const REGIONS_FOR_MUSCLE = {
  Quads: ['quads'],
  Hamstrings: ['hamstrings'],
  Glutes: ['glutes'],
  Hips: ['hips'],
  Chest: ['chest'],
  Back: ['back'],
  Lats: ['lats'],
  Shoulders: ['shoulders'],
  Arms: ['arms'],
  Core: ['core'],
};
const ALL_REGIONS = [...new Set([...Object.keys(FRONT), ...Object.keys(BACK)])];

/**
 * region → 'primary' | 'secondary'. "Full Body" lightly fills every region; muscles that are
 * named directly still get their own level (so a squat shows quads and glutes strongest).
 */
export function muscleLevels(muscles) {
  const levels = {};
  const fullBody = muscles.primary.includes('Full Body') || muscles.secondary.includes('Full Body');
  if (fullBody) ALL_REGIONS.forEach((r) => (levels[r] = 'secondary'));
  muscles.secondary.forEach((m) => (REGIONS_FOR_MUSCLE[m] ?? []).forEach((r) => (levels[r] ??= 'secondary')));
  muscles.primary.forEach((m) => (REGIONS_FOR_MUSCLE[m] ?? []).forEach((r) => (levels[r] = 'primary')));
  return levels;
}

function Figure({ regions, levels, label, offsetX }) {
  const halves = ['', 'translate(120 0) scale(-1 1)']; // left half, then the mirrored right half
  return (
    <g transform={`translate(${offsetX} 0)`}>
      {halves.map((mirror) => (
        <g key={mirror} transform={mirror}>
          <path className="body-neutral" d={NEUTRAL} />
          {Object.entries(regions).map(([region, d]) => (
            <path key={region} className={`body-region ${levels[region] ? `is-${levels[region]}` : ''}`} d={d} data-region={region} />
          ))}
        </g>
      ))}
      <text className="body-label" x="60" y="240" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

export default function MuscleDiagram({ muscles }) {
  const levels = muscleLevels(muscles);
  const description = `Muscles worked. Primary: ${muscles.primary.join(', ')}.${
    muscles.secondary.length ? ` Secondary: ${muscles.secondary.join(', ')}.` : ''
  }`;
  return (
    <svg className="muscle-diagram" viewBox="0 0 250 246" role="img" aria-label={description}>
      <Figure regions={FRONT} levels={levels} label="Front" offsetX={0} />
      <Figure regions={BACK} levels={levels} label="Back" offsetX={130} />
    </svg>
  );
}
