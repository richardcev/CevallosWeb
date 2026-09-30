import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Set SITE_URL to override the public origin in other environments.
export default defineConfig({
  site: process.env.SITE_URL || 'https://cevallosweb.com',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
