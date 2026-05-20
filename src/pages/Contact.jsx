import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, MessageSquare, Mail, MapPin } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSubmitted(false);
  };

  return (
    <div>
      <Navbar />

      <div className="relative min-h-[90vh] overflow-hidden max-w-7xl mx-auto flex flex-col justify-center fluid-container">
        {/* Glow Effects */}
        <div className="bg-glow-orb orb-primary top-1/4 -left-20 animate-float" />
        <div className="bg-glow-orb orb-tertiary bottom-1/4 -right-20" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto w-full">
          {/* Contact Details Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 glass rounded-3xl border border-white/5 bg-slate-950/20">
            <div>
              <span className="px-4 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                Get In Touch
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                Let's Connect
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
                Have questions about processor kernel pipelines or feature requests for our virtual simulators? Reach out to our design and developer team.
              </p>
            </div>

            <div className="mt-8 space-y-6 font-sans">
              <div className="flex gap-4 items-center">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email Address</div>
                  <a href="mailto:support@virtualcpulab.org" className="text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-all">
                    support@virtualcpulab.org
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Discord Channel</div>
                  <span className="text-sm font-semibold text-slate-300">
                    discord.gg/virtual-cpu-lab
                  </span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Lab Location</div>
                  <span className="text-sm font-semibold text-slate-300">
                    Silicon Valley, California
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="lg:col-span-7 glass rounded-3xl p-8 sm:p-10 border border-white/5 relative overflow-hidden flex flex-col justify-center min-h-[480px]">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  noValidate
                >
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
                    Send Kernel Report
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Fill out the fields below.
                  </p>

                  {/* Name field */}
                  <div className="material-input-group">
                    <input
                      type="text"
                      placeholder=" "
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="material-input font-sans"
                      required
                    />
                    <label className="material-label font-bold uppercase tracking-wider text-[10px] font-sans">Full Name</label>
                  </div>

                  {/* Email field */}
                  <div className="material-input-group">
                    <input
                      type="email"
                      placeholder=" "
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="material-input font-sans"
                      required
                    />
                    <label className="material-label font-bold uppercase tracking-wider text-[10px] font-sans">Email Address</label>
                  </div>

                  {/* Subject field */}
                  <div className="material-input-group">
                    <input
                      type="text"
                      placeholder=" "
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="material-input font-sans"
                    />
                    <label className="material-label font-bold uppercase tracking-wider text-[10px] font-sans">Subject</label>
                  </div>

                  {/* Message field */}
                  <div className="material-input-group">
                    <textarea
                      placeholder=" "
                      rows="4"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="material-input font-sans resize-none min-h-[100px]"
                      required
                    />
                    <label className="material-label font-bold uppercase tracking-wider text-[10px] font-sans">Your Message</label>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:to-cyan-400 font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-white shadow-glow cursor-pointer mt-6"
                  >
                    <Send size={16} />
                    Submit Ticket
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8 flex flex-col items-center justify-center h-full"
                >
                  <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-glow mb-6 animate-bounce">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                    Ticket Logged!
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-sm mx-auto font-sans leading-relaxed">
                    Thank you, <span className="text-indigo-400 font-bold">{formData.name}</span>. Your system feedback report was successfully recorded in our kernel log.
                  </p>
                  
                  <button
                    onClick={handleReset}
                    className="mt-8 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 font-bold text-xs sm:text-sm text-slate-300 rounded-xl border border-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    Log New Ticket
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
