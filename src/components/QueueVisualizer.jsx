import { motion } from "framer-motion";
import { ArrowLeft, Inbox } from "lucide-react";

export default function QueueVisualizer({ queue }) {
  return (
    <div className="glass p-6 sm:p-8 rounded-3xl border border-white/5 shadow-glow/5 relative overflow-hidden w-full">
      <div className="flex items-center gap-3 mb-6">
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

      {queue.length === 0 ? (
        <p className="text-slate-500 italic text-center py-4 text-sm font-semibold">Ready Queue is currently empty.</p>
      ) : (
        <div className="flex items-center gap-4 overflow-x-auto py-4 px-2">
          {queue.map((p, i) => {
            const isHead = i === 0;
            const isTail = i === queue.length - 1;
            return (
              <div key={p.pid} className="flex items-center gap-4 flex-shrink-0">
                <motion.div
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className={`p-4 rounded-2xl border flex flex-col justify-between w-32 h-28 relative ${
                    isHead
                      ? "border-cyan-500 bg-cyan-950/20 text-cyan-300 shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]"
                      : "border-white/10 bg-slate-900/40 text-slate-300"
                  }`}
                >
                  {/* Position Badge */}
                  <span className={`absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isHead 
                      ? "bg-cyan-500/20 text-cyan-400" 
                      : isTail 
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-white/5 text-slate-400"
                  }`}>
                    {isHead ? "Head" : isTail ? "Tail" : `Pos ${i + 1}`}
                  </span>

                  <span className="text-xl font-extrabold font-mono">{p.pid}</span>

                  <div className="mt-2 text-[10px] text-slate-400 font-mono space-y-0.5">
                    <div>Arr: <span className="text-slate-200 font-bold">{p.arrivalTime}s</span></div>
                    <div>Burst: <span className="text-slate-200 font-bold">{p.burstTime}s</span></div>
                  </div>
                </motion.div>

                {!isTail && (
                  <div className="text-slate-600 flex items-center justify-center">
                    <ArrowLeft size={18} className="animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}