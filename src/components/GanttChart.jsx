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

  // Calculate total time
  const totalTime = blocks.length > 0 ? blocks[blocks.length - 1].completionTime : 0;

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 shadow-glow/5 relative overflow-hidden w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Calendar size={20} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
            Gantt Timeline Chart
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Chronological sequence of scheduled operations and idle cycles (scaled by duration).
          </p>
        </div>
      </div>

      {blocks.length === 0 ? (
        <p className="text-slate-500 italic text-center py-4 text-sm font-semibold">
          No data to display. Start simulation to render the Gantt chart timeline.
        </p>
      ) : (
        <div className="overflow-x-auto pb-12 pt-6 px-6 scrollbar-thin">
          <div 
            className="relative flex items-stretch border border-white/10 rounded-2xl overflow-hidden bg-slate-950/20"
            style={{ width: `${totalTime * scale}px`, minHeight: "80px" }}
          >
            {/* Sliding Playhead Cursor */}
            {currentTick !== null && currentTick !== undefined && currentTick <= totalTime && (
              <div 
                className="absolute top-0 bottom-0 w-[3px] bg-cyan-400 shadow-[0_0_12px_#22d3ee] z-20 transition-all duration-300"
                style={{ left: `${currentTick * scale}px` }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-glow-cyan" />
              </div>
            )}

            {/* Gantt Segments */}
            {blocks.map((b, i) => {
              const duration = b.completionTime - b.startTime;
              const width = duration * scale;

              return (
                <div
                  key={i}
                  className="flex flex-col justify-center items-center relative border-r border-white/5 last:border-r-0 select-none group"
                  style={{ width: `${width}px` }}
                >
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center font-mono font-extrabold text-sm transition-all duration-300 ${
                      b.isIdle
                        ? "bg-slate-900/10 text-slate-600 border-b-2 border-dashed border-slate-800"
                        : "bg-gradient-to-tr from-indigo-500/10 to-cyan-500/15 text-cyan-300 shadow-[inset_0_0_12px_rgba(6,182,212,0.05)] border-b-2 border-cyan-500/30 hover:border-cyan-400"
                    }`}
                  >
                    <span>{b.pid}</span>
                    <span className="text-[9px] font-normal text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {duration}s
                    </span>
                  </div>

                  {/* Tick Marks and Labels */}
                  <span className="absolute -bottom-6 left-0 -translate-x-1/2 text-[10px] font-bold text-slate-400 font-mono">
                    {b.startTime}s
                  </span>
                  <div className="absolute -bottom-1.5 left-0 w-[1px] h-3 bg-white/20 -translate-x-1/2" />

                  {/* Show end tick on the very last block */}
                  {i === blocks.length - 1 && (
                    <>
                      <span className="absolute -bottom-6 right-0 translate-x-1/2 text-[10px] font-bold text-slate-400 font-mono">
                        {b.completionTime}s
                      </span>
                      <div className="absolute -bottom-1.5 right-0 w-[1px] h-3 bg-white/20 translate-x-1/2" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}