import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, BookOpen } from "lucide-react";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden fluid-container">
      {/* Background Glowing Orbs */}
      <div className="bg-glow-orb orb-primary top-10 left-10 animate-float" />
      <div className="bg-glow-orb orb-secondary bottom-10 right-10" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Decorative Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md"
        >
          Interactive OS Laboratory
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-extrabold tracking-tight fluid-title"
        >
          <span className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">Virtual Lab for</span><br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">CPU Scheduling</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-slate-400 max-w-2xl font-normal leading-relaxed fluid-subtitle"
        >
          Master process synchronization, scheduling queues, and timeline execution through our rich interactive FCFS and SJF simulators.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
        >
          <button
            onClick={() => navigate("/simulator")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold hover:scale-105 active:scale-95 transition-all shadow-glow text-white cursor-pointer group"
          >
            <Play size={18} className="fill-current group-hover:translate-x-0.5 transition-transform" />
            Start Simulation
          </button>
          
          <button
            onClick={() => {
              const el = document.getElementById("theory-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 font-bold border border-white/10 hover:scale-105 active:scale-95 transition-all text-slate-300 cursor-pointer"
          >
            <BookOpen size={18} />
            Explore Theory
          </button>
        </motion.div>
      </div>
    </section>
  );
}