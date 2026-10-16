import React, { useMemo } from 'react';
import {
  FaExternalLinkAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaClock,
  FaInfoCircle,
  FaExclamationTriangle,
  FaBullhorn,
  FaDiscord,
  FaWhatsapp,
  FaGithub,
  FaGoogle,
} from 'react-icons/fa';

/**
 * Auto-structures raw announcement text into clean paragraphs, headers, and bullet points.
 */
export const autoFormatBroadcast = (text) => {
  if (!text || typeof text !== 'string') return '';
  let str = text.trim();

  // 0. Deduplicate repeated opening greetings (e.g. "Dear SAFAL,\n\nDear SAFAL,")
  str = str.replace(/^((?:Dear|Hi|Hello|Hey)\s+[^\n,:]+[,:]?\s*[\r\n]+)(\1)+/gi, '$1');

  // 1. Separate common inline headers (e.g. "Notice: ... Date: ... Contact: ...")
  str = str.replace(
    /([.!?])\s*(Important:|Notice:|Attention:|Note:|Date\s*(?:and|&)?\s*Time:|Venue:|Location:|Meeting Link:|Registration Link:|Contact Details:|Contact:|Helpline:|Agenda:)/gi,
    '$1\n\n$2'
  );

  // 2. Separate emoji headers
  str = str.replace(/([.!?])\s*([📢🚨🚀💡📌🗓️⏰📍🔗📞💬⚡🎉✨])\s*/g, '$1\n\n$2 ');

  // 3. Break dense bullet lines if joined without newline
  str = str.replace(/([.!?])\s*([•\-\*✔✅👉]|\b\d+\.)\s+/g, '$1\n$2 ');

  return str;
};

/**
 * Identify platform from URL
 */
const getUrlBadge = (url) => {
  const u = url.toLowerCase();
  if (u.includes('meet.google.com')) return { label: 'Google Meet', icon: <FaGoogle className="text-red-500" /> };
  if (u.includes('discord.gg') || u.includes('discord.com')) return { label: 'Discord', icon: <FaDiscord className="text-indigo-400" /> };
  if (u.includes('whatsapp.com') || u.includes('wa.me')) return { label: 'WhatsApp Group', icon: <FaWhatsapp className="text-emerald-500" /> };
  if (u.includes('github.com')) return { label: 'GitHub', icon: <FaGithub className="text-slate-800 dark:text-slate-200" /> };
  if (u.includes('youtube.com') || u.includes('youtu.be')) return { label: 'YouTube', icon: <FaExternalLinkAlt className="text-red-600" /> };
  return { label: null, icon: <FaExternalLinkAlt className="text-google-blue shrink-0" size={10} /> };
};

/**
 * Render text with clickable links, emails, and phone numbers.
 */
