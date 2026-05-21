import React from "react";
import { Trophy } from "lucide-react";

export default function PerformanceSummary({ best }) {
  const algoName = best ? best.name : "SJF";
  const awtVal = best ? best.AWT.toFixed(2) : "3.10";

  return (
    <div className="glass p-5 rounded-2xl border border-white/5 shadow-glow/5 relative overflow-hidden flex flex-col justify-between h-full min-h-[170px]">
      <h3 className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest text-center shrink-0">
        Performance Summary
      </h3>

      <div className="flex items-center justify-between gap-4 my-auto">
        {/* Trophy with Laurel Wreaths */}
        <div className="relative w-28 h-24 flex items-center justify-center shrink-0">
          {/* Laurel Wreath Left */}
          <svg className="absolute left-1 w-8 h-16 text-emerald-500 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18c-2-1.5-3-3.5-3-6s1-4.5 3-6" />
            <path d="M3 14c-1-1-1.5-2-1.5-3.5s.5-2.5 1.5-3.5" />
            <path d="M7 10c-.5-1-1-2.5-1-4" />
            <path d="M5 16c-.5-1-1-2-1-3.5" />
          </svg>

          {/* Trophy Central Cup */}
          <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.4)] border border-yellow-200">
            <Trophy className="text-amber-950 w-6 h-6 fill-amber-950/20" />
          </div>

          {/* Laurel Wreath Right */}
          <svg className="absolute right-1 w-8 h-16 text-emerald-500 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 18c2-1.5 3-3.5 3-6s-1-4.5-3-6" />
            <path d="M21 14c1-1 1.5-2 1.5-3.5s-.5-2.5-1.5-3.5" />
            <path d="M17 10c.5-1 1-2.5 1-4" />
            <path d="M19 16c.5-1 1-2 1-3.5" />
          </svg>
        </div>

        {/* Dynamic Recommendation Text */}
        <div className="flex-grow text-center pr-2 flex flex-col justify-center">
          <p className="text-[10px] text-slate-400 leading-normal font-sans">
            Based on the current set of processes, the most efficient algorithm is
          </p>
          <h4 className="text-xl font-extrabold text-emerald-400 font-sans tracking-tight leading-none mt-1">
            {algoName}
          </h4>
          <p className="text-[10px] text-slate-400 leading-normal font-sans mt-1">
            with average waiting time of
          </p>
          <span className="text-base font-bold text-emerald-400 font-mono mt-0.5">
            {awtVal}s
          </span>
        </div>
      </div>
    </div>
  );
}
