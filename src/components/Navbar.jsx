import { NavLink, Link } from "react-router-dom";
import { Cpu } from "lucide-react";

export default function Navbar() {
  const links = [
    { name: "Home", path: "/" },
    { name: "Simulator", path: "/simulator" },
    { name: "About", path: "/about" },
    // { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="flex items-center justify-between py-5 glass sticky top-0 z-50 border-b border-white/5 backdrop-blur-md responsive-navbar">
      <Link to="/" className="flex items-center gap-2 group cursor-pointer">
        <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-glow group-hover:scale-110 transition-all duration-300">
          <Cpu size={20} className="animate-pulse" />
        </div>
        <h1 className="text-base sm:text-xl lg:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:to-cyan-400 transition-all duration-300 shrink-0">
          CPU <span className="text-indigo-400 font-medium font-sans">Virtual Lab</span>
        </h1>
      </Link>

      <div className="flex gap-4 sm:gap-6 lg:gap-8 items-center">
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
    </nav>
  );
}