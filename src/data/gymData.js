/**
 * ============================================================
 *  GYM DATA — what each machine is (muscles, how-to, video)
 * ============================================================
 *
 * WHERE things are does not live here. Positions are in src/data/layout-<level>.json (feet, edited
 * with the dev-only ?edit=1 editor); a layout item points at a machine below via `machineId`.
 *
 * DDFC (Dottie Dorion Fitness Center), 2nd floor of the UNF Student Wellness Complex (Building 61).
 * Content built from PUBLIC sources; the research notes and links are in docs/machine-sources.md
 * and docs/unf-draft-findings.md (not shown in the app).
 *
 * ZONES:    { id, name }  (names shown in the list and panel)
 * MACHINES: { id, name, short, zone, muscles: { primary, secondary }, steps, tips, youtubeId|null }
 *   youtubeId – only IDs verified via YouTube oEmbed (HTTP 200); else null
 */

export const FACILITY = {
  name: 'Dottie Dorion Fitness Center',
  building: 'Student Wellness Complex (Bldg 61)',
  campus: 'University of North Florida',
  isDraft: true,
  feedbackUrl:
    'https://github.com/zacharyflechas/unf-gym-map/issues/new?title=Layout%20correction&body=What%20is%20wrong%20or%20missing%3F%0A%0AWhere%20is%20it%20actually%3F',
};

export const ZONES = [
  { id: 'cardio', name: 'Cardio' },
  { id: 'patio', name: 'Outdoor Balcony' },
  { id: 'atrium', name: 'Atrium (open)' },
  { id: 'machines', name: 'Machines (selectorized + plate-loaded)' },
  { id: 'racks', name: 'Half Racks (×9) + Platforms' },
  { id: 'cozy', name: 'Cozy Corner' },
  { id: 'playground', name: '“Playground” (Synergy 360)' },
  { id: 'free-weights', name: 'Dumbbells & Benches' },
  { id: 'crossprey', name: 'Crossprey-Fit' },
];

