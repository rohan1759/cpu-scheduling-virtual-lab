import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import ProcessTable from "../components/ProcessTable";
import QueueVisualizer from "../components/QueueVisualizer";
import CPUVisualizer from "../components/CPUVisualizer";
import GanttChart from "../components/GanttChart";
import MetricsPanel from "../components/MetricsPanel";
import ExecutionLog from "../components/ExecutionLog";
import Controls from "../components/Controls";

import { fcfsScheduling } from "../algorithms/fcfs";
import { sjfScheduling } from "../algorithms/sjf";
import { srtfScheduling } from "../algorithms/srtf";
import { rrScheduling } from "../algorithms/rr";
import { priorityScheduling } from "../algorithms/priority";
import { mlqScheduling } from "../algorithms/mlq";
import { mlfqScheduling } from "../algorithms/mlfq";

import { Table, FileSpreadsheet, Printer, Award, LayoutDashboard, Sparkles } from "lucide-react";

const PRESETS = {
  balanced: [
    { pid: "P1", arrivalTime: 0, burstTime: 5, priority: 3, queue: 1 },
    { pid: "P2", arrivalTime: 1, burstTime: 3, priority: 1, queue: 1 },
    { pid: "P3", arrivalTime: 2, burstTime: 8, priority: 4, queue: 2 },
    { pid: "P4", arrivalTime: 3, burstTime: 2, priority: 2, queue: 2 },
  ],
  convoy: [
    { pid: "P1", arrivalTime: 0, burstTime: 25, priority: 4, queue: 2 },
    { pid: "P2", arrivalTime: 1, burstTime: 2, priority: 1, queue: 1 },
    { pid: "P3", arrivalTime: 2, burstTime: 1, priority: 2, queue: 1 },
  ],
  priorityDemo: [
    { pid: "P1", arrivalTime: 0, burstTime: 6, priority: 4, queue: 2 },
    { pid: "P2", arrivalTime: 2, burstTime: 4, priority: 1, queue: 1 },
    { pid: "P3", arrivalTime: 4, burstTime: 2, priority: 2, queue: 1 },
  ]
};

