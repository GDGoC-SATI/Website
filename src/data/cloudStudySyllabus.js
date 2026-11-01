/**
 * Google Cloud Study Jams Syllabus & Google Sheet Parsing Utility
 * 
 * Dynamically parses participant records and validates completed labs
 * strictly against the event's configured syllabus labs from the database.
 */

export const DEFAULT_SYLLABUS_SOURCE_URL =
  '';

export const DEFAULT_SYLLABUS_LABS = [
 
];

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
 * Helper to determine if a cell's value represents completion of a course/lab.
 * Strictly verifies positive markers or completion dates; rejects everything else.
 */
export const isCellCompleted = (val) => {
  if (val === null || val === undefined) return false;
  const str = String(val).trim();
  if (!str) return false;

  const lower = str.toLowerCase();

  // Explicit negatives that mean NOT completed
  if (
    lower === 'no' ||
    lower === 'n' ||
    lower === 'false' ||
    lower === '0' ||
    lower === '0.0' ||
    lower === '-' ||
    lower === '--' ||
    lower === 'na' ||
    lower === 'n/a' ||
    lower === 'none' ||
    lower === 'pending' ||
    lower === 'in progress' ||
    lower === 'not completed' ||
    lower === 'not started' ||
    lower === 'incomplete' ||
    lower === 'uncompleted' ||
    lower === 'enrolled' ||
    lower === 'registered' ||
    lower === 'waiting' ||
    lower === 'null' ||
    lower === 'undefined'
  ) {
    return false;
  }

  // Explicit positive markers
  if (
    lower === 'yes' ||
    lower === 'y' ||
    lower === 'true' ||
    lower === '1' ||
    lower === 'done' ||
    lower === 'completed' ||
    lower === 'complete' ||
    lower === 'passed' ||
    lower === 'pass' ||
    lower === 'earned' ||
    lower === 'achieved' ||
    lower === 'badge earned' ||
    lower === 'completed badge'
  ) {
    return true;
  }

  // Valid completion date formats (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY, DD.MM.YYYY)
  if (/^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}/.test(str)) {
    return true;
  }

  // Month date strings like "Oct 24, 2026" or "24 Oct 2026"
  if (
    /^(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2},? \d{4}/i.test(str) ||
    /^\d{1,2} (?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{4}/i.test(str)
  ) {
    return true;
  }

  // ISO timestamp (e.g. 2026-10-24T12:00:00Z)
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
    return true;
  }

  // If not an explicit positive marker or a date, it is NOT completed
  return false;
};

/**
 * Checks if a column header matches a syllabus lab
 */
export const isHeaderMatchingLab = (header, lab) => {
  if (!header || !lab) return false;

  // Never match general personal / profile / college metadata columns
  if (
    /name|student|participant|email|mail|college|institute|dept|department|branch|semester|year|roll|phone|mobile|contact|avatar|photo|profile|boost.*url|link|timestamp|date.*of.*birth|dob|status|arcade|trivia|token|swag|comment|remark/i.test(
      header
    )
  ) {
    return false;
  }

  const normH = normalizeText(header);
  const normTitle = normalizeText(lab.title);

  if (normH === normTitle) return true;

  // Match template ID in URL (e.g. 754, 702, 1426, 633, 638, 1586, 658, 756, 959)
  const templateMatch = lab.url && lab.url.match(/course_templates\/([0-9]+)/);
  if (templateMatch && templateMatch[1]) {
    const tid = templateMatch[1];
    if (new RegExp(`\\b${tid}\\b`).test(normH) || normH.includes(tid)) {
      return true;
    }
  }

  // Check if header contains the substantial part of the lab title
  if (normTitle.length >= 10 && normH.includes(normTitle)) {
    return true;
  }
  if (normH.length >= 10 && normTitle.includes(normH)) {
    return true;
  }

  // Substantial keyword matching
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
  ]);
  const titleWords = normTitle.split(' ').filter((w) => w.length > 2 && !stopWords.has(w));

  if (titleWords.length > 0) {
    const matchedCount = titleWords.filter((w) => normH.includes(w)).length;
    if (matchedCount >= Math.max(2, Math.ceil(titleWords.length * 0.7))) {
      return true;
    }
  }

  return false;
};

/**
 * Extracts a numeric badge completion count strictly from official skill badge summary columns
 */
export const extractNumericBadgeCount = (row, totalLabs) => {
  const keys = Object.keys(row);

  // Strict columns matching "# of Skill Badges Completed" (excluding Arcade games/trivia)
  const countColumns = keys.filter(
    (k) =>
      /#.*skill.*badge|number.*of.*skill.*badge|skill.*badge.*completed|total.*skill.*badge/i.test(k) &&
      !/arcade|trivia|game|token/i.test(k)
  );

  for (const col of countColumns) {
    const val = String(row[col] || '').trim();
    if (!val) continue;

    // "X/10" or "X / 10" or "X of 10"
    const ratioMatch = val.match(/^(\d+)\s*(?:\/|of)\s*(\d+)/i);
    if (ratioMatch) {
      const num = parseInt(ratioMatch[1], 10);
      if (!isNaN(num)) return Math.min(num, totalLabs);
    }

    // Direct integer like "10" or "8" or "0"
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && String(parsed) === val.split('.')[0]) {
      if (parsed >= 0 && parsed <= totalLabs) {
        return parsed;
      }
    }
  }

  return null;
};

