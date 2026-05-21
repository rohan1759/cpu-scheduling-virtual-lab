import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock, Zap, AlertTriangle, Activity, Settings, ShieldAlert, BookOpen, GraduationCap } from "lucide-react";

const cards = [
  {
    title: "First-Come, First-Served (FCFS)",
    content:
      "Processes are executed in the order of their arrival. It is simple and non-preemptive, but can lead to long waiting times if early jobs are very long (Convoy Effect).",
    icon: Clock,
    color: "text-cyan-400 bg-cyan-500/5 border-cyan-500/10",
  },
  {
    title: "Shortest Job First (SJF)",
    content:
      "Executes the process with the shortest burst time first. It is optimal for minimizing average waiting time, but can cause longer jobs to wait indefinitely (Starvation).",
    icon: Zap,
    color: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10",
  },
  {
    title: "Round Robin (RR)",
    content:
      "Allocates a fixed time quantum to each process cyclically. Designed for time-sharing systems, it achieves great response times but introduces context switching overhead.",
    icon: Settings,
    color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
  },
  {
    title: "Adaptive Feedback Queues",
    content:
      "MLFQ allows processes to move between queues. Short/IO-bound tasks stay high while CPU-heavy tasks are demoted, optimizing system performance dynamically.",
    icon: Activity,
    color: "text-purple-400 bg-purple-500/5 border-purple-500/10",
  },
];

export default function TheoryCards() {
  const navigate = useNavigate();

  return (
    <section id="theory-section" className="relative max-w-7xl mx-auto scroll-mt-20 fluid-container space-y-12 pb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Core OS Theory & Concepts
        </h2>
        <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">
          Dive into the mathematical foundation and potential bottlenecks of modern scheduling strategies.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass glass-interactive rounded-3xl p-6 sm:p-8 flex gap-5 border border-white/5"
            >
              <div className={`p-3 rounded-2xl border h-fit shrink-0 ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {card.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                  {card.content}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Call to Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8">
        <button
          onClick={() => navigate("/theory")}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <BookOpen size={16} />
          View Complete Guide
        </button>
        
        <button
          onClick={() => navigate("/viva")}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <GraduationCap size={16} />
          Launch Viva Quiz Deck
        </button>
      </div>
    </section>
  );
}