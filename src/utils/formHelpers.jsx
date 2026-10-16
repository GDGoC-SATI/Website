import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaEdit } from 'react-icons/fa';

export const EVENT_TYPES = [
  'Hackathon',
  'Workshop',
  'Study Jam',
  'Conference',
  'Kick-off',
  'Info Session',
  'Tech Talk',
  'Hands-on Lab',
  'Meetup',
];

export const COMMON_LOCATIONS = [
  'Online',
  'Smart Classroom, SATI Vidisha',
  'KSH Auditorium, SATI Vidisha',
  'VVNCC Lab, SATI Vidisha',
];

export const STATUS_OPTIONS = [
  {
    value: 'Planning',
    label: 'Planning',
    badgeClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
    dotClass: 'bg-amber-500',
  },
  {
    value: 'Ongoing',
    label: 'Ongoing',
    badgeClass: 'text-google-blue dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40',
    dotClass: 'bg-google-blue animate-pulse',
  },
  {
    value: 'Completed',
    label: 'Completed',
    badgeClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
    dotClass: 'bg-emerald-500',
  },
];

/**
 * Returns formatted badge configuration for a given status
 */
export const getStatusBadgeConfig = (status = 'Completed') => {
  const norm = (status || '').toLowerCase().trim();
  if (norm.includes('ongoing') || norm.includes('live') || norm.includes('active') || norm.includes('in progress')) {
    return {
      label: 'Ongoing',
      className: 'text-google-blue dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40',
      dotClass: 'bg-google-blue animate-pulse',
      isLive: true,
    };
  }
  if (norm.includes('planning') || norm.includes('upcoming') || norm.includes('scheduled')) {
    return {
      label: 'Planning',
      className: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
      dotClass: 'bg-amber-500',
      isLive: false,
    };
  }
  return {
    label: 'Completed',
    className: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
    dotClass: 'bg-emerald-500',
    isLive: false,
  };
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] || '0', 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const hours12 = h % 12 === 0 ? 12 : h % 12;
  const minutes = m === 0 ? '00' : m < 10 ? `0${m}` : `${m}`;
  return `${hours12}:${minutes} ${period}`;
}

export function formatDateStr(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  const y = parts[0];
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  const month = MONTH_NAMES[m - 1] || '';
  return `${month} ${d}, ${y}`;
}

/**
 * Builds the canonical GDG formatted date string:
 * e.g., 'Jan 31, 2026, 11:00 AM – 4:00 PM (GMT+5:30)'
 */
export function buildFormattedDateRange({
  startDate,
  startTime,
  endDate,
  endTime,
  includeTimezone = true,
  tzString = 'GMT+5:30',
}) {
  if (!startDate) return '';

  const startFormatted = formatDateStr(startDate);
  const isMultiDay = endDate && endDate !== startDate;

  if (isMultiDay) {
    const endFormatted = formatDateStr(endDate);
    if (startTime && endTime) {
      const sTime = formatTime12h(startTime);
      const eTime = formatTime12h(endTime);
      return `${startFormatted}, ${sTime} – ${endFormatted}, ${eTime}${includeTimezone ? ` (${tzString})` : ''}`;
    }
    return `${startFormatted} – ${endFormatted}`;
  }

  // Single Day
  if (startTime && endTime) {
    const sTime = formatTime12h(startTime);
    const eTime = formatTime12h(endTime);
    return `${startFormatted}, ${sTime} – ${eTime}${includeTimezone ? ` (${tzString})` : ''}`;
  } else if (startTime) {
    const sTime = formatTime12h(startTime);
    return `${startFormatted}, ${sTime}${includeTimezone ? ` (${tzString})` : ''}`;
  }

  return startFormatted;
}

/**
 * Formatted Date & Time input with visual pickers and canonical format generator
 */
