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

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 shadow-glow/5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
            Process Control Center
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Configure the arrival time, burst time, and specific criteria for each task.
          </p>
        </div>

        <button
          onClick={addProcess}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:to-cyan-400 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all text-white shadow-glow cursor-pointer"
        >
          <Plus size={16} />
          Add Process
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-4">PID</th>
              <th className="py-4 px-4">Arrival Time</th>
              <th className="py-4 px-4">Burst Time</th>
              {showPriority && <th className="py-4 px-4">Priority</th>}
              {showQueue && <th className="py-4 px-4">Queue</th>}
              <th className="py-4 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {processes.map((p, i) => (
              <tr key={p.pid} className="hover:bg-white/5 transition-all duration-200">
                <td className="py-4 px-4 font-mono font-bold text-indigo-400 text-base">
                  {p.pid}
                </td>

                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    value={p.arrivalTime}
                    onChange={(e) => {
                      const updated = [...processes];
                      updated[i].arrivalTime = Math.max(0, Number(e.target.value));
                      setProcesses(updated);
                    }}
                    className="bg-slate-900/60 border border-white/10 focus:border-indigo-500 focus:shadow-glow rounded-xl p-2 w-28 text-center text-white font-mono outline-none transition-all duration-300"
                  />
                </td>

                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="1"
                    value={p.burstTime}
                    onChange={(e) => {
                      const updated = [...processes];
                      updated[i].burstTime = Math.max(1, Number(e.target.value));
                      setProcesses(updated);
                    }}
                    className="bg-slate-900/60 border border-white/10 focus:border-indigo-500 focus:shadow-glow rounded-xl p-2 w-28 text-center text-white font-mono outline-none transition-all duration-300"
                  />
                </td>

                {showPriority && (
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="1"
                      value={p.priority || 1}
                      onChange={(e) => {
                        const updated = [...processes];
                        updated[i].priority = Math.max(1, Number(e.target.value));
                        setProcesses(updated);
                      }}
                      className="bg-slate-900/60 border border-white/10 focus:border-indigo-500 focus:shadow-glow rounded-xl p-2 w-28 text-center text-white font-mono outline-none transition-all duration-300"
                      title="Lower number = Higher Priority"
                    />
                  </td>
                )}

                {showQueue && (
                  <td className="py-3 px-4">
                    <select
                      value={p.queue || 1}
                      onChange={(e) => {
                        const updated = [...processes];
                        updated[i].queue = Number(e.target.value);
                        setProcesses(updated);
                      }}
                      className="bg-slate-900/60 border border-white/10 focus:border-indigo-500 focus:shadow-glow rounded-xl p-2 w-32 text-center text-white font-mono outline-none transition-all duration-300 cursor-pointer"
                    >
                      <option value={1}>Queue 1 (High)</option>
                      <option value={2}>Queue 2 (Low)</option>
                    </select>
                  </td>
                )}

                <td className="py-3 px-4 text-center">
                  <button
                    disabled={processes.length <= 1}
                    onClick={() => removeProcess(i)}
                    className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                      processes.length <= 1
                        ? "text-slate-600 border-white/5 cursor-not-allowed opacity-40"
                        : "text-rose-400 border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/20 hover:border-rose-500/30 active:scale-90"
                    }`}
                    title="Remove Process"
                  >
                    <Trash2 size={16} />
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