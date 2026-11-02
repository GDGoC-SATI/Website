/**
 * Google Cloud Study Jams Syllabus & Real-Time Profile Progress Utility
 *
 * Dynamically parses participant records and validates completed labs
 * strictly against the event's configured syllabus labs from the live
 * Google Cloud Skills Boost public profile in real time.
 */

export const DEFAULT_SYLLABUS_SOURCE_URL = '';

export const DEFAULT_SYLLABUS_LABS = [];

/**
 * Normalizes text for lenient yet robust matching
 */
export const normalizeText = (text) => {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Converts any Google Sheets link to a direct CSV export/download link
 */
export const convertToCsvUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = url.trim();

  // Already a direct CSV link or ends with .csv
  if (cleanUrl.includes('output=csv') || cleanUrl.includes('format=csv')) {
    return cleanUrl;
  }

  // Handle published Google Sheets (/pubhtml or /pub)
  if (cleanUrl.includes('/spreadsheets/d/e/2PACX-')) {
    let csvUrl = cleanUrl.replace(/\/pubhtml([?#].*)?$/, '/pub');
    if (!csvUrl.includes('/pub')) {
      csvUrl = csvUrl.replace(/\/pub\?/, '/pub?');
    }
    const hasQuery = csvUrl.includes('?');
    return `${csvUrl}${hasQuery ? '&' : '?'}output=csv`;
  }

  // Handle standard Google Sheets links (/d/{sheetId}/edit or /view)
  const idMatch = cleanUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (idMatch && idMatch[1]) {
    const sheetId = idMatch[1];
    // Check for gid parameter in query or hash
    const gidMatch = cleanUrl.match(/[?&#]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  }

  return cleanUrl;
};

/**
 * Robust RFC-compliant CSV Parser that handles quoted multi-line fields and commas
 */
export const parseCsvRows = (text) => {
  if (!text || typeof text !== 'string') return [];

  const lines = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped double quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      if (currentRow.some((f) => f.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map((h) => h.replace(/^["']|["']$/g, '').trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const rowValues = lines[i];
    const rowObj = {};
    headers.forEach((header, colIdx) => {
      rowObj[header] = rowValues[colIdx] ? rowValues[colIdx].replace(/^["']|["']$/g, '').trim() : '';
    });
    rows.push(rowObj);
  }

  return rows;
};

/**
 * Extracts all badges, name, and avatar from raw Google Cloud Skills Boost profile HTML
 */
export const parseProfileHtml = (html, profileUrl) => {
  if (!html || typeof html !== 'string') {
    return { name: null, avatar: null, badges: [], totalBadgesCount: 0 };
  }

  // 1. Extract Avatar
  const avatarMatch =
    html.match(/<ql-avatar[^>]+src=["']([^"']+)["']/i) ||
    html.match(/<img[^>]+src=["']([^"']+)["'][^>]*class=["'][^"']*avatar/i) ||
    html.match(/class=["'][^"']*avatar[^"']*["'][^>]*>\s*<img[^>]+src=["']([^"']+)["']/i) ||
    html.match(/<div[^>]+class=["'][^"']*public-profile__avatar[^"']*["'][^>]*>\s*<img[^>]+src=["']([^"']+)["']/i);
  let avatar = avatarMatch && avatarMatch[1] ? avatarMatch[1].trim() : null;
  if (avatar && avatar.startsWith('//')) avatar = `https:${avatar}`;

  // 2. Extract Name
  const nameMatch =
    html.match(/<h1[^>]+class=["'][^"']*ql-display-small[^"']*["'][^>]*>\s*([^<]+)\s*<\/h1>/i) ||
    html.match(/<h1[^>]*>\s*([^<]+)\s*<\/h1>/i);
  const name = nameMatch && nameMatch[1] ? nameMatch[1].trim() : null;

  // 3. Extract Badges
  const badges = [];
  const badgeBlockRegex =
    /<div[^>]+class=["'][^"']*profile-badge[^"']*["'][^>]*>([\s\S]*?)(?:<\/div>\s*<\/div>|(?=<div[^>]+class=["'][^"']*profile-badge)|$)/gi;
  let blockMatch;

  while ((blockMatch = badgeBlockRegex.exec(html)) !== null) {
    const block = blockMatch[1];

    // Title
    const titleMatch =
      block.match(/<span[^>]+class=["'][^"']*(?:ql-title-medium|ql-subhead-1|badge-title)[^"']*["'][^>]*>\s*([^<]+)\s*<\/span>/i) ||
      block.match(/<h3[^>]*>\s*([^<]+)\s*<\/h3>/i);
    const title = titleMatch && titleMatch[1] ? titleMatch[1].replace(/&amp;/g, '&').trim() : '';

    if (!title) continue;

    // Earned Date
    const dateMatch =
      block.match(/<span[^>]+class=["'][^"']*ql-body-medium[^"']*["'][^>]*>\s*(?:Earned\s*)?([^<]+)\s*<\/span>/i) ||
      block.match(/Earned\s+([A-Za-z0-9, ]+)/i);
    const earnedDate = dateMatch && dateMatch[1] ? dateMatch[1].trim() : '';

    // Image
    const imgMatch =
      block.match(/<img[^>]+src=["']([^"']+)["'][^>]*role=["']presentation["']/i) ||
      block.match(/<img[^>]+src=["']([^"']+)["']/i);
    const image = imgMatch && imgMatch[1] ? imgMatch[1].trim() : '';

    // Badge URL
    const linkMatch = block.match(/<a[^>]+class=["'][^"']*badge-image[^"']*["'][^>]+href=["']([^"']+)["']/i);
    const badgeUrl = linkMatch && linkMatch[1] ? linkMatch[1].trim() : '';

    badges.push({
      title,
      earnedDate,
      image,
      badgeUrl,
    });
  }

  // Fallback if badgeBlockRegex produced 0 but title spans exist
  if (badges.length === 0) {
    const titleRegex =
      /<span[^>]+class=["'][^"']*(?:ql-title-medium|ql-subhead-1|badge-title)[^"']*["'][^>]*>\s*([^<]+)\s*<\/span>/gi;
    let tm;
    while ((tm = titleRegex.exec(html)) !== null) {
      const title = tm[1].replace(/&amp;/g, '&').trim();
      if (title && !title.toLowerCase().includes('badge') && title.length > 3) {
        badges.push({
          title,
          earnedDate: '',
          image: '',
          badgeUrl: '',
        });
      }
    }
  }

  return {
    success: true,
    profileUrl,
    name,
    avatar,
    totalBadgesCount: badges.length,
    badges,
  };
};

/**
 * Checks whether an earned profile badge matches a specific syllabus lab
 */
export const isBadgeMatchingSyllabusLab = (badgeTitle, lab) => {
  if (!badgeTitle || !lab) return false;

  const normBadge = normalizeText(badgeTitle);
  const normLab = normalizeText(lab.title);

  // Exact normalized match
  if (normBadge === normLab) return true;

  // Full substring containment
  if (normLab.length >= 10 && normBadge.includes(normLab)) return true;
  if (normBadge.length >= 10 && normLab.includes(normBadge)) return true;

  // Match template ID in URL (e.g. 754, 700, 1426, 633, 638, 1586, 658, 756, 959)
  const templateMatch = lab.url && lab.url.match(/course_templates\/([0-9]+)/);
  if (templateMatch && templateMatch[1]) {
    const tid = templateMatch[1];
    if (new RegExp(`\\b${tid}\\b`).test(normBadge)) return true;
  }

  // Token-based similarity: compare distinctive keywords
  const stopWords = new Set([
    'google',
    'cloud',
    'the',
    'and',
    'for',
    'with',
    'using',
    'in',
    'on',
    'of',
    'first',
    'basics',
    'platform',
    'console',
    'skills',
    'boost',
    'skill',
    'badge',
    'quest',
  ]);
  const labWords = normLab.split(' ').filter((w) => w.length > 2 && !stopWords.has(w));
  const badgeWords = normBadge.split(' ').filter((w) => w.length > 2 && !stopWords.has(w));

  if (labWords.length > 0 && badgeWords.length > 0) {
    const matchedCount = labWords.filter((w) => badgeWords.includes(w)).length;
    if (matchedCount >= Math.max(2, Math.ceil(labWords.length * 0.7))) {
      return true;
    }
  }

  return false;
};

/**
 * Matches an array of earned profile badges strictly against the event's syllabus labs.
 * Returns only the completed labs that belong to the syllabus.
 */
export const matchProfileBadgesToSyllabus = (badges = [], syllabusLabs = []) => {
  const labs = Array.isArray(syllabusLabs) ? syllabusLabs : [];
  const totalLabs = labs.length;

  const completedLabs = [];

  for (const lab of labs) {
    const matchedBadge = (badges || []).find((b) => isBadgeMatchingSyllabusLab(b.title, lab));
    if (matchedBadge) {
      completedLabs.push({
        ...lab,
        earnedDate: matchedBadge.earnedDate || '',
        badgeImage: matchedBadge.image || '',
        badgeUrl: matchedBadge.badgeUrl || lab.url || '',
      });
    }
  }

  const verifiedCount = completedLabs.length;
  const percentage = totalLabs > 0 ? Math.min(100, Math.round((verifiedCount / totalLabs) * 100)) : 0;

  return {
    completedLabs,
    verifiedCount,
    percentage,
    totalProfileBadges: (badges || []).length,
  };
};

/**
 * Fetches real-time public profile data from Google Cloud Skills Boost.
 * Uses sessionStorage caching (15 min) and proxy fallbacks to bypass CORS.
 */
export const fetchCloudProfileRealtime = async (profileUrl, forceRefresh = false) => {
  if (!profileUrl || typeof profileUrl !== 'string') {
    return { success: false, message: 'Invalid URL' };
  }

  const cleanUrl = profileUrl.trim();
  const storageKey = `csb_live_v4_${encodeURIComponent(cleanUrl)}`;

  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.success && Array.isArray(parsed.badges)) {
          return parsed;
        }
      }
    } catch {}
  }

  // 1. Try internal serverless endpoint: /api/profile-progress
  try {
    const res = await fetch(`/api/profile-progress?url=${encodeURIComponent(cleanUrl)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(data));
        } catch {}
        return data;
      }
    }
  } catch {
    // Fall back to external CORS proxies
  }

  // 2. Fallbacks via public CORS proxies
  const proxyEndpoints = [
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  ];

  for (const getProxyUrl of proxyEndpoints) {
    try {
      const res = await fetch(getProxyUrl(cleanUrl), {
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        const html = await res.text();
        if (html && (html.includes('profile-badge') || html.includes('ql-display-small') || html.includes('ql-avatar'))) {
          const parsed = parseProfileHtml(html, cleanUrl);
          if (parsed && parsed.success) {
            try {
              sessionStorage.setItem(storageKey, JSON.stringify(parsed));
            } catch {}
            return parsed;
          }
        }
      }
    } catch {
      // Continue to next proxy
    }
  }

  return {
    success: false,
    profileUrl: cleanUrl,
    name: null,
    avatar: null,
    badges: [],
    totalBadgesCount: 0,
  };
};

/**
 * Parses raw CSV rows into initial participant records.
 * The Google Sheet is used exclusively to discover participants and their profile URLs.
 * Real completed counts are resolved live from each user's Google Cloud Skills Boost profile.
 */
export const parseParticipantsFromCsv = (csvText, syllabusLabs = DEFAULT_SYLLABUS_LABS) => {
  const rows = parseCsvRows(csvText);
  if (!rows || rows.length === 0) return [];

  const labs = Array.isArray(syllabusLabs) ? syllabusLabs : DEFAULT_SYLLABUS_LABS;
  const totalLabs = labs.length;

  return rows.map((row, index) => {
    const keys = Object.keys(row);

    // 1. Participant Name: Search for header with name / student / participant
    const nameKey =
      keys.find((k) => /name|student|participant/i.test(k) && !/course|lab|event|branch|dept|college/i.test(k)) ||
      keys[0];
    const name = (row[nameKey] || `Participant ${index + 1}`).trim();

    // 2. Cloud Skills Boost Profile URL
    const profileKey = keys.find((k) =>
      /profile|skills boost|cloudskillsboost|cloud profile|boost url|link/i.test(k)
    );
    let profileUrl = profileKey ? (row[profileKey] || '').trim() : '';

    if (!profileUrl) {
      for (const k of keys) {
        const val = (row[k] || '').trim();
        if (/cloudskillsboost\.google|skills\.google/i.test(val)) {
          profileUrl = val;
          break;
        }
      }
    }

    // Standardize URL protocol if needed
    if (profileUrl && !profileUrl.startsWith('http')) {
      profileUrl = `https://${profileUrl}`;
    }

    // 3. Check if we already have cached real-time profile data in sessionStorage
    let cachedData = null;
    if (typeof window !== 'undefined' && profileUrl) {
      try {
        const stored = sessionStorage.getItem(`csb_live_v4_${encodeURIComponent(profileUrl)}`);
        if (stored) {
          cachedData = JSON.parse(stored);
        }
      } catch {}
    }

    let completedLabs = [];
    let verifiedCount = 0;
    let percentage = 0;
    let liveVerified = false;
    let totalProfileBadges = 0;

    if (cachedData && Array.isArray(cachedData.badges)) {
      const matchRes = matchProfileBadgesToSyllabus(cachedData.badges, labs);
      completedLabs = matchRes.completedLabs;
      verifiedCount = matchRes.verifiedCount;
      percentage = matchRes.percentage;
      liveVerified = true;
      totalProfileBadges = cachedData.totalBadgesCount || cachedData.badges.length;
    }

    // Avatar resolution: Cached profile avatar > Sheet avatar > Default Google avatar
    const sheetAvatarKey = keys.find((k) => /avatar|photo|image|picture|pfp|dp|icon|profile_image/i.test(k));
    const sheetAvatar =
      sheetAvatarKey && row[sheetAvatarKey] && (row[sheetAvatarKey].startsWith('http') || row[sheetAvatarKey].startsWith('//'))
        ? row[sheetAvatarKey].trim()
        : null;

    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || 'User'
    )}&background=4285F4&color=fff&bold=true&rounded=true&size=128`;

    const avatar = cachedData?.avatar || sheetAvatar || defaultAvatar;

    return {
      id: `p-${index + 1}`,
      name,
      avatar,
      profileUrl,
      verifiedCount,
      completedLabs,
      percentage,
      liveVerified,
      totalProfileBadges,
    };
  });
};

/**
 * Backwards compatibility helper to resolve profile avatar
 */
export const resolveCloudProfileAvatar = async (profileUrl) => {
  const data = await fetchCloudProfileRealtime(profileUrl);
  return data?.avatar || null;
};
