import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { BookOpen, HelpCircle, ArrowRight, Table, Cpu, Settings, Award } from "lucide-react";

const theoryData = {
  FCFS: {
    title: "First-Come, First-Served (FCFS)",
    criteria: "Arrival Time",
    mode: "Non-Preemptive",
    formula: "Turnaround Time = Completion Time - Arrival Time\nWaiting Time = Turnaround Time - Burst Time\nResponse Time = Start Time - Arrival Time",
    desc: "FCFS is the simplest scheduling algorithm. The process that requests the CPU first gets the CPU allocated first. It is implemented using a FIFO queue.",
    pros: ["Simple and easy to understand", "No starvation risk (every process gets scheduled in arrival order)"],
    cons: ["Subject to the Convoy Effect (short jobs wait behind a very long job)", "High Average Waiting Time", "Poor response times for interactive systems"],
    example: "If P1 (burst 20) arrives at 0, and P2 (burst 2) arrives at 1. P2 will wait until time 20 to run. Convoy effect occurs."
  },
  SJF: {
    title: "Shortest Job First (SJF)",
    criteria: "Burst Time",
    mode: "Non-Preemptive",
    formula: "Turnaround Time = Completion Time - Arrival Time\nWaiting Time = Turnaround Time - Burst Time\nResponse Time = Start Time - Arrival Time",
    desc: "SJF schedules the process with the shortest burst time among all arrived processes. It is proven to be optimal for minimizing average waiting times.",
    pros: ["Minimizes Average Waiting Time (optimal)", "Excellent for batch systems where burst times are known in advance"],
    cons: ["Requires predicting future burst times (difficult in real systems)", "Starvation of longer processes if short processes continuously arrive"],
    example: "If P1 (burst 8) and P2 (burst 2) are ready, P2 runs first, reducing waiting time for P2 by 8 seconds."
  },
  SRTF: {
    title: "Shortest Remaining Time First (SRTF)",
    criteria: "Remaining Burst Time",
    mode: "Preemptive (Preemptive SJF)",
    formula: "Turnaround Time = Completion Time - Arrival Time\nWaiting Time = Turnaround Time - Burst Time\nResponse Time = First Start Time - Arrival Time",
    desc: "SRTF is the preemptive version of SJF. When a new process arrives, if its burst time is shorter than the remaining time of the currently running process, the current process is preempted.",
    pros: ["Provides even lower Average Waiting Time than non-preemptive SJF", "Highly responsive to short processes arriving during execution"],
    cons: ["High context switching overhead due to frequent preemption", "Starvation risk for long processes remains high", "Burst times must be estimated"],
    example: "P1 is running with 5s remaining. P2 arrives with burst 2s. P1 is immediately preempted and P2 runs."
  },
  RR: {
    title: "Round Robin (RR)",
    criteria: "Time Quantum (Time Slice)",
    mode: "Preemptive",
    formula: "Turnaround Time = Completion Time - Arrival Time\nWaiting Time = Turnaround Time - Burst Time\nResponse Time = First Start Time - Arrival Time",
    desc: "Round Robin is designed specifically for time-sharing systems. Each process is assigned a small time slice (time quantum). The CPU cycle shifts through ready processes circularly.",
    pros: ["Fair allocation of CPU resources", "Low Response Time (ideal for interactive/multi-user systems)", "No starvation (all processes get CPU access)"],
    cons: ["Performance depends heavily on Time Quantum size", "If quantum is too small, context switching overhead is high", "If quantum is too large, it degenerates into FCFS"],
    example: "With quantum 2s, P1 (burst 5s) runs for 2s, goes to tail, runs for 2s, goes to tail, and finishes with 1s run."
  },
  Priority: {
    title: "Priority Scheduling",
    criteria: "Priority Value",
    mode: "Preemptive or Non-Preemptive",
    formula: "Turnaround Time = Completion Time - Arrival Time\nWaiting Time = Turnaround Time - Burst Time\nResponse Time = First Start Time - Arrival Time",
    desc: "Each process is assigned a priority. The CPU is allocated to the process with the highest priority. In our lab, lower numerical values represent higher priority.",
    pros: ["Supports critical task execution first", "Allows implementing user-defined importance levels"],
    cons: ["Starvation (low priority processes may never run if higher priority tasks keep arriving)", "Requires 'Aging' (gradually increasing priority of waiting tasks) to prevent starvation"],
    example: "A system process (Priority 1) will run before a user application process (Priority 5)."
  },
  MLQ: {
    title: "Multilevel Queue Scheduling (MLQ)",
    criteria: "Process Class / Queue level",
    mode: "Preemptive / Multi-level",
    formula: "Calculated individually per queue based on FCFS/RR logic",
    desc: "MLQ divides the ready queue into multiple separate queues (e.g. Foreground/Interactive vs Background/Batch). Each queue has its own scheduling algorithm. Foreground queues have absolute priority over background queues.",
    pros: ["Organizes processes based on their type and requirements", "Allows scheduling interactive processes differently from batch tasks"],
    cons: ["Very rigid: processes cannot move between queues", "Can cause severe starvation in low-priority background queues"],
    example: "Queue 1 (System) runs RR. Queue 2 (Batch) runs FCFS. Queue 2 runs only when Queue 1 is completely empty."
  },
  MLFQ: {
    title: "Multilevel Feedback Queue (MLFQ)",
    criteria: "History of CPU consumption",
    mode: "Preemptive / Adaptive",
    formula: "Adaptive queue promotion/demotion based on quantum expiration",
    desc: "Unlike MLQ, MLFQ allows processes to move between queues. If a process uses too much CPU time (e.g. exhausts its quantum), it is demoted to a lower priority queue. If it waits too long in a lower queue, it is promoted (aging).",
    pros: ["Extremely flexible and adaptive", "Automatically penalizes CPU-bound tasks and rewards I/O-bound tasks", "Prevents starvation via aging mechanisms"],
    cons: ["Most complex scheduler design", "Requires setting parameters for quantum, promotion, and demotion levels"],
    example: "Process starts in Q0 (quantum 2). If it uses all 2s, it demotes to Q1 (quantum 4). If it uses all 4s in Q1, it demotes to Q2 (FCFS)."
  }
};

