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
  { path: 'privacy', priority: '0.3', changefreq: 'yearly' },
  { path: 'terms', priority: '0.3', changefreq: 'yearly' },
];

/**
 * Fetch all unique event slugs from both local static data and live backend API
 */
export async function getAllEventSlugs() {
  const slugSet = new Set();

  // 1. Static seed events
  eventsData.forEach((ev) => {
    const slug = ev.slug || ev.id;
    if (slug) slugSet.add(slug);
  });

  // 2. Live MongoDB API events (if backend is running)
  try {
    const res = await fetch('http://localhost:5000/api/events');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        json.data.forEach((ev) => {
          const slug = ev.slug || ev.id || ev._id;
          if (slug) slugSet.add(slug);
        });
      }
    }
  } catch {
    // Backend offline during build; using static seed events
  }

  return Array.from(slugSet);
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
  const eventSlugs = await getAllEventSlugs();
  eventSlugs.forEach((slug) => {
    urls.push({
      loc: `${BASE_URL}/events/${slug}`,
      lastmod: today,
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
