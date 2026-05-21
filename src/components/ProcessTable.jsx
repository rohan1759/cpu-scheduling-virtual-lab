import React from "react";
import { Trash2, Plus } from "lucide-react";

export default function ProcessTable({
  processes,
  setProcesses,
  algorithm,
}) {
  const addProcess = () => {
    const nextNum = processes.length > 0
      ? Math.max(...processes.map(p => parseInt(p.pid.replace("P", "")) || 0)) + 1
      : 1;
    setProcesses([
      ...processes,
      {
        pid: `P${nextNum}`,
        arrivalTime: 0,
        burstTime: 1,
        priority: 1,
        queue: 1,
      },
    ]);
  };

  const removeProcess = (index) => {
    if (processes.length <= 1) return;
    const updated = processes.filter((_, idx) => idx !== index);
    setProcesses(updated);
  };

  const showPriority = algorithm === "Priority";
  const showQueue = algorithm === "MLQ";

  // Dynamic PID Text Color Mapping
  const getPidColor = (pid) => {
    switch (pid) {
      case "P1": return "text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.1)]";
      case "P2": return "text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]";
      case "P3": return "text-purple-400 shadow-[0_0_12px_rgba(139,92,246,0.1)]";
      case "P4": return "text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]";
      default: return "text-indigo-400";
    }
  };

  return (
    <div className="glass rounded-2xl p-3 border border-white/5 shadow-glow/5 relative overflow-hidden flex flex-col justify-between h-full min-h-[190px] max-h-[220px]">
      <div className="flex justify-between items-center gap-2 mb-2 shrink-0">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-white font-sans tracking-tight">
            Process Control Center
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-tight font-sans">
            Configure the arrival time, burst time, and specific criteria.
          </p>
        </div>

        <button
          onClick={addProcess}
          className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold rounded-lg text-[9px] hover:scale-105 active:scale-95 transition-all text-white shadow-glow cursor-pointer shrink-0"
        >
          <Plus size={9} />
          Add
        </button>
      </div>

      <div className="overflow-y-auto flex-grow scrollbar-dense pr-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
              <th className="py-2 px-2 text-center w-12">PID</th>
              <th className="py-2 px-2 text-center">Arrival Time</th>
              <th className="py-2 px-2 text-center">Burst Time</th>
              {showPriority && <th className="py-2 px-2 text-center">Priority</th>}
              {showQueue && <th className="py-2 px-2 text-center">Queue</th>}
              <th className="py-2 px-2 text-center w-12">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {processes.map((p, i) => (
              <tr key={p.pid} className="hover:bg-white/5 transition-all duration-200">
                <td className={`py-1 px-2 font-mono font-black text-center text-xs ${getPidColor(p.pid)}`}>
                  {p.pid}
                </td>

                <td className="py-1 px-2 text-center">
                  <input
                    type="number"
                    min="0"
                    value={p.arrivalTime}
                    onChange={(e) => {
                      const updated = [...processes];
                      updated[i].arrivalTime = Math.max(0, Number(e.target.value));
                      setProcesses(updated);
                    }}
                    className="bg-slate-950/60 border border-white/10 focus:border-indigo-500 focus:shadow-glow rounded-lg py-1 px-1.5 w-16 text-center text-white text-xs font-mono outline-none transition-all duration-300"
                  />
                </td>

                <td className="py-1 px-2 text-center">
                  <input
                    type="number"
                    min="1"
                    value={p.burstTime}
                    onChange={(e) => {
                      const updated = [...processes];
                      updated[i].burstTime = Math.max(1, Number(e.target.value));
                      setProcesses(updated);
                    }}
                    className="bg-slate-950/60 border border-white/10 focus:border-indigo-500 focus:shadow-glow rounded-lg py-1 px-1.5 w-16 text-center text-white text-xs font-mono outline-none transition-all duration-300"
                  />
                </td>

                {showPriority && (
                  <td className="py-1 px-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={p.priority || 1}
                      onChange={(e) => {
                        const updated = [...processes];
                        updated[i].priority = Math.max(1, Number(e.target.value));
                        setProcesses(updated);
                      }}
                      className="bg-slate-950/60 border border-white/10 focus:border-indigo-500 focus:shadow-glow rounded-lg py-1 px-1.5 w-16 text-center text-white text-xs font-mono outline-none transition-all duration-300"
                      title="Lower number = Higher Priority"
                    />
                  </td>
                )}

                {showQueue && (
                  <td className="py-1 px-2 text-center">
                    <select
                      value={p.queue || 1}
                      onChange={(e) => {
                        const updated = [...processes];
                        updated[i].queue = Number(e.target.value);
                        setProcesses(updated);
                      }}
                      className="bg-slate-950/60 border border-white/10 focus:border-indigo-500 focus:shadow-glow rounded-lg py-1 px-1 w-24 text-center text-white text-2xs font-mono outline-none transition-all duration-300 cursor-pointer"
                    >
                      <option value={1}>Q1 (High)</option>
                      <option value={2}>Q2 (Low)</option>
                    </select>
                  </td>
                )}

                <td className="py-1 px-2 text-center">
                  <button
                    disabled={processes.length <= 1}
                    onClick={() => removeProcess(i)}
                    className={`p-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                      processes.length <= 1
                        ? "text-slate-700 border-white/5 cursor-not-allowed opacity-40"
                        : "text-rose-500 border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/20 hover:border-rose-500/30 active:scale-90"
                    }`}
                    title="Remove Process"
                  >
                    <Trash2 size={11} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}