export default function Theory() {
  const [activeTab, setActiveTab] = useState("FCFS");

  return (
    <div className="min-h-screen bg-[#050814] pb-20">
      {/* Background Glowing Orbs */}
      <div className="bg-glow-orb orb-primary top-10 left-10 animate-float" />
      <div className="bg-glow-orb orb-secondary bottom-10 right-10" />

      <Navbar />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12 fluid-container px-4">
        {/* Header Title Section */}
        <div className="text-center space-y-4">
          <div className="px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 text-xs font-bold uppercase tracking-wider inline-block">
            Virtual Learning Suite
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            CPU Scheduling Theory
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Deep dive into the operational mechanics, formulas, and structural comparison of CPU schedulers.
          </p>
        </div>

        {/* Tab Navigation Grid */}
        <div className="flex flex-wrap justify-center gap-2 bg-slate-950/40 p-2 rounded-3xl border border-white/5 max-w-4xl mx-auto">
          {Object.keys(theoryData).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === key
                  ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Active Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-3 gap-8 items-start"
          >
            {/* Left: Core Description and Formula */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 shadow-glow/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Cpu size={22} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">
                    {theoryData[activeTab].title}
                  </h2>
                </div>

                <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-sans">
                  {theoryData[activeTab].desc}
                </p>

                {/* Mathematical Formula Card */}
                <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-5 space-y-2 mt-4">
                  <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-extrabold flex items-center gap-1.5">
                    <Settings size={12} />
                    Kernel Scheduling Equations
                  </span>
                  <pre className="text-emerald-400 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {theoryData[activeTab].formula}
                  </pre>
                </div>

                {/* Example scenario */}
                <div className="p-5 border border-dashed border-slate-800 bg-slate-900/10 rounded-2xl space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-500">Case Study / Example</span>
                  <p className="text-slate-400 font-sans text-xs sm:text-sm italic">
                    {theoryData[activeTab].example}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Selection criteria & pros/cons list */}
            <div className="space-y-6">
              {/* Technical Specifications */}
              <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 shadow-glow/5 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award size={18} className="text-cyan-400" />
                  Parameters Matrix
                </h3>

                <div className="divide-y divide-white/5 text-xs font-mono">
                  <div className="py-3 flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Mode:</span>
                    <span className="text-cyan-300 font-bold">{theoryData[activeTab].mode}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Criteria:</span>
                    <span className="text-indigo-300 font-bold">{theoryData[activeTab].criteria}</span>
                  </div>
                </div>
              </div>

              {/* Advantages & Disadvantages */}
              <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 shadow-glow/5 space-y-6">
                {/* Pros */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                    Advantages
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-sans">
                    {theoryData[activeTab].pros.map((pro, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <ArrowRight size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-3 border-t border-white/5 pt-6">
                  <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider">
                    Disadvantages
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-sans">
                    {theoryData[activeTab].cons.map((con, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <ArrowRight size={14} className="text-rose-500 mt-0.5 shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Global Comparison Table */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 shadow-glow/5 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Table size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
                Comparative Summary Matrix
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Overview comparison of CPU scheduling criteria, advantages, and drawbacks.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-500 font-bold uppercase tracking-wider text-2xs">
                  <th className="py-4 px-4">Algorithm</th>
                  <th className="py-4 px-4">Selection Criteria</th>
                  <th className="py-4 px-4">Preemption</th>
                  <th className="py-4 px-4">Complexity</th>
                  <th className="py-4 px-4">Primary Weakness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-sans">
                {Object.keys(theoryData).map((key) => (
                  <tr key={key} className="hover:bg-white/5 transition-all">
                    <td className="py-4 px-4 font-mono font-bold text-white">{key}</td>
                    <td className="py-4 px-4 font-mono">{theoryData[key].criteria}</td>
                    <td className="py-4 px-4 font-mono text-cyan-400">{theoryData[key].mode}</td>
                    <td className="py-4 px-4">
                      {key === "FCFS" || key === "SJF" ? "Low" : key === "MLFQ" ? "Very High" : "Medium"}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {key === "FCFS" ? "Convoy Effect" : key === "SJF" || key === "SRTF" || key === "Priority" ? "Starvation" : key === "RR" ? "Context Switch Overhead" : "Complexity / Overhead"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
