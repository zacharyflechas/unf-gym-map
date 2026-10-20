/**
 * ============================================================
 *  GYM DATA — the only file you need to edit for a new layout
 * ============================================================
 *
 * The floor map is drawn on a 1000 x 700 coordinate grid
 * (x: 0 = left wall, 1000 = right wall; y: 0 = back wall, 700 = entrance side).
 *
 * ZONES: rectangles drawn on the map.
 *   id     – unique key, referenced by machines[].zone
 *   name   – label shown on the map and in filters
 *   x, y, width, height – rectangle in map units
 *   color  – fill color of the zone
 *
 * MACHINES: one marker per machine.
 *   id        – unique, URL-safe key (used in the URL hash, e.g. #leg-press)
 *   name      – display name
 *   short     – 2-4 character label drawn inside the marker
 *   zone      – a zone id from ZONES
 *   x, y      – marker center in map units (should sit inside its zone)
 *   muscles   – { primary: [...], secondary: [...] } (use names from MUSCLE_GROUPS
 *               so filter chips work; free text also works with search)
 *   steps     – short how-to steps (array of strings)
 *   tips      – safety / form tips (array of strings)
 *   youtubeId – an 11-char YouTube video ID, or null. If null, the detail panel
 *               shows a "Search YouTube" link built from `youtubeSearch` or `name`.
 *   youtubeSearch – (optional) custom search query used when youtubeId is null
 */

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 700;

export const ZONES = [
  { id: 'cardio', name: 'Cardio', x: 20, y: 20, width: 960, height: 150, color: '#E3EEF8' },
  { id: 'machines', name: 'Selectorized Machines', x: 20, y: 190, width: 470, height: 490, color: '#EEF1F4' },
  { id: 'racks', name: 'Racks & Benches', x: 510, y: 190, width: 470, height: 240, color: '#E6EBF0' },
  { id: 'cables', name: 'Cable Station', x: 510, y: 450, width: 220, height: 230, color: '#E9EEF5' },
  { id: 'free-weights', name: 'Free Weights', x: 750, y: 450, width: 230, height: 230, color: '#DFE6EE' },
];

/** Entrance marker (purely decorative). */
export const ENTRANCE = { x: 500, y: 700, label: 'Entrance' };

/** Muscle groups used for filter chips. */
export const MUSCLE_GROUPS = [
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Chest',
  'Back',
  'Lats',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Core',
  'Cardio',
];