export const MACHINES = [
  // ---------------- CARDIO ----------------
  {
    id: 'treadmill', name: 'Treadmills', short: 'TM', zone: 'cardio',
    muscles: { primary: ['Cardio', 'Quads'], secondary: ['Hamstrings', 'Glutes', 'Core'] },
    steps: [
      'Clip the safety key to your clothing.',
      'Stand on the side rails, press Start and let the belt begin slowly.',
      'Step on and raise speed/incline gradually.',
      'Cool down, press Stop and wait for the belt to stop before stepping off.',
    ],
    tips: ['Don’t hang on the rails — lower the speed or incline instead.', 'Wipe down after use (DDFC policy).'],
    youtubeId: 'E7sgqy7r6yc',
  },
  {
    id: 'stepmill', name: 'Step Mills', short: 'ST', zone: 'cardio',
    muscles: { primary: ['Cardio', 'Glutes', 'Quads'], secondary: ['Hamstrings', 'Core'] },
    steps: [
      'Hold the rails and step onto the stairs.',
      'Press Start and choose a low level to begin.',
      'Climb with your whole foot on each step, standing tall.',
      'Lower the level to cool down; wait for the stairs to stop before stepping off.',
    ],
    tips: ['Use the rails for balance only — don’t lean on them.', 'Short intervals are a great finisher.'],
    youtubeId: 'Zn1O9LcKW9E',
  },
  {
    id: 'elliptical', name: 'Ellipticals', short: 'EL', zone: 'cardio',
    muscles: { primary: ['Cardio', 'Quads', 'Glutes'], secondary: ['Hamstrings', 'Chest', 'Back'] },
    steps: [
      'Hold the fixed handles and step onto the lowest pedal.',
      'Start striding to wake up the console and pick a low resistance.',
      'Use moving handles for full body, fixed handles for legs only.',
      'Slow to a stop before stepping off.',
    ],
    tips: ['Keep posture tall and core engaged.'],
    youtubeId: 'sHMemwz_HPU',
  },
  {
    id: 'bike', name: 'Bikes', short: 'BK', zone: 'cardio',
    muscles: { primary: ['Cardio', 'Quads'], secondary: ['Hamstrings', 'Glutes'] },
    steps: [
      'Adjust the seat so your knee is slightly bent at the bottom of the stroke.',
      'Set handlebars so you can reach without rounding your back.',
      'Start pedaling at light resistance, then build gradually.',
    ],
    tips: ['Upright and recumbent bikes may both be present — recumbents are easier on the back.'],
    youtubeId: null,
    youtubeSearch: 'how to set up an exercise bike seat height',
  },
  {
    id: 'rower', name: 'Rowing Machines', short: 'RW', zone: 'cardio',
    muscles: { primary: ['Cardio', 'Back', 'Quads'], secondary: ['Glutes', 'Hamstrings', 'Arms', 'Core'] },
    steps: [
      'Strap feet in across the widest part of the foot.',
      'Drive: legs, then lean back, then pull the handle to your lower ribs.',
      'Recover: arms, body, then knees — slide back to the start.',
    ],
    tips: ['Damper 3–5 is plenty for most workouts.', 'Rowers are allowed out on the balcony (policy).'],
    youtubeId: '4zWu1yuJ0_g',
  },

  // ---------------- MACHINES ----------------
  {
    id: 'leg-press', name: 'Leg Press', short: 'LP', zone: 'machines',
    muscles: { primary: ['Quads', 'Glutes'], secondary: ['Hamstrings'] },
    steps: [
      'Sit with back and hips flat on the pad, feet hip-width in the middle of the platform.',
      'Release the safety handles and lower until knees reach about 90°.',
      'Press back up through your whole foot without locking your knees.',
      'Re-engage the safeties before getting out.',
    ],
    tips: ['Keep your lower back on the pad — reduce depth if it rounds.'],
    youtubeId: 'sp5lOlwj0mI',
  },
  {
    id: 'leg-extension', name: 'Leg Extension', short: 'LE', zone: 'machines',
    muscles: { primary: ['Quads'], secondary: [] },
    steps: [
      'Line your knees up with the machine’s pivot point.',
      'Set the shin pad just above your ankles.',
      'Extend your legs, pause, and lower slowly.',
    ],
    tips: ['No swinging — control the weight both ways.'],
    youtubeId: 'xd9m2S_Rw4s',
  },
  {
    id: 'leg-curl', name: 'Leg Curl', short: 'LC', zone: 'machines',
    muscles: { primary: ['Hamstrings'], secondary: [] },
    steps: [
      'Line your knees up with the pivot; pad just above your heels.',
      'Lock the thigh pad down snugly.',
      'Curl your heels back as far as you can, then return slowly.',
    ],
    tips: ['Keep hips pressed into the seat.'],
    youtubeId: '_2Kd0d-JEUM',
  },
  {
    id: 'hip-abductor', name: 'Hip Ab/Adductor', short: 'HA', zone: 'machines',
    muscles: { primary: ['Hips', 'Glutes'], secondary: [] },
    steps: [
      'Set the pads outside your knees for abduction (push out) or inside for adduction (squeeze in).',
      'Sit tall with your back against the pad and feet on the foot rests.',
      'Move your legs apart/together under control, then return slowly.',
    ],
    tips: ['Use a range you can control — don’t let the stack slam.'],
    youtubeId: 'b-cxonq03vQ',
  },
  {
    id: 'lat-pulldown', name: 'Lat Pulldown', short: 'PD', zone: 'machines',
    muscles: { primary: ['Lats', 'Back'], secondary: ['Arms', 'Shoulders'] },
    steps: [
      'Adjust the thigh pad snugly; grip slightly wider than shoulders.',
      'Pull shoulders down, then drive elbows toward hips to bring the bar to your upper chest.',
      'Let the bar rise slowly until arms are straight.',
    ],
    tips: ['Never pull behind the neck.'],
    youtubeId: 'SALxEARiMkw',
  },
  {
    id: 'seated-row', name: 'Seated Row', short: 'SR', zone: 'machines',
    muscles: { primary: ['Back', 'Lats'], secondary: ['Arms', 'Shoulders'] },
    steps: [
      'Sit tall with feet braced and knees slightly bent.',
      'Pull the handle to your belly, driving elbows back and squeezing shoulder blades.',
      'Extend arms slowly.',
    ],
    tips: ['Don’t rock back and forth.'],
    youtubeId: 'vwHG9Jfu4sw',
  },
  {
    id: 'chest-press', name: 'Chest Press', short: 'CP', zone: 'machines',
    muscles: { primary: ['Chest'], secondary: ['Arms', 'Shoulders'] },
    steps: [
      'Adjust the seat so handles are at mid-chest height.',
      'Press forward until arms are nearly straight.',
      'Return slowly until you feel a stretch in your chest.',
    ],
    tips: ['Keep elbows ~45° from your body.'],
    youtubeId: '2y6ntGVg4dw',
  },
  {
    id: 'shoulder-press', name: 'Shoulder Press', short: 'SP', zone: 'machines',
    muscles: { primary: ['Shoulders'], secondary: ['Arms', 'Chest'] },
    steps: [
      'Set the seat so handles start at shoulder height.',
      'Press overhead until arms are nearly straight.',
      'Lower under control.',
    ],
    tips: ['Keep your lower back against the pad.'],
    youtubeId: '7ijGii2c02o',
  },
  {
    id: 'plate-loaded', name: 'Plate-Loaded Machines', short: 'PL', zone: 'machines',
    muscles: { primary: ['Chest', 'Back', 'Quads'], secondary: ['Shoulders', 'Arms', 'Glutes'] },
    steps: [
      'Load plates evenly on both sides (iso-lateral machines move each arm separately).',
      'Adjust the seat so handles line up with the target (e.g. mid-chest for a press).',
      'Move through the machine’s arc under control; don’t lock out hard.',
      'Unload plates when finished.',
    ],
    tips: ['Video shows a Hammer Strength–style chest press; the DDFC’s exact models/brands are unknown.'],
    youtubeId: 'B3HWtDDKBlY',
  },
  {
    id: 'cable-station', name: 'Cable Station', short: 'CB', zone: 'machines',
    muscles: { primary: ['Chest', 'Back', 'Shoulders'], secondary: ['Arms', 'Core'] },
    steps: [
      'Set the pulley height for your exercise and clip on a handle or rope.',
      'Pick a light weight and stand in a stable, staggered stance.',
      'Move under control — e.g. flys, rows, pushdowns or curls.',
    ],
    tips: ['Return the attachments to their hooks when done.'],
    youtubeId: '22AFyTaVs5g',
  },
  {
    id: 'cybex-total-access', name: 'Accessible Machines (Cybex Total Access)', short: 'TA', zone: 'machines',
    muscles: { primary: ['Chest', 'Back', 'Shoulders'], secondary: ['Arms'] },
    steps: [
      'Swing the seat away to roll a wheelchair into position, or use it seated.',
      'Use the locking adjustments to set handle height.',
      'Pick a light starting weight and press/pull under control.',
    ],
    tips: ['Ask DDFC staff to help with setup the first time.'],
    youtubeId: 'YV0DOrt6-ys',
  },
  {
    id: 'ube', name: 'Upper Body Ergometer', short: 'UB', zone: 'machines',
    muscles: { primary: ['Cardio', 'Arms', 'Shoulders'], secondary: ['Back', 'Core'] },
    steps: [
      'Adjust the seat so the crank is about shoulder height (or roll a wheelchair in).',
      'Grip the handles and pedal with your arms at low resistance.',
      'Increase resistance gradually; try forward and backward.',
    ],
    tips: ['Great cardio option for lower-body injuries.'],
    youtubeId: 'BLVu198om5g',
  },

  // ---------------- RACKS ----------------
  {
    id: 'half-racks', name: 'Half Racks (×9)', short: 'HR', zone: 'racks',
    muscles: { primary: ['Quads', 'Glutes', 'Full Body'], secondary: ['Hamstrings', 'Core', 'Back'] },
    steps: [
      'Set J-hooks just below shoulder height and safety arms just below your bottom position.',
      'Brace under the bar, unrack, step back, and squat to depth with chest up.',
      'Drive up and re-rack into the hooks.',
    ],
    tips: [
      'Peak hours (4 PM–close): 40-minute limit on racks (policy).',
      'Only one barbell per rack; Olympic lifts must be in a rack/platform.',
      'Use collars — strongly recommended by DDFC policy.',
    ],
    youtubeId: '-bJIpOq-LWk',
  },
  {
    id: 'deadlift', name: 'Platforms / Deadlift', short: 'DL', zone: 'racks',
    muscles: { primary: ['Hamstrings', 'Glutes', 'Back'], secondary: ['Quads', 'Core', 'Arms'] },
    steps: [
      'Use the inlay platform in front of a rack; load bumper plates.',
      'Feet hip-width, bar over mid-foot, hinge and grip just outside your legs.',
      'Brace, push the floor away and stand tall; lower with control.',
    ],
    tips: ['Diamond/trap bar farmer’s carries only behind the squat racks (policy).', 'No lifting behind an occupied rack.'],
    youtubeId: null,
    youtubeSearch: 'how to deadlift for beginners proper form',
  },

  // ---------------- COZY CORNER ----------------
  {
    id: 'nautilus-one', name: 'Nautilus One Circuit', short: 'N1', zone: 'cozy',
    muscles: { primary: ['Full Body'], secondary: ['Chest', 'Back', 'Quads', 'Shoulders'] },
    steps: [
      'Go machine to machine in order around the circuit.',
      'Adjust each seat so the joint lines up with the machine’s pivot (look for colored adjustment knobs).',
      'Do 10–15 controlled reps per machine, then move on.',
    ],
    tips: ['UNF offers a free “Novice Workout” session that teaches this circuit.'],
    youtubeId: null,
    youtubeSearch: 'Nautilus One selectorized circuit how to use',
  },
  {
    id: 'light-dumbbells', name: 'Light Dumbbells', short: 'LD', zone: 'cozy',
    muscles: { primary: ['Arms', 'Shoulders'], secondary: ['Chest', 'Back'] },
    steps: [
      'Pick a pair you can control for 10–15 reps.',
      'Train away from the rack so others can reach weights.',
      'Return dumbbells to their spot.',
    ],
    tips: ['There are 4 light dumbbell areas away from the main heavy area — one is in the Cozy Corner.'],
    youtubeId: 'qEwKCR5JCog',
  },
  {
    id: 'stretch', name: 'Stretch Area', short: 'SA', zone: 'cozy',
    muscles: { primary: ['Mobility'], secondary: ['Hamstrings', 'Hips', 'Back'] },
    steps: [
      'Grab a mat and give yourself space.',
      'Hold each stretch 20–30 seconds without bouncing.',
      'Use stretch machines/foam rollers if available.',
    ],
    tips: ['There are 3 dedicated stretch mat areas plus stretch machines; stretch mats were refreshed in 2023–24.'],
    youtubeId: null,
    youtubeSearch: 'post workout full body stretch routine',
  },

  // ---------------- PLAYGROUND ----------------
  {
    id: 'synergy-360', name: 'Synergy 360 Rig', short: 'S3', zone: 'playground',
    muscles: { primary: ['Full Body', 'Core'], secondary: ['Shoulders', 'Back', 'Quads'] },
    steps: [
      'Pick a station: pull-up bars, cable/rope pulleys, suspension anchors, boxes, etc.',
      'Warm up, then do circuits like pull-ups, step-ups, rope work and core moves.',
      'Share stations and put accessories back.',
    ],
    tips: ['Video is Life Fitness’s product demo of the Synrgy360, not a UNF video.'],
    youtubeId: 'w6VWeQfn8_0',
  },
  {
    id: 'trx', name: 'TRX Suspension', short: 'TX', zone: 'playground',
    muscles: { primary: ['Core', 'Full Body'], secondary: ['Chest', 'Back', 'Shoulders'] },
    steps: [
      'Check the anchor is secure and adjust both straps to the same length.',
      'Lean back for rows, forward for presses — your body angle sets the difficulty.',
      'Keep a straight plank line from head to heels.',
    ],
    tips: ['Step your feet forward/back to make it easier or harder.'],
    youtubeId: 'jUJiXW2HGz0',
  },

  // ---------------- FREE WEIGHTS ----------------
  {
    id: 'dumbbells', name: 'Main Dumbbell Area', short: 'DB', zone: 'free-weights',
    muscles: { primary: ['Shoulders', 'Chest', 'Arms'], secondary: ['Back', 'Core', 'Quads'] },
    steps: [
      'Pick weights you can control for 8–12 good reps.',
      'Lift dumbbells off the rack with a neutral spine.',
      'Move away from the rack to train; re-rack in the labeled spot.',
    ],
    tips: ['EZ-curl bar may be used anywhere in the free weight area for non-traveling exercises (policy).'],
    youtubeId: 'qEwKCR5JCog',
  },
  {
    id: 'bench-press', name: 'Barbell Benches', short: 'BP', zone: 'free-weights',
    muscles: { primary: ['Chest'], secondary: ['Arms', 'Shoulders'] },
    steps: [
      'Eyes under the bar, feet flat, shoulder blades squeezed.',
      'Unrack over your shoulders and lower to mid/lower chest.',
      'Press up and re-rack.',
    ],
    tips: ['Ask for a spot when going heavy.', 'No standing barbell shoulder press over a bench-press bench (policy).'],
    youtubeId: 'gRVjAtPip0Y',
  },

  // ---------------- CROSSPREY-FIT ----------------
  {
    id: 'monkey-bars', name: 'Monkey Bars', short: 'MB', zone: 'crossprey',
    muscles: { primary: ['Lats', 'Arms', 'Core'], secondary: ['Shoulders', 'Back'] },
    steps: [
      'Start with dead hangs and active hangs (shoulders pulled down).',
      'Progress to scap pull-ups, then pull-ups or traverses.',
      'Drop down with soft knees.',
    ],
    tips: ['Upside-down crunches and “skin the cat” are not permitted (policy).'],
    youtubeId: '95zYvdKUn1o',
  },
  {
    id: 'olympic-platform', name: 'Olympic Platforms (×2)', short: 'OP', zone: 'crossprey',
    muscles: { primary: ['Full Body', 'Quads', 'Glutes'], secondary: ['Back', 'Shoulders', 'Core'] },
    steps: [
      'Use bumper plates and an empty platform.',
      'Learn the power clean from the hang first, with a light bar.',
      'Keep the bar close, extend hips explosively, and catch on your shoulders.',
    ],
    tips: ['Diamond bar deadlifts on the platform only with bumper plates (policy).'],
    youtubeId: 'lI35socHJ4k',
  },
  {
    id: 'slam-wall', name: 'Slam Wall', short: 'SW', zone: 'crossprey',
    muscles: { primary: ['Full Body', 'Core'], secondary: ['Shoulders', 'Lats'] },
    steps: [
      'Hold a slam ball at chest height, feet shoulder-width.',
      'Reach overhead, then slam it down hard, hinging at the hips.',
      'Pick it up with a flat back and repeat.',
    ],
    tips: ['Wall balls and handstand push-ups must be done in this area (policy).'],
    youtubeId: 'YFORkljMrEQ',
  },
  {
    id: 'air-bike', name: 'Air Bikes', short: 'AB', zone: 'crossprey',
    muscles: { primary: ['Cardio', 'Full Body'], secondary: ['Quads', 'Arms'] },
    steps: [
      'Adjust the seat like a normal bike.',
      'Push and pull the handles while pedaling — the harder you go, the more resistance.',
      'Try 10–20 s hard / 40–60 s easy intervals.',
    ],
    tips: ['Allowed out on the balcony (policy).'],
    youtubeId: '7b6n9Xuc3CA',
  },
];
