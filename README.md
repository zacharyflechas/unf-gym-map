# Rec Center Gym Map (UNF prototype)

An interactive, mobile-friendly gym floor map for students. Tap a machine to see the muscles it works, short how-to steps, tips, and (for machines where form matters most) a tap-to-load tutorial video.

> **Draft:** on the `unf-layout-draft` branch, the map is a best-effort draft of the **Dottie Dorion Fitness Center** (2nd floor, Student Wellness Complex, Building 61). It is built from public sources only. The equipment list is mostly sourced, but most **positions are guesses**. Research notes and sources are in [`docs/unf-draft-findings.md`](docs/unf-draft-findings.md) and [`docs/machine-sources.md`](docs/machine-sources.md) (not shown in the app). This project is not affiliated with or endorsed by UNF and uses no UNF logos. **Corrections are welcome:** open an issue.

![Desktop map](screenshots/01-desktop-map.png)

## Features

- Top-down SVG floor map, traced from the official plan (units: feet), with every piece of equipment drawn at its approximate size, colored by zone, with a small type icon when zoomed in. The layout is approximate and still being verified.
- **Pan & zoom** (hand-written, no library): drag to move, pinch or scroll to zoom, **+ / − / Reset** buttons; with the map focused, arrow keys pan, `+` / `-` zoom and `0` resets. A drag never opens a machine. Tapping a machine glides the map to it and back when the panel closes.
- **Levels:** 2F Gym and 3F Track (a placeholder for now). The level is in the URL (`?level=3f`).
- **Search + zone legend:** search by machine name, zone or muscle; tap a zone in the color legend to highlight it. Both combine; **Clear** resets both. Matches get a still gold glow and the rest dim. The match count is announced to screen readers.
- **Detail panel as cards:** muscles worked (front/back body diagram: primary strong, secondary light), video, how-to steps, tips. A right-hand drawer on desktop, a bottom sheet on phones.
- **Tap-to-load video:** only machines on the video list (form is non-obvious) have one. Nothing loads from YouTube until you press Play; then a privacy-enhanced `youtube-nocookie.com` player loads. Videos by Zach show a **Coach Zach** label and his coaching cues.
- **List view** button for a plain list of machines (big tap targets).
- **Light / dark theme:** follows the system, or pick Light/Dark (saved on this device). All colors come from [`src/tokens.css`](src/tokens.css) (Osprey Navy palette).
- Deep links: the URL hash holds the open machine (e.g. `…/#leg-press`). You could print these as QR codes and stick them on the real machines.
- Accessibility: visible focus rings, 44 px tap targets for controls, AA color contrast in both themes, every machine reachable with Tab + Enter, reduced motion respected.
- No backend: it builds to a static site.

## Run locally

Requires Node 20.19+ (or 22+).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve dist/ at http://localhost:4173
npm run validate   # check the layout files (also runs before every build)
npm test           # tests for the search + zone legend logic
```

## Edit the gym data

The data is split into **where things are** and **what they are**:

- **`src/data/layout-<level>.json`** ([2F](src/data/layout-2f.json), [3F](src/data/layout-3f.json)) holds where every item sits. These files are the **only** place machine positions live. Each item is `{ id, name, type, zone, x, y, rotation, width, depth, status, notes, machineId? }`:
  - Units are **feet**. `x`, `y` are the item's center and `rotation` is in degrees clockwise.
  - `status` is one of `guess | sketch | photo-verified | scan-verified`.
  - `machineId` (optional) links the item to an entry in `gymData.js` so tapping it shows muscles, how-to and video. Items without one show a simple "no info yet" panel.
  - The file starts with a `meta` block: `{ version, updated, source: "sketch" | "photos" | "scan", units: "ft", floor, ... }`. `version` is the file-format version (1). Older files without `meta` (the Stage A shape, or a bare `[ ...items ]` list) still load.
- **`src/data/base-<level>.json`** is the floor itself, in feet: `view` (the part of the floor the map shows), `outline` (required), and optional `rooms`, `facilities`, `stairs`, `balcony`, `columns`, `track`, `openings` and `entrance`. 2F is traced from the official plan; the scale is an **estimate** (28 ft column bay) until a wall is measured. 3F is a **placeholder** (approximate track loop).
- **[`src/data/gymData.js`](src/data/gymData.js)** holds what each machine is: `MACHINES` (muscles, steps, tips, optional `video`), `ZONES` (names) and `FACILITY` (header text, feedback link).
- **[`src/legend.js`](src/legend.js)** groups layout zone names into the color legend (unknown zones show under Other).
- **[`src/levels.js`](src/levels.js)** lists the levels (one line per floor).

## Updating the layout

Positions will keep improving (sketch → photos → scan). Each update is just a new layout file:

1. `npm run dev` and open `http://localhost:5173/?edit=1` (add `&level=3f` for the track, or use the level dropdown).
2. Move/edit items, set **Source** (sketch, photos, scan), then click **Export JSON**. You get `layout-2f.json` (or `layout-3f.json`) with a `meta` block and today's date in `meta.updated`.
3. Replace `src/data/layout-2f.json` with the downloaded file.
4. `npm run validate`. It prints every problem in plain words. **Errors** (missing or duplicate id, missing name, bad status, non-number coordinates, unknown `machineId`, units not feet) stop the build; **warnings** (item outside the floor outline, item still called "New item", no `meta` block) don't. The same check runs before every `npm run build` and in the browser console during `npm run dev`.
5. Commit and open a PR. No code changes are needed.

