/**
 * Post-build hook for Vercel deployment
 * Ensures /sitemap.xml is dynamically served via /api/sitemap serverless function
 * rather than being shadowed by a static snapshot in dist/.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distSitemap = path.resolve(__dirname, '../dist/sitemap.xml');

if (fs.existsSync(distSitemap)) {
  fs.unlinkSync(distSitemap);
  console.log('[Postbuild] Removed dist/sitemap.xml so Vercel routes /sitemap.xml dynamically to /api/sitemap');
} else {
  console.log('[Postbuild] dist/sitemap.xml is clean (dynamic routing active).');
}
