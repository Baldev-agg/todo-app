import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom"; // Popup fix ke liye zaroori hai
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  ArrowLeft, Plus, CheckCircle2, Circle, Calendar, AlertCircle, Clock,
  FileText, X, Search, ArrowUp, ArrowDown, ChevronDown
} from "lucide-react";

// ─────────────────────────────────────────────
// TASK MODAL (Unchanged)
// ─────────────────────────────────────────────
function TaskModal({ onClose, onSave, workspaceId, taskToEdit }) {
  const [form, setForm] = useState({
    text: taskToEdit?.text ?? "",
    description: taskToEdit?.description ?? "",
    status: taskToEdit ? (taskToEdit.status || (taskToEdit.completed ? "Done" : "Not started")) : "Not started",
    priority: taskToEdit?.priority ?? "Medium",
    assigneeEmail: taskToEdit?.assigneeId?.email ?? "",
    dueDate: taskToEdit?.dueDate ? taskToEdit.dueDate.split("T")[0] : "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const isEditing = !!taskToEdit;

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) { setErr("Task name is required."); return; }
    setSaving(true);
    try {
      const res = isEditing
        ? await API.put(`/todos/${taskToEdit._id}`, form)
        : await API.post("/todos", { ...form, workspaceId });
      onSave(res.data, isEditing);
      onClose();
    } catch {
      setErr("Failed to save task. Check email or try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 bg-[#F77B3A] rounded-lg flex items-center justify-center">
              {isEditing ? <FileText size={14} className="text-white" /> : <Plus size={14} className="text-white" />}
            </span>
            {isEditing ? "Edit Task" : "New Task"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {err && <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{err}</p>}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Task name *</label>
            <input name="text" value={form.text} onChange={handleChange} className="w-full border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#F77B3A]/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm dark:text-white outline-none">
                <option>Not started</option><option>In progress</option><option>Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="w-full border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm dark:text-white outline-none">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Assignee Email</label>
              <input name="assigneeEmail" type="email" value={form.assigneeEmail} onChange={handleChange} className="w-full border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm dark:text-white outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Due date</label>
              <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="w-full border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm dark:text-white outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm dark:text-white outline-none resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-black text-white bg-[#F77B3A] hover:bg-[#e8692a] rounded-xl disabled:opacity-50 transition-all">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NOTION-STYLE COLUMN HEADER (FIXED UI & ADDED ASSIGNEE SEARCH)
// ─────────────────────────────────────────────
function ColumnHeader({ label, colKey, sortConfig, onSort, filterValue, onFilter, filterOptions, assigneeNames, onAssigneeFilter }) {
  const [open, setOpen] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const btnRef = useRef(null);
  const popupRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const isSorted = sortConfig.key === colKey;
  const hasFilter = filterValue && filterValue !== "All";

  const toggleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
    }
    setOpen(!open);
  };

  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target) && !btnRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filteredNames = useMemo(() => 
    assigneeNames?.filter(n => n.toLowerCase().includes(assigneeSearch.toLowerCase())) || [],
    [assigneeNames, assigneeSearch]
  );

  const menuContent = (
    <div 
      ref={popupRef}
      style={{ top: coords.top, left: coords.left }}
      className="fixed z-[999] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-56 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>

      {/* Sort Section */}
      <div className="p-1">
        <button onClick={() => { onSort(colKey, "asc"); setOpen(false); }} className="w-full flex items-center gap-2 px-2.5 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <ArrowUp size={14} className="text-slate-400" /> Sort Ascending
        </button>
        <button onClick={() => { onSort(colKey, "desc"); setOpen(false); }} className="w-full flex items-center gap-2 px-2.5 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <ArrowDown size={14} className="text-slate-400" /> Sort Descending
        </button>
      </div>

      {/* Filter Section for Status/Priority */}
      {filterOptions && (
        <div className="p-1 border-t border-slate-100 dark:border-slate-700">
          <p className="px-2.5 py-1.5 text-[10px] font-black text-slate-400 uppercase">Filter</p>
          {["All", ...filterOptions].map(opt => (
            <button key={opt} onClick={() => { onFilter(colKey, opt); setOpen(false); }} className={`w-full flex items-center justify-between px-2.5 py-1.5 text-sm rounded-lg ${filterValue === opt ? 'bg-orange-50 dark:bg-orange-900/20 text-[#F77B3A] font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
              {opt} {filterValue === opt && <CheckCircle2 size={12} />}
            </button>
          ))}
        </div>
      )}

      {/* Assignee Search Section */}
      {colKey === "assignee" && (
        <div className="p-1 border-t border-slate-100 dark:border-slate-700">
          <p className="px-2.5 py-1.5 text-[10px] font-black text-slate-400 uppercase">Filter by Name</p>
          <div className="px-2 pb-2">
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={assigneeSearch} onChange={e => setAssigneeSearch(e.target.value)} placeholder="Search..." className="w-full pl-7 pr-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-[#F77B3A] dark:text-white" />
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredNames.length > 0 ? filteredNames.map(name => (
              <button key={name} onClick={() => { onAssigneeFilter(name); setOpen(false); }} className={`w-full flex items-center gap-2 px-2.5 py-2 text-sm rounded-lg ${filterValue === name ? 'text-[#F77B3A] font-bold bg-orange-50' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
                 <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold uppercase">{name[0]}</div>
                 <span className="truncate">{name}</span>
              </button>
            )) : <p className="text-[10px] text-center py-4 text-slate-400 italic">No members found</p>}
          </div>
          {filterValue && filterValue !== "All" && (
             <button onClick={() => { onAssigneeFilter("All"); setOpen(false); }} className="w-full text-center py-2 text-[10px] text-red-500 font-bold hover:bg-red-50 border-t mt-1">Clear Filter</button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400 text-sm select-none">
      <button ref={btnRef} onClick={toggleOpen} className={`flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-white transition-colors group ${open || isSorted || hasFilter ? "text-slate-800 dark:text-white" : ""}`}>
        {isSorted && <span className="text-[#F77B3A]">{sortConfig.direction === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}</span>}
        <span>{label}</span>
        {hasFilter && <span className="w-1.5 h-1.5 rounded-full bg-[#F77B3A]" />}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""} opacity-0 group-hover:opacity-100`} />
      </button>
      {open && createPortal(menuContent, document.body)}
    </th>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
function TeamspaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workspaceName] = useState("Team Workspace");
  const [userName, setUserName] = useState("User");
  const [userId, setUserId] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [columnFilters, setColumnFilters] = useState({ status: "All", priority: "All", assignee: "All" });

  useEffect(() => {
    fetchWorkspaceTasks();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserName(decoded.name || "User");
        setUserId(decoded.id || decoded._id);
      } catch {}
    }
  }, [id]);

  const fetchWorkspaceTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/todos/${id}`);
      setTasks(Array.isArray(res.data) ? res.data : res.data.todos || []);
    } catch (err) {
      if (err.response?.status === 404) setTasks([]);
      else setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const assigneeNames = useMemo(() => {
    const names = new Set();
    tasks.forEach(t => {
      const name = typeof t.assigneeId === 'object' ? t.assigneeId?.name : null;
      if (name) names.add(name);
    });
    return Array.from(names);
  }, [tasks]);

  const processedTasks = useMemo(() => {
    let result = [...tasks];
    if (activeTab === "me") result = result.filter(t => (t.assigneeId?._id || t.assigneeId) === userId);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.text?.toLowerCase().includes(q) || t.assigneeId?.name?.toLowerCase().includes(q));
    }
    if (columnFilters.status !== "All") result = result.filter(t => (t.status || (t.completed ? "Done" : "Not started")) === columnFilters.status);
    if (columnFilters.priority !== "All") result = result.filter(t => t.priority === columnFilters.priority);
    if (columnFilters.assignee !== "All") result = result.filter(t => t.assigneeId?.name === columnFilters.assignee);

    result.sort((a, b) => {
      let aVal = sortConfig.key === "assignee" ? (a.assigneeId?.name ?? "") : (a[sortConfig.key] ?? "");
      let bVal = sortConfig.key === "assignee" ? (b.assigneeId?.name ?? "") : (b[sortConfig.key] ?? "");
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [tasks, activeTab, searchQuery, sortConfig, columnFilters, userId]);

  const handleTaskSaved = useCallback((savedTask, isEditing) => {
    if (isEditing) setTasks(prev => prev.map(t => t._id === savedTask._id ? savedTask : t));
    else setTasks(prev => [savedTask, ...prev]);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm font-bold dark:text-white">
          <button onClick={() => navigate("/teamspaces")} className="hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-md"><ArrowLeft size={18} /></button>
          <span className="bg-orange-100 text-orange-600 w-5 h-5 flex items-center justify-center rounded text-xs font-black">T</span>
          {workspaceName} / Tasks Tracker
        </div>
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-black text-xs uppercase">{userName[0]}</div>
      </header>

      <main className="max-w-[1400px] w-full mx-auto p-6 md:p-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black dark:text-white flex items-center gap-3">
             <span className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center"><CheckCircle2 size={22} /></span>
             Tasks Tracker
          </h1>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-lg border dark:border-slate-700">
              <button onClick={() => setActiveTab("all")} className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${activeTab === "all" ? "bg-white dark:bg-slate-900 shadow-sm text-slate-800 dark:text-white" : "text-slate-500"}`}>All Tasks</button>
              <button onClick={() => setActiveTab("me")} className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${activeTab === "me" ? "bg-white dark:bg-slate-900 shadow-sm text-slate-800 dark:text-white" : "text-slate-500"}`}>My Tasks</button>
            </div>
            {/* Filter Pills */}
            {Object.entries(columnFilters).filter(([_, v]) => v !== "All").map(([k, v]) => (
              <span key={k} className="px-2 py-1 bg-orange-50 dark:bg-orange-950 text-[#F77B3A] text-[10px] font-black uppercase rounded-lg border border-orange-100 flex items-center gap-1">
                {k}: {v} <X size={10} className="cursor-pointer" onClick={() => setColumnFilters({...columnFilters, [k]: "All"})} />
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-sm dark:text-white outline-none focus:border-[#F77B3A] w-48" />
            </div>
            <button onClick={() => setShowModal(true)} className="bg-[#F77B3A] hover:bg-[#e8692a] text-white px-4 py-1.5 rounded-lg text-sm font-black transition flex items-center gap-1.5 shadow-lg shadow-orange-500/10">
              <Plus size={16} /> New Task
            </button>
          </div>
        </div>

        {/* Table wrapper — fixed bug: overflow won't cut popups anymore */}
        <div className="w-full border border-slate-100 dark:border-slate-800 rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900 border-b dark:border-slate-800">
                  <ColumnHeader label="Task Name" colKey="text" sortConfig={sortConfig} onSort={setSortConfig} />
                  <ColumnHeader label="Status" colKey="status" sortConfig={sortConfig} onSort={setSortConfig} filterValue={columnFilters.status} onFilter={(k, v) => setColumnFilters({...columnFilters, [k]: v})} filterOptions={["Not started", "In progress", "Done"]} />
                  <ColumnHeader label="Assignee" colKey="assignee" sortConfig={sortConfig} onSort={setSortConfig} filterValue={columnFilters.assignee} onAssigneeFilter={(v) => setColumnFilters({...columnFilters, assignee: v})} assigneeNames={assigneeNames} />
                  <th className="py-3 px-4 font-semibold text-slate-500 text-sm">Description</th>
                  <ColumnHeader label="Due Date" colKey="dueDate" sortConfig={sortConfig} onSort={setSortConfig} />
                  <ColumnHeader label="Priority" colKey="priority" sortConfig={sortConfig} onSort={setSortConfig} filterValue={columnFilters.priority} onFilter={(k, v) => setColumnFilters({...columnFilters, [k]: v})} filterOptions={["High", "Medium", "Low"]} />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="py-20 text-center"><Clock className="animate-spin mx-auto text-slate-200" size={32} /></td></tr>
                ) : processedTasks.map(task => {
                   const assignee = typeof task.assigneeId === 'object' ? task.assigneeId : null;
                   return (
                     <tr key={task._id} onDoubleClick={() => { setEditingTask(task); setShowModal(true); }} className="border-b dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer group">
                       <td className="py-4 px-4 font-bold text-slate-800 dark:text-white text-sm">{task.text}</td>
                       <td className="py-4 px-4">
                         <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight
                           ${task.status === "Done" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950" : task.status === "In progress" ? "bg-blue-50 text-blue-600 dark:bg-blue-950" : "bg-slate-50 text-slate-600 dark:bg-slate-800"}`}>
                           {task.status === "Done" ? <CheckCircle2 size={10}/> : task.status === "In progress" ? <Clock size={10}/> : <Circle size={10}/>} {task.status || "Not started"}
                         </span>
                       </td>
                       <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {assignee ? <>
                              <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold uppercase">{assignee.name[0]}</div>
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{assignee.name}</span>
                            </> : <span className="text-xs text-slate-300 italic">—</span>}
                          </div>
                       </td>
                       <td className="py-4 px-4 text-xs text-slate-500 truncate max-w-[200px]">{task.description || "—"}</td>
                       <td className="py-4 px-4 text-xs font-bold text-slate-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</td>
                       <td className="py-4 px-4">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${task.priority === "High" ? "bg-red-50 text-red-500" : task.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-500"}`}>
                           {task.priority}
                         </span>
                       </td>
                     </tr>
                   )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showModal && <TaskModal onClose={() => setShowModal(false)} onSave={handleTaskSaved} workspaceId={id} taskToEdit={editingTask} />}
    </div>
  );
}

export default TeamspaceDetail;