import { Clock, TrendingUp, BarChart3, Zap } from "lucide-react";

export default function MetricsPanel({ completed }) {
  const hasData = completed && completed.length > 0;

  const avgWT = hasData
    ? completed.reduce((a, b) => a + (b.waitingTime || 0), 0) / completed.length
    : 0;

  const avgTAT = hasData
    ? completed.reduce((a, b) => a + (b.turnaroundTime || 0), 0) / completed.length
    : 0;

  const avgRT = hasData
    ? completed.reduce((a, b) => a + (b.responseTime !== undefined ? b.responseTime : (b.waitingTime || 0)), 0) / completed.length
    : 0;

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <BarChart3 size={20} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
            Simulation Metrics
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Key execution results and CPU efficiency analytics.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {/* Waiting Time Card */}
        <div className="glass glass-interactive rounded-3xl p-6 relative overflow-hidden border border-white/5 flex items-center justify-between">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Avg Waiting Time</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono mt-2">
              {hasData ? `${avgWT.toFixed(2)}s` : "--"}
            </p>
            <p className="text-[10px] text-slate-500 mt-1.5 font-sans">
              Total idle delay spent in ready queue.
            </p>
          </div>
          <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-glow-cyan/20">
            <Clock size={20} />
          </div>
        </div>

        {/* Turnaround Time Card */}
        <div className="glass glass-interactive rounded-3xl p-6 relative overflow-hidden border border-white/5 flex items-center justify-between">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Avg Turnaround</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono mt-2">
              {hasData ? `${avgTAT.toFixed(2)}s` : "--"}
            </p>
            <p className="text-[10px] text-slate-500 mt-1.5 font-sans">
              Duration from arrival to completion.
            </p>
          </div>
          <div className="p-3 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-glow/20">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Response Time Card */}
        <div className="glass glass-interactive rounded-3xl p-6 relative overflow-hidden border border-white/5 flex items-center justify-between">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Avg Response Time</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-2">
              {hasData ? `${avgRT.toFixed(2)}s` : "--"}
            </p>
            <p className="text-[10px] text-slate-500 mt-1.5 font-sans">
              Time from arrival to first execution.
            </p>
          </div>
          <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-glow-emerald/20">
            <Zap size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}