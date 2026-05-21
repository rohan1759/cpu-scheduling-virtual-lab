import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Cpu, Menu, X } from "lucide-react";
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
      <div className="flex items-center justify-between responsive-navbar py-4 md:py-5">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-glow group-hover:scale-110 transition-all duration-300">
            <Cpu size={20} className="animate-pulse" />
          </div>
          <h1 className="text-base sm:text-xl lg:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:to-cyan-400 transition-all duration-300 shrink-0">
            CPU <span className="text-indigo-400 font-medium font-sans">Virtual Lab</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 sm:gap-6 lg:gap-8 items-center">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-[10px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider transition-all duration-300 relative py-1 hover:text-white cursor-pointer ${
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
            <div className="flex flex-col gap-2 responsive-navbar py-4">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-xs font-bold uppercase tracking-wider transition-all duration-300 py-3 px-4 rounded-2xl hover:bg-white/5 hover:text-white cursor-pointer flex items-center justify-between ${
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