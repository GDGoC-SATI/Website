import React from 'react';

/**
 * Base Shimmer component with smooth pulse gradient in light & dark mode
 */
export const Shimmer = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700/70 dark:to-slate-800 rounded-lg ${className}`}
  />
);

/**
 * Card Skeleton: Matches modern rounded-3xl showcase cards (Projects, Gallery, Events)
 */
export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full space-y-4 overflow-hidden">
    <Shimmer className="h-44 sm:h-48 w-full rounded-2xl shrink-0" />
    <div className="flex items-center gap-2">
      <Shimmer className="h-5 w-20 rounded-full" />
      <Shimmer className="h-4 w-28 rounded-md" />
    </div>
    <Shimmer className="h-6 w-3/4 rounded-lg" />
    <div className="space-y-2">
      <Shimmer className="h-4 w-full rounded-md" />
      <Shimmer className="h-4 w-5/6 rounded-md" />
    </div>
    <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100 dark:border-slate-800/80">
      <div className="flex gap-1.5">
        <Shimmer className="h-5 w-14 rounded-md" />
        <Shimmer className="h-5 w-14 rounded-md" />
      </div>
      <Shimmer className="h-8 w-20 rounded-xl" />
    </div>
  </div>
);

/**
 * List Item Skeleton: Matches horizontal list items (Projects, Gallery, Events list view)
 */
export const ListItemSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1 w-full sm:w-auto">
      <Shimmer className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl shrink-0" />
      <div className="min-w-0 flex-1 space-y-2 w-full">
        <div className="flex items-center gap-2">
          <Shimmer className="h-4 w-16 rounded-full" />
          <Shimmer className="h-3.5 w-28 rounded-md" />
          <Shimmer className="h-3.5 w-24 rounded-md hidden sm:block" />
        </div>
        <Shimmer className="h-5 w-3/4 sm:w-1/2 rounded-md" />
        <Shimmer className="h-3.5 w-full sm:w-4/5 rounded-md" />
      </div>
    </div>
    <div className="w-full sm:w-auto flex items-center justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
      <Shimmer className="h-8 w-24 rounded-xl" />
    </div>
  </div>
);

/**
 * Member Skeleton: Matches modern Team / Alumni member cards
 */
export const MemberSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4">
    <Shimmer className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl" />
    <Shimmer className="h-5 w-36 rounded-md" />
    <Shimmer className="h-4 w-24 rounded-full" />
    <Shimmer className="h-3.5 w-4/5 rounded-md" />
    <div className="flex gap-2.5 pt-2">
      <Shimmer className="w-8 h-8 rounded-xl" />
      <Shimmer className="w-8 h-8 rounded-xl" />
      <Shimmer className="w-8 h-8 rounded-xl" />
    </div>
  </div>
);

/**
 * Timeline Skeleton: Matches multi-stage event journey / timeline items
 */
export const TimelineSkeleton = () => (
  <div className="w-full space-y-6 my-4 pl-4 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 ml-2 sm:ml-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shimmer className="h-5 w-20 rounded-full" />
            <Shimmer className="h-5 w-24 rounded-full" />
          </div>
          <Shimmer className="h-4 w-32 rounded-md" />
        </div>
        <Shimmer className="h-6 w-2/3 rounded-lg" />
        <div className="space-y-2">
          <Shimmer className="h-3.5 w-full rounded-md" />
          <Shimmer className="h-3.5 w-4/5 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Event Details Skeleton: Matches modern EventDetails.jsx layout pixel-for-pixel
 */
export const EventDetailsSkeleton = () => (
  <div className="min-h-screen pt-15 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header: Back Button & Edit button */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-8">
        <Shimmer className="h-8 w-28 rounded-xl" />
        <Shimmer className="h-8 w-24 rounded-xl" />
      </div>

      {/* Main Event Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
        {/* Banner Area */}
        <Shimmer className="w-full h-44 sm:h-64 md:h-80 rounded-none" />

        {/* Content Area */}
        <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">
          {/* Header row */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Shimmer className="h-6 w-24 rounded-full" />
              <Shimmer className="h-6 w-24 rounded-full" />
            </div>
            <Shimmer className="h-8 sm:h-10 w-3/4 rounded-xl" />
            <div className="flex flex-wrap gap-4 pt-1">
              <Shimmer className="h-4 w-40 rounded-md" />
              <Shimmer className="h-4 w-48 rounded-md" />
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Shimmer className="h-6 w-36 rounded-md" />
            <div className="space-y-2 pt-1">
              <Shimmer className="h-4 w-full rounded-md" />
              <Shimmer className="h-4 w-11/12 rounded-md" />
              <Shimmer className="h-4 w-4/5 rounded-md" />
            </div>
          </div>

          {/* Timeline or Stage Items */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Shimmer className="w-9 h-9 rounded-xl" />
              <div className="space-y-1.5">
                <Shimmer className="h-5 w-36 rounded-md" />
                <Shimmer className="h-3 w-48 rounded-md" />
              </div>
            </div>
            <TimelineSkeleton />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Grid Skeleton: Renders cards, list items, or members
 */
export const GridSkeleton = ({ count = 6, type = 'card' }) => {
  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, idx) => (
          <ListItemSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (type === 'member') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <MemberSkeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * Table Skeleton: Modern table row shimmers with cells, badges, and action buttons
 */
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full space-y-3">
    {/* Table Header Row */}
    <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 px-4 flex items-center justify-between">
      <Shimmer className="h-4 w-24 rounded-md" />
      <Shimmer className="h-4 w-32 rounded-md hidden sm:block" />
      <Shimmer className="h-4 w-20 rounded-md hidden md:block" />
      <Shimmer className="h-4 w-16 rounded-md" />
    </div>

    {/* Table Body Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="h-14 sm:h-16 w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-4 flex items-center justify-between gap-4 shadow-xs"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Shimmer className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0" />
          <div className="space-y-1.5 min-w-0 flex-1">
            <Shimmer className="h-4 w-32 sm:w-44 rounded-md" />
            <Shimmer className="h-3 w-24 sm:w-32 rounded-md" />
          </div>
        </div>
        <Shimmer className="h-6 w-20 rounded-full shrink-0" />
        <div className="flex gap-2 shrink-0">
          <Shimmer className="w-7 h-7 rounded-lg" />
          <Shimmer className="w-7 h-7 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Profile Skeleton: Matches modern max-w-7xl Profile.jsx layout
 */
export const ProfileSkeleton = () => (
  <div className="min-h-screen pt-15 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <Shimmer className="h-6 w-20 rounded-lg" />

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Banner Area */}
        <Shimmer className="h-32 sm:h-44 md:h-52 w-full rounded-none" />

        <div className="px-6 sm:px-10 pb-8">
          {/* Overlapping Avatar and Joined Meta */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800 shrink-0">
              <Shimmer className="w-full h-full rounded-full" />
            </div>
            <Shimmer className="h-8 w-32 rounded-xl self-start sm:self-auto" />
          </div>

          {/* Name & Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Shimmer className="h-8 w-52 rounded-xl" />
              <Shimmer className="h-5 w-28 rounded-full" />
              <Shimmer className="h-5 w-24 rounded-full" />
            </div>
            <Shimmer className="h-4 w-32 rounded-md" />
            <Shimmer className="h-4 w-3/4 sm:w-1/2 rounded-md" />

            {/* Quick Meta Row */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Shimmer className="h-4 w-28 rounded-md" />
              <Shimmer className="h-4 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Details & Projects) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <Shimmer className="h-6 w-32 rounded-md" />
            <div className="space-y-2">
              <Shimmer className="h-4 w-full rounded-md" />
              <Shimmer className="h-4 w-11/12 rounded-md" />
              <Shimmer className="h-4 w-4/5 rounded-md" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <Shimmer className="h-6 w-40 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Shimmer className="h-28 w-full rounded-2xl" />
              <Shimmer className="h-28 w-full rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar & Socials) */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <Shimmer className="h-5 w-32 rounded-md" />
            <div className="space-y-3">
              <Shimmer className="h-10 w-full rounded-xl" />
              <Shimmer className="h-10 w-full rounded-xl" />
              <Shimmer className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Settings Skeleton: Matches modern max-w-7xl Settings.jsx layout
 */
export const SettingsSkeleton = () => (
  <div className="min-h-screen pt-15 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Shimmer className="h-5 w-32 rounded-lg" />
      </div>

      {/* Page Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Shimmer className="w-14 h-14 rounded-2xl shrink-0" />
          <div className="space-y-2">
            <Shimmer className="h-7 w-52 rounded-xl" />
            <Shimmer className="h-4 w-72 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 shrink-0">
          <Shimmer className="w-10 h-10 rounded-full" />
          <div className="space-y-1 pr-3">
            <Shimmer className="h-3.5 w-24 rounded-md" />
            <Shimmer className="h-3 w-16 rounded-md" />
          </div>
        </div>
      </div>

      {/* Privacy Settings Card (Auto-saving toggles) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <Shimmer className="w-9 h-9 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Shimmer className="h-5 w-52 rounded-md" />
            <Shimmer className="h-3.5 w-80 rounded-md" />
          </div>
        </div>

        {/* 3 Toggle Setting Items */}
        <div className="space-y-4 pt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-start gap-3.5 pr-4 flex-1">
                <Shimmer className="w-9 h-9 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Shimmer className="h-4 w-44 rounded-md" />
                  <Shimmer className="h-3 w-3/4 rounded-md" />
                </div>
              </div>
              <Shimmer className="w-6 h-6 rounded-md shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-red-100 dark:border-red-950/30 space-y-4">
        <Shimmer className="h-5 w-32 rounded-md" />
        <Shimmer className="h-4 w-96 rounded-md" />
        <Shimmer className="h-10 w-36 rounded-xl" />
      </div>
    </div>
  </div>
);

/**
 * Admin Skeleton: Matches modern Admin Console dashboard
 */
export const AdminSkeleton = () => (
  <div className="min-h-screen pt-15 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Executive Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <Shimmer className="w-14 h-14 rounded-2xl shrink-0" />
          <div className="space-y-2">
            <Shimmer className="h-7 w-60 rounded-xl" />
            <Shimmer className="h-4 w-80 rounded-md" />
          </div>
        </div>
        <div className="flex gap-2.5">
          <Shimmer className="h-10 w-28 rounded-xl" />
          <Shimmer className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center">
              <Shimmer className="h-3.5 w-20 rounded-md" />
              <Shimmer className="w-8 h-8 rounded-lg" />
            </div>
            <Shimmer className="h-8 w-16 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Content Section with Tabs & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Shimmer className="h-9 w-28 rounded-xl" />
            <Shimmer className="h-9 w-28 rounded-xl" />
            <Shimmer className="h-9 w-28 rounded-xl" />
            <Shimmer className="h-9 w-28 rounded-xl" />
          </div>
          <Shimmer className="h-9 w-full sm:w-64 rounded-xl" />
        </div>
        <TableSkeleton rows={5} />
      </div>
    </div>
  </div>
);

/**
 * Page Skeleton: Standard full-page Suspense fallback
 */
export const PageSkeleton = () => (
  <div className="min-h-screen pt-15 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Skeleton */}
      <div className="max-w-2xl mx-auto text-center space-y-3 pt-6 pb-2">
        <Shimmer className="h-6 w-28 mx-auto rounded-full" />
        <Shimmer className="h-10 w-2/3 mx-auto rounded-xl" />
        <Shimmer className="h-4 w-4/5 mx-auto rounded-md" />
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default {
  Shimmer,
  CardSkeleton,
  ListItemSkeleton,
  MemberSkeleton,
  TimelineSkeleton,
  EventDetailsSkeleton,
  GridSkeleton,
  TableSkeleton,
  ProfileSkeleton,
  SettingsSkeleton,
  AdminSkeleton,
  PageSkeleton,
};
