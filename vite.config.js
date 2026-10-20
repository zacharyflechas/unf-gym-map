import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` controls the URL prefix for built assets.
// - './' (default here) produces relative asset paths, which works on GitHub
//   Pages project sites (https://<user>.github.io/<repo>/) and most static hosts.
// - If you prefer absolute paths, set it to '/<your-repo-name>/', e.g. '/unf-gym-map/'.
// You can also override at build time: VITE_BASE=/unf-gym-map/ npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || './',
});