export const FormattedDateTimeInput = ({
  value = '',
  onChange,
  label = 'Date & Time',
  required = false,
  compact = false,
}) => {
  const [mode, setMode] = useState('picker'); // 'picker' | 'manual'
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('12:00');
  const [isMultiDay, setIsMultiDay] = useState(false);

  const applyFormat = () => {
    if (!startDate) return;
    const formatted = buildFormattedDateRange({
      startDate,
      startTime,
      endDate: isMultiDay ? endDate : '',
      endTime,
    });
    if (formatted) {
      onChange(formatted);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-google-red">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setMode(mode === 'picker' ? 'manual' : 'picker')}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-google-blue hover:underline"
        >
          {mode === 'picker' ? (
            <>
              <FaEdit size={10} /> Edit Raw Text
            </>
          ) : (
            <>
              <FaClock size={10} /> Use Format Builder
            </>
          )}
        </button>
      </div>

      {mode === 'manual' ? (
        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Jan 31, 2026, 11:00 AM – 4:00 PM (GMT+5:30)"
          className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-google-blue"
        />
      ) : (
        <div className={`p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 ${compact ? 'text-xs' : ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">Start Date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  const formatted = buildFormattedDateRange({
                    startDate: e.target.value,
                    startTime,
                    endDate: isMultiDay ? endDate : '',
                    endTime,
                  });
                  if (formatted) onChange(formatted);
                }}
                className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>

            <div>
              <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">Start Time</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  const formatted = buildFormattedDateRange({
                    startDate: startDate || new Date().toISOString().split('T')[0],
                    startTime: e.target.value,
                    endDate: isMultiDay ? endDate : '',
                    endTime,
                  });
                  if (formatted) onChange(formatted);
                }}
                className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>

            <div>
              <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">End Time</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  const formatted = buildFormattedDateRange({
                    startDate: startDate || new Date().toISOString().split('T')[0],
                    startTime,
                    endDate: isMultiDay ? endDate : '',
                    endTime: e.target.value,
                  });
                  if (formatted) onChange(formatted);
                }}
                className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isMultiDay}
                onChange={(e) => {
                  setIsMultiDay(e.target.checked);
                  const formatted = buildFormattedDateRange({
                    startDate,
                    startTime,
                    endDate: e.target.checked ? endDate : '',
                    endTime,
                  });
                  if (formatted) onChange(formatted);
                }}
                className="rounded border-slate-300 text-google-blue focus:ring-google-blue"
              />
              <span>Multi-day event</span>
            </label>

            {isMultiDay && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">End Date:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    const formatted = buildFormattedDateRange({
                      startDate,
                      startTime,
                      endDate: e.target.value,
                      endTime,
                    });
                    if (formatted) onChange(formatted);
                  }}
                  className="px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Formatted Preview */}
          <div className="pt-1 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              Output: <span className="text-google-blue font-bold">{value || 'No date set'}</span>
            </span>
            <button
              type="button"
              onClick={applyFormat}
              className="text-[10px] font-bold text-google-blue bg-google-blue/10 px-2 py-0.5 rounded hover:bg-google-blue hover:text-white transition-colors shrink-0"
            >
              Re-apply Format
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Dropdown Selector for Locations with common venues + custom option
 */
export const LocationSelect = ({
  value = '',
  onChange,
  label = 'Location',
  compact = false,
}) => {
  const isCommon = COMMON_LOCATIONS.includes(value);
  const [isCustom, setIsCustom] = useState(!isCommon && value !== '');

  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <select
        value={isCustom ? '__custom__' : value || 'Online'}
        onChange={(e) => {
          if (e.target.value === '__custom__') {
            setIsCustom(true);
          } else {
            setIsCustom(false);
            onChange(e.target.value);
          }
        }}
        className={`w-full ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 sm:py-2.5 text-xs sm:text-sm'} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-google-blue`}
      >
        {COMMON_LOCATIONS.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
        <option value="__custom__">Custom Location / Venue...</option>
      </select>

      {isCustom && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type custom venue or location..."
          className={`w-full mt-1.5 ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs sm:text-sm'} bg-white dark:bg-slate-800 border border-google-blue/50 rounded-xl text-slate-900 dark:text-white outline-none focus:border-google-blue`}
        />
      )}
    </div>
  );
};

/**
 * Dropdown Selector for Status (Planning, Ongoing, Completed) with visual color badge
 */
export const StatusSelect = ({
  value = 'Completed',
  onChange,
  label = 'Status',
  compact = false,
}) => {
  const currentBadge = getStatusBadgeConfig(value);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentBadge.className}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${currentBadge.dotClass}`} />
          {currentBadge.label}
        </span>
      </div>

      <select
        value={value || 'Completed'}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs sm:text-sm'} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-google-blue font-medium`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
