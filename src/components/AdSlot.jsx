import React from 'react';

/**
 * AdSlot Component - Non-intrusive container reserved for future programmatic / AdSense units.
 * Renders cleanly without disruptive layout shifts (CLS) and without fake ad content.
 */
export default function AdSlot({ slotId = 'default', format = 'horizontal', className = '' }) {
  // If no publisher ID or ad network is configured, render a clean, non-intrusive semantic placeholder or empty container
  return (
    <aside 
      aria-label="Sponsorship / Partner Notice"
      className={`w-full max-w-6xl mx-auto my-6 px-4 ${className}`}
    >
      <div className="w-full min-h-[60px] sm:min-h-[90px] rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/40 flex items-center justify-between px-4 py-2.5 text-[11px] font-bold text-slate-400">
        <span className="uppercase tracking-widest text-[9px] font-black text-slate-400">
          CleanAir Partner Zone
        </span>
        <span className="text-[10px] text-slate-400">
          Reserved for privacy-friendly atmospheric sponsorships
        </span>
      </div>
    </aside>
  );
}
