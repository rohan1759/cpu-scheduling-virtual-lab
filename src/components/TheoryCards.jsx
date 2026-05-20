import { motion } from "framer-motion";
import { Clock, Zap, AlertTriangle, Activity } from "lucide-react";

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
    title: "Convoy Effect",
    content:
      "A phenomenon in FCFS where a CPU-bound process blocks several shorter I/O-bound processes, slowing down the overall system performance.",
    icon: Activity,
    color: "text-rose-400 bg-rose-500/5 border-rose-500/10",
  },
  {
    title: "Starvation",
    content:
      "A scheduling issue where low-priority or longer burst-time processes are delayed indefinitely because shorter jobs are continually arriving and scheduled.",
    icon: AlertTriangle,
    color: "text-amber-400 bg-amber-500/5 border-amber-500/10",
  },
];

export default function TheoryCards() {
  return (
    <section id="theory-section" className="relative max-w-7xl mx-auto scroll-mt-20 fluid-container">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Core OS Theory & Concepts
        </h2>
        <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">
          Dive into the mathematical foundation and potential bottlenecks of modern scheduling strategies.
        </p>
      </div>

      <div className="theory-grid-layout">
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
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">
                  {card.title}
                </h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
                  {card.content}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}