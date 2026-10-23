/**
 * ============================================================
 *  GYM DATA — what each machine is (muscles, how-to, video)
 * ============================================================
 *
 * WHERE things are no longer lives here. Positions are in src/data/layout-2f.json (feet, edited
 * with the dev-only ?edit=1 editor); a layout item points at a machine below via `machineId`.
 *
 * DDFC (Dottie Dorion Fitness Center), 2nd floor of the UNF Student Wellness Complex (Building 61).
 * Content built from PUBLIC sources (see SOURCES below and docs/unf-draft-findings.md).
 *
 * ZONES: { id, name, confidence, locationConfidence, note, sources }  (used for names in the list/panel)
 * MACHINES: { id, name, short, zone, muscles: {primary, secondary}, steps, tips,
 *             youtubeId|null, youtubeSearch?, confidence, locationConfidence, note, sources }
 *   confidence         – how sure we are this equipment EXISTS at the DDFC
 *   locationConfidence – (old draft) how sure the old guessed position was; shown in the panel until Spec 02 removes it
 *   youtubeId          – only IDs verified via YouTube oEmbed (HTTP 200); else null → search link
 */

export const FACILITY = {
  name: 'Dottie Dorion Fitness Center',
  building: 'Student Wellness Complex (Bldg 61) · 2nd floor',
  campus: 'University of North Florida',
  isDraft: true,
  feedbackUrl:
    'https://github.com/zacharyflechas/unf-gym-map/issues/new?title=Layout%20correction&body=What%20is%20wrong%20or%20missing%3F%0A%0AWhere%20is%20it%20actually%3F',
};

/** Public sources referenced by `sources: [...]` keys below. */
export const SOURCES = {
  ddfc: { title: 'UNF RecWell – Dottie Dorion Fitness Center page (features list, hours)', url: 'https://www.unf.edu/recwell/swc/ddfc.html' },
  swc: { title: 'UNF RecWell – Student Wellness Complex page', url: 'https://www.unf.edu/recwell/swc/index.html' },
  facilities: { title: 'UNF RecWell – Hours and Facilities (floor-by-floor list)', url: 'https://www.unf.edu/recwell/hoursandfacilities.html' },
  policies: { title: 'UNF RecWell – Policies (DDFC rules mention racks, platforms, Crossprey Fit, patio)', url: 'https://www.unf.edu/recwell/policies.html' },
  ribbon: { title: 'UNF Newsroom, Feb 2024 – SWC ribbon cutting (9 half-racks, new equipment)', url: 'https://www.unf.edu/newsroom/2024/02/SWC-Ribbon-Cutting.html' },
  spin2024: { title: 'UNF Spinnaker, Feb 29 2024 – Inside UNF’s new and improved SWC (+ rack photo)', url: 'https://unfspinnaker.com/102275/latest/inside-unfs-new-and-improved-student-wellness-center/' },
  spin2023: { title: 'UNF Spinnaker, Oct 25 2023 – Gym to close for renovations', url: 'https://unfspinnaker.com/101352/news/gym-and-rock-wall-to-close-for-renovations-next-month-university-says/' },
  spin2016: { title: 'UNF Spinnaker, Aug 12 2016 – UNF Gym Life: What you should know', url: 'https://unfspinnaker.com/51729/entertainment/unf-gym-life-what-you-should-know/' },
  photos: { title: 'UNF RecWell photos (DDFC/SWC banners, Capital Projects page “swcfloor”, “weightroom”)', url: 'https://www.unf.edu/recwell/projects.html' },
  arch: { title: 'Architect project sheet (Borrelli + Partners / PSA-Dewberry, 2018 PDF, ~2012 photos)', url: 'https://assets.ctfassets.net/7obzj0odnsj4/7zLDTRbqVycl6APJVzv001/e4e1ef972fefe9af109c7ca47e1351db/UNF_Student_Wellness_Complex.pdf' },
};

