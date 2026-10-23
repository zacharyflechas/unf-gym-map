/**
 * Pan & zoom for an <svg> whose units are feet. Hand-written (no library): it only changes the
 * svg's viewBox, so the map stays sharp at every zoom and the rest of the code keeps using feet.
 *
 *   camera = { cx, cy, scale }  → the point (feet) at the center of the map, and pixels per foot.
 *
 * Mouse: drag to pan, wheel to zoom. Touch: one finger pans, two fingers pinch.
 * Keyboard (when the map has focus): arrows pan, + / - zoom, 0 resets.
 * A press that moves more than DRAG_PX counts as a drag; wasDrag() lets taps ignore it.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const DRAG_PX = 6; // movement before a press becomes a pan instead of a tap
const MAX_ZOOM = 10; // how far you can zoom in, compared with the whole-floor view
const BUTTON_STEP = 1.6; // zoom factor for the + / - buttons and keys
const KEY_PAN_PX = 60;
const ANIMATE_MS = 350;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function usePanZoom(home) {
  const svgRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 }); // the svg's size on screen, in pixels
  const [camera, setCamera] = useState(null);
  const cameraRef = useRef(null); // same as `camera`, readable inside event handlers without re-binding
  const pointers = useRef(new Map()); // pointerId → last { x, y } while pressed
  const press = useRef({ startX: 0, startY: 0, dragging: false });
  const lastDrag = useRef(false);
  const animation = useRef(0);

  const fitScale = size.w && size.h ? Math.min(size.w / home.width, size.h / home.height) : 1;

  // Keep the camera inside sensible limits: never smaller than the whole floor, and an edge of the
  // floor can't be pulled past the edge of the map. (If the floor is narrower than the map, center it.)
  const limit = useCallback(
    (c) => {
      const scale = clamp(c.scale, fitScale, fitScale * MAX_ZOOM);
      const halfW = size.w / 2 / scale; // half the visible width, in feet
      const halfH = size.h / 2 / scale;
      const keepIn = (center, start, length, half) =>
        2 * half >= length ? start + length / 2 : clamp(center, start + half, start + length - half);
      return {
        scale,
        cx: keepIn(c.cx, home.x, home.width, halfW),
        cy: keepIn(c.cy, home.y, home.height, halfH),
      };
    },
    [fitScale, home, size],
  );

  const setCam = useCallback(
    (c) => {
      cancelAnimationFrame(animation.current);
      const next = limit(c);
      cameraRef.current = next;
      setCamera(next);
    },
    [limit],
  );

  const homeCamera = useCallback(
    () => ({ cx: home.x + home.width / 2, cy: home.y + home.height / 2, scale: fitScale }),
    [home, fitScale],
  );

  /** Glide to a camera (instant with reduced motion). */
  const animateTo = useCallback(
    (target) => {
      const from = cameraRef.current;
      const to = limit(target);
      if (!from || reducedMotion()) return setCam(to);
      cancelAnimationFrame(animation.current);
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / ANIMATE_MS);
        const e = 1 - (1 - t) ** 3; // ease-out
        const c = {
          cx: from.cx + (to.cx - from.cx) * e,
          cy: from.cy + (to.cy - from.cy) * e,
          scale: from.scale + (to.scale - from.scale) * e,
        };
        cameraRef.current = c;
        setCamera(c);
        if (t < 1) animation.current = requestAnimationFrame(step);
      };
      animation.current = requestAnimationFrame(step);
    },
    [limit, setCam],
  );

  // Measure the svg, and fit the whole floor when the size or the floor (level) changes.
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const measure = () => setSize({ w: svg.clientWidth, h: svg.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (size.w && size.h) setCam(homeCamera());
  }, [size.w, size.h, homeCamera, setCam]);

  /** Zoom by `factor`, keeping the point under (px, py) (pixels inside the svg) in place. */
  const zoomAt = useCallback(
    (factor, px = size.w / 2, py = size.h / 2) => {
      const c = cameraRef.current;
      if (!c) return;
      const fx = c.cx + (px - size.w / 2) / c.scale; // the feet position under the pointer
      const fy = c.cy + (py - size.h / 2) / c.scale;
      const scale = clamp(c.scale * factor, fitScale, fitScale * MAX_ZOOM);
      setCam({ scale, cx: fx - (px - size.w / 2) / scale, cy: fy - (py - size.h / 2) / scale });
    },
    [size, fitScale, setCam],
  );

  const panBy = useCallback(
    (dxPx, dyPx) => {
      const c = cameraRef.current;
      if (c) setCam({ ...c, cx: c.cx - dxPx / c.scale, cy: c.cy - dyPx / c.scale });
    },
    [setCam],
  );

  // Wheel zoom needs a non-passive listener so the page doesn't scroll at the same time.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e) => {
      e.preventDefault();
      const box = svg.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - box.left, e.clientY - box.top);
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  // ---------- pointer handlers (mouse, pen and touch all arrive as pointer events) ----------
  function onPointerDown(e) {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      press.current = { startX: e.clientX, startY: e.clientY, dragging: false };
      lastDrag.current = false;
    }
  }

  function onPointerMove(e) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const now = { x: e.clientX, y: e.clientY };

    if (pointers.current.size === 1) {
      const p = press.current;
      if (!p.dragging && Math.hypot(now.x - p.startX, now.y - p.startY) > DRAG_PX) {
        p.dragging = true;
        lastDrag.current = true;
        // Capture only once it's a drag, so a plain tap still lands on the item underneath.
        svgRef.current.setPointerCapture(e.pointerId);
      }
      if (p.dragging) panBy(now.x - prev.x, now.y - prev.y);
    } else if (pointers.current.size === 2) {
      // Pinch: zoom by how much the finger distance changed, around the point between the fingers.
      const [other] = [...pointers.current.entries()].filter(([id]) => id !== e.pointerId).map(([, pt]) => pt);
      const before = Math.hypot(prev.x - other.x, prev.y - other.y);
      const after = Math.hypot(now.x - other.x, now.y - other.y);
      const box = svgRef.current.getBoundingClientRect();
      if (before > 0) zoomAt(after / before, (now.x + other.x) / 2 - box.left, (now.y + other.y) / 2 - box.top);
      lastDrag.current = true;
    }
    pointers.current.set(e.pointerId, now);
  }

  function onPointerUp(e) {
    pointers.current.delete(e.pointerId);
  }

  function onKeyDown(e) {
    const keys = {
      ArrowLeft: () => panBy(KEY_PAN_PX, 0),
      ArrowRight: () => panBy(-KEY_PAN_PX, 0),
      ArrowUp: () => panBy(0, KEY_PAN_PX),
      ArrowDown: () => panBy(0, -KEY_PAN_PX),
      '+': () => zoomAt(BUTTON_STEP),
      '=': () => zoomAt(BUTTON_STEP),
      '-': () => zoomAt(1 / BUTTON_STEP),
      0: () => animateTo(homeCamera()),
    };
    if (!keys[e.key]) return;
    e.preventDefault();
    keys[e.key]();
  }

  const wasDrag = useCallback(() => lastDrag.current, []);

  const c = camera ?? homeCamera();
  const viewBox = size.w
    ? `${c.cx - size.w / 2 / c.scale} ${c.cy - size.h / 2 / c.scale} ${size.w / c.scale} ${size.h / c.scale}`
    : `${home.x} ${home.y} ${home.width} ${home.height}`;

  return {
    svgRef,
    viewBox,
    scale: c.scale, // pixels per foot right now
    zoomFactor: c.scale / fitScale, // 1 = whole floor
    size,
    camera: cameraRef,
    zoomIn: () => zoomAt(BUTTON_STEP),
    zoomOut: () => zoomAt(1 / BUTTON_STEP),
    reset: () => animateTo(homeCamera()),
    animateTo,
    wasDrag,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onKeyDown },
  };
}
