import React, { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

export default function ExecutionLog({ logs }) {
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  // Log Parser to dynamically style elements (Timestamps, kernel prefix, PIDs)
  const renderLogLine = (log, index) => {
    // Expected format: "[00:00] kernel: Process P1 arrived in system (Burst: 5s)."
    const regex = /^(\[\d{2}:\d{2}\])\s*(kernel:)\s*(.*)$/;
    const match = log.match(regex);

    if (match) {
      const timestamp = match[1];
      const kernel = match[2];
      const message = match[3];

      // Parse message parts to style process names (P1, P2, P3, P4)
      const parts = message.split(/(P[1-4]\b)/g);
      const styledMessage = parts.map((part, pIdx) => {
        if (part === "P1") return <strong key={pIdx} className="text-blue-400 font-black font-mono">P1</strong>;
        if (part === "P2") return <strong key={pIdx} className="text-emerald-400 font-black font-mono">P2</strong>;
        if (part === "P3") return <strong key={pIdx} className="text-purple-400 font-black font-mono">P3</strong>;
        if (part === "P4") return <strong key={pIdx} className="text-amber-400 font-black font-mono">P4</strong>;
        return <span key={pIdx}>{part}</span>;
      });

      return (
        <div key={index} className="flex items-start gap-1.5 leading-relaxed py-0.5 text-2xs border-b border-white/2 pb-1 last:border-b-0">
          <span className="text-slate-500 font-mono select-none shrink-0">{timestamp}</span>
          <span className="text-emerald-500 font-mono font-bold select-none shrink-0">{kernel}</span>
          <span className="font-mono text-slate-300 font-medium">{styledMessage}</span>
        </div>
      );
    }

    // Fallback if parsing fails
    return (
      <div key={index} className="flex items-start gap-2 leading-relaxed py-0.5 text-2xs">
        <span className="text-slate-500 font-mono select-none shrink-0">&gt;</span>
        <span className="font-mono text-slate-300">{log}</span>
      </div>
    );
  };

  return (
    <div className="glass rounded-2xl border border-white/5 shadow-glow/5 relative overflow-hidden w-full flex flex-col h-full min-h-[200px] max-h-[150px]">
      {/* Terminal Title Bar */}
      <div className="bg-slate-950/80 border-b border-white/10 px-3 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Mac Window Dots */}
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[9px] font-mono text-slate-400 font-bold ml-2 uppercase tracking-widest flex items-center gap-1">
            <Terminal size={10} className="text-indigo-400" />
            system kernel debugger
          </span>
        </div>
        <span className="text-[8px] font-mono text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.1)]">
          LIVE LOG
        </span>
      </div>

      {/* Terminal Output Area */}
      <div
        ref={containerRef}
        className="p-2 font-mono text-xs text-slate-300 overflow-y-auto flex-grow bg-slate-950/40 space-y-0.5 scrollbar-dense"
      >
        {logs.length === 0 ? (
          <div className="text-slate-600 flex flex-col justify-center items-center h-full gap-1 py-2">
            <span className="animate-pulse font-bold text-slate-500">_</span>
            <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-60">Awaiting kernel boot sequence...</span>
          </div>
        ) : (
          <>
            {logs.map((log, i) => renderLogLine(log, i))}
            <div className="flex items-center gap-1 text-emerald-500 font-bold pt-0.5 text-2xs">
              <span className="select-none animate-pulse">$ _</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}