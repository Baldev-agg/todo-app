import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  BarChart3,
  ListTodo,
  Building2,
  X,
  Sun,
  Moon,
} from "lucide-react";

function Sidebar({ isOpen, onClose, isDesktop }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    applyTheme(newTheme);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/landing");
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isDesktop && isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
  flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 h-screen z-50
  transition-all duration-300 ease-in-out
  ${
    isDesktop
      ? `sticky top-0 overflow-hidden flex-shrink-0 ${isOpen ? "w-64 p-6" : "w-0 p-0 border-0"}`
      : `fixed inset-y-0 left-0 w-72 p-6 ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`
  }
`}
      >
        {/* min-w stops content collapsing during the width animation on desktop */}
        <div className="min-w-[208px] flex flex-col flex-1">
          {/* Logo row */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex-shrink-0 bg-[#F77B3A] rounded-xl flex items-center justify-center text-white font-black">
                T
              </div>
              <span className="font-black text-lg tracking-tight dark:text-white">
                TaskMaster
              </span>
            </div>
            {/* X button — mobile only */}
            {!isDesktop && (
              <button
                className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400 transition"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            )}
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            <Link
              to="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                location.pathname === "/" || location.pathname === "/"
                  ? "bg-[#FFF0E8] dark:bg-orange-950 text-[#F77B3A] dark:text-orange-300"
                  : "text-slate-400 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 text-slate-400 dark:text-slate-500 rounded-xl font-bold text-sm cursor-not-allowed">
              <BarChart3 size={18} /> Analytics
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-slate-400 dark:text-slate-500 rounded-xl font-bold text-sm cursor-not-allowed">
              <ListTodo size={18} /> Projects
            </div>
            <Link
              to="/teamspaces"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                location.pathname === "/teamspaces"
                  ? "bg-[#FFF0E8] dark:bg-orange-950 text-[#F77B3A] dark:text-orange-300"
                  : "text-slate-400 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Building2 size={18} /> Teamspaces
            </Link>
          </nav>

          {/* Theme Toggle + Logout */}
          <div className="mt-auto space-y-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold text-sm transition w-full"
            >
              {isDarkMode ? (
                <>
                  <Sun size={18} /> Light Mode
                </>
              ) : (
                <>
                  <Moon size={18} /> Dark Mode
                </>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl font-bold text-sm transition w-full"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