export const MACHINES = [
  // ---------------- CARDIO ----------------
  {
    id: 'treadmill',
    name: 'Treadmill',
    short: 'TM',
    zone: 'cardio',
    x: 160,
    y: 95,
    muscles: { primary: ['Cardio', 'Quads', 'Calves'], secondary: ['Hamstrings', 'Glutes', 'Core'] },
    steps: [
      'Clip the safety key to your shirt or waistband.',
      'Stand on the side rails, press Start, and let the belt begin slowly.',
      'Step on and walk; raise speed and incline gradually with the +/- buttons.',
      'To finish, slow to a walk for a cool-down, press Stop and wait for the belt to stop.',
    ],
    tips: [
      'Stay centered on the belt and look ahead, not down.',
      'Avoid hanging on the handrails — lower the speed or incline instead.',
      'Wipe down the console and rails when you are done.',
    ],
    youtubeId: 'E7sgqy7r6yc',
  },
  {
    id: 'elliptical',
    name: 'Elliptical',
    short: 'EL',
    zone: 'cardio',
    x: 370,
    y: 95,
    muscles: { primary: ['Cardio', 'Quads', 'Glutes'], secondary: ['Hamstrings', 'Calves', 'Chest', 'Back'] },
    steps: [
      'Hold the stationary handles and step onto the lowest pedal first.',
      'Start striding smoothly to wake up the console.',
      'Choose a program or quick start, and set a low resistance to begin.',
      'Use the moving handles for a full-body workout, or the fixed handles for legs only.',
    ],
    tips: [
      'Keep your posture tall and your core engaged.',
      'Push through your heels to involve more glutes and hamstrings.',
      'Slow to a stop before stepping off.',
    ],
    youtubeId: 'sHMemwz_HPU',
  },
  {
    id: 'stationary-bike',
    name: 'Stationary Bike',
    short: 'BK',
    zone: 'cardio',
    x: 580,
    y: 95,
    muscles: { primary: ['Cardio', 'Quads'], secondary: ['Hamstrings', 'Glutes', 'Calves'] },
    steps: [
      'Adjust the seat so your knee is slightly bent at the bottom of the pedal stroke.',
      'Set handlebar height so you can reach comfortably without rounding your back.',
      'Strap your feet in and start pedaling at a light resistance.',
      'Increase resistance or cadence gradually during your workout.',
    ],
    tips: [
      'Seat roughly at hip height when standing next to the bike is a good starting point.',
      'Keep your knees tracking over your feet.',
    ],
    // No verified tutorial yet — the app will show a YouTube search link instead.
    youtubeId: null,
    youtubeSearch: 'how to set up a stationary exercise bike seat height',
  },
  {
    id: 'rowing-machine',
    name: 'Rowing Machine',
    short: 'RW',
    zone: 'cardio',
    x: 790,
    y: 95,
    muscles: { primary: ['Cardio', 'Back', 'Quads'], secondary: ['Glutes', 'Hamstrings', 'Biceps', 'Core'] },
    steps: [
      'Strap your feet in so the strap crosses the widest part of your foot.',
      'Start at the "catch": shins vertical, arms straight, leaning slightly forward.',
      'Drive: push with the legs, then swing the body back, then pull the handle to your lower ribs.',
      'Recovery: arms away, body forward, then bend the knees to slide back to the catch.',
    ],
    tips: [
      'Order is legs → body → arms on the drive, and arms → body → legs on the return.',
      'A damper setting of 3–5 is plenty for most workouts.',
    ],
    youtubeId: '4zWu1yuJ0_g',
  },

  // ---------------- SELECTORIZED MACHINES ----------------
  {
    id: 'leg-press',
    name: 'Leg Press',
    short: 'LP',
    zone: 'machines',
    x: 100,
    y: 280,
    muscles: { primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Calves'] },
    steps: [
      'Sit with your back and hips flat against the pad.',
      'Place feet hip-width apart in the middle of the platform.',
      'Release the safety handles and lower the platform until your knees reach about 90°.',
      'Press through your whole foot back up, stopping just short of locking your knees.',
    ],
    tips: [
      'Do not lock out your knees at the top.',
      'Keep your lower back on the pad — if it rounds, reduce the depth.',
      'Re-engage the safety handles before getting out.',
    ],
    youtubeId: 'sp5lOlwj0mI',
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    short: 'LE',
    zone: 'machines',
    x: 255,
    y: 280,
    muscles: { primary: ['Quads'], secondary: [] },
    steps: [
      'Adjust the back pad so your knees line up with the machine’s pivot point.',
      'Set the shin pad just above your ankles.',
      'Hold the side handles and extend your legs until straight.',
      'Pause briefly, then lower slowly without letting the stack touch.',
    ],
    tips: [
      'Use a controlled tempo — no swinging.',
      'Start light if you have knee issues.',
    ],
    youtubeId: 'xd9m2S_Rw4s',
  },
  {
    id: 'leg-curl',
    name: 'Seated Leg Curl',
    short: 'LC',
    zone: 'machines',
    x: 410,
    y: 280,
    muscles: { primary: ['Hamstrings'], secondary: ['Calves'] },
    steps: [
      'Adjust the seat so your knees line up with the pivot point.',
      'Place the lower pad just above your heels and lock the thigh pad down snugly.',
      'Curl your heels down and back as far as you can.',
      'Return slowly to the start without letting the weight slam.',
    ],
    tips: [
      'Keep your hips pressed into the seat.',
      'Point toes up (dorsiflex) for better hamstring engagement.',
    ],
    youtubeId: '_2Kd0d-JEUM',
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    short: 'PD',
    zone: 'machines',
    x: 100,
    y: 440,
    muscles: { primary: ['Lats', 'Back'], secondary: ['Biceps', 'Shoulders'] },
    steps: [
      'Adjust the thigh pad so it holds your legs down snugly.',
      'Grab the bar slightly wider than shoulder-width and sit down.',
      'Pull your shoulders down, then drive your elbows toward your hips to bring the bar to your upper chest.',
      'Let the bar rise slowly until your arms are straight.',
    ],
    tips: [
      'Stay mostly upright — avoid leaning far back and yanking.',
      'Never pull the bar behind your neck.',
    ],
    youtubeId: 'SALxEARiMkw',
  },
  {
    id: 'seated-row',
    name: 'Seated Cable Row',
    short: 'SR',
    zone: 'machines',
    x: 255,
    y: 440,
    muscles: { primary: ['Back', 'Lats'], secondary: ['Biceps', 'Shoulders'] },
    steps: [
      'Attach a V-handle, sit down and place feet on the platform with knees slightly bent.',
      'Grab the handle and sit tall with your chest up.',
      'Pull the handle to your belly, driving elbows back and squeezing your shoulder blades.',
      'Extend your arms slowly, letting your shoulders reach forward a little.',
    ],
    tips: [
      'Keep your lower back neutral — don’t rock back and forth.',
      'Lead with the elbows, not the hands.',
    ],
    youtubeId: 'vwHG9Jfu4sw',
  },
  {
    id: 'chest-press',
    name: 'Chest Press Machine',
    short: 'CP',
    zone: 'machines',
    x: 410,
    y: 440,
    muscles: { primary: ['Chest'], secondary: ['Triceps', 'Shoulders'] },
    steps: [
      'Adjust the seat so the handles are at mid-chest height.',
      'Sit with your back flat against the pad and feet on the floor.',
      'Press the handles forward until your arms are almost straight.',
      'Return slowly until you feel a stretch in your chest.',
    ],
    tips: [
      'Keep elbows about 45° from your body, not flared straight out.',
      'Keep shoulder blades back and down against the pad.',
    ],
    youtubeId: '2y6ntGVg4dw',
  },
  {
    id: 'shoulder-press',
    name: 'Shoulder Press Machine',
    short: 'SP',
    zone: 'machines',
    x: 175,
    y: 600,
    muscles: { primary: ['Shoulders'], secondary: ['Triceps', 'Chest'] },
    steps: [
      'Adjust the seat so the handles start at about shoulder height.',
      'Sit back against the pad with feet planted and core braced.',
      'Press the handles overhead until your arms are nearly straight.',
      'Lower under control back to shoulder height.',
    ],
    tips: [
      'Keep your lower back against the pad — don’t arch.',
      'Stop just short of locking the elbows.',
    ],
    youtubeId: '7ijGii2c02o',
  },

  // ---------------- RACKS & BENCHES ----------------
  {
    id: 'squat-rack',
    name: 'Squat Rack',
    short: 'SQ',
    zone: 'racks',
    x: 590,
    y: 320,
    muscles: { primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Core', 'Back'] },
    steps: [
      'Set the bar hooks just below shoulder height and the safety bars just below your bottom squat depth.',
      'Step under the bar, rest it on your upper back (traps), grip it firmly and brace.',
      'Stand up to unrack, take two or three steps back, feet about shoulder-width.',
      'Sit hips back and down to at least parallel, then drive up through your whole foot.',
    ],
    tips: [
      'Always set the safety bars, and use collars on the plates.',
      'Start with the empty bar to learn the movement.',
      'Keep your chest up and knees tracking over your toes.',
    ],
    youtubeId: '-bJIpOq-LWk',
  },
  {
    id: 'smith-machine',
    name: 'Smith Machine',
    short: 'SM',
    zone: 'racks',
    x: 745,
    y: 320,
    muscles: { primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Core'] },
    steps: [
      'Set the safety stops below your lowest squat position.',
      'Position the bar on your upper back with feet slightly in front of the bar.',
      'Rotate the bar to unhook it, then squat down under control.',
      'Drive back up, then rotate the bar to re-hook it at the end of your set.',
    ],
    tips: [
      'The bar moves on a fixed path — adjust your feet so your heels stay flat.',
      'Also usable for bench press, rows, and lunges.',
    ],
    youtubeId: 'DUWK_gKcRCc',
  },
  {
    id: 'flat-bench',
    name: 'Flat Bench Press',
    short: 'BP',
    zone: 'racks',
    x: 900,
    y: 320,
    muscles: { primary: ['Chest'], secondary: ['Triceps', 'Shoulders'] },
    steps: [
      'Lie with eyes under the bar, feet flat, and shoulder blades squeezed together.',
      'Grip slightly wider than shoulder-width and unrack the bar over your shoulders.',
      'Lower the bar under control to your mid/lower chest.',
      'Press back up until your arms are straight, then re-rack.',
    ],
    tips: [
      'Ask for a spotter when going heavy, and use collars.',
      'Keep elbows around 45–70°, not flared to 90°.',
      'Keep your butt on the bench.',
    ],
    youtubeId: 'gRVjAtPip0Y',
  },

  // ---------------- CABLES ----------------
  {
    id: 'cable-crossover',
    name: 'Cable Crossover',
    short: 'CC',
    zone: 'cables',
    x: 620,
    y: 565,
    muscles: { primary: ['Chest'], secondary: ['Shoulders', 'Core'] },
    steps: [
      'Set both pulleys around shoulder height and attach single handles.',
      'Grab a handle in each hand and step forward into a staggered stance.',
      'With a slight bend in the elbows, bring your hands together in a wide arc in front of your chest.',
      'Return slowly until you feel a stretch across the chest.',
    ],
    tips: [
      'Keep the elbow angle fixed — it’s a hug, not a press.',
      'Low pulleys hit more upper chest; high pulleys hit more lower chest.',
    ],
    youtubeId: 'TdAk3RRAgSU',
  },

  // ---------------- FREE WEIGHTS ----------------
  {
    id: 'dumbbell-rack',
    name: 'Dumbbell Rack',
    short: 'DB',
    zone: 'free-weights',
    x: 865,
    y: 565,
    muscles: { primary: ['Shoulders', 'Chest', 'Biceps', 'Triceps'], secondary: ['Back', 'Core', 'Quads'] },
    steps: [
      'Pick a pair you can control for 8–12 good reps (the video shows a dumbbell shoulder press).',
      'Lift dumbbells off the rack with a neutral spine — squat down, don’t round over.',
      'Move away from the rack to train so others can reach weights.',
      'Return dumbbells to their labeled spot on the rack when finished.',
    ],
    tips: [
      'Don’t drop dumbbells from overhead.',
      'Common moves: shoulder press, curls, rows, goblet squats, lunges.',
    ],
    youtubeId: 'qEwKCR5JCog',
  },
];
