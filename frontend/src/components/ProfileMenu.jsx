import { useState, useEffect, useRef } from "react";
import { LogOut, User, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the token or from an API endpoint
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserData({
          name: decoded.name || "User",
          email: decoded.email || "",
        });
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 flex-shrink-0 bg-indigo-50 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-500 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-800 uppercase text-sm hover:shadow-lg transition-all hover:scale-105"
        title="Open profile menu"
      >
        {userData.name[0]}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* User Info Section */}
          <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-900/30 to-indigo-100 dark:to-indigo-800/30 p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-500 dark:bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {userData.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-800 dark:text-white truncate">
                  {userData.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {userData.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          {/* User Details Section */}
          <div className="p-4 space-y-3">
            {/* Name */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <User size={18} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Name
                </p>
                <p className="font-medium text-slate-800 dark:text-white truncate">
                  {userData.name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Mail size={18} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Email
                </p>
                <p className="font-medium text-slate-800 dark:text-white truncate">
                  {userData.email || "No email provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="border-t border-slate-100 dark:border-slate-800 p-3">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut size={18} />
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
