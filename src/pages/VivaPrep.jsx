import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { HelpCircle, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

const vivaQuestions = [
  {
    q: "What is CPU Scheduling, and why is it needed?",
    a: "CPU scheduling is the process of deciding which process in the ready queue gets allocated the CPU core for execution. It is needed in multi-programmed operating systems to maximize CPU utilization, keep the system responsive, and achieve high throughput."
  },
  {
    q: "Explain the difference between Preemptive and Non-Preemptive scheduling.",
    a: "In non-preemptive scheduling, once a process gets the CPU, it keeps it until it terminates or blocks for I/O. In preemptive scheduling, the kernel can interrupt a currently running process and allocate the CPU to another process (e.g., if a higher priority process arrives or its time quantum expires)."
  },
  {
    q: "What is the Convoy Effect, and in which algorithm does it occur?",
    a: "The Convoy Effect occurs in First-Come, First-Served (FCFS) scheduling. It describes a situation where several short processes wait in the queue for a single long, CPU-bound process to finish executing. This results in poor device utilization and high average waiting times."
  },
  {
    q: "What is Starvation, and how does Aging resolve it?",
    a: "Starvation (or indefinite blocking) is a situation where low-priority or long burst-time processes wait indefinitely because shorter or higher-priority processes keep arriving. Aging resolves this by gradually increasing the priority of processes that wait in the system for a long time."
  },
  {
    q: "What is a Dispatcher, and what is Dispatch Latency?",
    a: "The dispatcher is the kernel module that actually gives control of the CPU to the process selected by the short-term scheduler. Dispatch latency is the time it takes for the dispatcher to stop one process, context switch, and start another process running. This latency should be minimized."
  },
  {
    q: "What is the difference between Turnaround Time and Waiting Time?",
    a: "Turnaround Time is the total time interval from the submission of a process to its completion (Completion Time - Arrival Time). Waiting Time is the total time a process spends waiting in the ready queue (Turnaround Time - Burst Time). Waiting time represents the delays introduced by the scheduler."
  },
  {
    q: "Why is Shortest Job First (SJF) scheduling optimal?",
    a: "SJF is optimal because it mathematically minimizes the Average Waiting Time for a given set of processes. By scheduling the shortest job first, it quickly clears quick tasks from the queue, preventing them from accumulating waiting time while longer jobs run."
  },
  {
    q: "How does a Multilevel Feedback Queue (MLFQ) differ from a Multilevel Queue (MLQ)?",
    a: "In a Multilevel Queue (MLQ) scheduler, processes are permanently assigned to a queue upon entry and cannot change queues. In a Multilevel Feedback Queue (MLFQ) scheduler, processes can move between queues dynamically based on their CPU usage. CPU-bound processes are demoted to lower-priority queues, and starving processes are promoted."
  },
  {
    q: "What is a Context Switch, and what is its overhead?",
    a: "A context switch is the process of saving the state (context) of a running process so it can be resumed later, and loading the saved state of a new process. Its overhead is purely administrative (CPU time spent by kernel without doing productive user work), which is why frequent preemptions can degrade system performance."
  },
  {
    q: "What is the relationship between Response Time and Round Robin Scheduling?",
    a: "Response time is the time from process submission to its first CPU execution. Round Robin scheduling is designed specifically to provide low response times, making it ideal for interactive systems where users expect immediate feedback even if the process takes longer to complete overall."
  }
];

export default function VivaPrep() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [masteredList, setMasteredList] = useState(new Array(vivaQuestions.length).fill(null));

  const handleNext = () => {
    if (index < vivaQuestions.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setFlipped(false);
    }
  };

  const handleMastered = (status) => {
    const updated = [...masteredList];
    updated[index] = status;
    setMasteredList(updated);
    // Auto advance after short delay
    setTimeout(() => {
      handleNext();
    }, 400);
  };

  const resetProgress = () => {
    setMasteredList(new Array(vivaQuestions.length).fill(null));
    setIndex(0);
    setFlipped(false);
  };

  const masteredCount = masteredList.filter((m) => m === "yes").length;
  const reviewCount = masteredList.filter((m) => m === "no").length;

  return (
    <div className="min-h-screen relative overflow-auto responsive-page bg-[#050814] pb-20">
      {/* Background Glowing Orbs */}
      <div className="bg-glow-orb orb-primary top-10 left-10 animate-float" />
      <div className="bg-glow-orb orb-secondary bottom-10 right-10" />

      <Navbar />

      <div className="max-w-4xl mx-auto relative z-10 space-y-12 fluid-container">
        {/* Title Block */}
        <div className="text-center space-y-4">
          <div className="px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 text-xs font-bold uppercase tracking-wider inline-block">
            Viva & Exam Prep
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            CPU Scheduling Flashcards
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Test your conceptual knowledge of operating systems. Click a card to flip it and reveal the answer.
          </p>
        </div>

        {/* Progress Tracker Widget */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto bg-slate-950/40 p-4 rounded-2xl border border-white/5 text-center">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</div>
            <div className="text-xl font-extrabold text-white mt-1">
              {masteredList.filter((m) => m !== null).length} / {vivaQuestions.length}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Mastered</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">{masteredCount}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-rose-500 uppercase tracking-wider">Review Needed</div>
            <div className="text-xl font-extrabold text-rose-400 mt-1">{reviewCount}</div>
          </div>
        </div>

        {/* Interactive Flashcard Container */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div 
            onClick={() => setFlipped(!flipped)}
            className="w-full max-w-xl h-80 cursor-pointer perspective-1000"
          >
            <motion.div 
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative w-full h-full transform-style-3d shadow-2xl rounded-3xl"
            >
              {/* CARD FRONT */}
              <div 
                className={`absolute inset-0 w-full h-full p-8 rounded-3xl border border-white/10 flex flex-col justify-between items-center text-center backface-hidden bg-gradient-to-tr from-slate-900 to-indigo-950/40 ${
                  flipped ? "pointer-events-none" : ""
                }`}
              >
                <div className="flex justify-between items-center w-full text-slate-500 text-xs font-mono font-bold uppercase">
                  <span>Question {index + 1}</span>
                  <HelpCircle size={16} className="text-indigo-400 animate-pulse" />
                </div>
                
                <div className="text-lg sm:text-xl font-bold text-white px-4 leading-relaxed font-sans">
                  {vivaQuestions[index].q}
                </div>

                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold flex items-center gap-1">
                  <RefreshCw size={10} /> Click to Flip Card
                </span>
              </div>

              {/* CARD BACK */}
              <div 
                className={`absolute inset-0 w-full h-full p-8 rounded-3xl border border-indigo-500/20 flex flex-col justify-between items-center text-center backface-hidden bg-slate-950 shadow-[inset_0_0_24px_rgba(99,102,241,0.15)] rotate-y-180`}
              >
                <div className="flex justify-between items-center w-full text-indigo-400 text-xs font-mono font-bold uppercase">
                  <span>Explanation</span>
                  <span className="bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 text-[9px]">
                    Answer
                  </span>
                </div>
                
                <div className="text-sm sm:text-base text-slate-300 px-4 leading-relaxed font-sans overflow-y-auto max-h-48 text-left w-full py-2">
                  {vivaQuestions[index].a}
                </div>

                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold flex items-center gap-1">
                  <RefreshCw size={10} /> Click to Flip Card
                </span>
              </div>
            </motion.div>
          </div>

          {/* User Evaluation Controls */}
          {flipped && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 items-center justify-center w-full max-w-xl bg-slate-900/40 p-4 rounded-2xl border border-white/5"
            >
              <span className="text-xs text-slate-400 font-bold">Assess your answer:</span>
              <button
                onClick={() => handleMastered("no")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 text-xs font-bold transition-all cursor-pointer"
              >
                <AlertCircle size={14} />
                Need Review
              </button>
              <button
                onClick={() => handleMastered("yes")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
              >
                <CheckCircle size={14} />
                Mastered!
              </button>
            </motion.div>
          )}

          {/* Navigation Deck */}
          <div className="flex justify-between items-center w-full max-w-xl pt-4">
            <button
              onClick={handlePrev}
              disabled={index === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer font-bold text-sm"
            >
              <ChevronLeft size={16} />
              Prev
            </button>

            <button
              onClick={resetProgress}
              className="text-xs font-bold text-slate-500 hover:text-white transition-all underline cursor-pointer"
            >
              Reset Progress
            </button>

            <button
              onClick={handleNext}
              disabled={index === vivaQuestions.length - 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer font-bold text-sm"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
