/* global process */
/**
 * Dynamic Vercel Serverless Function: /api/sitemap
 * Generates an up-to-the-minute XML sitemap querying live MongoDB events and static routes.
 */

const BASE_URL = 'https://gdgocsati.vercel.app';

const BACKEND_URLS = [
  process.env.VITE_API_URL,
  'https://gdgocsatibackend.vercel.app/api',
  'http://localhost:5000/api',
].filter(Boolean);

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

// Fallback seed event slugs in case backend is temporarily unreachable
const SEED_EVENT_SLUGS = [
  'gdgoc-sati-recruitment-2026',
  'google-cloud-study-learn-2026',
  'hands-on-workshop-dive-into-computer-vision',
  'hack-verse-hackathon-2026',
  'devfest-bhopal-2025',
  'genesis-hackathon',
  'google-cloud-study-jam-kick-off',
  'gdg-on-campus-kick-off',
  'tech-winter-break-gdgsati-web-development',
  'machine-learning-workshop',
  'cloud-skills-kickoff',
  'gdgc-info-session-and-gen-ai-study-jam',
];

/**
 * Fetch live events from MongoDB backend with timeout
 */
async function fetchLiveEvents() {
  for (const backend of BACKEND_URLS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const endpoint = `${backend.replace(/\/$/, '')}/events`;
      const res = await fetch(endpoint, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch {
      // Try next backend candidate
    }
  }
  return null;
}

/**
 * Build XML sitemap string
 */
export async function buildSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const urlMap = new Map();

  // 1. Static canonical routes
  STATIC_ROUTES.forEach((route) => {
    const loc = route.path ? `${BASE_URL}/${route.path}` : `${BASE_URL}/`;
    urlMap.set(loc, {
      loc,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  });

  // 2. Fetch live events from DB
  const liveEvents = await fetchLiveEvents();

  if (liveEvents && liveEvents.length > 0) {
    liveEvents.forEach((ev) => {
      const slug = ev.slug || ev.id || ev._id;
      if (!slug) return;

      const loc = `${BASE_URL}/events/${slug}`;
      const lastmod = ev.updatedAt
        ? new Date(ev.updatedAt).toISOString().split('T')[0]
        : today;

      urlMap.set(loc, {
        loc,
        lastmod,
        changefreq: 'weekly',
        priority: '0.85',
      });
    });
  } else {
    // Fallback to seed events if backend was unreachable
    SEED_EVENT_SLUGS.forEach((slug) => {
      const loc = `${BASE_URL}/events/${slug}`;
      urlMap.set(loc, {
        loc,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.85',
      });
    });
  }

  const urls = Array.from(urlMap.values());

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

  return { xml: xml.trim() + '\n', count: urls.length };
}

export default async function handler(req, res) {
  // Allow GET and HEAD methods
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', ['GET', 'HEAD']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const isRefresh = req.query?.refresh === '1' || req.query?.refresh === 'true';
    const { xml, count } = await buildSitemap();

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Sitemap-Entries', String(count));

    if (isRefresh) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    } else {
      // 5-minute CDN edge cache with 10-minute stale-while-revalidate
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600');
    }

    return res.status(200).send(xml);
  } catch (err) {
    console.error('[Dynamic Sitemap API Error]:', err);
    return res.status(500).json({ error: 'Failed to generate dynamic sitemap' });
  }
}
