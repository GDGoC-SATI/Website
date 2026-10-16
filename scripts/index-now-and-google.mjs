/**
 * Automated Search Engine Indexing Engine for GDGoC SATI Vidisha
 * Integrates:
 * 1. Microsoft IndexNow (Bing, Yahoo, Yandex, Seznam, Naver)
 * 2. Google Indexing API (URL_UPDATED notifications via Google Service Account)
 * 3. Search Console Sitemap Ping
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getAllUrls } from './generate-sitemap.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
export const HOST = 'gdgocsati.vercel.app';
export const BASE_URL = `https://${HOST}`;
export const INDEXNOW_KEY = 'b2fd1b8f90b04d08b51ec21945b9658f';
export const INDEXNOW_KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

export const SERVICE_ACCOUNT_CANDIDATES = [
  path.resolve(__dirname, '../gdgocsati-5d1c1a694067.json'),
  path.resolve(__dirname, '../../gdg-backend/gdgocsati-5d1c1a694067.json'),
  path.resolve(__dirname, '../service_account.json'),
  path.resolve(__dirname, '../../gdg-backend/service_account.json'),
];

export function findServiceAccountFile() {
  for (const candidate of SERVICE_ACCOUNT_CANDIDATES) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function base64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

/**
 * 1. Google OAuth2 JWT Bearer Token Generator
 */
async function getGoogleAccessToken() {
  let key;

  // 1. Check environment variable (recommended for cloud/Vercel/CI)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      key = JSON.parse(raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8'));
    } catch (e) {
      console.warn('[Google Auth] Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY env var:', e.message);
    }
  }

  // 2. Check local .env file in frontend or backend
  if (!key) {
    const envPaths = [
      path.resolve(__dirname, '../.env'),
      path.resolve(__dirname, '../../gdg-backend/.env'),
    ];
    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf8');
        const match = raw.match(/GOOGLE_SERVICE_ACCOUNT_KEY\s*=\s*['"]?(\{[\s\S]*?\})['"]?(?:\r?\n|$)/);
        if (match) {
          try {
            key = JSON.parse(match[1]);
            break;
          } catch {
            // continue checking
          }
        }
      }
    }
  }

  // 3. Check local JSON file (recommended for local development)
  if (!key) {
    const serviceAccountFile = findServiceAccountFile();
    if (!serviceAccountFile) {
      throw new Error(
        `Google service account credentials not found. Either provide GOOGLE_SERVICE_ACCOUNT_KEY in .env or place service_account.json in the project.`
      );
    }
    key = JSON.parse(fs.readFileSync(serviceAccountFile, 'utf8'));
  }
  const now = Math.floor(Date.now() / 1000);

  const header = base64url({ alg: 'RS256', typ: 'JWT' });
  const payload = base64url({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  });

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(key.private_key, 'base64url');
  const jwt = `${header}.${payload}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Failed to obtain Google token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

/**
 * 2. Submit single URL to Google Indexing API
 */
async function submitToGoogle(url, accessToken) {
  try {
    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url,
        type: 'URL_UPDATED',
      }),
    });

    const data = await res.json();
    if (res.ok && data.urlNotificationMetadata) {
      return { success: true, url };
    }
    return { success: false, url, error: data.error?.message || JSON.stringify(data) };
  } catch (err) {
    return { success: false, url, error: err.message };
  }
}

/**
 * 3. Submit URL list to IndexNow API (Bing, Yahoo, Yandex, Seznam)
 */
async function submitToIndexNow(urls) {
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: urls,
      }),
    });

    if (res.status === 200 || res.status === 202) {
      return { success: true, count: urls.length, status: res.status };
    }
    const text = await res.text();
    return { success: false, status: res.status, error: text };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * 4. Ping Sitemap to Google & Bing
 */
async function pingSitemaps() {
  const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);
  const pings = [
    { name: 'Google Sitemap Ping', url: `https://www.google.com/ping?sitemap=${sitemapUrl}` },
    { name: 'Bing Sitemap Ping', url: `https://www.bing.com/ping?sitemap=${sitemapUrl}` },
  ];

  for (const ping of pings) {
    try {
      const res = await fetch(ping.url);
      console.log(`[Ping] ${ping.name}: Status ${res.status}`);
    } catch (err) {
      console.log(`[Ping] ${ping.name} skipped: ${err.message}`);
    }
  }
}

/**
 * Helper to pause execution
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Main Execution Function
 */
export async function runAutomation() {
  console.log('='.repeat(65));
  console.log('GDGoC SATI Vidisha - Automated Search Engine Indexing Engine');
  console.log('='.repeat(65));

  // Check for CLI argument --url=<specific_url>
  const urlArg = process.argv.find((arg) => arg.startsWith('--url='));
  let targetUrls = [];

  if (urlArg) {
    const singleUrl = urlArg.split('=')[1];
    targetUrls = [singleUrl];
    console.log(`[Mode] Single URL targeted: ${singleUrl}`);
  } else {
    const all = await getAllUrls();
    targetUrls = all.map((u) => u.loc);
    console.log(`[Mode] Full Site Mode: Processing all ${targetUrls.length} verified pages.`);
  }

  // --- Step 1: Microsoft IndexNow Protocol ---
  console.log('\n[1/3] Submitting to IndexNow (Bing / Yahoo / Yandex / Seznam)...');
  const indexNowResult = await submitToIndexNow(targetUrls);
  if (indexNowResult.success) {
    console.log(`✅ IndexNow Accepted! ${targetUrls.length} URLs submitted directly (HTTP ${indexNowResult.status})`);
  } else {
    console.warn(`⚠️ IndexNow Notice: ${indexNowResult.error || indexNowResult.status}`);
  }

  // --- Step 2: Google Indexing API ---
  console.log('\n[2/3] Submitting to Google Indexing API via Service Account...');
  let googleSuccessCount = 0;
  let googleFailCount = 0;

  try {
    const accessToken = await getGoogleAccessToken();
    console.log('🔑 Authenticated with Google Cloud Service Account successfully.');

    for (let i = 0; i < targetUrls.length; i++) {
      const url = targetUrls[i];
      const result = await submitToGoogle(url, accessToken);

      if (result.success) {
        googleSuccessCount++;
        console.log(`   [${i + 1}/${targetUrls.length}] ✅ Google Indexed: ${url}`);
      } else {
        googleFailCount++;
        console.log(`   [${i + 1}/${targetUrls.length}] ❌ Google Error (${url}): ${result.error}`);
      }

      // Small delay between requests to avoid rate limits
      if (i < targetUrls.length - 1) {
        await delay(200);
      }
    }
  } catch (err) {
    console.error('❌ Google Indexing Authentication Error:', err.message);
  }

  // --- Step 3: Search Engine Sitemap Pings ---
  console.log('\n[3/3] Sending live Sitemap Pings...');
  await pingSitemaps();

  // --- Summary ---
  console.log('\n' + '='.repeat(65));
  console.log('📊 Automated Indexing Report');
  console.log('='.repeat(65));
  console.log(`Total URLs Processed : ${targetUrls.length}`);
  console.log(`IndexNow (Bing/Yahoo): ${indexNowResult.success ? '✅ 100% Accepted' : '⚠️ Pending Verification'}`);
  console.log(`Google Indexing API  : ✅ ${googleSuccessCount} Succeeded | ❌ ${googleFailCount} Failed`);
  console.log(`Sitemap Location     : ${BASE_URL}/sitemap.xml`);
  console.log('='.repeat(65) + '\n');
}

// Auto-execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAutomation().catch((err) => {
    console.error('Fatal indexing error:', err);
    process.exit(1);
  });
}
