/**
 * Official Google Cloud Study Jams 2026 Syllabus Badges
 * Source: https://docs.google.com/spreadsheets/d/e/2PACX-1vTVMEFW24yi5IVcBblZFEK5xMdQyeF9pndf-wxE37BKu5hyOghhSkYiCHW6rSLjNJd5U3OI_E_I9vZi/pubhtml?gid=411469390&single=true&urp=gmail_link
 * 
 * STRICT REQUIREMENT: Only badges from this exact syllabus of 10 labs/courses count towards the leaderboard progress.
 */

export const SYLLABUS_SOURCE_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVMEFW24yi5IVcBblZFEK5xMdQyeF9pndf-wxE37BKu5hyOghhSkYiCHW6rSLjNJd5U3OI_E_I9vZi/pubhtml?gid=411469390&single=true&urp=gmail_link';

export const OFFICIAL_SYLLABUS_BADGES = [
  {
    id: 'badge-1',
    templateId: '754',
    title: 'The Basics of Google Cloud Compute',
    shortName: 'Google Cloud Compute',
    url: 'https://www.cloudskillsboost.google/course_templates/754',
    credits: 4,
    category: 'Compute & Infrastructure',
    iconColor: '#4285F4', // Google Blue
    aliases: [
      'the basics of google cloud compute',
      'basics of google cloud compute',
      'google cloud compute',
      'gsp754',
      '754',
    ],
  },
  {
    id: 'badge-2',
    templateId: '702',
    title: 'Configure Service Accounts and IAM Roles for Google Cloud',
    shortName: 'IAM & Service Accounts',
    url: 'https://www.cloudskillsboost.google/course_templates/702',
    credits: 4,
    category: 'Security & Access',
    iconColor: '#EA4335', // Google Red
    aliases: [
      'configure service accounts and iam roles for google cloud',
      'configure service accounts and iam roles',
      'service accounts and iam roles',
      'iam roles for google cloud',
      'gsp702',
      '702',
    ],
  },
  {
    id: 'badge-3',
    templateId: '700',
    title: 'Implement Speech and Language Solutions with Pre-trained APIs',
    shortName: 'Speech & Language APIs',
    url: 'https://www.cloudskillsboost.google/course_templates/700',
    credits: 4,
    category: 'Machine Learning & NLP',
    iconColor: '#34A853', // Google Green
    aliases: [
      'implement speech and language solutions with pre-trained apis',
      'speech and language solutions with pre-trained apis',
      'speech and language solutions',
      'pre-trained apis',
      'gsp700',
      '700',
    ],
  },
  {
    id: 'badge-4',
    templateId: '1426',
    title: 'Develop AI-Powered Prototypes in Google AI Studio',
    shortName: 'Google AI Studio Prototypes',
    url: 'https://www.cloudskillsboost.google/course_templates/1426',
    credits: 0,
    category: 'Generative AI',
    iconColor: '#FBBC05', // Google Yellow
    aliases: [
      'develop ai-powered prototypes in google ai studio',
      'develop ai powered prototypes in google ai studio',
      'google ai studio prototypes',
      'ai-powered prototypes in google ai studio',
      'google ai studio',
      'gsp1426',
      '1426',
    ],
  },
  {
    id: 'badge-5',
    templateId: '633',
    title: 'Analyze Images with the Cloud Vision API',
    shortName: 'Cloud Vision API',
    url: 'https://www.cloudskillsboost.google/course_templates/633',
    credits: 12,
    category: 'Computer Vision',
    iconColor: '#4285F4',
    aliases: [
      'analyze images with the cloud vision api',
      'analyze images with cloud vision api',
      'cloud vision api',
      'vision api',
      'gsp633',
      '633',
    ],
  },
  {
    id: 'badge-6',
    templateId: '638',
    title: 'Build a Website on Google Cloud',
    shortName: 'Website on Google Cloud',
    url: 'https://www.cloudskillsboost.google/course_templates/638',
    credits: 13,
    category: 'Web & Hosting',
    iconColor: '#34A853',
    aliases: [
      'build a website on google cloud',
      'build a website on gcp',
      'website on google cloud',
      'gsp638',
      '638',
    ],
  },
  {
    id: 'badge-7',
    templateId: '1586',
    title: 'Create Your First Gemini Enterprise Application',
    shortName: 'Gemini Enterprise App',
    url: 'https://www.cloudskillsboost.google/course_templates/1586',
    credits: 0,
    category: 'Generative AI & Gemini',
    iconColor: '#8E24AA', // Purple
    aliases: [
      'create your first gemini enterprise application',
      'gemini enterprise application',
      'first gemini enterprise application',
      'gemini enterprise app',
      'gsp1586',
      '1586',
    ],
  },
  {
    id: 'badge-8',
    templateId: '658',
    title: 'Store, Process, and Manage Data on Google Cloud - Console',
    shortName: 'Data on Cloud Console',
    url: 'https://www.cloudskillsboost.google/course_templates/658',
    credits: 3,
    category: 'Data & Storage',
    iconColor: '#FBBC05',
    aliases: [
      'store, process, and manage data on google cloud - console',
      'store process and manage data on google cloud',
      'manage data on google cloud - console',
      'store process and manage data',
      'data on google cloud - console',
      'gsp658',
      '658',
    ],
  },
  {
    id: 'badge-9',
    templateId: '756',
    title: 'Using the Google Cloud Speech API',
    shortName: 'Google Cloud Speech API',
    url: 'https://www.cloudskillsboost.google/course_templates/756',
    credits: 4,
    category: 'Speech & Audio AI',
    iconColor: '#EA4335',
    aliases: [
      'using the google cloud speech api',
      'google cloud speech api',
      'cloud speech api',
      'speech api',
      'gsp756',
      '756',
    ],
  },
  {
    id: 'badge-10',
    templateId: '959',
    title: 'Explore Generative AI in Agent Platform',
    shortName: 'Generative AI Agent Platform',
    url: 'https://www.cloudskillsboost.google/course_templates/959',
    credits: 16,
    category: 'AI Agents & GenAI',
    iconColor: '#00ACC1', // Cyan
    aliases: [
      'explore generative ai in agent platform',
      'generative ai in agent platform',
      'agent platform generative ai',
      'gsp959',
      '959',
    ],
  },
];

