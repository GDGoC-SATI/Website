import React, { useMemo } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaLaptopCode,
  FaUserTie,
  FaTrophy,
  FaInfoCircle,
  FaCheckCircle,
  FaLightbulb,
} from 'react-icons/fa';

/**
 * Automatically structures and beautifies raw pasted text.
 * Delimits inline announcements, sections, and bullets.
 */
export const autoFormatEventDescription = (raw) => {
  if (!raw || typeof raw !== 'string') return '';
  let text = raw.trim();

  // 1. Separate common inline key-value pairs (e.g., "Date: ... Time: ... Platform: ...")
  text = text.replace(
    /([.!?])\s*(Date\s*(?:and|&)?\s*Time:|Platform:|Venue:|Location:|Time:|Hosted by:|Eligibility:|Registration Fee:|Prize Pool:|Event Highlights:|What You'll Learn:|Key Tracks:|Key Domains:|Perks & Recognition:|Perks:|Guidelines:|Rules:)/gi,
    '$1\n\n$2'
  );

  // 2. Separate emoji sections that were pasted inline without newlines
  text = text.replace(/([.!?])\s*([🚀💡🏆📌🎯🗓️⏰🎙️⚡🛠️📚🏅✨])\s*/g, '$1\n\n$2 ');

  // 3. Break dense highlight/learn blocks into formatted bullet points if pasted in one line
  const sections = text.split(/\n\n+/);
  const formattedSections = sections.map((sec) => {
    const trimmed = sec.trim();
    if (
      /^(Event Highlights|What You'll Learn|Key Topics|Key Tracks|Key Domains|Agenda|Rules|Guidelines|Perks|Perks & Recognition):/i.test(
        trimmed
      )
    ) {
      const parts = trimmed.split(/:\s*/);
      const header = parts[0] + ':';
      const body = parts.slice(1).join(': ');
      const sentences = body
        .split(/(?<=[.!?])\s+(?=[A-Z0-9•\-])/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (sentences.length > 1 && !sentences.some((s) => /^[•\-\*✔✅👉]/.test(s))) {
        return header + '\n' + sentences.map((s) => `• ${s}`).join('\n');
      }
    }
    return trimmed;
  });

  return formattedSections.join('\n\n');
};

/**
 * Helper to render inline formatting: bold (**), italics (*), code (`), and URLs
 */
const renderInlineFormatting = (text, keyPrefix = 'inline') => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={`${keyPrefix}-url-${i}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-google-blue hover:underline font-semibold break-all inline-flex items-center gap-1"
        >
          {part}
        </a>
      );
    }

    // Markdown bold (**) and italic (*) parsing
    const subTokens = part.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return (
      <React.Fragment key={`${keyPrefix}-txt-${i}`}>
        {subTokens.map((token, j) => {
          const subKey = `${keyPrefix}-${i}-${j}`;
          if (token.startsWith('**') && token.endsWith('**')) {
            return (
              <strong key={subKey} className="font-bold text-slate-900 dark:text-white">
                {token.slice(2, -2)}
              </strong>
            );
          }
          if (token.startsWith('*') && token.endsWith('*')) {
            return (
              <em key={subKey} className="italic text-slate-700 dark:text-slate-300">
                {token.slice(1, -1)}
              </em>
            );
          }
          if (token.startsWith('`') && token.endsWith('`')) {
            return (
              <code
                key={subKey}
                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-google-blue font-mono text-[11px] sm:text-xs"
              >
                {token.slice(1, -1)}
              </code>
            );
          }
          return token;
        })}
      </React.Fragment>
    );
  });
};

/**
 * Categorize key-value metadata to attach appropriate visual icons
 */
const getKeyMetaIcon = (key) => {
  const k = key.toLowerCase();
  if (k.includes('date') || k.includes('day')) return <FaCalendarAlt className="text-google-yellow shrink-0" size={13} />;
  if (k.includes('time') || k.includes('hour')) return <FaClock className="text-google-blue shrink-0" size={13} />;
  if (k.includes('venue') || k.includes('location') || k.includes('campus'))
    return <FaMapMarkerAlt className="text-google-red shrink-0" size={13} />;
  if (k.includes('platform') || k.includes('meet') || k.includes('online') || k.includes('virtual'))
    return <FaLaptopCode className="text-indigo-500 shrink-0" size={13} />;
  if (k.includes('host') || k.includes('speaker') || k.includes('organizer') || k.includes('lead'))
    return <FaUserTie className="text-google-green shrink-0" size={13} />;
  if (k.includes('prize') || k.includes('award') || k.includes('perk') || k.includes('reward'))
    return <FaTrophy className="text-amber-500 shrink-0" size={13} />;
  return <FaInfoCircle className="text-slate-400 shrink-0" size={13} />;
};

/**
 * Intelligent Structured Description Renderer
 */
export const StructuredDescription = ({ content, compact = false, className = '' }) => {
  const blocks = useMemo(() => {
    if (!content || typeof content !== 'string') return [];

    // Pre-format to ensure inline delimiters are broken out cleanly
    const formatted = autoFormatEventDescription(content);
    const rawLines = formatted
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const parsedBlocks = [];
    let currentList = null;
    let currentInfoGroup = null;

    const flushList = () => {
      if (currentList && currentList.items.length > 0) {
        parsedBlocks.push(currentList);
        currentList = null;
      }
    };

    const flushInfoGroup = () => {
      if (currentInfoGroup && currentInfoGroup.items.length > 0) {
        parsedBlocks.push(currentInfoGroup);
        currentInfoGroup = null;
      }
    };

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];

      // 1. Detect Callout / Note blocks (e.g., 📌 Don't miss..., ⚠️ Note:)
      if (/^(📌|⚠️|💡\s*Note:|Important:|Note:)/i.test(line)) {
        flushList();
        flushInfoGroup();
        parsedBlocks.push({
          type: 'callout',
          text: line.replace(/^(📌|⚠️|💡\s*Note:|Important:|Note:)\s*/i, '').trim(),
          prefix: line.match(/^(📌|⚠️|💡\s*Note:|Important:|Note:)/i)?.[0] || '📌',
        });
        continue;
      }

      // 2. Detect Key-Value Pairs (e.g., Date: 20th Oct, Platform: Google Meet)
      // Must have Key: Value format where Key is <= 25 characters and value exists
      const kvMatch = line.match(/^([🚀💡🏆📌🎯🗓️⏰🎙️⚡🛠️📚🏅✨]?\s*[A-Za-z\s&/]{2,25}):\s+(.+)$/);
      const isBullet = /^[•\-\*✔✅👉]/.test(line) || /^(Stage|Round|Phase|\d+\.)/i.test(line);

      if (kvMatch && !isBullet && !line.endsWith(':') && kvMatch[2].length < 180) {
        flushList();
        if (!currentInfoGroup) {
          currentInfoGroup = { type: 'info-grid', items: [] };
        }
        currentInfoGroup.items.push({
          key: kvMatch[1].trim(),
          value: kvMatch[2].trim(),
        });
        continue;
      } else {
        flushInfoGroup();
      }

      // 3. Detect Section Headings (Lines starting with emojis, markdown ###, or ending with ':')
      const isHeader =
        /^###?\s+/.test(line) ||
        /^[🚀💡🏆📌🎯⚡🛠️📚🏅✨]\s+[A-Za-z0-9]/.test(line) ||
        (/^[A-Za-z0-9\s&/—–-]{3,45}:$/.test(line) && !line.includes('.'));

      if (isHeader) {
        flushList();
        parsedBlocks.push({
          type: 'header',
          text: line.replace(/^###?\s+/, '').replace(/:$/, '').trim(),
        });
        continue;
      }

      // 4. Detect Bullet / Numbered List Items
      const bulletMatch = line.match(/^([•\-\*✔✅👉]|\d+\.|\bStage\s+\d+:|\bRound\s+\d+:|\bPhase\s+\d+:)\s*(.+)$/i);
      if (bulletMatch) {
        if (!currentList) {
          currentList = { type: 'list', items: [] };
        }

        const rawItem = bulletMatch[2].trim();
        // Check for "Title — Description" or "Title: Description" inside the item
        let itemTitle = '';
        let itemDesc = rawItem;

        const sepMatch = rawItem.match(/^([A-Za-z0-9\s&/—–-]{3,50})\s*(?:—|–|:)\s+(.+)$/);
        if (sepMatch && sepMatch[1].length < 45) {
          itemTitle = sepMatch[1].trim();
          itemDesc = sepMatch[2].trim();
        }

        currentList.items.push({
          title: itemTitle,
          desc: itemDesc,
          badge: bulletMatch[1].replace(/^[•\-\*]\s*/, '').trim(),
        });
        continue;
      } else {
        flushList();
      }

      // 5. Standard Paragraph
      parsedBlocks.push({
        type: 'paragraph',
        text: line,
      });
    }

    flushList();
    flushInfoGroup();

    return parsedBlocks;
  }, [content]);

  if (!content) return null;

  return (
    <div className={`space-y-3.5 sm:space-y-4 text-slate-700 dark:text-slate-300 ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'header':
            return (
              <div key={idx} className="pt-2 sm:pt-3 first:pt-0">
                <div className="flex items-center gap-2.5 mb-1.5 sm:mb-2">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    {renderInlineFormatting(block.text, `hdr-${idx}`)}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-700/80 to-transparent" />
                </div>
              </div>
            );

          case 'info-grid':
            return (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 my-2.5 sm:my-3"
              >
                {block.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
                  >
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 shadow-xs shrink-0">
                      {getKeyMetaIcon(item.key)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 truncate">
                        {item.key}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {renderInlineFormatting(item.value, `kv-${idx}-${itemIdx}`)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );

          case 'list':
            return (
              <div key={idx} className="space-y-2 sm:space-y-2.5 my-2 pl-0.5">
                {block.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-start gap-2.5 sm:gap-3 group text-xs sm:text-sm md:text-[15px] leading-relaxed"
                  >
                    {/* Custom Bullet Indicator */}
                    <span className="w-2 h-2 rounded-full bg-google-blue shrink-0 mt-2 ring-4 ring-blue-500/10 dark:ring-blue-400/20" />

                    <div className="flex-1 min-w-0">
                      {item.title && (
                        <span className="font-bold text-slate-900 dark:text-white mr-1.5 inline-block">
                          {renderInlineFormatting(item.title, `li-t-${idx}-${itemIdx}`)}
                          <span className="text-slate-400 dark:text-slate-500 ml-1 font-normal">—</span>
                        </span>
                      )}
                      <span className="text-slate-600 dark:text-slate-300">
                        {renderInlineFormatting(item.desc, `li-d-${idx}-${itemIdx}`)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );

          case 'callout':
            return (
              <div
                key={idx}
                className="my-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-amber-100 flex items-start gap-3 shadow-xs"
              >
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                  <FaLightbulb size={13} />
                </div>
                <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                  {renderInlineFormatting(block.text, `co-${idx}`)}
                </div>
              </div>
            );

          case 'paragraph':
          default:
            return (
              <p
                key={idx}
                className={`text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm md:text-[15px] ${
                  compact ? 'line-clamp-3' : ''
                }`}
              >
                {renderInlineFormatting(block.text, `p-${idx}`)}
              </p>
            );
        }
      })}
    </div>
  );
};

export default StructuredDescription;
