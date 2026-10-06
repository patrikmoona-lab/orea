import React from 'react';
import { BookOpen } from 'lucide-react';
import { ValueBarItem } from '../types';

interface ValueBarProps {
  items: ValueBarItem[];
  onItemClick?: (id: string) => void;
}

export const ValueBar: React.FC<ValueBarProps> = ({ items, onItemClick }) => {
  return (
    <section className="w-full py-4 sm:py-6 bg-white">
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="w-full rounded-2xl bg-[#f4f9fd] border border-[#e1eef8] p-4 sm:p-5 shadow-[0_2px_14px_rgba(37,99,235,0.04)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-2">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <div
                  key={item.id}
                  onClick={() => onItemClick?.(item.id)}
                  className={`flex items-center gap-4 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl transition-all cursor-pointer hover:bg-white/80 ${
                    !isLast ? 'lg:border-r lg:border-[#d9e8f6]' : ''
                  }`}
                >
                  {/* Circular Icon Container */}
                  <div className="w-12 h-12 rounded-full bg-[#e4f0fc] border border-[#d2e6fa] flex items-center justify-center text-[#2563eb] shrink-0 shadow-xs">
                    {item.iconType === 'shield' && (
                      <svg viewBox="0 0 24 24" fill="none" className="w-5.5 h-5.5 text-[#2563eb]">
                        <path
                          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.5 12l2 2 3.5-3.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}

                    {item.iconType === 'sprout' && (
                      <svg viewBox="0 0 24 24" fill="none" className="w-5.5 h-5.5 text-[#2563eb]">
                        <path
                          d="M7 20h10"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 20v-8"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 12c-3.5 0-6-2.5-6-6 4 0 6 2.5 6 6z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 14c3.5 0 6-2 6-5-3.5 0-6 2-6 5z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}

                    {item.iconType === 'heart' && (
                      <svg viewBox="0 0 24 24" fill="none" className="w-5.5 h-5.5 text-[#2563eb]">
                        <path
                          d="M12 8c1-2 3.5-2.5 5-1s1.5 4 0 5.5l-5 4.5-5-4.5C5.5 11 6 8.5 7 7s4-1 5 1z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 18c3-1 6-1 8 0s5 1 8 0"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}

                    {item.iconType === 'book' && (
                      <BookOpen className="w-5.5 h-5.5 text-[#2563eb]" strokeWidth={1.8} />
                    )}
                  </div>

                  {/* Text labels */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-[#0f2347] leading-snug truncate">
                      {item.title}
                    </span>
                    <span className="text-[12px] text-[#64748b] leading-tight mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
