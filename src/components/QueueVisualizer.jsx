import React from "react";
import { motion } from "framer-motion";
import { Mail, ChevronRight } from "lucide-react";

export default function QueueVisualizer({ queue }) {
  // Helper to check if queue is an object containing multiple queues (MLQ / MLFQ)
  const isMultiQueue = queue && !Array.isArray(queue) && typeof queue === "object";

  // Dynamic PID Text Color Mapping
  const getPidColor = (pid) => {
    switch (pid) {
      case "P1": return "text-blue-400 border-blue-500/30 bg-blue-500/5";
      case "P2": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
      case "P3": return "text-purple-400 border-purple-500/30 bg-purple-500/5";
      case "P4": return "text-amber-400 border-amber-500/30 bg-amber-500/5";
      default: return "text-cyan-400 border-cyan-500/30 bg-cyan-500/5";
    }
  };

  const renderQueueRow = (pids, label, isSubRow = false) => {
    return (
      <div className="space-y-1 flex-grow flex flex-col justify-center">
        {/* Row Label and Size */}
        <div className="flex justify-between items-center text-[9px] tracking-wider uppercase font-bold text-slate-500 font-mono">
          <span>{label}</span>
          <span className="text-cyan-400 text-2xs normal-case">
            Size: {pids.length}
          </span>
        </div>

        {/* Process Flow row */}
        {pids.length === 0 ? (
          <div className="flex-grow flex items-center justify-center border border-dashed border-slate-800 rounded-lg py-2 bg-slate-950/20">
            <span className="text-[9px] text-slate-600 font-semibold italic">Queue is empty</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-dense pr-1">
            {pids.map((pid, i) => {
              const isTail = i === pids.length - 1;
              return (
                <div key={pid} className="flex items-center gap-1 flex-shrink-0">
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`px-2 py-0.5 rounded-md border font-mono font-black text-[10px] flex items-center justify-center shadow-md relative ${getPidColor(pid)}`}
                  >
                    <span>{pid}</span>
                  </motion.div>

                  {!isTail && (
                    <div className="text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronRight size={10} className="animate-pulse text-indigo-500/50" />
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
    <div className="glass p-3 rounded-2xl border border-white/5 shadow-glow/5 relative overflow-hidden flex flex-col justify-between h-full min-h-[190px] max-h-[220px] w-full">
      {/* Header */}
      <div className="flex items-start gap-2 shrink-0 mb-1">
        <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
          <Mail size={12} />
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-extrabold text-white font-sans tracking-tight">
            Ready Queue
          </h2>
          <p className="text-[9px] text-slate-400 mt-0.5 leading-tight font-sans">
            Tasks waiting in the scheduling queue.
          </p>
        </div>
      </div>

      {/* Queue rows wrapper */}
      <div className="flex-grow flex flex-col justify-center pt-0.5">
        {isMultiQueue ? (
          <div className="space-y-2 flex flex-col justify-between">
            {queue.q0 !== undefined ? (
              // MLFQ
              <>
                {renderQueueRow(queue.q0, "Q0 - RR (Q=2)", true)}
                {renderQueueRow(queue.q1, "Q1 - RR (Q=4)", true)}
                {renderQueueRow(queue.q2, "Q2 - FCFS", true)}
              </>
            ) : (
              // MLQ
              <>
                {renderQueueRow(queue.q1 || [], "Q1 (High)", true)}
                {renderQueueRow(queue.q2 || [], "Q2 (Low)", true)}
              </>
            )}
          </div>
        ) : (
          renderQueueRow(Array.isArray(queue) ? queue : [], "Ready Queue (Waiting)")
        )}
      </div>
    </div>
  );
}