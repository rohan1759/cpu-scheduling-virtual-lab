import React from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export default function CPUVisualizer({
  current,
  status = "Idle",
  remainingBurst = 0,
  elapsedTime = 0,
  utilization = 0,
}) {
  const isRunning = current !== null && status === "Running";

  // Dynamic PID Text Color for central circle
  const getPidColor = (pid) => {
    switch (pid) {
      case "P1": return "text-blue-400";
      case "P2": return "text-emerald-400";
      case "P3": return "text-purple-400";
      case "P4": return "text-amber-400";
      default: return "text-indigo-400";
    }
  };

  return (
    <div className="glass rounded-2xl p-3 border border-white/5 shadow-glow/5 relative overflow-hidden flex flex-col justify-between h-full min-h-[190px] max-h-[220px]">
      {/* Title */}
      <div className="shrink-0 mb-1">
        <h2 className="text-xs sm:text-sm font-extrabold text-white font-sans tracking-tight">
          CPU Core Engine
        </h2>
      </div>

      {/* Main Grid: Circle Visualizer Left, Stats Right */}
      <div className="flex-grow flex items-center justify-between gap-3 my-auto">
        {/* Left Column: Glowing Circular Gauge */}
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          {/* Outer rotating glowing ring */}
          {isRunning && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/40"
            />
          )}

          {/* Middle pulse ring */}
          {isRunning && (
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500/10 via-cyan-400/10 to-transparent blur-sm"
            />
          )}

          {/* Central Circular Gauge */}
          <div className="w-[72px] h-[72px] rounded-full bg-slate-950 border border-white/10 flex flex-col items-center justify-center shadow-inner relative z-10">
            {isRunning ? (
              <>
                <Cpu size={12} className="text-cyan-400 animate-pulse mb-0.5" />
                <span className={`text-lg font-black font-mono leading-none ${getPidColor(current.pid)}`}>
                  {current.pid}
                </span>
                <span className="text-[7px] font-bold text-cyan-400 uppercase tracking-widest mt-0.5 shadow-[0_0_8px_#22d3ee]/20">
                  RUNNING
                </span>
              </>
            ) : (
              <>
                <Cpu size={14} className="text-slate-600 opacity-60 mb-0.5" />
                <span className="text-xs font-extrabold font-mono text-slate-500 leading-none">
                  IDLE
                </span>
                <span className="text-[7px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                  CORE 0
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Execution Stats */}
        <div className="flex-grow flex flex-col justify-center gap-1.5">
          {/* Status */}
          <div className="flex items-center justify-between text-[10px] border-b border-white/5 pb-1">
            <span className="font-mono text-slate-500 uppercase tracking-wider font-bold">Status</span>
            <span className={`font-mono font-black ${isRunning ? "text-emerald-400" : "text-slate-500"}`}>
              {isRunning ? "Running" : "Idle"}
            </span>
          </div>

          {/* Remaining Burst */}
          <div className="flex items-center justify-between text-[10px] border-b border-white/5 pb-1">
            <span className="font-mono text-slate-500 uppercase tracking-wider font-bold">Remaining</span>
            <span className="font-mono font-bold text-slate-300">
              {isRunning ? `${remainingBurst}s` : "0s"}
            </span>
          </div>

          {/* Elapsed Time */}
          <div className="flex items-center justify-between text-[10px] border-b border-white/5 pb-1">
            <span className="font-mono text-slate-500 uppercase tracking-wider font-bold">Elapsed</span>
            <span className="font-mono font-bold text-slate-300">
              {isRunning ? `${elapsedTime}s` : "0s"}
            </span>
          </div>

          {/* CPU Utilization - simple stat row, no progress bar */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-mono text-slate-500 uppercase tracking-wider font-bold">Utilization</span>
            <span className="font-mono font-bold text-emerald-400">{utilization}%</span>
          </div>
        </div>
      </div>

      {/* Bottom info text */}
      <div className="shrink-0 mt-1 border-t border-white/5 pt-1">
        <p className="text-[9px] text-slate-400 text-center font-sans italic leading-tight">
          {isRunning ? `CPU is executing process ${current.pid}` : "CPU core is currently idle"}
        </p>
      </div>
    </div>
  );
}