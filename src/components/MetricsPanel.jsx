import React from "react";
import { Clock, TrendingUp, BarChart3, Zap, PieChart } from "lucide-react";

export default function MetricsPanel({ completed, utilization = 0 }) {
  const hasData = completed && completed.length > 0;

  const avgWT = hasData
    ? completed.reduce((a, b) => a + (b.waitingTime || 0), 0) / completed.length
    : 0;

  const avgTAT = hasData
    ? completed.reduce((a, b) => a + (b.turnaroundTime || 0), 0) / completed.length
    : 0;

  const avgRT = hasData
    ? completed.reduce((a, b) => a + (b.responseTime !== undefined ? b.responseTime : (b.waitingTime || 0)), 0) / completed.length
    : 0;

  const formatSec = (val) => (hasData ? `${val.toFixed(2)}s` : "--");
  const formatPct = (val) => (hasData ? `${val.toFixed(1)}%` : "--");

  return (
    <div className="glass p-3 rounded-2xl border border-white/5 shadow-glow/5 relative overflow-hidden flex flex-col justify-between h-full min-h-[190px] max-h-[220px] w-full">
      {/* Header */}
      <div className="flex items-start gap-2 shrink-0 mb-1">
        <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
          <BarChart3 size={12} />
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-extrabold text-white font-sans tracking-tight">
            Simulation Metrics
          </h2>
          <p className="text-[9px] text-slate-400 mt-0.5 leading-tight font-sans">
            Key execution analytics.
          </p>
        </div>
      </div>

      {/* Grid: 2x2 layout of compact metrics */}
      <div className="grid grid-cols-2 gap-2 flex-grow pt-0.5">
        {/* Waiting Time Card */}
        <div className="glass rounded-lg p-2 border border-white/5 flex items-center justify-between gap-1.5">
          <div className="flex-grow min-w-0">
            <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold block truncate">
              Avg Wait Time
            </span>
            <p className="text-xs sm:text-sm font-black text-cyan-400 font-mono mt-0.5 leading-none">
              {formatSec(avgWT)}
            </p>
          </div>
          <div className="p-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <Clock size={10} />
          </div>
        </div>

        {/* Turnaround Time Card */}
        <div className="glass rounded-lg p-2 border border-white/5 flex items-center justify-between gap-1.5">
          <div className="flex-grow min-w-0">
            <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold block truncate">
              Avg Turnaround
            </span>
            <p className="text-xs sm:text-sm font-black text-purple-400 font-mono mt-0.5 leading-none">
              {formatSec(avgTAT)}
            </p>
          </div>
          <div className="p-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <TrendingUp size={10} />
          </div>
        </div>

        {/* Response Time Card */}
        <div className="glass rounded-lg p-2 border border-white/5 flex items-center justify-between gap-1.5">
          <div className="flex-grow min-w-0">
            <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold block truncate">
              Avg Response
            </span>
            <p className="text-xs sm:text-sm font-black text-emerald-400 font-mono mt-0.5 leading-none">
              {formatSec(avgRT)}
            </p>
          </div>
          <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Zap size={10} />
          </div>
        </div>

        {/* CPU Utilization Card */}
        <div className="glass rounded-lg p-2 border border-white/5 flex items-center justify-between gap-1.5">
          <div className="flex-grow min-w-0">
            <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold block truncate">
              CPU Utilization
            </span>
            <p className="text-xs sm:text-sm font-black text-amber-400 font-mono mt-0.5 leading-none">
              {formatPct(utilization)}
            </p>
          </div>
          <div className="p-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <PieChart size={10} />
          </div>
        </div>
      </div>
    </div>
  );
}