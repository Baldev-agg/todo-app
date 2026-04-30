import { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, ChevronsLeft } from "lucide-react";

const LG = 1024;

function Layout({ children }) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= LG : true
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= LG : true
  );

  const handleResize = useCallback(() => {
    const desktop = window.innerWidth >= LG;
    if (desktop !== isDesktop) {
      setIsDesktop(desktop);
      setIsSidebarOpen(desktop);
    }
  }, [isDesktop]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-slate-950 flex font-sans antialiased text-slate-800 dark:text-slate-100 relative">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDesktop={isDesktop}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-hidden min-w-0">
        {/* Toggle Button in Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#F77B3A] transition flex-shrink-0"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen && isDesktop ? (
              <ChevronsLeft size={20} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}

export default Layout;
