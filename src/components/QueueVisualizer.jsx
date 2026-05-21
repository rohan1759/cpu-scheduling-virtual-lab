import { motion } from "framer-motion";
import { ArrowLeft, Inbox } from "lucide-react";

export default function QueueVisualizer({ queue }) {
  // Helper to check if queue is an object containing multiple queues
  const isMultiQueue = queue && !Array.isArray(queue) && typeof queue === "object";

  const renderQueueRow = (pids, label, subtitle) => {
    // Lookup process details if available (we will just display the PIDs as cards)
    return (
      <div className="space-y-2 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400 font-sans">
            {label}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold font-mono">
            {subtitle} ({pids.length} waiting)
          </span>
        </div>

        {pids.length === 0 ? (
          <p className="text-slate-600 italic text-left py-2 text-xs font-semibold pl-2">
            Empty
          </p>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-thin">
            {pids.map((pid, i) => {
              const isHead = i === 0;
              const isTail = i === pids.length - 1;
              return (
                <div key={pid} className="flex items-center gap-2 flex-shrink-0">
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`px-4 py-2.5 rounded-xl border flex items-center justify-center font-mono font-extrabold text-sm relative ${
                      isHead
                        ? "border-cyan-500 bg-cyan-950/20 text-cyan-300 shadow-[inset_0_0_12px_rgba(6,182,212,0.1)]"
                        : "border-white/10 bg-slate-900/40 text-slate-400"
                    }`}
                  >
                    <span>{pid}</span>
                    {isHead && (
                      <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-slate-950 font-sans text-[8px] px-1 rounded-md uppercase font-black">
                        HEAD
                      </span>
                    )}
                  </motion.div>

                  {!isTail && (
                    <div className="text-slate-700 flex items-center justify-center">
                      <ArrowLeft size={12} className="animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass p-6 sm:p-8 rounded-3xl border border-white/5 shadow-glow/5 relative overflow-hidden w-full space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Inbox size={20} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
            Ready Queue Timeline
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Tasks currently waiting in the main scheduling queue.
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {isMultiQueue ? (
          <>
            {queue.q0 !== undefined ? (
              // MLFQ
              <>
                {renderQueueRow(queue.q0, "Queue 0 (High)", "RR (Quantum = 2)")}
                {renderQueueRow(queue.q1, "Queue 1 (Medium)", "RR (Quantum = 4)")}
                {renderQueueRow(queue.q2, "Queue 2 (Low)", "FCFS")}
              </>
            ) : (
              // MLQ
              <>
                {renderQueueRow(queue.q1 || [], "Queue 1 (High)", "RR (Quantum = 2)")}
                {renderQueueRow(queue.q2 || [], "Queue 2 (Low)", "FCFS")}
              </>
            )}
          </>
        ) : (
          renderQueueRow(Array.isArray(queue) ? queue : [], "Ready Queue", "Main Queue")
        )}
      </div>
    </div>
  );
}