export const renderInteractiveTokens = (text, keyPrefix = 'tok') => {
  if (!text) return null;

  // Regex patterns
  const urlPattern = 'https?:\\/\\/[^\\s<>"{}|\\\\^`]+|www\\.[^\\s<>"{}|\\\\^`]+';
  const emailPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
  const phonePattern = '(?:\\+91[\\s-]?)?[6-9]\\d{4}[\\s-]?\\d{5}\\b|\\b\\+?\\d{1,3}[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b';

  // Combined master tokenizer regex
  const masterRegex = new RegExp(`(${urlPattern}|${emailPattern}|${phonePattern})`, 'gi');

  const parts = text.split(masterRegex);

  return parts.map((part, i) => {
    if (!part) return null;
    const tokenKey = `${keyPrefix}-${i}`;

    // 1. URL Match
    if (new RegExp(`^(${urlPattern})$`, 'i').test(part)) {
      const href = part.startsWith('http') ? part : `https://${part}`;
      const badge = getUrlBadge(href);

      return (
        <a
          key={tokenKey}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 my-0.5 rounded-lg bg-google-blue/10 hover:bg-google-blue/20 text-google-blue dark:text-blue-400 font-semibold text-[11px] sm:text-xs border border-google-blue/25 hover:border-google-blue/40 transition-all hover:scale-[1.02] shadow-xs break-all"
        >
          {badge.icon}
          <span>{badge.label || part.replace(/^https?:\/\//, '')}</span>
        </a>
      );
    }

    // 2. Email Match
    if (new RegExp(`^${emailPattern}$`, 'i').test(part)) {
      return (
        <a
          key={tokenKey}
          href={`mailto:${part}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 my-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] sm:text-xs border border-emerald-500/25 hover:border-emerald-500/40 transition-all hover:scale-[1.02] shadow-xs"
        >
          <FaEnvelope size={10} className="shrink-0" />
          <span>{part}</span>
        </a>
      );
    }

    // 3. Phone / Mobile Number Match
    if (new RegExp(`^(${phonePattern})$`).test(part)) {
      const cleanPhone = part.replace(/[^\d+]/g, '');
      return (
        <a
          key={tokenKey}
          href={`tel:${cleanPhone}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 my-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold text-[11px] sm:text-xs border border-amber-500/25 hover:border-amber-500/40 transition-all hover:scale-[1.02] shadow-xs"
        >
          <FaPhoneAlt size={10} className="shrink-0" />
          <span>{part}</span>
        </a>
      );
    }

    // 4. Standard Text with markdown bold (**) and code (`)
    const subTokens = part.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
      <React.Fragment key={tokenKey}>
        {subTokens.map((sub, j) => {
          const subKey = `${tokenKey}-${j}`;
          if (sub.startsWith('**') && sub.endsWith('**')) {
            return (
              <strong key={subKey} className="font-bold text-slate-900 dark:text-white">
                {sub.slice(2, -2)}
              </strong>
            );
          }
          if (sub.startsWith('`') && sub.endsWith('`')) {
            return (
              <code
                key={subKey}
                className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-google-blue font-mono text-[11px]"
              >
                {sub.slice(1, -1)}
              </code>
            );
          }
          return sub;
        })}
      </React.Fragment>
    );
  });
};

/**
 * Structured Broadcast Component
 * Renders broadcast announcements with auto-detected headers, bullet lists, callout alerts,
 * and clickable interactive links, emails, and phone numbers.
 */
export const StructuredBroadcast = ({ message, compact = false, className = '' }) => {
  const structuredBlocks = useMemo(() => {
    if (!message || typeof message !== 'string') return [];

    const formatted = autoFormatBroadcast(message);
    const rawLines = formatted.split('\n').map((l) => l.trim()).filter(Boolean);

    // Filter consecutive duplicate lines (e.g. repeated greetings like "Dear SAFAL,")
    const cleanLines = [];
    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const prev = cleanLines[cleanLines.length - 1];
      if (prev && prev.toLowerCase().replace(/[,.:]$/, '').trim() === line.toLowerCase().replace(/[,.:]$/, '').trim()) {
        continue;
      }
      cleanLines.push(line);
    }

    const blocks = [];
    let currentList = null;

    cleanLines.forEach((line) => {
      // Check for bullet point
      const bulletMatch = line.match(/^([•\-\*✔✅👉]|\d+[\.)])\s+(.*)/);
      if (bulletMatch) {
        if (!currentList) {
          currentList = { type: 'list', items: [] };
          blocks.push(currentList);
        }
        currentList.items.push(bulletMatch[2]);
        return;
      }

      // If we were accumulating a list and hit a non-bullet, reset list
      currentList = null;

      // Check for Callout / Alert line (Important:, Note:, Warning:, etc.)
      const calloutMatch = line.match(/^(Important|Notice|Note|Attention|Warning|Alert|Deadline):?\s*(.*)/i);
      if (calloutMatch) {
        blocks.push({
          type: 'callout',
          label: calloutMatch[1],
          text: calloutMatch[2],
        });
        return;
      }

      // Check for Section Header
      const isHeader =
        /^([📢🚨🚀💡📌🗓️⏰📍🔗📞💬⚡🎉✨#])/.test(line) ||
        (line.endsWith(':') && line.length < 70);

      if (isHeader) {
        blocks.push({ type: 'header', text: line });
        return;
      }

      // Regular Paragraph
      blocks.push({ type: 'paragraph', text: line });
    });

    return blocks;
  }, [message]);

  if (!message) return null;

  // In compact mode (e.g. navbar dropdown preview)
  if (compact) {
    const formatted = autoFormatBroadcast(message);
    return (
      <div className={`text-xs text-slate-600 dark:text-slate-300 leading-snug ${className}`}>
        {renderInteractiveTokens(formatted, 'compact')}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {structuredBlocks.map((block, idx) => {
        // 1. Callout Box
        if (block.type === 'callout') {
          return (
            <div
              key={`callout-${idx}`}
              className="p-3 sm:p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-2.5 my-2 shadow-xs"
            >
              <FaExclamationTriangle className="text-amber-500 shrink-0 mt-0.5" size={14} />
              <div className="leading-relaxed min-w-0 flex-1">
                <span className="font-bold uppercase tracking-wider text-[10px] text-amber-700 dark:text-amber-300 block mb-0.5">
                  {block.label}
                </span>
                <span>{renderInteractiveTokens(block.text, `callout-text-${idx}`)}</span>
              </div>
            </div>
          );
        }

        // 2. Section Header
        if (block.type === 'header') {
          return (
            <div
              key={`hdr-${idx}`}
              className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 first:border-t-0 first:pt-0"
            >
              <span>{renderInteractiveTokens(block.text, `hdr-text-${idx}`)}</span>
            </div>
          );
        }

        // 3. Bulleted List
        if (block.type === 'list') {
          return (
            <ul key={`list-${idx}`} className="space-y-1.5 pl-1 sm:pl-2 my-1">
              {block.items.map((item, itemIdx) => (
                <li
                  key={`li-${idx}-${itemIdx}`}
                  className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-google-blue shrink-0 mt-2" />
                  <span className="flex-1 min-w-0">
                    {renderInteractiveTokens(item, `li-item-${idx}-${itemIdx}`)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        // 4. Standard Paragraph
        return (
          <p
            key={`p-${idx}`}
            className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words"
          >
            {renderInteractiveTokens(block.text, `p-text-${idx}`)}
          </p>
        );
      })}
    </div>
  );
};

export default StructuredBroadcast;
