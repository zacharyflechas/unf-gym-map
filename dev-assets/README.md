# dev-assets (not committed, not published)

Underlay images for the dev-only layout editor (`npm run dev`, then `?edit=1`). Every `.jpg`, `.png` or `.webp` in this folder shows up in the editor's **Underlay** dropdown.

- `plan-2f-straightened.jpg`: the straightened official 2nd-floor plan (5 px = 1 ft, same origin as `src/data/base-2f.json`). It lines up automatically.
- Anything else (photos stitched top-down, a LiDAR top-down export, …): pick it in the dropdown, then line it up with the x / y / width (ft) boxes.

The plan was given to us by UNF, so it stays out of git and out of `dist/`. Everything in this folder except this README is git-ignored, and nothing here is in `public/`, so `npm run build` never copies it.
