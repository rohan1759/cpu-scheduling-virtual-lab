import React from "react";
import { Calendar } from "lucide-react";

export default function GanttChart({ timeline = [], currentTick = null }) {
  const getGanttBlocks = () => {
    if (!timeline || timeline.length === 0) return [];

    // Sort execution segments by start time
    const sorted = [...timeline].sort((a, b) => a.startTime - b.startTime);
    const blocks = [];
    let lastTime = 0;

    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      if (p.startTime > lastTime) {
        blocks.push({
          pid: "Idle",
          isIdle: true,
          startTime: lastTime,
          completionTime: p.startTime,
        });
      }
      blocks.push({
        pid: p.pid,
        isIdle: false,
        startTime: p.startTime,
        completionTime: p.completionTime,
      });
      lastTime = p.completionTime;
    }
    return blocks;
  };

  const blocks = getGanttBlocks();
  const scale = 40; // 40px per second representation
  const totalTime = blocks.length > 0 ? blocks[blocks.length - 1].completionTime : 0;

  // Generate ruler tick numbers
  const rulerTicks = [];
  for (let t = 0; t <= Math.max(18, totalTime); t++) {
    rulerTicks.push(t);
  }

  // Color mappings for dynamic Gantt blocks
  const getBlockStyles = (pid) => {
    switch (pid) {
      case "P1": return "bg-blue-600/80 border-blue-500/40 text-blue-100 shadow-[inset_0_0_8px_rgba(59,130,246,0.2)]";
      case "P2": return "bg-emerald-600/80 border-emerald-500/40 text-emerald-100 shadow-[inset_0_0_8px_rgba(16,185,129,0.2)]";
      case "P3": return "bg-amber-600/80 border-amber-500/40 text-amber-100 shadow-[inset_0_0_8px_rgba(245,158,11,0.2)]";
      case "P4": return "bg-purple-600/80 border-purple-500/40 text-purple-100 shadow-[inset_0_0_8px_rgba(139,92,246,0.2)]";
      default: return "bg-slate-800/60 border-slate-700/40 text-slate-400";
    }
  };

  return (
    <div className="glass rounded-2xl p-3 border border-white/5 shadow-glow/5 relative overflow-hidden w-full flex flex-col justify-between h-full min-h-[200px] max-h-[150px]">
      {/* Header */}
      <div className="flex items-start gap-2 shrink-0 mb-1">
        <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
          <Calendar size={12} />
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-extrabold text-white font-sans tracking-tight">
            Gantt Timeline
          </h2>
          <p className="text-[9px] text-slate-400 mt-0.5 leading-tight font-sans">
            Chronological sequence of scheduled operations.
          </p>
        </div>
      </div>

      {/* Main Gantt Scroller */}
      {blocks.length === 0 ? (
        <div className="flex-grow flex items-center justify-center py-3 border border-dashed border-slate-800 rounded-xl">
          <p className="text-slate-500 italic text-2xs font-semibold">
            No data to display. Start simulation to render the Gantt chart.
          </p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-between overflow-x-auto scrollbar-dense pr-1 py-0.5">
          {/* Scrollable Container */}
          <div className="relative min-w-[760px] pb-4" style={{ width: `${Math.max(18, totalTime) * scale + 60}px` }}>
            {/* Axis Ruler Header Row */}
            <div className="relative h-5 border-b border-white/10 mb-1 flex items-end">
              <span className="absolute -left-12 bottom-1 text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">
                Time (s)
              </span>

              {rulerTicks.map((t) => (
                <div
                  key={t}
                  className="absolute flex flex-col items-center justify-end"
                  style={{ left: `${t * scale}px` }}
                >
                  <span className="text-[7px] font-mono font-black text-slate-500 leading-none mb-0.5">
                    {t}
                  </span>
                  <div className="w-[1px] h-1 bg-slate-700" />
                </div>
              ))}
            </div>

            {/* Gantt Bars Row */}
            <div className="relative h-8 flex rounded-lg border border-white/5 overflow-hidden bg-slate-950/20">
              {/* Sliding Playhead Cursor */}
              {currentTick !== null && currentTick !== undefined && currentTick <= totalTime && (
                <div
                  className="absolute top-0 bottom-0 w-[1px] border-l border-dashed border-red-500 z-20 pointer-events-none transition-all duration-300"
                  style={{ left: `${currentTick * scale}px` }}
                >
                  <div className="absolute bottom-0 -left-[4.5px] playhead-triangle" />
                </div>
              )}

              {/* Blocks */}
              {blocks.map((b, i) => {
                const duration = b.completionTime - b.startTime;
                const width = duration * scale;

                return (
                  <div
                    key={i}
                    className={`h-full flex flex-col items-center justify-center border-r border-white/5 last:border-r-0 select-none group font-mono font-black text-2xs cursor-default relative overflow-hidden transition-all duration-300 ${getBlockStyles(b.pid)}`}
                    style={{ width: `${width}px` }}
                  >
                    <span>{b.pid}</span>
                    <span className="text-[7px] font-medium text-white/50 leading-none mt-0">
                      ({b.startTime}-{b.completionTime})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}