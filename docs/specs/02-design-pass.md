# Spec 02: Design pass (Tier A + pan/zoom, floor toggle, icons, muscle diagram, tap-to-load video, dark mode)

Status: **Approved 2026-10-20 (by Zach)** · Target: PR by Sun 11/1 · Builds after the layout rebuild (Spec 01) merges

## Goal
Give the gym map one consistent, professional visual identity and three high-value features, while keeping it fast (Lighthouse 90+ mobile for performance and accessibility) and small enough that Zach can explain every line.

## Scope
1. **Design tokens**: one `tokens.css` with CSS variables for color, spacing scale, radius, shadows, type sizes. One brand color + gold reserved for active/match states. System font stack (decided; no web fonts).
2. **Zone legend filter**: color-coded legend; tapping a zone highlights that zone and dims others; works with search.
3. **Dot-grid floor texture + entrance label**: pure CSS/SVG pattern, no JS.
4. **Detail panel as cards**: muscles, video, how-to, tips as distinct cards with consistent spacing.
5. **Muscle diagram**: front/back body SVG; the machine's primary muscles filled with the strong color, secondary with a lighter tint. Driven by the existing `muscles` data (one mapping table from muscle name to SVG region).
6. **Tap-to-load video**: show YouTube thumbnail + play button; load the `youtube-nocookie` iframe only on tap.
7. **Pan & zoom map (DeskFlow-style)**: drag to pan, pinch/scroll-wheel/buttons to zoom, reset-view button; machine tap still works; keyboard zoom buttons. Prefer a small, well-known library (e.g. react-zoom-pan-pinch) over hand-rolled gestures; justify size.
8. **Level toggle**: switch between 2nd-floor gym (DDFC) and 3rd-floor track/overlook; each level has its own SVG and data; selection kept in URL.
9. **Simple machine icons**: ~6-8 lightweight inline SVG icons by machine type (cardio, selectorized, plate-loaded, rack, cable, dumbbells, rig, mat).
10. **Dark mode**: follows system setting with a manual toggle (saved in localStorage); both themes pass AA contrast.
11. **Accessibility**: visible focus rings, 44px min tap targets, WCAG AA contrast, screen-reader live count of matches ("6 machines match Glutes").

## Non-goals
Route line, draggable bottom sheet, tilt/3D view, analytics (separate spec), layout/position changes (Spec 01), new content.

## Acceptance checklist
- [ ] All colors/spacing come from `tokens.css` (no stray hex values in components)
- [ ] Legend filter + search combine correctly; clearing resets
- [ ] Every machine shows a muscle diagram matching its data
- [ ] Only machines on the video list show a video; others show none (no fallback link)
- [ ] Video data supports `source: "zach"` + cues and renders them
- [ ] No YouTube iframe/network requests until a video is tapped
- [ ] Lighthouse mobile: performance ≥ 90, accessibility ≥ 90
- [ ] Keyboard: every machine, chip, legend item reachable and operable
- [ ] Reduced-motion still respected
- [ ] JS bundle growth ≤ 25 kB gzip (pan/zoom lib included)
- [ ] Pan/zoom works with touch, mouse, and keyboard; taps on machines never misfire after a drag
- [ ] Level toggle switches floors and is linkable
- [ ] Light and dark themes both pass AA contrast
- [ ] Not-affiliated-with-UNF note still present; no UNF logos

## Test plan
- Screenshot set (desktop + 390px mobile): map, legend filter active, detail panel w/ diagram, video before/after tap
- Lighthouse run (mobile) before and after, scores in the PR
- Network check: zero youtube requests on initial load
- Manual keyboard pass + axe accessibility scan

## Risks
- Muscle SVG could be heavy or look amateur → use a simple, lightweight outline; review screenshots before polish
- Token refactor touches many files → big diff; I'll group the PR walkthrough by file purpose
- Pan/zoom vs. tap conflicts on phones, and its bundle cost → test on 390px touch emulation, compare library sizes
- Track level content is thin (it's mostly a running loop) → keep it simple: track, lanes/direction, stairs, overlook
- Legend + search interaction logic → keep it in one small hook with tests

## Open questions for Zach
1. ~~Brand color~~ DECIDED: Osprey Navy. Light: bg #F5F7FA, surface #FFFFFF, text #0F1B2D, brand #0B4F9C, accent/gold #F2B705, muted #C9D3E0. Dark: bg #0B1220, surface #152035, text #E6ECF5, brand #4C9BFF, accent #FFC933, muted #2A3A55. Gold only for active/match states.
2. ~~Font~~ DECIDED: system font stack (no web font download).
3. ~~Bloat~~ DECIDED (see Removals below).

## Removals & changes (decided by Zach 2026-10-20)
- Remove per-machine confidence/source notes from the UI (keep sources in docs/ only).
- Remove the "Draft layout… Help us fix it!" banner once the layout is verified (Spec 01).
- Remove the muscle filter chip row (search + zone legend cover it).
- Search-match highlight becomes a still gold glow (no pulse).
- Machine list moves behind a "List view" button (not always shown under the map).

## Video policy (decided)
- Videos only for machines where form is non-obvious or easy to get wrong (e.g. racks/squat, bench, deadlift platforms, cable station, Smith-type/plate-loaded, leg press, lat pulldown, rows, Synergy 360). No videos for treadmill, bike, elliptical, step mill, rower basics, stretch areas, etc.; those show steps/tips only.
- Data model: `video` is optional and becomes an object `{ youtubeId, source: "zach" | "external", cues?: string[] }` so Zach's own tutorials (with his coaching cues) can replace external ones later without code changes. UI shows a small "Coach Zach" label for his own videos and lists the cues under the video.
- No YouTube search-link fallback for machines without videos.
