import React from 'react';
import { GraduationCap } from 'lucide-react';

export const OreaEducationSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 space-y-6 animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-200 rounded" />
          <div className="h-4 w-48 bg-slate-200 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-32 bg-slate-200 rounded-xl" />
          <div className="h-8 w-28 bg-slate-200 rounded-xl" />
          <div className="h-8 w-8 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Hero Presentation Skeleton */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0f2347]/90 to-[#1e3a8a]/90 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3 max-w-2xl w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/10 w-52 h-6">
                <GraduationCap className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                <div className="h-3 w-36 bg-white/20 rounded" />
              </div>
              <div className="h-8 w-3/4 bg-white/20 rounded-lg" />
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-4/5 bg-white/10 rounded" />
            </div>
            <div className="h-10 w-44 bg-white/20 rounded-xl hidden sm:block shrink-0" />
          </div>

          {/* 4 Metric Cards Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-2"
              >
                <div className="h-3 w-20 bg-white/20 rounded" />
                <div className="h-6 w-14 bg-white/30 rounded" />
                <div className="h-2.5 w-24 bg-white/15 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-10 w-36 bg-slate-200 rounded-xl shrink-0"
          />
        ))}
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] h-11 bg-slate-100 rounded-2xl" />
          <div className="h-11 w-32 bg-slate-100 rounded-2xl" />
          <div className="h-11 w-28 bg-slate-100 rounded-2xl" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-24 bg-slate-100 rounded-xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Course Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="h-5 w-24 bg-slate-200 rounded-lg" />
                <div className="h-5 w-16 bg-slate-100 rounded-lg" />
              </div>
              <div className="h-6 w-5/6 bg-slate-200 rounded-md" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-full bg-slate-100 rounded" />
                <div className="h-3.5 w-4/5 bg-slate-100 rounded" />
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <div className="h-4 w-16 bg-slate-100 rounded" />
                <div className="h-4 w-20 bg-slate-100 rounded" />
              </div>
              <div className="h-9 w-full bg-slate-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
