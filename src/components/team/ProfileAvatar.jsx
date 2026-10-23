import React, { useState } from 'react';

/**
 * Cloudinary Profile Avatar Frames categorized by Google brand color
 */
export const AVATAR_FRAMES = {
  blue: 'https://res.cloudinary.com/lydk5lda/image/upload/v1792706167/profile_avatar_blue.png',
  yellow: 'https://res.cloudinary.com/lydk5lda/image/upload/v1792706167/profile_avatar_yellow.png',
  red: 'https://res.cloudinary.com/lydk5lda/image/upload/v1792706166/profile_avatar_red.png',
  green: 'https://res.cloudinary.com/lydk5lda/image/upload/v1792706166/profile_avatar_green.png',
};

/**
 * Local fallback paths in case Cloudinary is unavailable or offline
 */
export const LOCAL_AVATAR_FRAMES = {
  blue: '/assets/brand_kit/profile_avatar/profile_avatar_blue.png',
  yellow: '/assets/brand_kit/profile_avatar/profile_avatar_yellow.png',
  red: '/assets/brand_kit/profile_avatar/profile_avatar_red.png',
  green: '/assets/brand_kit/profile_avatar/profile_avatar_green.png',
};

/**
 * Helper to determine which avatar frame color to use
 * based on domain, team name, or hex color
 */
export const getAvatarColorKey = ({ domain, team, color } = {}) => {
  // 1. By domain key (technical, media, events, management, lead)
  if (domain) {
    const d = String(domain).toLowerCase();
    if (d.includes('tech')) return 'red';
    if (d.includes('media')) return 'blue';
    if (d.includes('event')) return 'green';
    if (d.includes('manage')) return 'yellow';
    if (d.includes('lead')) return 'blue';
  }

  // 2. By team title string
  if (team) {
    const t = String(team).toLowerCase();
    if (t.includes('tech')) return 'red';
    if (t.includes('media')) return 'blue';
    if (t.includes('event')) return 'green';
    if (t.includes('manage')) return 'yellow';
    if (t.includes('lead')) return 'blue';
  }

  // 3. By color code / hex
  if (color) {
    const c = String(color).toLowerCase();
    if (c.includes('ea4335') || c.includes('red') || c.includes('eb4')) return 'red';
    if (c.includes('4285f4') || c.includes('57ca') || c.includes('blue') || c.includes('0077')) return 'blue';
    if (c.includes('34a853') || c.includes('green') || c.includes('2e7d32')) return 'green';
    if (c.includes('fbbc04') || c.includes('yellow') || c.includes('f59e0b')) return 'yellow';
  }

  // Default to Google Blue for GDG
  return 'blue';
};

/**
 * ProfileAvatar Component
 * Renders the member's profile image with their domain-colored avatar frame layered on top.
 *
 * Layer structure:
 * - Background layer: Member profile image or initial fallback (rounded-full)
 * - Foreground layer: Transparent PNG avatar frame with domain-specific theme and GDG badge
 */
const ProfileAvatar = ({
  member,
  domain,
  team,
  color,
  size = 'card', // 'card' (w-28 h-28), 'modal' (w-32 h-32 md:w-36 md:h-36), or 'custom'
  className = '',
  imgClassName = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const [frameError, setFrameError] = useState(false);

  // Extract member details
  const name = member?.name || '';
  const image = member?.image;
  const resolvedDomain = domain || member?.domain;
  const resolvedTeam = team || member?.team;
  const resolvedColor = color || member?.themeColor;

  const colorKey = getAvatarColorKey({
    domain: resolvedDomain,
    team: resolvedTeam,
    color: resolvedColor,
  });

  const frameUrl = frameError
    ? LOCAL_AVATAR_FRAMES[colorKey]
    : AVATAR_FRAMES[colorKey] || AVATAR_FRAMES.blue;

  // Preset size styles
  const sizeClasses =
    size === 'card'
      ? 'w-28 h-28'
      : size === 'modal'
      ? 'w-32 h-32 md:w-36 md:h-36'
      : '';

  return (
    <div
      className={`relative select-none flex-shrink-0 transition-transform duration-300 ${sizeClasses} ${className}`}
    >
      {/* Background Layer: Member's Profile Image or Fallback Letter */}
      <div className="absolute inset-[2%] rounded-full overflow-hidden bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center shadow-inner">
        {image && !imgError ? (
          <img
            src={image}
            alt={name || 'Profile'}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover ${imgClassName}`}
          />
        ) : (
          <span
            className={`font-bold text-slate-400 dark:text-slate-500 uppercase ${
              size === 'modal' ? 'text-4xl md:text-5xl' : 'text-3xl'
            }`}
          >
            {name ? name.charAt(0) : '?'}
          </span>
        )}
      </div>

      {/* Foreground Layer: Domain Profile Avatar Frame (Higher z-index, transparent center) */}
      <img
        src={frameUrl}
        alt={`${colorKey} domain frame`}
        onError={() => {
          if (!frameError) setFrameError(true);
        }}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 drop-shadow-sm transition-transform duration-300"
      />
    </div>
  );
};

export default ProfileAvatar;