export const ZONES = [
  {
    id: 'cardio', name: 'Cardio',
    confidence: 'high', locationConfidence: 'medium',
    note: 'Official: an “expansive cardio area” with the balcony just off it; several cardio areas with different views. Photos show rows of treadmills/steppers/ellipticals facing large windows under the 3rd-floor track overhang. Which wall: unknown. Cardio is also “interspersed” elsewhere (integrated floor plan).',
    sources: ['swc', 'ddfc', 'photos'],
  },
  {
    id: 'patio', name: 'Outdoor Balcony',
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: outdoor multi-use balcony “just off of the expansive cardio area”, also used for outdoor group fitness. Rowers, air bikes and light equipment allowed; no heavy equipment/slamming. Exact side: guess.',
    sources: ['swc', 'policies'],
  },
  {
    id: 'atrium', name: 'Atrium (open)',
    confidence: 'medium', locationConfidence: 'low',
    note: 'The 34-ft climbing wall rises from the 1st floor to track level and the track “gives views of the fitness level, atrium”. Size/position of the opening on the 2nd floor: guess.',
    sources: ['swc', 'arch'],
  },
  {
    id: 'machines', name: 'Machines (selectorized + plate-loaded)',
    confidence: 'high', locationConfidence: 'low',
    note: 'Leg press, leg extension, hip abductor/adductor and “many other machines” (2016). ~2012 photos show blue/black plate-loaded machines and Power Lift units in the open central floor; the current SWC web-page banner photo (undated) shows machines under a curved “University of North Florida” soffit. Arrangement here: guess.',
    sources: ['spin2016', 'arch', 'swc'],
  },
  {
    id: 'racks', name: 'Half Racks (×9) + Platforms',
    confidence: 'high', locationConfidence: 'medium',
    note: '9 matching half-racks with inlay lifting platforms (Jan 2024) on 4-layer impact flooring. Photos: two facing rows of racks with a center aisle of “North Florida” inlay platforms, one row against floor-to-ceiling exterior windows overlooking a stadium. Which side of the building: unknown.',
    sources: ['ribbon', 'spin2024', 'spin2023', 'ddfc', 'photos'],
  },
  {
    id: 'cozy', name: 'Cozy Corner',
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: “a non-intimidating small fitness center within the larger fitness center” with the Nautilus One circuit, a light dumbbell area, a stretch area and some cardio. Students describe it as “tucked away in a corner”. Which corner: guess.',
    sources: ['ddfc', 'spin2016'],
  },
  {
    id: 'playground', name: '“Playground” (Synergy 360)',
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: functional training area featuring the Life Fitness Synergy 360, nicknamed the Playground. A ~2012 photo shows a red/black rig in the central open floor. Position: guess.',
    sources: ['ddfc', 'arch'],
  },
  {
    id: 'free-weights', name: 'Dumbbells & Benches',
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: a main heavier dumbbell area plus 4 separate light dumbbell areas; “benches galore” and barbell benches (policies). Rubber free-weight area is 6,900 sq ft. Position: guess.',
    sources: ['ddfc', 'policies', 'spin2016', 'ribbon'],
  },
  {
    id: 'crossprey', name: 'Crossprey-Fit',
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: custom monkey bars, 2 Olympic platforms and a slam wall. Policies: wall balls and handstand push-ups must be done here; no barbell lifts in its open space. Position: guess.',
    sources: ['ddfc', 'policies'],
  },
];

export const MUSCLE_GROUPS = [
  'Quads', 'Hamstrings', 'Glutes', 'Hips', 'Chest', 'Back', 'Lats', 'Shoulders',
  'Arms', 'Core', 'Full Body', 'Cardio', 'Mobility',
];

