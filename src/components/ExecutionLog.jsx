import { Terminal } from "lucide-react";

export default function ExecutionLog({ logs }) {
  return (
    <div className="glass rounded-3xl border border-white/5 shadow-glow/5 relative overflow-hidden w-full flex flex-col h-80">
      {/* Terminal Title Bar */}
      <div className="bg-slate-950/80 border-b border-white/10 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Mock Window Dots */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold ml-2 uppercase tracking-widest flex items-center gap-1.5">
            <Terminal size={12} />
            system_kernel_debugger
          </span>
        </div>
        <span className="text-[10px] font-mono text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
          LIVE LOG
        </span>
      </div>

      {/* Terminal Output Area */}
      <div className="p-5 font-mono text-xs sm:text-sm text-slate-300 overflow-y-auto flex-grow bg-slate-950/20 space-y-2.5">
        {logs.length === 0 ? (
          <div className="text-slate-500 flex flex-col justify-center items-center h-full gap-2">
            <span className="animate-pulse">_</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">Awaiting kernel boot sequence...</span>
          </div>
        ) : (
          <>
            {logs.map((log, i) => (
              <div
                key={i}
                className="flex items-start gap-2 border-b border-white/5 pb-2 last:border-b-0 leading-relaxed"
              >
                <span className="text-emerald-400 font-bold select-none shrink-0">$</span>
                <span className="text-indigo-300 font-bold select-none shrink-0">kernel:</span>
                <span>{log}</span>
              </div>
            ))}
            <div className="flex items-center gap-1 text-emerald-400 font-bold pt-1">
              <span className="select-none">$</span>
              <span className="animate-pulse">_</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}