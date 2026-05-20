import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export default function CPUVisualizer({ current }) {
  return (
    <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 shadow-glow/5 relative overflow-hidden flex flex-col items-center w-full">
      <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6 font-sans">
        CPU Core Engine
      </h2>

      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Outer rotating ring */}
        {current && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/40"
          />
        )}

        {/* Middle pulse ring */}
        {current && (
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-cyan-400/10 to-transparent blur-md"
          />
        )}

        {/* Central Core */}
        {current ? (
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-36 h-36 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 flex flex-col items-center justify-center text-white font-mono shadow-glow border border-white/20 relative z-10"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Executing</span>
            <span className="text-3xl font-extrabold mt-1">{current.pid}</span>
          </motion.div>
        ) : (
          <div className="w-36 h-36 rounded-full border border-dashed border-slate-700 bg-slate-900/40 flex flex-col items-center justify-center text-slate-500 font-mono">
            <Cpu size={24} className="opacity-40 animate-pulse text-indigo-400" />
            <span className="text-[10px] uppercase tracking-widest mt-2 font-bold opacity-60">CPU Idle</span>
          </div>
        )}
      </div>

      {current ? (
        <div className="mt-5 grid grid-cols-2 gap-4 w-full text-center">
          <div className="bg-slate-950/40 p-2.5 rounded-2xl border border-white/5">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Arrival Time</div>
            <div className="text-sm font-mono font-bold text-slate-300 mt-0.5">{current.arrivalTime}s</div>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-2xl border border-white/5">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Burst Duration</div>
            <div className="text-sm font-mono font-bold text-slate-300 mt-0.5">{current.burstTime}s</div>
          </div>
        </div>
      ) : (
        <div className="mt-5 text-center text-xs text-slate-500 font-semibold italic py-2">
          Waiting for scheduling simulation to begin...
        </div>
      )}
    </div>
  );
}