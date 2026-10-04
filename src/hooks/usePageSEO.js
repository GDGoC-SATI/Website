import { useEffect } from 'react';

export const BASE_URL = 'https://gdgocsati.vercel.app';
export const SITE_BRAND = 'GDGoC SATI Vidisha';

export const ROUTE_METADATA = {
  '/': {
    title: 'Home',
    description: 'Official community platform of Google Developer Groups on Campus (GDGoC) at Samrat Ashok Technological Institute (SATI), Vidisha. Learn, build, and grow together.',
  },
  '/events': {
    title: 'Events & Workshops',
    description: 'Discover upcoming hackathons, bootcamps, speaker sessions, and technical meetups hosted by GDG on Campus SATI Vidisha.',
  },
  '/projects': {
    title: 'Projects Showcase',
    description: 'Explore open-source projects, community software, and innovative applications developed by student developers at GDGoC SATI Vidisha.',
  },
  '/team': {
    title: 'Core Team & Leads',
    description: 'Meet the executive chapter leads, organizers, and student domain directors driving GDG on Campus SATI Vidisha.',
  },
  '/gallery': {
    title: 'Community Gallery',
    description: 'Visual highlights, event photos, and memories from hackathons, workshops, and tech conferences at GDGoC SATI Vidisha.',
  },
  '/alumni': {
    title: 'Alumni Network',
    description: 'Connect with former leads and members of GDG on Campus SATI Vidisha working across top global technology organizations.',
  },
  '/about': {
    title: 'About Our Chapter',
    description: 'Learn about the mission, history, and community culture of Google Developer Groups on Campus at Samrat Ashok Technological Institute Vidisha.',
  },
  '/contact': {
    title: 'Contact Us',
    description: 'Get in touch with GDGoC SATI organizers for partnerships, sponsorship opportunities, student queries, and tech collaborations.',
  },
  '/login': {
    title: 'Sign In',
    description: 'Access your GDGoC SATI Vidisha account with Email, OTP, or Google single sign-on.',
  },
  '/signup': {
    title: 'Create Account',
    description: 'Join the GDGoC SATI Vidisha student developer community to RSVP for events and showcase your projects.',
  },
  '/profile': {
    title: 'Member Profile',
    description: 'View and manage your developer profile, skills, showcased projects, and chapter achievements on GDGoC SATI.',
  },
  '/settings': {
    title: 'Account Settings',
    description: 'Manage your password, privacy preferences, notifications, and security settings on GDGoC SATI Vidisha.',
  },
  '/notifications': {
    title: 'Notifications',
    description: 'Stay updated with chapter announcements, event reminders, and community alerts.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Review our data protection standards, privacy practices, and member data policies at GDGoC SATI Vidisha.',
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'Read the terms of participation, code of conduct, and acceptable use guidelines for GDGoC SATI Vidisha.',
  },
  '/admin': {
    title: 'Admin Console',
    description: 'Administrative portal for managing events, projects, community members, and announcements at GDGoC SATI Vidisha.',
  },
};

export function getTitleForPath(pathname) {
  if (ROUTE_METADATA[pathname]) {
    return `${ROUTE_METADATA[pathname].title} | ${SITE_BRAND}`;
  }
  if (pathname.startsWith('/events/')) {
    return `Event Details | ${SITE_BRAND}`;
  }
  if (pathname.startsWith('/profile/')) {
    return `Developer Profile | ${SITE_BRAND}`;
  }
  return `404 - Page Not Found | ${SITE_BRAND}`;
}

/**
 * Hook to dynamically update document title, canonical link, and meta tags for SEO/AEO/GEO.
 * @param {object} options
 * @param {string} options.title - Page specific title (e.g. 'Events & Workshops')
 * @param {string} [options.description] - 140-160 char page summary
 * @param {string} [options.path] - e.g. '/events'
 * @param {string} [options.image] - Custom og:image URL
 */
export function usePageSEO({ title, description, path = '', image = `${BASE_URL}/assets/favicon.png` }) {
  useEffect(() => {
    // 1. Update Title in Browser Tab
    const fullTitle = title ? `${title} | ${SITE_BRAND}` : `${SITE_BRAND} | Google Developer Groups`;
    document.title = fullTitle;

    // 2. Helper to set/create meta tag
    const setMeta = (nameOrProperty, value, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, nameOrProperty);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    // 3. Update Standard & Social Meta
    if (description) {
      setMeta('description', description);
      setMeta('og:description', description, true);
      setMeta('twitter:description', description);
    }
    setMeta('og:title', fullTitle, true);
    setMeta('twitter:title', fullTitle);
    setMeta('og:image', image, true);
    setMeta('twitter:image', image);

    const canonicalUrl = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    setMeta('og:url', canonicalUrl, true);
    setMeta('twitter:url', canonicalUrl);

    // 4. Update Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);
  }, [title, description, path, image]);
}

export default usePageSEO;
