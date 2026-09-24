import React from 'react';

/**
 * Computes 2-letter avatar initials for email/regular users:
 * - First character of first word + first character of second word (e.g. "Safal Tiwari" -> "ST")
 * - If only one word: first two letters uppercase (e.g. "Safal" -> "SA")
 */
export const getUserInitials = (name, email) => {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    const clean = email.split('@')[0].replace(/[^a-zA-Z]/g, '');
    return clean.slice(0, 2).toUpperCase() || 'U';
  }
  return 'U';
};

/**
 * Reusable UserAvatar component:
 * - Displays avatar image if provided (Google avatar or custom image)
 * - Otherwise displays first letter of first word and first letter of second word
 */
export const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-16 h-16 text-xl font-black',
    xl: 'w-24 h-24 text-3xl font-black',
  };

  const initials = getUserInitials(user?.name, user?.email);
  const selectedSize = sizeClasses[size] || sizeClasses.md;

  if (user?.avatar) {
    return (
      <div
        className={`rounded-full overflow-hidden shrink-0 ${selectedSize} ${className}`}
      >
        <img
          src={user.avatar}
          alt={user.name || 'User'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-full h-full hidden items-center justify-center bg-gradient-to-tr from-google-blue via-indigo-600 to-google-green text-white font-black tracking-wider">
          {initials}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-full overflow-hidden bg-gradient-to-tr from-google-blue via-blue-600 to-indigo-600 text-white font-black tracking-wider flex items-center justify-center shrink-0 border border-white/20 shadow-sm ${selectedSize} ${className}`}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
