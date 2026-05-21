import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Settings } from "lucide-react";

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
    <div className="flex flex-col gap-6 p-6 sm:p-8 glass rounded-3xl border border-white/5 shadow-glow/5 w-full">
      {/* Top Row: Algorithm Selection and Config */}
      <div className="grid lg:grid-cols-3 gap-6 items-center">
        {/* Left: Selector */}
        <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-sans shrink-0">
            Scheduling Strategy:
          </span>
          <div className="flex flex-wrap bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 gap-1">
            {algorithms.map((alg) => (
              <button
                key={alg.name}
                onClick={() => setAlgorithm(alg.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
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
        <div className="flex items-center gap-4 bg-slate-900/30 p-4 rounded-2xl border border-white/5 h-full min-h-[70px]">
          <Settings size={18} className="text-indigo-400 shrink-0" />
          <div className="flex-grow">
            {algorithm === "RR" && (
              <div className="flex items-center justify-between gap-4 w-full">
                <span className="text-xs font-bold text-slate-300">Time Quantum:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={timeQuantum}
                    onChange={(e) => setTimeQuantum(Number(e.target.value))}
                    className="w-24 accent-indigo-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                  />
                  <span className="text-sm font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-xl border border-indigo-500/20">
                    {timeQuantum}s
                  </span>
                </div>
              </div>
            )}

            {algorithm === "Priority" && (
              <div className="flex items-center justify-between gap-4 w-full">
                <span className="text-xs font-bold text-slate-300">Mode:</span>
                <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setPriorityPreemptive(false)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-300 cursor-pointer ${
                      !priorityPreemptive
                        ? "bg-slate-800 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Non-Preempt
                  </button>
                  <button
                    onClick={() => setPriorityPreemptive(true)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-300 cursor-pointer ${
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
              <span className="text-xs text-slate-500 italic">
                No custom parameters required.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle Row: Global Actions and Playback Deck */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-t border-white/5 pt-6">
        {/* Run / Reset Simulation */}
        <div className="flex gap-3 items-center">
          <button
            onClick={onStart}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:to-cyan-400 font-bold hover:scale-[1.03] active:scale-95 transition-all shadow-glow text-white cursor-pointer text-sm"
          >
            <Play size={14} className="fill-current" />
            {isSimulationActive ? "Re-Run Simulation" : "Run Simulation"}
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 font-bold border border-white/10 hover:scale-[1.03] active:scale-95 transition-all text-slate-300 cursor-pointer text-sm"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {/* Playback Controls Deck (Active only when simulation is computed) */}
        {isSimulationActive && (
          <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-950/40 p-2 rounded-2xl border border-white/5">
            {/* Step Back */}
            <button
              onClick={stepBackward}
              disabled={currentTick === 0}
              className="p-2.5 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
              title="Step Backward"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Play / Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                isPlaying
                  ? "bg-cyan-500 text-slate-950 shadow-glow-cyan"
                  : "bg-indigo-500 text-white shadow-glow"
              }`}
              title={isPlaying ? "Pause Simulation" : "Play Simulation"}
            >
              {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current" />}
            </button>

            {/* Step Forward */}
            <button
              onClick={stepForward}
              disabled={currentTick >= maxTicks}
              className="p-2.5 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
              title="Step Forward"
            >
              <ChevronRight size={16} />
            </button>

            {/* Playback Speed selector */}
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-white/5 ml-2">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    speed === s
                      ? "bg-slate-800 text-cyan-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row: Timeline Scrub Slider */}
      {isSimulationActive && (
        <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
            <span>Simulation Playback timeline</span>
            <span className="text-cyan-400">
              {currentTick}s / {maxTicks}s total
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxTicks}
            value={currentTick}
            onChange={(e) => setCurrentTick(Number(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-950 border border-white/5 h-2 rounded-xl appearance-none cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}