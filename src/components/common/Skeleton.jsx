import React from 'react';

export const Shimmer = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-lg ${className}`}
  />
);

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full space-y-4">
    <Shimmer className="h-48 w-full rounded-2xl" />
    <Shimmer className="h-6 w-3/4 rounded-md" />
    <Shimmer className="h-4 w-full rounded-md" />
    <Shimmer className="h-4 w-5/6 rounded-md" />
    <div className="flex gap-2 pt-4 mt-auto">
      <Shimmer className="h-6 w-16 rounded-full" />
      <Shimmer className="h-6 w-16 rounded-full" />
      <Shimmer className="h-6 w-16 rounded-full" />
    </div>
  </div>
);

export const MemberSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4">
    <Shimmer className="w-28 h-28 rounded-full" />
    <Shimmer className="h-5 w-32 rounded-md" />
    <Shimmer className="h-4 w-24 rounded-md" />
    <div className="flex gap-3 pt-2">
      <Shimmer className="w-8 h-8 rounded-full" />
      <Shimmer className="w-8 h-8 rounded-full" />
      <Shimmer className="w-8 h-8 rounded-full" />
    </div>
  </div>
);

export const TimelineSkeleton = () => (
  <div className="w-full space-y-8 my-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-6 items-start">
        <Shimmer className="w-12 h-12 rounded-full shrink-0" />
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex-grow space-y-3">
          <Shimmer className="h-6 w-1/3 rounded-md" />
          <Shimmer className="h-4 w-1/4 rounded-md" />
          <Shimmer className="h-40 w-full rounded-xl" />
          <Shimmer className="h-4 w-full rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

export const GridSkeleton = ({ count = 6, type = 'card' }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, idx) =>
      type === 'member' ? <MemberSkeleton key={idx} /> : <CardSkeleton key={idx} />
    )}
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full space-y-3">
    <Shimmer className="h-10 w-full rounded-xl" />
    {Array.from({ length: rows }).map((_, i) => (
      <Shimmer key={i} className="h-14 w-full rounded-xl" />
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
     
      

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <Shimmer className="h-32 sm:h-40 w-full rounded-none" />
        <div className="px-6 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden shadow-lg bg-slate-200 dark:bg-slate-800 shrink-0">
              <Shimmer className="w-full h-full rounded-full" />
            </div>
            <div className="flex gap-2">
              <Shimmer className="h-9 w-28 rounded-xl" />
            </div>
          </div>
          <div className="space-y-3">
            <Shimmer className="h-7 w-48 rounded-lg" />
            <Shimmer className="h-4 w-32 rounded-md" />
            <div className="flex gap-2 pt-1">
              <Shimmer className="h-6 w-20 rounded-full" />
              <Shimmer className="h-6 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-3">
            <Shimmer className="h-4 w-20 rounded-md" />
            <Shimmer className="h-4 w-full rounded-md" />
            <Shimmer className="h-4 w-5/6 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Shimmer className="h-16 w-full rounded-2xl" />
            <Shimmer className="h-16 w-full rounded-2xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <Shimmer className="h-4 w-24 rounded-md" />
            <Shimmer className="h-10 w-full rounded-xl" />
            <Shimmer className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const SettingsSkeleton = () => (
  <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Shimmer className="h-6 w-24 rounded-lg" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
        <Shimmer className="w-16 h-16 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-grow">
          <Shimmer className="h-6 w-40 rounded-md" />
          <Shimmer className="h-4 w-56 rounded-md" />
        </div>
      </div>

      {/* Appearance card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <Shimmer className="h-5 w-32 rounded-md" />
        <div className="flex justify-between items-center pt-2">
          <div className="space-y-1">
            <Shimmer className="h-4 w-24 rounded-md" />
            <Shimmer className="h-3 w-40 rounded-md" />
          </div>
          <Shimmer className="h-9 w-28 rounded-xl" />
        </div>
      </div>

      {/* Password card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <Shimmer className="h-5 w-36 rounded-md" />
        <Shimmer className="h-11 w-full rounded-xl" />
        <Shimmer className="h-11 w-full rounded-xl" />
        <Shimmer className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  </div>
);

export const AdminSkeleton = () => (
  <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Shimmer className="h-8 w-60 rounded-xl" />
          <Shimmer className="h-4 w-80 rounded-md" />
        </div>
        <div className="flex gap-3">
          <Shimmer className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <Shimmer className="h-4 w-20 rounded-md" />
              <Shimmer className="w-8 h-8 rounded-lg" />
            </div>
            <Shimmer className="h-7 w-16 rounded-md" />
          </div>
        ))}
      </div>

      {/* Table section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Shimmer className="h-9 w-28 rounded-xl" />
          <Shimmer className="h-9 w-28 rounded-xl" />
          <Shimmer className="h-9 w-28 rounded-xl" />
          <Shimmer className="h-9 w-28 rounded-xl" />
        </div>
        <TableSkeleton rows={5} />
      </div>
    </div>
  </div>
);
