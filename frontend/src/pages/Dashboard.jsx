import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import {
  LogOut,
  Plus,
  Trash2,
  CircleCheck,
  Clock,
  Edit2,
  Calendar,
  LayoutDashboard,
  BarChart3,
  ListTodo,
  Search,
  Rocket,
  MoreVertical,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  Building2,
  Users,
  Globe,
  Settings,
} from "lucide-react";

const LG = 1024;

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
  const [addingTodo, setAddingTodo] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState("Medium");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= LG : true,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= LG : true,
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

  useEffect(() => {
    loadTodos();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserName(decoded.name || "User");
      } catch (e) {}
    }
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const res = await API.get("/todos");
      setTodos(res.data);
      setError("");
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!text.trim()) return;
    setAddingTodo(true);
    try {
      const res = await API.post("/todos", {
        text: text.trim(),
        priority,
        dueDate: dueDate || null,
      });
      setTodos([...todos, res.data]);
      setText("");
      setPriority("Medium");
      setDueDate("");
      setError("");
    } catch {
      setError("Failed to add task");
    } finally {
      setAddingTodo(false);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await API.put(`/todos/${id}`, { completed: !completed });
      setTodos(
        todos.map((t) => (t._id === id ? { ...t, completed: !completed } : t)),
      );
    } catch {
      setError("Failed to update task");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete task");
    }
  };

  const startEdit = (id, currentText, currentPriority, currentDueDate) => {
    setEditingId(id);
    setEditingText(currentText);
    setEditingPriority(currentPriority || "Medium");
    setEditingDueDate(currentDueDate ? currentDueDate.split("T")[0] : "");
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) {
      setError("Task text cannot be empty");
      return;
    }
    try {
      const res = await API.put(`/todos/${id}`, {
        text: editingText.trim(),
        priority: editingPriority,
        dueDate: editingDueDate || null,
      });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditingText("");
      setEditingPriority("Medium");
      setEditingDueDate("");
      setError("");
    } catch {
      setError("Failed to update task");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingPriority("Medium");
    setEditingDueDate("");
  };

  const isOverdue = (todo) => {
    if (todo.completed) return false;
    const now = new Date();
    if (todo.dueDate) return new Date(todo.dueDate) < now;
    return (now - new Date(todo.createdAt)) / (1000 * 60 * 60) > 24;
  };

  const getPriorityStyles = (p) => {
    switch (p) {
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-amber-400 text-black";
      case "Low":
        return "bg-emerald-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const formatDueDate = (d) => {
    if (!d) return null;
    const date = new Date(d);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/landing";
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !addingTodo) addTodo();
  };
  const handleEditKeyPress = (e, id) => {
    if (e.key === "Enter") saveEdit(id);
    else if (e.key === "Escape") cancelEdit();
  };

  const priorityWeight = { High: 1, Medium: 2, Low: 3 };
  const sortedTodos = [...todos].sort((a, b) => {
    const aO = isOverdue(a),
      bO = isOverdue(b);
    if (aO && !bO) return -1;
    if (!aO && bO) return 1;
    if (priorityWeight[a.priority] !== priorityWeight[b.priority])
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const searchedTasks = sortedTodos.filter(task => 
  task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
  (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans antialiased text-slate-800 relative">
      {/* Mobile overlay */}
      {!isDesktop && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
  flex flex-col bg-white border-r border-slate-100 h-screen z-50
  transition-all duration-300 ease-in-out
  ${
    isDesktop
      ? `sticky top-0 overflow-hidden flex-shrink-0 ${isSidebarOpen ? "w-64 p-6" : "w-0 p-0 border-0"}`
      : `fixed inset-y-0 left-0 w-72 p-6 ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`
  }
`}
      >
        {/* min-w stops content collapsing during the width animation on desktop */}
        <div className="min-w-[208px] flex flex-col flex-1">
          {/* Logo row — mobile X only, NO desktop close button here */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex-shrink-0 bg-[#F77B3A] rounded-xl flex items-center justify-center text-white font-black">
                T
              </div>
              <span className="font-black text-lg tracking-tight">
                TaskMaster
              </span>
            </div>
            {/* X button — mobile only */}
            {!isDesktop && (
              <button
                className="p-1 text-slate-400 hover:text-slate-600 transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            )}
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#FFF0E8] text-[#F77B3A] rounded-xl font-bold text-sm">
              <LayoutDashboard size={18} /> Dashboard
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed">
              <BarChart3 size={18} /> Analytics
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed">
              <ListTodo size={18} /> Projects
            </div>
            <Link
              to="/teamspaces"
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 rounded-xl font-bold text-sm transition"
            >
              <Building2 size={18} /> Teamspaces
            </Link>
          </nav>

          {/* Logout — mt-auto pushes it to the very bottom */}
          <button
            onClick={logout}
            className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition w-full"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-hidden min-w-0">
        {/* Header */}
        <header className="flex justify-between items-center gap-3 mb-8 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600 hover:text-[#F77B3A] transition flex-shrink-0"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {
                isSidebarOpen && isDesktop ? (
                  <ChevronsLeft size={20} /> // desktop open → show collapse arrow
                ) : (
                  <Menu size={22} />
                ) // desktop closed or mobile → show hamburger
              }
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                Dashboard
              </h1>
              <p className="text-slate-400 text-xs font-medium hidden sm:block">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-1 justify-end max-w-xs">
            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/5 transition shadow-sm text-sm"
              />
            </div>
            <div className="w-9 h-9 flex-shrink-0 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 font-bold border border-indigo-100 uppercase text-sm">
              {userName[0]}
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome banner */}
            <div className="bg-gradient-to-br from-[#FFECD8] to-[#FFD9B8] p-6 sm:p-8 rounded-[2rem] relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-black mb-1">
                  Hi, {userName} 👋
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed font-medium max-w-[200px] sm:max-w-xs">
                  You have{" "}
                  <span className="font-bold text-slate-900">
                    {todos.filter((t) => !t.completed).length} tasks
                  </span>{" "}
                  pending today.
                </p>
              </div>
              <Rocket
                size={80}
                className="absolute -right-4 -bottom-4 text-[#F77B3A] opacity-10 group-hover:translate-x-2 transition-transform duration-700"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Total",
                  value: todos.length,
                  color: "text-slate-800",
                },
                {
                  label: "Done",
                  value: todos.filter((t) => t.completed).length,
                  color: "text-emerald-600",
                },
                {
                  label: "Pending",
                  value: todos.filter((t) => !t.completed).length,
                  color: "text-amber-500",
                },
                {
                  label: "Due",
                  value: todos.filter((t) => isOverdue(t)).length,
                  color: "text-red-500",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center"
                >
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {label}
                  </p>
                  <p className={`text-2xl font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Add task */}
            <div className="bg-white p-4 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What needs to be done?"
                  className="flex-1 min-w-0 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium text-sm"
                />
                <button
                  onClick={addTodo}
                  disabled={addingTodo || !text.trim()}
                  className="flex-shrink-0 bg-[#F77B3A] hover:bg-[#e67a3f] text-white font-black px-4 sm:px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline uppercase text-xs tracking-tighter">
                    Add
                  </span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm cursor-pointer"
                >
                  <option value="Low">🟢 Low Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="High">🔴 High Priority</option>
                </select>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm"
                />
              </div>
            </div>

            {/* ── TASK LIST ── KEY FIX AREA ── */}
            <div className="space-y-5">
              {loading ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <Clock
                    className="animate-spin text-slate-200 mx-auto mb-4"
                    size={40}
                  />
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    Syncing tasks...
                  </p>
                </div>
              ) : (
                searchedTasks.map((todo) => (
                  <div
                    key={todo._id}
                    className={`
                      relative pt-6 pb-4 px-4 sm:px-5 bg-white rounded-[1.5rem] border
                      transition-all duration-300 overflow-hidden
                      ${
                        todo.completed
                          ? "border-slate-100 opacity-60"
                          : isOverdue(todo)
                            ? "border-red-200 shadow-lg shadow-red-50"
                            : "border-slate-100 hover:border-orange-200 hover:shadow-lg"
                      }
                    `}
                  >
                    {/* ── Priority + DUE badges — stacked on same row, won't overflow ── */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span
                        className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${getPriorityStyles(todo.priority)}`}
                      >
                        {todo.priority}
                      </span>
                      {isOverdue(todo) && !todo.completed && (
                        <span className="px-3 py-0.5 bg-red-500 text-white rounded-full text-[9px] font-black uppercase tracking-tighter animate-pulse">
                          ⚠️ DUE
                        </span>
                      )}
                    </div>

                    {/* ── Card body ── */}
                    {editingId === todo._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyPress={(e) => handleEditKeyPress(e, todo._id)}
                          className="w-full bg-slate-50 px-3 py-2 rounded-xl outline-none text-sm font-medium border border-slate-100"
                          autoFocus
                        />
                        <div className="flex gap-2 flex-wrap">
                          <select
                            value={editingPriority}
                            onChange={(e) => setEditingPriority(e.target.value)}
                            className="flex-1 min-w-[100px] bg-slate-50 px-2 py-2 rounded-xl text-xs font-bold outline-none border border-slate-100"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                          <input
                            type="datetime-local"
                            value={editingDueDate}
                            onChange={(e) => setEditingDueDate(e.target.value)}
                            className="flex-1 min-w-[140px] bg-slate-50 px-2 py-2 rounded-xl text-xs font-bold outline-none border border-slate-100"
                          />
                        </div>
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => saveEdit(todo._id)}
                            className="text-emerald-500 font-bold text-xs uppercase"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-slate-400 font-bold text-xs uppercase"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleTodo(todo._id, todo.completed)}
                          className="flex-shrink-0 mt-0.5 transition-all hover:scale-110 active:scale-90"
                        >
                          {todo.completed ? (
                            <CircleCheck
                              className="text-emerald-500"
                              size={24}
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-4 border-slate-200 hover:border-orange-300 transition-colors" />
                          )}
                        </button>

                        {/* Text — FIXED: break-words prevents overflow */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`
                            text-sm sm:text-base font-bold leading-snug
                            break-words whitespace-normal overflow-wrap-anywhere
                            ${todo.completed ? "line-through text-slate-300" : "text-slate-800"}
                          `}
                          >
                            {todo.text}
                          </p>
                          {todo.dueDate && (
                            <div
                              className={`flex items-center gap-1 mt-1.5 text-[10px] font-black uppercase tracking-tighter ${isOverdue(todo) && !todo.completed ? "text-red-500" : "text-slate-400"}`}
                            >
                              <Calendar size={11} />{" "}
                              {formatDueDate(todo.dueDate)}
                            </div>
                          )}
                        </div>

                        {/* Action buttons — always visible on mobile, hover on desktop */}
                        <div className="flex-shrink-0 flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              !todo.completed &&
                              startEdit(
                                todo._id,
                                todo.text,
                                todo.priority,
                                todo.dueDate,
                              )
                            }
                            disabled={todo.completed}
                            className={`p-1.5 rounded-xl transition ${todo.completed ? "text-slate-200" : "text-slate-400 hover:text-[#F77B3A] hover:bg-orange-50"}`}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() =>
                              !todo.completed && deleteTodo(todo._id)
                            }
                            disabled={todo.completed}
                            className={`p-1.5 rounded-xl transition ${todo.completed ? "text-slate-200" : "text-slate-400 hover:text-red-500 hover:bg-red-50"}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-200 to-[#F77B3A] rounded-[2rem] mx-auto mb-4 flex items-center justify-center text-white text-2xl font-black shadow-lg uppercase">
                {userName[0]}
              </div>
              <h4 className="font-black text-base sm:text-lg tracking-tight uppercase truncate">
                {userName}
              </h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                Master Planner
              </p>
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-xl font-black">{todos.length}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Tasks
                  </p>
                </div>
                <div className="border-l border-slate-100">
                  <p className="text-xl font-black">
                    {todos.filter((t) => t.completed).length}
                  </p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Achieved
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex justify-between items-center">
                Ongoing <MoreVertical size={14} />
              </h4>
              <div className="space-y-5">
                {sortedTodos
                  .slice(0, 3)
                  .filter((t) => !t.completed)
                  .map((t, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${t.priority === "High" ? "bg-red-400" : "bg-amber-400"}`}
                      />
                      <div className="min-w-0">
                        {/* FIXED: break-words here too */}
                        <p className="text-xs font-black text-slate-800 break-words">
                          {t.text}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">
                          {t.priority}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
