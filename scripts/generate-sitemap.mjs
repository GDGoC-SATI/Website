/**
 * Dynamic Sitemap Generator for GDGoC SATI Vidisha
 * Generates public/sitemap.xml dynamically with all static and dynamic event routes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { eventsData } from '../src/data/eventsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BASE_URL = 'https://gdgocsati.vercel.app';

export const STATIC_ROUTES = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: 'events', priority: '0.95', changefreq: 'daily' },
  { path: 'projects', priority: '0.9', changefreq: 'weekly' },
  { path: 'team', priority: '0.85', changefreq: 'monthly' },
  { path: 'gallery', priority: '0.85', changefreq: 'weekly' },
  { path: 'about', priority: '0.8', changefreq: 'monthly' },
  { path: 'alumni', priority: '0.8', changefreq: 'monthly' },
  { path: 'contact', priority: '0.7', changefreq: 'monthly' },
  { path: 'brand', priority: '0.8', changefreq: 'monthly' },
  { path: 'privacy', priority: '0.3', changefreq: 'yearly' },
  { path: 'terms', priority: '0.3', changefreq: 'yearly' },
];

const BACKEND_URLS = [
  process.env.VITE_API_URL,
  'https://gdgocsatibackend.vercel.app/api',
  'http://localhost:5000/api',
].filter(Boolean);

/**
 * Fetch all unique event entries from both local static data and live backend API
 */
export async function getAllEventEntries() {
  const eventMap = new Map();

  // 1. Static seed events
  eventsData.forEach((ev) => {
    const slug = ev.slug || ev.id;
    if (slug) {
      eventMap.set(slug, {
        slug,
        lastmod: ev.updatedAt ? new Date(ev.updatedAt).toISOString().split('T')[0] : null,
      });
    }
  });

  // 2. Live MongoDB API events (try production backend first, then local)
  for (const backend of BACKEND_URLS) {
    try {
      const endpoint = `${backend.replace(/\/$/, '')}/events`;
      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          json.data.forEach((ev) => {
            const slug = ev.slug || ev.id || ev._id;
            if (slug) {
              eventMap.set(slug, {
                slug,
                lastmod: ev.updatedAt ? new Date(ev.updatedAt).toISOString().split('T')[0] : null,
              });
            }
          });
          break; // Successfully loaded from live DB
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  return Array.from(eventMap.values());
}

/**
 * Fetch all unique event slugs (backward compatibility)
 */
export async function getAllEventSlugs() {
  const entries = await getAllEventEntries();
  return entries.map((e) => e.slug);
}

/**
 * Build the full list of canonical URLs
 */
export async function getAllUrls() {
  const urls = [];
  const today = new Date().toISOString().split('T')[0];

  // Static Pages
  STATIC_ROUTES.forEach((route) => {
    const loc = route.path ? `${BASE_URL}/${route.path}` : `${BASE_URL}/`;
    urls.push({
      loc,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  });

  // Dynamic Event Pages
  const eventEntries = await getAllEventEntries();
  eventEntries.forEach((ev) => {
    urls.push({
      loc: `${BASE_URL}/events/${ev.slug}`,
      lastmod: ev.lastmod || today,
      changefreq: 'weekly',
      priority: '0.85',
    });
  });

  return urls;
}

/**
 * Generates and writes public/sitemap.xml
 */
export async function generateSitemap() {
  const urls = await getAllUrls();
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- Generated dynamically on ${today} with ${urls.length} verified pages -->
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, xml.trim() + '\n', 'utf8');
  console.log(`[Sitemap] Generated public/sitemap.xml successfully with ${urls.length} URLs!`);
  return urls;
}

// Auto-execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemap().catch((err) => {
    console.error('[Sitemap] Failed to generate sitemap:', err);
    process.exit(1);
  });
}