### Swap in a scan underlay (e.g. a LiDAR top-down export)

- Put the image in [`dev-assets/`](dev-assets/README.md) (git-ignored, never published). Every `.jpg`, `.png` or `.webp` there shows up in the editor's **Underlay** dropdown. Or use **Pick image file…** to open any image from disk without copying it.
- Line it up with the **x / y / width (ft)** boxes: x, y is where the image's top-left corner sits on the map, width is how wide the image is in feet (height follows the image's proportions). `plan-2f-straightened.jpg` lines up automatically.

### Swap in a new base map (from a scan)

Replace `src/data/base-2f.json` with a new file of the same shape. Only `view` and `outline` are required, so you can start with just the outer walls and add rooms, stairs and columns later. Keep the same origin (top-left, feet) if you want existing item positions to stay put; otherwise re-place items in the editor on top of the new base. Set `entrance` to `{ "x": ..., "y": ..., "label": "Entrance" }` to show the entrance label (it is `null`, so hidden, until we confirm where it is). Run `npm run validate`.

### Layout editor (dev only)

- **Drag** an item to move it. **Drag the yellow dot** to rotate it (hold Shift for 15° steps).
- **Arrow keys** nudge the selected item 0.5 ft (Shift = 5 ft).
- Click an item to edit its **name (required), type, zone, status, linked machine, size and notes**. Use **Add item** and **Delete item** to add or remove items.
- Edits autosave in your browser (localStorage, per level). The toolbar says whether your edits differ from the file and shows live error/warning counts. **Reset** goes back to the file.

The editor is loaded with a dynamic `import()` behind `import.meta.env.DEV` (see [`src/main.jsx`](src/main.jsx)), so it is not part of `npm run build`. To check: `npm run build && grep -r LAYOUT_EDITOR_MARKER dist/` should print nothing.

### Adding a video

Videos follow the Spec 02 policy: only for machines where form is non-obvious or easy to get wrong. In `gymData.js`:

```js
video: { youtubeId: 'abc123', source: 'zach', title: 'Leg press with Coach Zach', cues: ['Feet hip-width', 'Knees track over toes'] },
```

- `source: 'zach'` shows the **Coach Zach** label and lists `cues` under the video; `'external'` is someone else's video.
- Check the ID first: `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json` returns 200 for a real, embeddable video.
- No `video` means no video card (there is no YouTube search fallback). Removed IDs are listed in [`docs/machine-sources.md`](docs/machine-sources.md).

## Deploy to GitHub Pages

1. Push this repo to GitHub with `main` as the default branch.
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push to `main`, or run the workflow by hand. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds with `npm ci && npm run build` and publishes `dist/`.
4. The site will be at `https://<user>.github.io/<repo>/`. For this repo that's https://zacharyflechas.github.io/unf-gym-map/.

### Vite `base` note

Project Pages sites are served from a sub-path (`/<repo>/`), so built asset URLs must include it. The workflow builds with `VITE_BASE=/${{ github.event.repository.name }}/`, which is `/unf-gym-map/` for this repo. [`vite.config.js`](vite.config.js) reads that variable, and falls back to `'./'` (relative paths) for local builds. If you fork or rename the repo, the workflow picks up the new name automatically. For a user/org site (`<user>.github.io`) or a custom domain, use `VITE_BASE=/`.

Live prototype: https://zacharyflechas.github.io/unf-gym-map/

## Screenshots

`npm run screenshots` uses `playwright-core` with a locally installed Chrome (`CHROME_PATH`, default `/usr/bin/google-chrome`). It expects `npm run preview` to be running on port 4173. Output goes to [`screenshots/`](screenshots/).
`npm run demo` records demo videos (`screenshots/demo-desktop.webm` and `screenshots/demo-mobile.webm`, which git ignores). It needs Playwright's ffmpeg, installed once with `npx playwright-core install ffmpeg`.

## Stack

React 19 + Vite 8 in plain JavaScript, with one plain CSS file (`src/styles.css`, colors in CSS variables: navy `#004B87` and grays). There are no UI libraries and no backend.

## Video credits

Each tutorial embed belongs to its YouTube creator: Naomi Kong, Planet Fitness, Concept2, Matrix Fitness, Morgan M.S. CPT, NASM, ATHLEAN-X, Max Euceda, Sewell Fitness, The Muscle Mentors, Onnit, Buff Dudes, and ScottHermanFitness. The how-to text in this app is general guidance, not medical advice.
