import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Local-first resume builder. The editor is a client-only React island;
// the surrounding Astro pages stay static for SEO.
export default defineConfig({
  site: 'https://lasthitcv.com',
  integrations: [react()],
  vite: {
    // @react-pdf/renderer references `global` in its browser bundle.
    define: { global: 'globalThis' },
  },
});
