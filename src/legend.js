/**
 * Map legend: the zone groups you can tap to filter the map. Each group lists the `zone` names used
 * in the layout files. A zone that isn't listed here shows under "Other" (`npm run validate` warns
 * about it), so renaming a zone in the editor never breaks the map.
 * Colors: --zone-<id> in tokens.css.
 */
export const LEGEND = [
  { id: 'cardio', label: 'Cardio', zones: ['Treadmills', 'Ellipticals', 'Cardio / StairMasters'] },
  {
    id: 'machines',
    label: 'Machines',
    zones: ['Machines center', 'Free weights / machines (west block)', 'North-west strip (by rooms)', 'Leg machines + bikes (cardio edge)'],
  },
  { id: 'free-weights', label: 'Free weights', zones: ['DB racks / free weights'] },
  { id: 'racks', label: 'Racks', zones: ['Rack row (r1-r13)'] },
  { id: 'rig', label: 'Rig & bars', zones: ['Monkey bar / rig area', 'Bar stations (center)'] },
  { id: 'stretch', label: 'Cozy & stretch', zones: ['Cozy Corner', 'Stretch area', 'Warm-up'] },
  { id: 'other', label: 'Other', zones: ['Desk'] },
];

const OTHER = LEGEND[LEGEND.length - 1];

/** The legend group for a layout item (by its zone name). */
export const legendGroupOf = (item) => LEGEND.find((g) => g.zones.includes(item.zone)) ?? OTHER;

/** Every zone name the legend knows about (used by the validator). */
export const KNOWN_ZONES = LEGEND.flatMap((g) => g.zones);