export default function Simulator() {
  // 1. Initial State (load from localStorage if exists)
  const [processes, setProcesses] = useState(() => {
    const saved = localStorage.getItem("cpu-simulator-processes");
    return saved ? JSON.parse(saved) : PRESETS.balanced;
  });

  const [algorithm, setAlgorithm] = useState("FCFS");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [priorityPreemptive, setPriorityPreemptive] = useState(false);
  const [activeTab, setActiveTab] = useState("simulator"); // "simulator" | "comparison"

  // Playback Loop States
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [currentTick, setCurrentTick] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.5x, 1x, 2x

  const intervalRef = useRef(null);

  // Sync processes to localStorage
  useEffect(() => {
    localStorage.setItem("cpu-simulator-processes", JSON.stringify(processes));
  }, [processes]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Handle speed and play status changes
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying && simulationResult) {
      const baseDelay = 1000; // 1 second base tick duration
      const delay = baseDelay / speed;
      
      intervalRef.current = setInterval(() => {
        setCurrentTick((prev) => {
          const maxTicks = simulationResult.ticks.length - 1;
          if (prev >= maxTicks) {
            setIsPlaying(false);
            clearInterval(intervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    }
  }, [isPlaying, speed, simulationResult]);

  // Load Preset Workload
  const loadPreset = (presetKey) => {
    setProcesses(PRESETS[presetKey]);
    resetSimulation();
  };

  // Run the Simulation for active algorithm
  const runSimulation = () => {
    setIsPlaying(false);
    setCurrentTick(0);

    let res;
    switch (algorithm) {
      case "FCFS":
        res = fcfsScheduling(processes);
        break;
      case "SJF":
        res = sjfScheduling(processes);
        break;
      case "SRTF":
        res = srtfScheduling(processes);
        break;
      case "RR":
        res = rrScheduling(processes, timeQuantum);
        break;
      case "Priority":
        res = priorityScheduling(processes, { preemptive: priorityPreemptive });
        break;
      case "MLQ":
        res = mlqScheduling(processes);
        break;
      case "MLFQ":
        res = mlfqScheduling(processes);
        break;
      default:
        res = fcfsScheduling(processes);
    }

    setSimulationResult(res);
    setIsSimulationActive(true);
    // Automatically start playing
    setIsPlaying(true);
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentTick(0);
    setSimulationResult(null);
    setIsSimulationActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stepForward = () => {
    if (!simulationResult) return;
    const maxTicks = simulationResult.ticks.length - 1;
    if (currentTick < maxTicks) {
      setCurrentTick((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentTick > 0) {
      setCurrentTick((prev) => prev - 1);
    }
  };

  // Get snapshots for current playback position
  const activeTickSnapshot = simulationResult?.ticks[currentTick] || null;
  const maxTicks = simulationResult ? simulationResult.ticks.length - 1 : 0;

  // CPU details
  const runningPid = activeTickSnapshot?.running;
  const runningProcess = runningPid
    ? processes.find((p) => p.pid === runningPid)
    : null;

  // Logs generator
  const logList = [];
  if (simulationResult && isSimulationActive) {
    let prevRunning = null;
    const completedSet = new Set();

    for (let t = 0; t <= currentTick; t++) {
      const snap = simulationResult.ticks[t];
      if (!snap) continue;

      processes.forEach((p) => {
        if (p.arrivalTime === t) {
          logList.push(`Process ${p.pid} arrived in system (Burst: ${p.burstTime}s).`);
        }
      });

      const running = snap.running;
      if (running !== prevRunning) {
        if (running) {
          logList.push(`CPU scheduled process ${running}.`);
        } else if (t < maxTicks) {
          logList.push(`CPU Core is idle.`);
        }
        prevRunning = running;
      }

      simulationResult.processes.forEach((p) => {
        if (p.completionTime === t && !completedSet.has(p.pid)) {
          logList.push(
            `Process ${p.pid} finished execution (TAT: ${p.turnaroundTime}s, WT: ${p.waitingTime}s).`
          );
          completedSet.add(p.pid);
        }
      });
    }
  }

  // Algorithm comparison logic
  const runComparison = () => {
    const list = [...processes];
    const getAvg = (res, field) => {
      const procs = res.processes;
      return procs.reduce((a, b) => a + (b[field] || 0), 0) / procs.length;
    };

    const fcfsRes = fcfsScheduling(list);
    const sjfRes = sjfScheduling(list);
    const srtfRes = srtfScheduling(list);
    const rrRes = rrScheduling(list, timeQuantum);
    const priorityRes = priorityScheduling(list, { preemptive: priorityPreemptive });
    const mlqRes = mlqScheduling(list);
    const mlfqRes = mlfqScheduling(list);

    return [
      { name: "FCFS", AWT: getAvg(fcfsRes, "waitingTime"), ATT: getAvg(fcfsRes, "turnaroundTime"), ART: getAvg(fcfsRes, "waitingTime") },
      { name: "SJF", AWT: getAvg(sjfRes, "waitingTime"), ATT: getAvg(sjfRes, "turnaroundTime"), ART: getAvg(sjfRes, "waitingTime") },
      { name: "SRTF", AWT: getAvg(srtfRes, "waitingTime"), ATT: getAvg(srtfRes, "turnaroundTime"), ART: getAvg(srtfRes, "responseTime") },
      { name: "RR", AWT: getAvg(rrRes, "waitingTime"), ATT: getAvg(rrRes, "turnaroundTime"), ART: getAvg(rrRes, "responseTime") },
      { name: "Priority", AWT: getAvg(priorityRes, "waitingTime"), ATT: getAvg(priorityRes, "turnaroundTime"), ART: getAvg(priorityRes, "responseTime") },
      { name: "MLQ", AWT: getAvg(mlqRes, "waitingTime"), ATT: getAvg(mlqRes, "turnaroundTime"), ART: getAvg(mlqRes, "responseTime") },
      { name: "MLFQ", AWT: getAvg(mlfqRes, "waitingTime"), ATT: getAvg(mlfqRes, "turnaroundTime"), ART: getAvg(mlfqRes, "responseTime") },
    ];
  };

  const comparisonData = activeTab === "comparison" ? runComparison() : [];

  // Best algorithm recommendation
  const bestAlgorithm = activeTab === "comparison" && comparisonData.length > 0
    ? [...comparisonData].sort((a, b) => a.AWT - b.AWT)[0]
    : null;

  // Report Exporters
  const exportToCSV = () => {
    if (!simulationResult) return;
    const headers = ["PID", "Arrival Time", "Burst Time", "Priority", "Queue", "Start Time", "Completion Time", "Turnaround Time", "Waiting Time", "Response Time"];
    const rows = simulationResult.processes.map((p) => [
      p.pid,
      p.arrivalTime,
      p.burstTime,
      p.priority || 1,
      p.queue || 1,
      p.startTime,
      p.completionTime,
      p.turnaroundTime,
      p.waitingTime,
      p.responseTime !== undefined ? p.responseTime : p.waitingTime,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cpu_scheduling_${algorithm.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    if (!simulationResult) return;
    const printWindow = window.open("", "_blank");
    const processesHTML = simulationResult.processes.map((p) => `
      <tr>
        <td><strong>${p.pid}</strong></td>
        <td>${p.arrivalTime}s</td>
        <td>${p.burstTime}s</td>
        <td>${p.priority || 1}</td>
        <td>Q${p.queue || 1}</td>
        <td>${p.startTime}s</td>
        <td>${p.completionTime}s</td>
        <td>${p.turnaroundTime}s</td>
        <td>${p.waitingTime}s</td>
        <td>${p.responseTime !== undefined ? p.responseTime : p.waitingTime}s</td>
      </tr>
    `).join("");

    const avgWT = (simulationResult.processes.reduce((a, b) => a + (b.waitingTime || 0), 0) / simulationResult.processes.length).toFixed(2);
    const avgTAT = (simulationResult.processes.reduce((a, b) => a + (b.turnaroundTime || 0), 0) / simulationResult.processes.length).toFixed(2);
    const avgRT = (simulationResult.processes.reduce((a, b) => a + (b.responseTime !== undefined ? b.responseTime : b.waitingTime), 0) / simulationResult.processes.length).toFixed(2);

    printWindow.document.write(`
      <html>
        <head>
          <title>CPU Scheduling Simulation Report - ${algorithm}</title>
          <style>
            body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
            h1 { color: #4f46e5; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 30px; font-size: 28px; }
            table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            th, td { border: 1px solid #e2e8f0; padding: 14px; text-align: left; font-size: 13px; }
            th { background: #f8fafc; font-weight: 700; color: #475569; }
            .meta { display: flex; gap: 40px; margin-bottom: 30px; font-size: 14px; color: #64748b; }
            .metrics { display: flex; gap: 20px; margin-top: 30px; }
            .metric-card { flex: 1; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #faf5ff; }
            .metric-label { font-size: 12px; font-weight: 700; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.05em; }
            .metric-value { font-size: 32px; font-weight: 800; color: #6b21a8; margin-top: 8px; }
          </style>
        </head>
        <body>
          <h1>CPU Scheduling Lab Simulation Report</h1>
          <div class="meta">
            <div><strong>Algorithm:</strong> ${algorithm}</div>
            <div><strong>Total Execution Time:</strong> ${maxTicks} seconds</div>
            <div><strong>Generated On:</strong> ${new Date().toLocaleString()}</div>
          </div>
          
          <h2>Process Completion Metrics</h2>
          <table>
            <thead>
              <tr>
                <th>PID</th>
                <th>Arrival</th>
                <th>Burst</th>
                <th>Priority</th>
                <th>Queue</th>
                <th>Start</th>
                <th>Completion</th>
                <th>Turnaround</th>
                <th>Waiting</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              ${processesHTML}
            </tbody>
          </table>

          <h2>Performance Summary</h2>
          <div class="metrics">
            <div class="metric-card" style="background-color: #ecfeff;">
              <div class="metric-label" style="color: #0891b2;">Average Waiting Time</div>
              <div class="metric-value" style="color: #155e75;">${avgWT}s</div>
            </div>
            <div class="metric-card" style="background-color: #f5f3ff;">
              <div class="metric-label">Average Turnaround Time</div>
              <div class="metric-value">${avgTAT}s</div>
            </div>
            <div class="metric-card" style="background-color: #f0fdf4;">
              <div class="metric-label" style="color: #16a34a;">Average Response Time</div>
              <div class="metric-value" style="color: #166534;">${avgRT}s</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050814] pb-24">
      {/* Background Glowing Orbs */}
      <div className="bg-glow-orb orb-primary top-10 left-10 animate-float" />
      <div className="bg-glow-orb orb-secondary bottom-10 right-10" />

      <Navbar />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 fluid-container">
        {/* Header Block with Mode Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Scheduling Lab Simulator
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Visualize, analyze, and compare scheduling processes side-by-side.
            </p>
          </div>

          {/* Mode Toggles */}
          <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 gap-1 shrink-0">
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-indigo-500 text-white shadow-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutDashboard size={14} />
              Simulator Console
            </button>
            <button
              onClick={() => setActiveTab("comparison")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "comparison"
                  ? "bg-indigo-500 text-white shadow-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Table size={14} />
              Algorithm Comparison
            </button>
          </div>
        </div>

        {/* Tab 1: Simulator Console */}
        {activeTab === "simulator" && (
          <>
            {/* Presets & Exporters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Preset Scenarios:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => loadPreset("balanced")}
                    className="px-3.5 py-1.5 rounded-xl text-2xs font-bold bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:border-indigo-500/30 transition-all cursor-pointer"
                  >
                    Balanced Mix
                  </button>
                  <button
                    onClick={() => loadPreset("convoy")}
                    className="px-3.5 py-1.5 rounded-xl text-2xs font-bold bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:border-indigo-500/30 transition-all cursor-pointer"
                    title="Long process starts first, causing conveyor effect"
                  >
                    Convoy Effect
                  </button>
                  <button
                    onClick={() => loadPreset("priorityDemo")}
                    className="px-3.5 py-1.5 rounded-xl text-2xs font-bold bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:border-indigo-500/30 transition-all cursor-pointer"
                  >
                    Priority Preemption
                  </button>
                </div>
              </div>

              {isSimulationActive && (
                <div className="flex gap-2">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-2xs font-bold text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 hover:border-emerald-500/20 border border-white/5 bg-slate-900/60 cursor-pointer transition-all"
                  >
                    <FileSpreadsheet size={12} />
                    Export CSV
                  </button>
                  <button
                    onClick={printReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-2xs font-bold text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/5 hover:border-indigo-500/20 border border-white/5 bg-slate-900/60 cursor-pointer transition-all"
                  >
                    <Printer size={12} />
                    Download PDF Report
                  </button>
                </div>
              )}
            </div>

            {/* Playback Controls Component */}
            <Controls
              onStart={runSimulation}
              onReset={resetSimulation}
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentTick={currentTick}
              setCurrentTick={setCurrentTick}
              maxTicks={maxTicks}
              speed={speed}
              setSpeed={setSpeed}
              stepForward={stepForward}
              stepBackward={stepBackward}
              timeQuantum={timeQuantum}
              setTimeQuantum={setTimeQuantum}
              priorityPreemptive={priorityPreemptive}
              setPriorityPreemptive={setPriorityPreemptive}
              isSimulationActive={isSimulationActive}
            />

            {/* Dashboard grid layout */}
            <div className="dashboard-grid-layout items-start">
              {/* Left Column: Config and Metrics */}
              <div className="col-span-full lg:col-span-7 space-y-8 min-w-0">
                <ProcessTable
                  processes={processes}
                  setProcesses={setProcesses}
                  algorithm={algorithm}
                />

                <MetricsPanel
                  completed={simulationResult ? simulationResult.processes : []}
                />
              </div>

              {/* Right Column: Active Simulation Vis Core */}
              <div className="col-span-full lg:col-span-5 space-y-8 min-w-0">
                <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  {/* CPU execution indicator */}
                  <CPUVisualizer current={runningProcess} />

                  {/* Active Ready Queue Status */}
                  <QueueVisualizer
                    queue={
                      isSimulationActive && activeTickSnapshot
                        ? activeTickSnapshot.readyQueue
                        : []
                    }
                  />
                </div>

                {/* Console System Log output */}
                <ExecutionLog logs={logList} />
              </div>
            </div>

            {/* Gantt Timeline */}
            <GanttChart
              timeline={simulationResult ? simulationResult.timeline : []}
              currentTick={isSimulationActive ? currentTick : null}
            />
          </>
        )}

        {/* Tab 2: Algorithm Comparison Mode */}
        {activeTab === "comparison" && (
          <div className="space-y-8 max-w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start min-w-0">
              {/* Left: Process configuration */}
              <div className="lg:col-span-1 space-y-6 min-w-0">
                <ProcessTable
                  processes={processes}
                  setProcesses={setProcesses}
                  algorithm={algorithm}
                />

                {bestAlgorithm && (
                  <div className="glass rounded-3xl p-6 border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden shadow-glow-emerald/5 flex flex-col gap-4 items-start min-w-0">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white">Efficiency Recommendation</h4>
                      <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-sans">
                        Based on the loaded processes, the most efficient algorithm is <strong className="text-emerald-400">{bestAlgorithm.name}</strong>, yielding an average waiting time of only <strong className="text-emerald-400">{bestAlgorithm.AWT.toFixed(2)}s</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Charts and Analysis */}
              <div className="lg:col-span-2 space-y-8 min-w-0">
                {/* Bar chart comparison */}
                <div className="glass rounded-3xl p-5 sm:p-8 border border-white/5 shadow-glow/5 relative overflow-hidden w-full h-[300px] sm:h-[360px] md:h-[420px] flex flex-col min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-indigo-400" />
                      <h3 className="text-base sm:text-lg font-bold text-white">Algorithm Performance Comparison</h3>
                    </div>
                  </div>
                  <div className="flex-grow min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonData}
                        margin={{ top: 16, right: 20, left: 0, bottom: 8 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155/20" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                        <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'Seconds', angle: -90, position: 'insideLeft', fill: '#94a3b8', offset: 10 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0f172a", borderRadius: "16px", borderColor: "rgba(255,255,255,0.08)" }}
                          itemStyle={{ fontSize: "12px", fontFamily: "monospace" }}
                          labelStyle={{ fontWeight: "bold", color: "#818cf8" }}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                        <Bar dataKey="AWT" fill="#22d3ee" name="Avg Waiting Time (AWT)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="ATT" fill="#c084fc" name="Avg Turnaround Time (ATT)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="ART" fill="#34d399" name="Avg Response Time (ART)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Metrics Table Grid */}
                <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 shadow-glow/5 max-w-full overflow-x-auto">
                  <h3 className="text-lg font-bold text-white mb-6">Metrics Comparison Table</h3>
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full min-w-[520px] text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-500 font-bold uppercase tracking-wider text-2xs">
                          <th className="py-3 px-4">Algorithm</th>
                          <th className="py-3 px-4 text-center">Avg Waiting Time (AWT)</th>
                          <th className="py-3 px-4 text-center">Avg Turnaround Time (ATT)</th>
                          <th className="py-3 px-4 text-center">Avg Response Time (ART)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300 font-sans">
                        {comparisonData.map((row) => (
                          <tr key={row.name} className="hover:bg-white/5 transition-all">
                            <td className="py-4 px-4 font-mono font-bold text-white">{row.name}</td>
                            <td className="py-4 px-4 text-center font-mono text-cyan-400 font-bold">{row.AWT.toFixed(2)}s</td>
                            <td className="py-4 px-4 text-center font-mono text-purple-400 font-bold">{row.ATT.toFixed(2)}s</td>
                            <td className="py-4 px-4 text-center font-mono text-emerald-400 font-bold">{row.ART.toFixed(2)}s</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}