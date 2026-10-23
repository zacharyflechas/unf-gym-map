# Spec 01: Layout Stage A (accurate base map + sketch layout as data + dev-only editor)

Status: **Approved 2026-10-20 (by Zach)** · Target: Stage A live on GitHub Pages by **Sun 10/25** · Covers plan Phases 1–3 (Stage A only)

## Goal
Replace the guessed 1000×700 layout with a real floor outline traced from the official 2nd-floor plan, plus every item from Zach's sketch stored **as data in feet**. Ship it labeled approximate, and give Zach a local editor so he can fix positions himself (from memory, or standing in the gym) without touching component code.

## Scope
1. **Base map** (`src/assets/base-2f.svg`, plus `columns-2f.json` for reference): rec-area outline, rooms, stairs, balcony, and 37 structural columns as anchors. Units are feet. The scale is an ESTIMATE until Zach tapes one wall; after that it's a one-number rescale.
2. **Layout as data**: `src/data/layout-2f.json`, with items `{ id, name, type, zone, x, y, rotation, width, depth, status, notes }` (feet; `status` is `guess | sketch | photo-verified | scan-verified`). The map renders only from this file. An optional `machineId` links an item to its existing content (muscles, steps, video) in `gymData.js`. Items without content still render and can be tapped.
3. **Rendering**: GymMap draws the base SVG and the items (rotated rects, sized in feet), with `viewBox` in feet. Search, selection, and the detail panel keep working. `status` is stored in the data but not styled publicly (per Spec 02's "remove confidence notes").
4. **Public note**: a small, always-visible "Layout approximate, being verified" note on the live site. It replaces the current "Draft layout… based on public info" banner text and stays until Stage C sign-off.
5. **Dev-only editor at `?edit=1`**: drag to move, a rotate handle, arrow keys to nudge (Shift = bigger step), a toggle for a semi-transparent underlay of the straightened official plan, click an item to edit `status` / `notes`, and an **Export JSON** button that downloads `layout-2f.json`. It loads only when `import.meta.env.DEV && ?edit=1`, through a dynamic `import('./editor/LayoutEditor.jsx')`, so Vite tree-shakes it out of `vite build`.
6. **Underlay image stays out of `dist`**: the plan image is UNF-provided, so it lives outside `public/` (e.g. `dev-assets/`) and is imported only by the editor module. It's never published unless Zach confirms that's OK.

## Non-goals
Photo, LiDAR, or scan verification (Stage C, Phases 4–5). The design pass, tokens, pan/zoom, icons, and dark mode (Spec 02). The 3rd-floor track. New machine content. A public or production editor. Committing the official plan image.

## Acceptance checklist
- [ ] Map renders from `src/data/layout-2f.json` (positions in feet, `status` on every item); moving an item = a data-only diff
- [ ] Outline, stairs, and columns line up with the official plan (side-by-side image in the PR)
- [ ] "Layout approximate, being verified" note is visible on desktop and on 390px mobile
- [ ] `npm run dev` + `?edit=1`: drag, rotate, nudge, underlay toggle, status/notes edit, and Export JSON all work; the exported file round-trips (re-import renders the same layout)
- [ ] Without `?edit=1` (or in a prod build), no editor UI appears
- [ ] `npm run build` then `grep -r "LAYOUT_EDITOR_MARKER" dist/` returns nothing (the editor carries that marker string)
- [ ] `dist/` contains no official-plan image (`ls -R dist | grep -i plan` is empty)
- [ ] Existing search, detail panel, keyboard access, and reduced-motion behavior are unchanged
- [ ] Not-affiliated-with-UNF note still present

## Test plan
- Screenshots (desktop + 390px): the live map, and the editor with the underlay on and off
- Build check: the grep/ls commands above go in the PR description with their output
- Manual pass: move 3 items, rotate 1, export, replace the JSON, reload, confirm same positions
- Bundle size before/after (the prod build should not grow by the editor)

## Risks
- **Scale is an estimate** (28 ft column bay; the traced rec area is ~30,400 sq ft vs the legend's 28,921, +5%), so labels and sizes may be off. Fix: one taped wall, then a single rescale factor in the data.
- **Sketch isn't to scale**: 106 of 168 items are `guess`. Fix: Zach answers the 20 questions, then adjusts in the editor.
- **The editor leaking into prod**: fix with the DEV gate + dynamic import + the grep check in CI.
- **Plan image licensing**: kept dev-only. Open question: is publishing the *traced outline* (not the image) OK? I'll assume yes unless Zach says otherwise.
- **Data migration**: zone/machine ids in `gymData.js` need mapping to the new items; I'll keep a small mapping table and list unmapped items in the PR.

## Process
1. Zach approves this spec, then the bot codes. Nothing is coded before approval.
2. Two small PRs, opened by the bot: **(a)** base map + `layout-2f.json` rendering + public note, **(b)** the dev-only editor (a good learning PR). Zach reviews and merges; the bot never merges.
3. Each PR comes with a "what to check" walkthrough: (a) data shape + GymMap render path + note text; (b) the DEV gate and dynamic import, the drag/rotate math, the export function, and proof the editor isn't in `dist`.
4. After merge: Zach edits from memory in `?edit=1`, exports the JSON, the bot opens a data-only PR, Zach merges, and Pages deploys Stage A.