/**
 * Parses raw CSV rows into standardized participant records and verifies
 * badges strictly against the event's configured syllabus labs.
 * NO RANK IS ASSIGNED.
 */
export const parseParticipantsFromCsv = (csvText, syllabusLabs = DEFAULT_SYLLABUS_LABS) => {
  const rows = parseCsvRows(csvText);
  if (!rows || rows.length === 0) return [];

  const labs = Array.isArray(syllabusLabs) && syllabusLabs.length > 0 ? syllabusLabs : DEFAULT_SYLLABUS_LABS;
  const totalLabs = labs.length;

  // Detect which columns in the sheet correspond to individual syllabus labs
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  const labColumnMap = new Map();

  for (const lab of labs) {
    const matchingHeader = headers.find((h) => isHeaderMatchingLab(h, lab));
    if (matchingHeader) {
      labColumnMap.set(lab.id || lab.title, { lab, header: matchingHeader });
    }
  }

  const hasIndividualLabColumns = labColumnMap.size > 0;

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

    // 3. Completed Labs & Badges matching strictly against syllabusLabs
    const completedLabs = [];

    if (hasIndividualLabColumns) {
      // Individual columns for labs exist in the sheet: check each syllabus lab strictly
      for (const { lab, header } of labColumnMap.values()) {
        const cellVal = row[header];
        if (isCellCompleted(cellVal)) {
          completedLabs.push(lab);
        }
      }
    }

    // Verified count is strictly the number of actual syllabus labs completed
    let verifiedCount = completedLabs.length;

    // Fallback: only if NO individual lab columns exist at all in sheet, check for explicit "# of Skill Badges Completed" column
    if (!hasIndividualLabColumns) {
      const explicitCount = extractNumericBadgeCount(row, totalLabs);
      if (explicitCount !== null && explicitCount >= 0) {
        verifiedCount = Math.min(explicitCount, totalLabs);
      }
    }

    // Avatar (Cloud Skills Boost Profile Avatar / Image)
    const avatarKey = keys.find((k) => /avatar|photo|image|picture|pfp|dp|icon|profile_image|user_photo/i.test(k));
    const sheetAvatar =
      avatarKey && row[avatarKey] && (row[avatarKey].startsWith('http') || row[avatarKey].startsWith('//'))
        ? row[avatarKey].trim()
        : null;

    let cachedAvatar = null;
    if (typeof window !== 'undefined' && profileUrl) {
      try {
        cachedAvatar = sessionStorage.getItem(`csb_avatar_${encodeURIComponent(profileUrl)}`);
      } catch {}
    }

    const defaultGoogleAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || 'User'
    )}&background=4285F4&color=fff&bold=true&rounded=true&size=128`;
    const avatar = sheetAvatar || cachedAvatar || defaultGoogleAvatar;

    const percentage = totalLabs > 0 ? Math.min(100, Math.round((verifiedCount / totalLabs) * 100)) : 0;

    return {
      id: `p-${index + 1}`,
      name,
      avatar,
      profileUrl,
      verifiedCount,
      completedLabs,
      percentage,
    };
  });
};

/**
 * Asynchronously attempts to resolve the exact avatar image from a public Cloud Skills Boost profile
 */
export const resolveCloudProfileAvatar = async (profileUrl) => {
  if (!profileUrl || typeof profileUrl !== 'string' || typeof window === 'undefined') return null;

  const storageKey = `csb_avatar_${encodeURIComponent(profileUrl)}`;
  try {
    const cached = sessionStorage.getItem(storageKey);
    if (cached) return cached;
  } catch {}

  const proxies = [
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  ];

  for (const makeProxy of proxies) {
    try {
      const res = await fetch(makeProxy(profileUrl), { signal: AbortSignal.timeout(3500) });
      if (!res.ok) continue;
      const html = await res.text();
      const match =
        html.match(/<ql-avatar[^>]+src=["']([^"']+)["']/i) ||
        html.match(/<img[^>]+(?:class|id)=["'][^"']*avatar[^"']*["'][^>]+src=["']([^"']+)["']/i) ||
        html.match(/<div[^>]+class=["'][^"']*public-profile__avatar[^"']*["'][^>]*>\s*<img[^>]+src=["']([^"']+)["']/i);

      if (match && match[1] && (match[1].startsWith('http') || match[1].startsWith('//'))) {
        const fullUrl = match[1].startsWith('//') ? `https:${match[1]}` : match[1];
        try {
          sessionStorage.setItem(storageKey, fullUrl);
        } catch {}
        return fullUrl;
      }
    } catch {
      // Continue to next
    }
  }

  return null;
};
