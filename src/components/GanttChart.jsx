import { Calendar } from "lucide-react";

export default function GanttChart({ completed }) {
  // Helper to generate blocks with idle times
  const getGanttBlocks = () => {
    if (!completed || completed.length === 0) return [];
    
    // Sort processes by start time to construct the sequence
    const sorted = [...completed].sort((a, b) => a.startTime - b.startTime);
    const blocks = [];
    let lastTime = 0;

    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      // If there's a gap between the end of the last process and the start of this one, add an Idle block
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
            Chronological sequence of scheduled operations and idle cycles.
          </p>
        </div>
      </div>

      {blocks.length === 0 ? (
        <p className="text-slate-500 italic text-center py-4 text-sm font-semibold">No data to display. Start simulation to render the Gantt chart timeline.</p>
      ) : (
        <div className="flex overflow-x-auto pb-12 pt-6 px-6 scrollbar-thin">
          {blocks.map((b, i) => {
            const isLast = i === blocks.length - 1;
            return (
              <div
                key={i}
                className="flex flex-col items-center relative flex-shrink-0"
              >
                {/* Visual Block */}
                <div
                  className={`px-8 py-5 border text-center font-mono font-extrabold min-w-[100px] transition-all duration-300 ${
                    b.isIdle
                      ? "border-dashed border-slate-700 bg-slate-900/20 text-slate-500"
                      : "border-cyan-500/40 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 text-cyan-300 shadow-[inset_0_0_16px_rgba(6,182,212,0.1)] hover:border-cyan-400"
                  }`}
                >
                  {b.pid}
                </div>

                {/* Subscript Start Time */}
                <span className="absolute -bottom-6 left-0 -translate-x-1/2 text-xs font-bold text-slate-400 font-mono">
                  {b.startTime}s
                </span>

                {/* Boundary Tick Marks */}
                <div className="absolute -bottom-1.5 left-0 w-[1px] h-3 bg-white/20 -translate-x-1/2" />
                {isLast && (
                  <div className="absolute -bottom-1.5 right-0 w-[1px] h-3 bg-white/20 translate-x-1/2" />
                )}

                {/* Subscript Completion Time: only show at the bottom right of the last block */}
                {isLast && (
                  <span className="absolute -bottom-6 right-0 translate-x-1/2 text-xs font-bold text-slate-400 font-mono">
                    {b.completionTime}s
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}