export const TOTAL_SYLLABUS_BADGES = OFFICIAL_SYLLABUS_BADGES.length; // 10

/**
 * Normalizes text for lenient yet accurate matching
 */
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Check if a badge belongs to the official syllabus
 * Returns the matching syllabus badge definition or null
 */
export const matchSyllabusBadge = (rawBadge) => {
  if (!rawBadge) return null;

  // If rawBadge is an object with id/templateId/title
  const inputStr = typeof rawBadge === 'string'
    ? rawBadge
    : (rawBadge.title || rawBadge.name || rawBadge.id || rawBadge.templateId || '');

  const normInput = normalizeText(inputStr);
  if (!normInput) return null;

  for (const badge of OFFICIAL_SYLLABUS_BADGES) {
    // 1. Direct template ID match
    if (rawBadge.templateId && String(rawBadge.templateId) === badge.templateId) {
      return badge;
    }
    // 2. Strict ID match
    if (rawBadge.id && rawBadge.id === badge.id) {
      return badge;
    }
    // 3. Normalized title match
    const normTitle = normalizeText(badge.title);
    if (normInput === normTitle || normInput.includes(normTitle) || normTitle.includes(normInput)) {
      return badge;
    }
    // 4. Aliases
    for (const alias of badge.aliases) {
      const normAlias = normalizeText(alias);
      if (normInput === normAlias || (normAlias.length > 5 && normInput.includes(normAlias))) {
        return badge;
      }
    }
  }

  return null;
};

/**
 * Strictly filters and calculates syllabus badges completed by a participant.
 * Ignores any badges outside the 10 syllabus courses.
 */
export const filterAndCountSyllabusBadges = (participantBadges = []) => {
  if (!Array.isArray(participantBadges)) return { completedBadges: [], count: 0, percentage: 0 };

  const matchedSet = new Map();

  for (const item of participantBadges) {
    const matched = matchSyllabusBadge(item);
    if (matched && !matchedSet.has(matched.id)) {
      matchedSet.set(matched.id, {
        ...matched,
        completedAt: item?.completedAt || item?.date || null,
      });
    }
  }

  const completedBadges = Array.from(matchedSet.values());
  const count = completedBadges.length;
  const percentage = Math.round((count / TOTAL_SYLLABUS_BADGES) * 100);

  return {
    completedBadges,
    count,
    percentage,
  };
};

/**
 * Calculate participant milestone tier based on verified syllabus badge count
 */
export const getMilestoneTier = (count) => {
  if (count >= 10) {
    return {
      tier: 'Tier 1 (Complete)',
      label: 'All 10 Badges Completed',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      color: '#10B981',
      isComplete: true,
    };
  }
  if (count >= 6) {
    return {
      tier: 'Milestone 2',
      label: 'Milestone 2 (6+ Badges)',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      color: '#3B82F6',
      isComplete: false,
    };
  }
  if (count >= 3) {
    return {
      tier: 'Milestone 1',
      label: 'Milestone 1 (3+ Badges)',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      color: '#F59E0B',
      isComplete: false,
    };
  }
  return {
    tier: 'Getting Started',
    label: 'In Progress (<3 Badges)',
    badgeClass: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20',
    color: '#64748B',
    isComplete: false,
  };
};
