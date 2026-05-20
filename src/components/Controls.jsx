import { Play, RotateCcw } from "lucide-react";

export default function Controls({
  onStart,
  onReset,
  algorithm,
  setAlgorithm,
}) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 glass rounded-3xl border border-white/5 shadow-glow/5">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <button
          onClick={onStart}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:to-cyan-400 font-bold hover:scale-[1.03] active:scale-95 transition-all shadow-glow text-white cursor-pointer"
        >
          <Play size={16} className="fill-current" />
          Start Simulation
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 font-bold border border-white/10 hover:scale-[1.03] active:scale-95 transition-all text-slate-300 cursor-pointer"
        >
          <RotateCcw size={16} />
          Reset Simulation
        </button>
      </div>

      <div className="flex items-center justify-between sm:justify-start gap-4">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-sans">
          Scheduling Strategy:
        </span>
        <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 shrink-0">
          <button
            onClick={() => setAlgorithm("FCFS")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              algorithm === "FCFS"
                ? "bg-cyan-500 text-white shadow-glow-cyan"
                : "text-slate-400 hover:text-white"
            }`}
          >
            FCFS
          </button>
          <button
            onClick={() => setAlgorithm("SJF")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              algorithm === "SJF"
                ? "bg-indigo-500 text-white shadow-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            SJF
          </button>
        </div>
      </div>
    </div>
  );
}