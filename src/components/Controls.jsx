import { Settings } from "lucide-react";

export default function Controls({
  onStart,
  onReset,
  algorithm,
  setAlgorithm,
  isPlaying,
  setIsPlaying,
  currentTick,
  setCurrentTick,
  maxTicks,
  speed,
  setSpeed,
  stepForward,
  stepBackward,
  timeQuantum,
  setTimeQuantum,
  priorityPreemptive,
  setPriorityPreemptive,
  isSimulationActive,
}) {
  const algorithms = [
    { name: "FCFS", desc: "First-Come First-Served" },
    { name: "SJF", desc: "Shortest Job First" },
    { name: "SRTF", desc: "Shortest Remaining Time First" },
    { name: "RR", desc: "Round Robin" },
    { name: "Priority", desc: "Priority Scheduling" },
    { name: "MLQ", desc: "Multilevel Queue" },
    { name: "MLFQ", desc: "Multilevel Feedback Queue" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 glass rounded-2xl border border-white/5 shadow-glow/5 w-full">
      {/* Top Row: Algorithm Selection and Config */}
      <div className="grid lg:grid-cols-3 gap-4 items-center">
        {/* Left: Selector */}
        <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 font-sans shrink-0">
            Scheduling Strategy:
          </span>
          <div className="flex flex-wrap bg-slate-950/60 p-1 rounded-2xl border border-white/5 gap-1">
            {algorithms.map((alg) => (
              <button
                key={alg.name}
                onClick={() => setAlgorithm(alg.name)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  algorithm === alg.name
                    ? "bg-indigo-500 text-white shadow-glow"
                    : "text-slate-400 hover:text-white"
                }`}
                title={alg.desc}
              >
                {alg.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Dynamic Param Inputs */}
        <div className="flex items-center gap-3 bg-slate-900/30 p-2 rounded-xl border border-white/5 h-full min-h-[56px]">
          <Settings size={16} className="text-indigo-400 shrink-0" />
          <div className="flex-grow">
            {algorithm === "RR" && (
              <div className="flex items-center justify-between gap-3 w-full">
                <span className="text-[10px] font-bold text-slate-300">Time Quantum:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={timeQuantum}
                    onChange={(e) => setTimeQuantum(Number(e.target.value))}
                    className="w-20 accent-indigo-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                  />
                  <span className="text-[11px] font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                    {timeQuantum}s
                  </span>
                </div>
              </div>
            )}

            {algorithm === "Priority" && (
              <div className="flex items-center justify-between gap-3 w-full">
                <span className="text-[10px] font-bold text-slate-300">Mode:</span>
                <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setPriorityPreemptive(false)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all duration-300 cursor-pointer ${
                      !priorityPreemptive
                        ? "bg-slate-800 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Non-Preempt
                  </button>
                  <button
                    onClick={() => setPriorityPreemptive(true)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all duration-300 cursor-pointer ${
                      priorityPreemptive
                        ? "bg-indigo-500 text-white shadow-glow"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Preemptive
                  </button>
                </div>
              </div>
            )}

            {algorithm !== "RR" && algorithm !== "Priority" && (
              <span className="text-[11px] text-slate-500 italic">
                No custom parameters required.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}