import React from "react";

export default function Legend() {
  const items = [
    { label: "Running", color: "bg-emerald-500 shadow-[0_0_8px_#10b981]" },
    { label: "Ready", color: "bg-blue-500 shadow-[0_0_8px_#3b82f6]" },
    { label: "Waiting", color: "bg-amber-500 shadow-[0_0_8px_#f59e0b]" },
    { label: "Completed", color: "bg-purple-500 shadow-[0_0_8px_#8b5cf6]" },
    { label: "Idle", color: "bg-slate-500 shadow-[0_0_8px_#64748b]" },
  ];

  return (
    <div className="glass p-5 rounded-2xl border border-white/5 shadow-glow/5 relative overflow-hidden flex flex-col justify-between h-full min-h-[170px]">
      <h3 className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest text-center shrink-0">
        Legend
      </h3>

      <div className="flex flex-col gap-2.5 my-auto justify-center pl-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
            <span className="text-xs font-bold text-slate-300 font-sans">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
