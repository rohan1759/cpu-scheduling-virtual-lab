import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Cpu, Menu, X, Sun, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Simulator", path: "/simulator" },
    { name: "Theory", path: "/theory" },
    { name: "Viva Prep", path: "/viva" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/5 backdrop-blur-md">
      {/* Top Bar */}
      <div className="flex items-center justify-between responsive-navbar py-2 md:py-3">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-1 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-glow group-hover:scale-110 transition-all duration-300">
            <Cpu size={20} className="animate-pulse" />
          </div>
          <h1 className="text-sm sm:text-lg lg:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:to-cyan-400 transition-all duration-300 shrink-0">
            CPU <span className="text-indigo-400 font-medium font-sans">Virtual Lab</span>
          </h1>
        </Link>

        {/* Desktop Navigation and Controls */}
        <div className="hidden md:flex gap-3 sm:gap-4 lg:gap-6 items-center">
          <div className="flex gap-4 sm:gap-6 lg:gap-8 items-center">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-[9px] sm:text-[10px] lg:text-sm font-light uppercase tracking-wider transition-all duration-300 relative py-1 hover:text-white cursor-pointer ${
                    isActive ? "text-indigo-400" : "text-slate-400"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full shadow-glow" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* <div className="flex items-center gap-2 text-slate-400 border-l border-white/10 pl-4 sm:pl-6 lg:pl-8">
            <button className="p-2 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/60 hover:text-white transition-all duration-300 cursor-pointer">
              <Sun size={16} />
            </button>
            <button className="p-2 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/60 hover:text-white transition-all duration-300 cursor-pointer">
              <Settings size={16} />
            </button>
          </div> */}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-[#0a0f23]/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-2 responsive-navbar py-2">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-xs font-bold uppercase tracking-wider transition-all duration-300 py-2 px-3 rounded-2xl hover:bg-white/5 hover:text-white cursor-pointer flex items-center justify-between ${
                      isActive ? "text-indigo-400 bg-white/5 border border-white/5" : "text-slate-400 border border-transparent"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full shadow-glow" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}