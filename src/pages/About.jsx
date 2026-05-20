import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { BookOpen, Shield, Cpu, Target } from "lucide-react";

export default function About() {
  const cards = [
    {
      title: "Interactive Education",
      desc: "Providing students and computer science enthusiasts with an intuitive interface to visualize processor queues in real-time.",
      icon: BookOpen,
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    },
    {
      title: "Algorithm Precision",
      desc: "Accurately computing start, completion, turnaround, and waiting times down to the clock cycle for each scheduling choice.",
      icon: Cpu,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    },
    {
      title: "Kernel Simulation",
      desc: "Mirroring true operating system scheduler tasks including handling process arrivals and managing CPU idle cycles.",
      icon: Target,
      color: "text-rose-400 border-rose-500/20 bg-rose-500/5",
    },
    {
      title: "Aesthetic Simplicity",
      desc: "Implementing minimal and material design concepts to make complex system topics accessible and engaging.",
      icon: Shield,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    },
  ];

  return (
    <div>
      <Navbar />

      <div className="relative min-h-[90vh] overflow-hidden max-w-7xl mx-auto fluid-container">
        {/* Glow Effects */}
        <div className="bg-glow-orb orb-primary -top-10 -right-20 animate-float" />
        <div className="bg-glow-orb orb-secondary -bottom-20 -left-20" />

        <div className="relative z-10 max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 inline-block"
          >
            Behind The Engine
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
          >
            About Virtual CPU Lab
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mt-4 text-base sm:text-lg leading-relaxed font-sans"
          >
            An interactive playground designed to simplify core Operating System scheduling algorithms. Our mission is to bridge the gap between abstract computer science lectures and visual runtime execution.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <div className="theory-grid-layout relative z-10">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="glass glass-interactive rounded-3xl p-6 sm:p-8 flex gap-5 border border-white/5"
              >
                <div className={`p-3 rounded-2xl border h-fit shrink-0 ${card.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
                    {card.title}
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 sm:p-8 border border-white/5 mt-12 relative z-10"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Comparison of Core Strategies
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm sm:text-base">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-4 px-4">Metric</th>
                  <th className="py-4 px-4">FCFS</th>
                  <th className="py-4 px-4">SJF (Non-Preemptive)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-sans">
                <tr>
                  <td className="py-4 px-4 font-bold text-white">Selection Criteria</td>
                  <td className="py-4 px-4">Arrival order (FCFS)</td>
                  <td className="py-4 px-4">Burst duration size</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-white">Preemption</td>
                  <td className="py-4 px-4">No (Non-preemptive)</td>
                  <td className="py-4 px-4">No (Non-preemptive)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-white">AWT Optimization</td>
                  <td className="py-4 px-4">Suboptimal</td>
                  <td className="py-4 px-4">Optimal (Best for non-preemptive)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-white">Weaknesses</td>
                  <td className="py-4 px-4">Convoy Effect</td>
                  <td className="py-4 px-4">Process Starvation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
