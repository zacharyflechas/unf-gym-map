import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` controls the URL prefix for built assets.
// - The GitHub Pages workflow builds with VITE_BASE=/unf-gym-map/ (the repo name),
//   because project Pages sites are served from https://<user>.github.io/<repo>/.
// - Locally it defaults to './' (relative asset paths), so `npm run dev` / `preview`
//   work at the server root and the build also works from any sub-path.
// Override any time: VITE_BASE=/unf-gym-map/ npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || './',
});
