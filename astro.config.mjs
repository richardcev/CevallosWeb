import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Set SITE_URL to the final public origin before deployment.
export default defineConfig({
  site: process.env.SITE_URL || 'https://softagile.net',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
