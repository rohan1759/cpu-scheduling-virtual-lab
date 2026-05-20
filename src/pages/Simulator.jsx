import { useState } from "react";

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

export default function Simulator() {

  const [processes, setProcesses] = useState([
    {
      pid: "P1",
      arrivalTime: 0,
      burstTime: 5,
    },
    {
      pid: "P2",
      arrivalTime: 1,
      burstTime: 3,
    },
  ]);

  const [algorithm, setAlgorithm] = useState("FCFS");
  const [completed, setCompleted] = useState([]);
  const [logs, setLogs] = useState([]);
  const [current, setCurrent] = useState(null);
  const [activeInterval, setActiveInterval] = useState(null);

  const startSimulation = () => {
    // Clear any previous running simulation interval
    if (activeInterval) {
      clearInterval(activeInterval);
    }

    const result = algorithm === "FCFS"
      ? fcfsScheduling(processes)
      : sjfScheduling(processes);

    setCompleted(result);

    let executionLogs = [];

    result.forEach((p) => {
      executionLogs.push(
        `${p.pid} executed from ${p.startTime} to ${p.completionTime}`
      );
    });

    setLogs(executionLogs);

    let i = 0;

    const interval = setInterval(() => {

      if (i >= result.length) {
        clearInterval(interval);
        setCurrent(null);
        setActiveInterval(null);
        return;
      }

      setCurrent(result[i]);

      i++;
    }, 2000);

    setActiveInterval(interval);
  };

  const resetSimulation = () => {
    if (activeInterval) {
      clearInterval(activeInterval);
      setActiveInterval(null);
    }
    setCompleted([]);
    setLogs([]);
    setCurrent(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050814]">
      {/* Background Glowing Orbs */}
      <div className="bg-glow-orb orb-primary top-10 left-10 animate-float" />
      <div className="bg-glow-orb orb-secondary bottom-10 right-10" />

      <Navbar />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 fluid-container">
        {/* Header Title Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Scheduling Lab Simulator
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            Visual execution, metrics computation, and queue states.
          </p>
        </div>

        {/* Global Action Controls */}
        <Controls
          onStart={startSimulation}
          onReset={resetSimulation}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
        />

        {/* Dashboard Grid */}
        <div className="dashboard-grid-layout items-start">
          {/* Left Column: Process Configuration & Analytics */}
          <div className="col-span-full lg:col-span-7 space-y-8 min-w-0">
            <ProcessTable
              processes={processes}
              setProcesses={setProcesses}
            />

            <MetricsPanel completed={completed} />
          </div>

          {/* Right Column: Execution Core & Engine Log */}
          <div className="col-span-full lg:col-span-5 space-y-8 min-w-0">
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <CPUVisualizer current={current} />
              <QueueVisualizer queue={processes} />
            </div>

            <ExecutionLog logs={logs} />
          </div>
        </div>

        {/* Gantt Timeline Area (Full-Width at Bottom) */}
        <GanttChart completed={completed} />
      </div>
    </div>
  );
}