/**
 * Serverless API: /api/profile-progress
 * Fetches and parses Google Cloud Skills Boost public profile badges in real time.
 */

export const config = {
  maxDuration: 15,
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawUrl = req.query.url || req.body?.url;
  if (!rawUrl || typeof rawUrl !== 'string') {
    return res.status(400).json({ success: false, message: 'Missing "url" parameter.' });
  }

  const cleanUrl = rawUrl.trim();
  if (
    !cleanUrl.includes('cloudskillsboost.google/public_profiles/') &&
    !cleanUrl.includes('skills.google/public_profiles/')
  ) {
    return res.status(400).json({
      success: false,
      message: 'Invalid URL. Expected a Google Cloud Skills Boost public profile URL.',
    });
  }

  // Ensure standard protocol and domain
  let targetUrl = cleanUrl;
  if (!targetUrl.startsWith('http')) {
    targetUrl = `https://${targetUrl}`;
  }

  try {
    const fetchOptions = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(8000),
    };

    let response = await fetch(targetUrl, fetchOptions);

    // If redirected or domain mismatch, retry with alternative domain if needed
    if (!response.ok && targetUrl.includes('cloudskillsboost.google')) {
      const skillsGoogleUrl = targetUrl.replace('cloudskillsboost.google', 'skills.google');
      response = await fetch(skillsGoogleUrl, fetchOptions).catch(() => response);
    } else if (!response.ok && targetUrl.includes('skills.google')) {
      const csbUrl = targetUrl.replace('skills.google', 'www.cloudskillsboost.google');
      response = await fetch(csbUrl, fetchOptions).catch(() => response);
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `Google Cloud Skills Boost responded with status ${response.status}`,
      });
    }

    const html = await response.text();

    // 1. Extract Avatar
    const avatarMatch =
      html.match(/<ql-avatar[^>]+src=["']([^"']+)["']/i) ||
      html.match(/<img[^>]+src=["']([^"']+)["'][^>]*class=["'][^"']*avatar/i) ||
      html.match(/class=["'][^"']*avatar[^"']*["'][^>]*>\s*<img[^>]+src=["']([^"']+)["']/i);
    const avatar = avatarMatch && avatarMatch[1] ? avatarMatch[1].trim() : null;

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

      // Badge detail link
      const linkMatch = block.match(/<a[^>]+class=["'][^"']*badge-image[^"']*["'][^>]+href=["']([^"']+)["']/i);
      const badgeUrl = linkMatch && linkMatch[1] ? linkMatch[1].trim() : '';

      badges.push({
        title,
        earnedDate,
        image,
        badgeUrl,
      });
    }

    // Fallback if profile-badge containers differ in novel layout
    if (badges.length === 0) {
      const titleRegex = /<span[^>]+class=["'][^"']*(?:ql-title-medium|ql-subhead-1|badge-title)[^"']*["'][^>]*>\s*([^<]+)\s*<\/span>/gi;
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

    // Cache header for edge/browser (5 minutes cache, 10 min SWR)
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return res.status(200).json({
      success: true,
      profileUrl: cleanUrl,
      name,
      avatar,
      totalBadgesCount: badges.length,
      badges,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch public profile data.',
    });
  }
}

