# Rec Center Gym Map (UNF prototype)

An interactive, mobile-friendly gym floor map for students. Tap a machine to see the muscles it works, short how-to steps, tips, and an embedded YouTube tutorial.

> **Prototype:** the layout is an example, **not** the actual UNF Student Wellness / Rec Center floor plan. It is not affiliated with or endorsed by UNF, and it uses no UNF logos.

![Desktop map](screenshots/01-desktop-map.png)

## Features

- Top-down SVG floor map with zones (Cardio, Selectorized Machines, Racks & Benches, Cable Station, Free Weights) and clickable machine markers (mouse, touch, and keyboard: Tab + Enter).
- Detail panel: a right-hand drawer on desktop and a bottom sheet on phones. It shows primary/secondary muscles, how-to steps, tips, and a privacy-enhanced `youtube-nocookie.com` embed. If a machine has no `youtubeId`, the panel shows a YouTube search link instead.
- Search by machine name, zone, or muscle, plus one-tap muscle-group chips. Matching machines are highlighted on the map with a gold ring and the rest are dimmed.
- A machine list under the map for big, easy tap targets on phones. On narrow screens the map scrolls sideways.
- Deep links: the URL hash holds the open machine (e.g. `…/#leg-press`). You could print these as QR codes and stick them on the real machines.
- No backend: it builds to a static site.
- Motion, all in plain CSS (transform/opacity only, no animation library):
  - **Load sequence:** the zones fade in, then markers pop in one after another.
  - **Search matches:** a soft gold glow pulses around them. The glow is a radial gradient, not an animated blur filter.
  - **Zoom on tap:** the map zooms and pans toward the tapped machine and zooms back out when the panel closes. This is a CSS transform tween on a wrapper, so the horizontal scroll and tap targets still work. On phones the page also scrolls so the zoomed map shows above the bottom sheet.
  - **Panel:** the drawer (desktop) or bottom sheet (phone) springs in using CSS `linear()` spring easing, with a cubic-bezier fallback for older browsers. The backdrop fades.
  - **Hover lift:** on desktop, markers lift and tilt on hover. This only applies under `@media (hover: hover) and (pointer: fine)`.
  - **Reduced motion:** with `prefers-reduced-motion: reduce`, all of the above is turned off and the map doesn't zoom.

## Run locally

Requires Node 20.19+ (or 22+).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve dist/ at http://localhost:4173
```

## Edit the gym data

**All content lives in one file: [`src/data/gymData.js`](src/data/gymData.js).** You don't need to touch any component to change the layout.

The map uses a **1000 × 700** coordinate grid. `x` runs from the left wall (0) to the right wall (1000). `y` runs from the back wall (0) to the entrance side (700).

- `ZONES`: rectangles `{ id, name, x, y, width, height, color }`.
- `MACHINES`: one object per machine:

```js
{
  id: 'leg-press',            // unique, URL-safe (used in #hash links)
  name: 'Leg Press',
  short: 'LP',                // 2–4 chars drawn inside the marker
  zone: 'machines',           // must match a ZONES id
  x: 100, y: 280,             // marker center on the 1000×700 grid
  muscles: { primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Calves'] },
  steps: ['…', '…'],
  tips: ['…'],
  youtubeId: 'sp5lOlwj0mI',   // or null → shows a "Search YouTube" link
  youtubeSearch: '…',         // optional custom search text when youtubeId is null
}
```

- `MUSCLE_GROUPS`: the filter chips. Use the same spellings in `muscles` so the chips match.

To drop in the real UNF layout:

1. Sketch the floor on the 1000×700 grid. A photo of the posted floor plan with a grid overlay works well.
2. Update `ZONES`.
3. Move, add, or remove `MACHINES` entries.

**Adding a video:** check that the ID exists by opening
`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json`.
It returns 200 for a real, embeddable video and 401/404 otherwise. If you're not sure about a video, set `youtubeId: null`.

## Deploy to GitHub Pages

1. Push this repo to GitHub with `main` as the default branch.
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push to `main`, or run the workflow by hand. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds with `npm ci && npm run build` and publishes `dist/`.
4. The site will be at `https://<user>.github.io/<repo>/`.

### Vite `base` note

Project Pages sites are served from a sub-path (`/<repo>/`), so asset URLs have to account for it. In [`vite.config.js`](vite.config.js), `base` defaults to `'./'` (relative paths), which works under any sub-path without changes. If you'd rather use absolute paths, either:

- set `base: '/<repo-name>/'` in `vite.config.js`, or
- build with `VITE_BASE=/<repo-name>/ npm run build`. The workflow has a commented-out `env` line for this.

For a user/org site (`<user>.github.io`) or a custom domain, `'/'` also works.

## Screenshots

`npm run screenshots` uses `playwright-core` with a locally installed Chrome (`CHROME_PATH`, default `/usr/bin/google-chrome`). It expects `npm run preview` to be running on port 4173. Output goes to [`screenshots/`](screenshots/).
`npm run demo` records demo videos (`screenshots/demo-desktop.webm` and `screenshots/demo-mobile.webm`, which git ignores). It needs Playwright's ffmpeg, installed once with `npx playwright-core install ffmpeg`.

## Stack

React 19 + Vite 8 in plain JavaScript, with one plain CSS file (`src/styles.css`, colors in CSS variables: navy `#004B87` and grays). There are no UI libraries and no backend.

## Video credits

Each tutorial embed belongs to its YouTube creator: Naomi Kong, Planet Fitness, Concept2, Matrix Fitness, Morgan M.S. CPT, NASM, ATHLEAN-X, Max Euceda, Sewell Fitness, The Muscle Mentors, Onnit, Buff Dudes, and ScottHermanFitness. The how-to text in this app is general guidance, not medical advice.
