import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend as ChartLegend, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import ProcessTable from "../components/ProcessTable";
import QueueVisualizer from "../components/QueueVisualizer";
import CPUVisualizer from "../components/CPUVisualizer";
import GanttChart from "../components/GanttChart";
import MetricsPanel from "../components/MetricsPanel";
import ExecutionLog from "../components/ExecutionLog";


import { fcfsScheduling } from "../algorithms/fcfs";
import { sjfScheduling } from "../algorithms/sjf";
import { srtfScheduling } from "../algorithms/srtf";
import { rrScheduling } from "../algorithms/rr";
import { priorityScheduling } from "../algorithms/priority";
import { mlqScheduling } from "../algorithms/mlq";
import { mlfqScheduling } from "../algorithms/mlfq";

import {
  Table,
  FileSpreadsheet,
  Printer,
  Award,
  LayoutDashboard,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles
} from "lucide-react";

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

  // Remaining & Elapsed Burst Times for active process
  const remainingBurst = (isSimulationActive && activeTickSnapshot && runningPid)
    ? activeTickSnapshot.remainingBursts[runningPid]
    : 0;
  const elapsedTime = runningProcess ? (runningProcess.burstTime - remainingBurst) : 0;

  // Dynamic CPU utilization up to current tick
  const getUtilizationAtTick = () => {
    if (!simulationResult || currentTick === 0) return 0;
    let busy = 0;
    for (let t = 0; t < currentTick; t++) {
      if (simulationResult.ticks[t]?.running) busy++;
    }
    return Math.round((busy / currentTick) * 100);
  };
  const cpuUtilization = getUtilizationAtTick();

  // Dynamic logs matching the "[00:xx] kernel:" format
  const logList = [];
  if (simulationResult && isSimulationActive) {
    let prevRunning = null;
    const completedSet = new Set();

    for (let t = 0; t <= currentTick; t++) {
      const snap = simulationResult.ticks[t];
      if (!snap) continue;

      const ts = `[00:${String(t).padStart(2, "0")}] kernel:`;

      processes.forEach((p) => {
        if (p.arrivalTime === t) {
          logList.push(`${ts} Process ${p.pid} arrived in system (Burst: ${p.burstTime}s).`);
        }
      });

      const running = snap.running;
      if (running !== prevRunning) {
        if (running) {
          logList.push(`${ts} CPU scheduled process ${running}.`);
        } else if (t < maxTicks) {
          logList.push(`${ts} CPU Core is idle.`);
        }
        prevRunning = running;
      }

      simulationResult.processes.forEach((p) => {
        if (p.completionTime === t && !completedSet.has(p.pid)) {
          logList.push(
            `${ts} Process ${p.pid} completed execution.`
          );
          completedSet.add(p.pid);
        }
      });
    }
  }

  // Algorithm comparison calculations
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

  // Best algorithm dynamic selection
  const getBestAlgorithm = () => {
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

    const data = [
      { name: "FCFS", AWT: getAvg(fcfsRes, "waitingTime") },
      { name: "SJF", AWT: getAvg(sjfRes, "waitingTime") },
      { name: "SRTF", AWT: getAvg(srtfRes, "waitingTime") },
      { name: "RR", AWT: getAvg(rrRes, "waitingTime") },
      { name: "Priority", AWT: getAvg(priorityRes, "waitingTime") },
      { name: "MLQ", AWT: getAvg(mlqRes, "waitingTime") },
      { name: "MLFQ", AWT: getAvg(mlfqRes, "waitingTime") },
    ];
    return [...data].sort((a, b) => a.AWT - b.AWT)[0];
  };

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
    <div className="simulator-scroll h-screen max-h-screen overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col bg-[#02050f] text-slate-100 relative">
      {/* Background Glowing Orbs */}
      <div className="bg-glow-orb orb-primary top-10 left-10 animate-float opacity-10 pointer-events-none" />
      <div className="bg-glow-orb orb-secondary bottom-10 right-10 opacity-10 pointer-events-none" />

      <Navbar />

      {/* Main Workspace Outer Wrap */}
      <div className="simulator-scroll flex-grow overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col justify-between p-2 gap-1.5 max-w-7xl mx-auto w-full z-10">
        {/* Header Block with Mode Toggle */}
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-none">
              Scheduling Lab Simulator
            </h1>
            <p className="text-slate-500 text-[9px] sm:text-[10px] mt-0.5 font-sans leading-none">
              Visualize, analyze, and compare scheduling processes side-by-side.
            </p>
          </div>

          {/* Mode Toggle Buttons */}
          <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5 gap-1 shrink-0 scale-90 sm:scale-100">
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-indigo-600 text-white shadow-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutDashboard size={10} />
              Simulator Console
            </button>
            <button
              onClick={() => setActiveTab("comparison")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "comparison"
                  ? "bg-indigo-600 text-white shadow-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Table size={10} />
              Algorithm Comparison
            </button>
          </div>
        </div>

        {/* Tab 1: Simulator Console */}
        {activeTab === "simulator" && (
          <div className="flex-grow overflow-hidden flex flex-col justify-between gap-1.5">
            {/* ROW 1: Preset & Strategies (Consolidated!) */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-1 glass rounded-xl border border-white/5 shrink-0">
              <div className="flex flex-wrap items-center gap-4">
                {/* Presets */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
                    Preset Scenario:
                  </span>
                  <select
                    value={
                      processes === PRESETS.balanced ? "balanced" :
                      processes === PRESETS.convoy ? "convoy" :
                      processes === PRESETS.priorityDemo ? "priorityDemo" : ""
                    }
                    onChange={(e) => {
                      if (e.target.value) {
                        loadPreset(e.target.value);
                      }
                    }}
                    className="bg-slate-950/60 border border-white/10 text-[10px] text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500 outline-none cursor-pointer font-bold font-mono transition-all hover:bg-slate-900/80"
                  >
                    <option value="" disabled>Select Preset</option>
                    <option value="balanced">Balanced Mix</option>
                    <option value="convoy">Convoy Effect</option>
                    <option value="priorityDemo">Priority Preemption</option>
                  </select>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-[1px] h-4 bg-white/10" />

                {/* Scheduling Strategy Selection */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
                    Scheduling Strategy:
                  </span>
                  <select
                    value={algorithm}
                    onChange={(e) => {
                      setAlgorithm(e.target.value);
                      resetSimulation();
                    }}
                    className="bg-slate-950/60 border border-white/10 text-[10px] text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-blue-500 outline-none cursor-pointer font-bold font-mono transition-all hover:bg-slate-900/80"
                  >
                    <option value="FCFS">FCFS (First Come First Serve)</option>
                    <option value="SJF">SJF (Shortest Job First)</option>
                    <option value="SRTF">SRTF (Shortest Remaining Time First)</option>
                    <option value="RR">RR (Round Robin)</option>
                    <option value="Priority">Priority</option>
                    <option value="MLQ">MLQ (Multi-Level Queue)</option>
                    <option value="MLFQ">MLFQ (Multi-Level Feedback Queue)</option>
                  </select>

                  {/* Inline Quantum / Preemption Controls */}
                  {algorithm === "RR" && (
                    <div className="flex items-center gap-2 bg-indigo-500/5 border border-indigo-500/20 px-2 py-0.5 rounded-lg animate-fade-in">
                      <span className="text-[8px] font-bold font-mono text-indigo-300">Quantum:</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={timeQuantum}
                        onChange={(e) => {
                          setTimeQuantum(Number(e.target.value));
                          resetSimulation();
                        }}
                        className="w-12 accent-indigo-500 cursor-pointer h-1 rounded"
                      />
                      <span className="text-[9px] font-mono font-black text-indigo-400">{timeQuantum}s</span>
                    </div>
                  )}

                  {algorithm === "Priority" && (
                    <div className="flex items-center gap-1 bg-indigo-500/5 border border-indigo-500/20 p-0.5 rounded-lg animate-fade-in scale-90">
                      <button
                        onClick={() => {
                          setPriorityPreemptive(false);
                          resetSimulation();
                        }}
                        className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                          !priorityPreemptive ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        Non-Preempt
                      </button>
                      <button
                        onClick={() => {
                          setPriorityPreemptive(true);
                          resetSimulation();
                        }}
                        className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                          priorityPreemptive ? "bg-indigo-500 text-white shadow-glow" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        Preemptive
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Exporters aligned far right */}
              {/* {isSimulationActive && (
                <div className="flex gap-2">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-2xs font-bold text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 hover:border-emerald-500/20 border border-white/5 bg-slate-900/60 cursor-pointer transition-all"
                  >
                    <FileSpreadsheet size={10} />
                    Export CSV
                  </button>
                  <button
                    onClick={printReport}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-2xs font-bold text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/5 hover:border-indigo-500/20 border border-white/5 bg-slate-900/60 cursor-pointer transition-all"
                  >
                    <Printer size={10} />
                    Download PDF Report
                  </button>
                </div>
              )} */}
            </div>

            {/* ROW 2: Playback Controls (Consolidated!) */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 glass rounded-xl border border-white/5 shrink-0">
              {/* Start & Reset */}
              <div className="flex gap-2 items-center">
                <button
                  onClick={runSimulation}
                  className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 font-medium hover:scale-[1.02] active:scale-95 transition-all shadow-glow text-slate-950 cursor-pointer text-xs"
                >
                  <Play size={10} className="fill-current" />
                  {isSimulationActive ? "Re-Run" : "Run Simulation"}
                </button>

                <button
                  onClick={resetSimulation}
                  className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 font-medium border border-white/10 hover:scale-[1.02] active:scale-95 transition-all text-slate-300 cursor-pointer text-xs"
                >
                  <RotateCcw size={10} />
                  Reset
                </button>
              </div>

              {/* Center Playback Controls */}
              {isSimulationActive && (
                <div className="flex items-center gap-2 bg-slate-950/40 px-2 py-1 rounded-xl border border-white/5">
                  {/* Skip to Start */}
                  <button
                    onClick={() => setCurrentTick(0)}
                    disabled={currentTick === 0}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-all"
                    title="Skip to Start"
                  >
                    <SkipBack size={12} />
                  </button>

                  {/* Step Back */}
                  <button
                    onClick={stepBackward}
                    disabled={currentTick === 0}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-all"
                    title="Step Backward"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {/* Play / Pause */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-[0_0_12px_#3b82f6] hover:scale-105 active:scale-95 transition-all"
                    title={isPlaying ? "Pause Simulation" : "Play Simulation"}
                  >
                    {isPlaying ? <Pause size={10} className="fill-current" /> : <Play size={10} className="fill-current ml-0.5" />}
                  </button>

                  {/* Step Forward */}
                  <button
                    onClick={stepForward}
                    disabled={currentTick >= maxTicks}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-all"
                    title="Step Forward"
                  >
                    <ChevronRight size={14} />
                  </button>

                  {/* Skip to End */}
                  <button
                    onClick={() => setCurrentTick(maxTicks)}
                    disabled={currentTick >= maxTicks}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-all"
                    title="Skip to End"
                  >
                    <SkipForward size={12} />
                  </button>

                  {/* Speed Selector */}
                  <div className="flex bg-slate-900/80 p-0.5 rounded border border-white/5 ml-1">
                    {[0.5, 1, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold transition-all cursor-pointer ${
                          speed === s
                            ? "bg-slate-800 text-cyan-400 font-extrabold"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Right timeline Scrubber */}
              {isSimulationActive && (
                  <div className="flex items-center gap-3 flex-grow max-w-sm pl-3">
                  <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                    Simulation Time: <strong className="text-cyan-400 font-extrabold">{currentTick}s / {maxTicks}s</strong>
                  </span>
                    <input
                      type="range"
                      min="0"
                      max={maxTicks}
                      value={currentTick}
                      onChange={(e) => setCurrentTick(Number(e.target.value))}
                      className="flex-grow accent-cyan-400 bg-slate-950 border border-white/5 h-1 rounded-full appearance-none cursor-pointer"
                    />
                </div>
              )}
            </div>

            {/* ROW 3: Core Simulation Cards Grid (1 row of 4 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 shrink-0 overflow-hidden">
              <ProcessTable
                processes={processes}
                setProcesses={setProcesses}
                algorithm={algorithm}
              />

              <CPUVisualizer
                current={runningProcess}
                status={isSimulationActive ? (runningProcess ? "Running" : "Idle") : "Stopped"}
                remainingBurst={remainingBurst}
                elapsedTime={elapsedTime}
                utilization={cpuUtilization}
              />

              <QueueVisualizer
                queue={
                  isSimulationActive && activeTickSnapshot
                    ? activeTickSnapshot.readyQueue
                    : []
                }
              />

              <MetricsPanel
                completed={simulationResult ? simulationResult.processes : []}
                utilization={cpuUtilization}
              />
            </div>

            {/* ROW 4: Live Debugger + Gantt Chart Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 shrink-0">
              <ExecutionLog logs={logList} />
              <GanttChart
                timeline={simulationResult ? simulationResult.timeline : []}
                currentTick={isSimulationActive ? currentTick : null}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Algorithm Comparison Mode */}
        {activeTab === "comparison" && (
          <div className="flex-grow overflow-y-auto pr-1 space-y-4 pt-1 scrollbar-dense">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              {/* Left: Process configuration */}
              <div className="lg:col-span-1 space-y-4">
                <ProcessTable
                  processes={processes}
                  setProcesses={setProcesses}
                  algorithm={algorithm}
                />

                {getBestAlgorithm() && (
                  <div className="glass rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden shadow-glow-emerald/5 flex flex-col gap-3 items-start">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1">
                      <Award size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white font-sans tracking-tight">Efficiency Recommendation</h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed font-sans">
                        Based on the loaded processes, the most efficient algorithm is <strong className="text-emerald-400 font-extrabold font-sans">{getBestAlgorithm().name}</strong>, yielding an average waiting time of only <strong className="text-emerald-400 font-mono font-extrabold">{getBestAlgorithm().AWT.toFixed(2)}s</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Charts and Analysis */}
              <div className="lg:col-span-2 space-y-4">
                {/* Bar chart comparison */}
                <div className="glass rounded-2xl p-5 border border-white/5 shadow-glow/5 relative overflow-hidden w-full h-[280px] flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-indigo-400" />
                    <h3 className="text-sm sm:text-base font-extrabold text-white font-sans tracking-tight">Algorithm Performance Comparison</h3>
                  </div>
                  <div className="flex-grow min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff/10" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={9} fontWeight="bold" />
                        <YAxis stroke="#64748b" fontSize={9} label={{ value: 'Seconds', angle: -90, position: 'insideLeft', fill: '#64748b', offset: 10 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#090e21", borderRadius: "12px", borderColor: "rgba(255,255,255,0.08)", fontSize: "10px" }}
                          itemStyle={{ fontSize: "10px", fontFamily: "monospace" }}
                          labelStyle={{ fontWeight: "bold", color: "#818cf8" }}
                        />
                        <ChartLegend wrapperStyle={{ fontSize: "9px", fontWeight: "bold" }} />
                        <Bar dataKey="AWT" fill="#22d3ee" name="Avg Waiting Time (AWT)" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="ATT" fill="#c084fc" name="Avg Turnaround Time (ATT)" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="ART" fill="#34d399" name="Avg Response Time (ART)" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Metrics Table Grid */}
                <div className="glass rounded-2xl p-5 border border-white/5 shadow-glow/5 w-full">
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight mb-4">Metrics Comparison Table</h3>
                  <div className="overflow-x-auto scrollbar-dense">
                    <table className="w-full min-w-[400px] text-left border-collapse text-2xs sm:text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                          <th className="py-2.5 px-3">Algorithm</th>
                          <th className="py-2.5 px-3 text-center">Avg Waiting Time (AWT)</th>
                          <th className="py-2.5 px-3 text-center">Avg Turnaround Time (ATT)</th>
                          <th className="py-2.5 px-3 text-center">Avg Response Time (ART)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300 font-sans">
                        {comparisonData.map((row) => (
                          <tr key={row.name} className="hover:bg-white/5 transition-all">
                            <td className="py-2 px-3 font-mono font-bold text-white text-xs">{row.name}</td>
                            <td className="py-2 px-3 text-center font-mono text-cyan-400 font-bold">{row.AWT.toFixed(2)}s</td>
                            <td className="py-2 px-3 text-center font-mono text-purple-400 font-bold">{row.ATT.toFixed(2)}s</td>
                            <td className="py-2 px-3 text-center font-mono text-emerald-400 font-bold">{row.ART.toFixed(2)}s</td>
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