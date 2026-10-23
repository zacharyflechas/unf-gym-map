# dev-assets (not committed, not published)

Put `plan-2f-straightened.jpg` here: the straightened official 2nd-floor plan (5 px = 1 ft, same origin as `src/data/base-2f.json`).
The dev-only layout editor (`npm run dev`, then `?edit=1`) shows it as a see-through underlay.

The plan was given to us by UNF, so it stays out of git and out of `dist/`. Everything in this folder except this README is git-ignored, and nothing here is in `public/`, so `npm run build` never copies it.