const S_MACHINES = 'Exact brand/position unknown.';

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
    confidence: 'high', locationConfidence: 'medium',
    note: 'Rows of treadmills face the windows in photos; new treadmills were bought in 2024. Brand not legible in public photos.',
    sources: ['spin2016', 'ribbon', 'photos'],
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
    confidence: 'high', locationConfidence: 'medium',
    note: 'Step mills were among the 2024 equipment purchases; stair masters mentioned in 2016.',
    sources: ['ribbon', 'spin2016', 'photos'],
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
    confidence: 'high', locationConfidence: 'medium',
    note: 'Ellipticals (2016 article) and elliptical/adaptive-motion style trainers visible in photos. Model unknown.',
    sources: ['spin2016', 'photos'],
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
    confidence: 'high', locationConfidence: 'low',
    note: '“Bicycles” listed in 2016. Upright vs. recumbent mix unknown. (Spin bikes are in the 1st-floor group fitness studio, not here.)',
    sources: ['spin2016'],
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
    confidence: 'high', locationConfidence: 'low',
    note: '“A few rowing machines” (2016); policies allow rowers on the patio. Location on the floor unknown.',
    sources: ['spin2016', 'policies'],
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
    confidence: 'medium', locationConfidence: 'low',
    note: 'Leg presses mentioned in 2016; plate-loaded vs. selectorized and current status unknown. ' + S_MACHINES,
    sources: ['spin2016'],
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
    confidence: 'medium', locationConfidence: 'low',
    note: 'Leg extensions mentioned in 2016. ' + S_MACHINES,
    sources: ['spin2016'],
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
    confidence: 'low', locationConfidence: 'low',
    note: 'GUESS: not named in any source, but standard in machine lines like the Nautilus One circuit. ' + S_MACHINES,
    sources: ['ddfc'],
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
    confidence: 'medium', locationConfidence: 'low',
    note: 'Hip adductor/abductor mentioned in 2016. ' + S_MACHINES,
    sources: ['spin2016'],
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
    confidence: 'low', locationConfidence: 'low',
    note: 'GUESS from “many other machines that isolate your arm and back muscles” (2016); a Cybex Total Access lat pulldown is a possibility. ' + S_MACHINES,
    sources: ['spin2016'],
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
    confidence: 'low', locationConfidence: 'low',
    note: 'GUESS (back machines mentioned generally in 2016). ' + S_MACHINES,
    sources: ['spin2016'],
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
    confidence: 'low', locationConfidence: 'low',
    note: 'GUESS: a standard machine; not named in sources. ' + S_MACHINES,
    sources: ['spin2016'],
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
    confidence: 'low', locationConfidence: 'low',
    note: 'GUESS: a standard machine; not named in sources. ' + S_MACHINES,
    sources: ['spin2016'],
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
    confidence: 'medium', locationConfidence: 'low',
    note: 'Plate-loaded machines are referenced by UNF’s free-weight personal-training offer; ~2012 photos show blue/black plate-loaded units and “POWER LIFT”-labelled machines in the central floor. May have changed since.',
    sources: ['ddfc', 'arch'],
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
    confidence: 'medium', locationConfidence: 'low',
    note: '“Cables” listed in 2016. Type (crossover vs. dual adjustable pulley) and position unknown.',
    sources: ['spin2016'],
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
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: wheelchair-accessible equipment includes Cybex Total Access weight machines. Which models and where: unknown.',
    sources: ['ddfc'],
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
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: a “Techno Excite” (likely Technogym Excite) upper body ergometer. Video shows a Technogym arm ergometer. Position unknown.',
    sources: ['ddfc'],
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
    confidence: 'high', locationConfidence: 'medium',
    note: '9 matching half-racks with inlay platforms added Jan 2024; photos show them in two facing rows along exterior windows (PLAE and Rogue bumper plates visible).',
    sources: ['ribbon', 'spin2024', 'spin2023', 'policies', 'photos'],
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
    confidence: 'high', locationConfidence: 'medium',
    note: 'Inlay platforms with the racks (2024); a “deadlift station” mentioned in 2016; diamond bar rules in policies.',
    sources: ['ribbon', 'spin2016', 'policies'],
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
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: Nautilus One “Simple Circuit” in the Cozy Corner (page says both 10-piece and 11-unit). Which machines are included: unknown.',
    sources: ['ddfc'],
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
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: 4 light dumbbell areas set away from the main heavier area; one in the Cozy Corner. Others: unknown.',
    sources: ['ddfc'],
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
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: 3 stretch mat areas (one in the Cozy Corner) and several stretch machines. Locations of the other two: unknown.',
    sources: ['ddfc', 'spin2023'],
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
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: Life Fitness Synergy 360 (“the Playground”).',
    sources: ['ddfc', 'arch'],
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
    confidence: 'medium', locationConfidence: 'low',
    note: 'TRX bands listed in 2016. Placing them on the functional rig is a GUESS.',
    sources: ['spin2016'],
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
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: main heavier, larger dumbbell area; 525 lb of new dumbbells added in 2024.',
    sources: ['ddfc', 'ribbon', 'policies'],
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
    confidence: 'high', locationConfidence: 'low',
    note: 'Policies repeatedly mention “barbell benches”/“bench press”; “benches galore” (2016). Position: guess.',
    sources: ['policies', 'spin2016'],
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
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: custom-built monkey bars in the Crossprey-Fit area.',
    sources: ['ddfc', 'policies'],
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
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: 2 Olympic platforms in Crossprey-Fit.',
    sources: ['ddfc', 'policies'],
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
    confidence: 'high', locationConfidence: 'low',
    note: 'Official: slam wall in Crossprey-Fit.',
    sources: ['ddfc', 'policies'],
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
    confidence: 'medium', locationConfidence: 'low',
    note: 'Policies mention “air dyne/assault bikes” being permitted on the patio, implying the DDFC has them. Location: GUESS.',
    sources: ['policies'],
  },
];
