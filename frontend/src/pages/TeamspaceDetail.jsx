// import { useEffect, useState, useCallback } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import API from "../services/api";
// import {
//   ArrowLeft, Plus, CheckCircle2, Circle, Calendar, AlertCircle, Clock,
//   FileText, User, LayoutDashboard, BarChart3, ListTodo, Building2, LogOut,
//   X, Menu, ChevronsLeft, Minus, ChevronDown
// } from "lucide-react";

// const LG = 1024;

// // ─────────────────────────────────────────────
// // NEW TASK MODAL COMPONENT
// // ─────────────────────────────────────────────
// function NewTaskModal({ onClose, onSave, workspaceId }) {
//   const [form, setForm] = useState({
//     text: "",
//     description: "",
//     status: "Not started",
//     priority: "Medium",
//     assigneeName: "",
//     dueDate: "",
//   });
//   const [saving, setSaving] = useState(false);
//   const [err, setErr] = useState("");

//   const handleChange = (e) =>
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.text.trim()) {
//       setErr("Task name is required.");
//       return;
//     }
//     setSaving(true);
//     try {
//       const res = await API.post("/todos", {
//         text: form.text,
//         description: form.description,
//         status: form.status,
//         priority: form.priority,
//         assigneeName: form.assigneeName,
//         dueDate: form.dueDate || null,
//         workspaceId,
//       });
//       onSave(res.data);
//       onClose();
//     } catch (err) {
//       // Optimistic fallback agar backend ready nahi hai
//       onSave({
//         ...form,
//         _id: Date.now().toString(),
//         createdAt: new Date().toISOString(),
//       });
//       onClose();
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ESC se close
//   useEffect(() => {
//     const handleKey = (e) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">

//         {/* Modal Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//           <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
//             <span className="w-6 h-6 bg-[#F77B3A] rounded-lg flex items-center justify-center">
//               <Plus size={14} className="text-white" />
//             </span>
//             New Task
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-600"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
//           {err && (
//             <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg flex items-center gap-2">
//               <AlertCircle size={14} /> {err}
//             </p>
//           )}

//           {/* Task Name */}
//           <div>
//             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
//               Task name <span className="text-red-400">*</span>
//             </label>
//             <input
//               autoFocus
//               name="text"
//               value={form.text}
//               onChange={handleChange}
//               placeholder="What needs to be done?"
//               className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F77B3A]/40 focus:border-[#F77B3A] transition"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               rows={2}
//               placeholder="Add more details…"
//               className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F77B3A]/40 focus:border-[#F77B3A] transition resize-none"
//             />
//           </div>

//           {/* Status + Priority */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
//                 Status
//               </label>
//               <div className="relative">
//                 <select
//                   name="status"
//                   value={form.status}
//                   onChange={handleChange}
//                   className="w-full appearance-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F77B3A]/40 focus:border-[#F77B3A] bg-white pr-8 transition"
//                 >
//                   <option>Not started</option>
//                   <option>In progress</option>
//                   <option>Done</option>
//                 </select>
//                 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               </div>
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
//                 Priority
//               </label>
//               <div className="relative">
//                 <select
//                   name="priority"
//                   value={form.priority}
//                   onChange={handleChange}
//                   className="w-full appearance-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F77B3A]/40 focus:border-[#F77B3A] bg-white pr-8 transition"
//                 >
//                   <option>High</option>
//                   <option>Medium</option>
//                   <option>Low</option>
//                 </select>
//                 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               </div>
//             </div>
//           </div>

//           {/* Assignee + Due Date */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
//                 Assignee
//               </label>
//               <input
//                 name="assigneeName"
//                 value={form.assigneeName}
//                 onChange={handleChange}
//                 placeholder="Name…"
//                 className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F77B3A]/40 focus:border-[#F77B3A] transition"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
//                 Due date
//               </label>
//               <input
//                 type="date"
//                 name="dueDate"
//                 value={form.dueDate}
//                 onChange={handleChange}
//                 className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F77B3A]/40 focus:border-[#F77B3A] transition"
//               />
//             </div>
//           </div>

//           {/* Status indicator pills preview */}
//           <div className="flex items-center gap-2 pt-1">
//             <span className="text-[11px] text-slate-400 font-medium">Preview:</span>
//             <StatusPill status={form.status} />
//             <PriorityPill priority={form.priority} />
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-5 py-2 text-sm font-black text-white bg-[#F77B3A] hover:bg-[#e56d2f] rounded-xl transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
//             >
//               {saving ? (
//                 <><Clock size={14} className="animate-spin" /> Saving…</>
//               ) : (
//                 <><Plus size={14} /> Create task</>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ── Small preview pills ──
// function StatusPill({ status }) {
//   const map = {
//     "Done":        { cls: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 size={11}/> },
//     "In progress": { cls: "bg-blue-100 text-blue-700",       icon: <Clock size={11}/> },
//     "Not started": { cls: "bg-slate-100 text-slate-600",     icon: <Circle size={11}/> },
//   };
//   const s = map[status] || map["Not started"];
//   return (
//     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.cls}`}>
//       {s.icon} {status}
//     </span>
//   );
// }

// function PriorityPill({ priority }) {
//   const map = {
//     High:   "bg-red-100 text-red-700",
//     Medium: "bg-amber-100 text-amber-700",
//     Low:    "bg-emerald-100 text-emerald-700",
//   };
//   return (
//     <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${map[priority] || "bg-slate-100 text-slate-700"}`}>
//       {priority}
//     </span>
//   );
// }

// // ─────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────
// function TeamspaceDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [workspaceName, setWorkspaceName] = useState("Team Workspace");
//   const [userName, setUserName] = useState("User");
//   const [userId, setUserId] = useState("");
//   const [activeTab, setActiveTab] = useState("all");

//   // ✅ Modal state (replaces isAddingTask inline row)
//   const [showModal, setShowModal] = useState(false);

//   // Sidebar states
//   const [isDesktop, setIsDesktop] = useState(
//     typeof window !== "undefined" ? window.innerWidth >= LG : true
//   );
//   const [isSidebarOpen, setIsSidebarOpen] = useState(
//     typeof window !== "undefined" ? window.innerWidth >= LG : true
//   );

//   const handleResize = useCallback(() => {
//     const desktop = window.innerWidth >= LG;
//     if (desktop !== isDesktop) {
//       setIsDesktop(desktop);
//       setIsSidebarOpen(desktop);
//     }
//   }, [isDesktop]);

//   useEffect(() => {
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [handleResize]);

//   useEffect(() => {
//     fetchWorkspaceTasks();
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = JSON.parse(atob(token.split(".")[1]));
//         setUserName(decoded.name || "User");
//         setUserId(decoded.id || decoded._id);
//       } catch (e) {}
//     }
//   }, [id]);

//   const fetchWorkspaceTasks = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get(`/todos/${id}`);
//       setTasks(Array.isArray(res.data) ? res.data : res.data.todos || []);
//       setError("");
//     } catch (err) {
//       if (err.response && err.response.status === 404) {
//         setTasks([]);
//         setError("");
//       } else {
//         setError("Failed to load team tasks.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   // ✅ Called when modal saves a task
//   const handleTaskSaved = (newTask) => {
//     setTasks((prev) => [newTask, ...prev]);
//   };

//   const filteredTasks = tasks.filter((task) => {
//     if (activeTab === "all") return true;
//     return task.assigneeId === userId;
//   });

//   const getPriorityStyle = (priority) => {
//     switch (priority) {
//       case "High":   return "bg-red-100 text-red-700";
//       case "Medium": return "bg-amber-100 text-amber-700";
//       case "Low":    return "bg-emerald-100 text-emerald-700";
//       default:       return "bg-slate-100 text-slate-700";
//     }
//   };

//   const getStatusStyle = (status, completed) => {
//     const s = status || (completed ? "Done" : "Not started");
//     switch (s) {
//       case "Done":        return { cls: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 size={12}/>, label: "Done" };
//       case "In progress": return { cls: "bg-blue-100 text-blue-700",       icon: <Clock size={12}/>,        label: "In progress" };
//       default:            return { cls: "bg-slate-100 text-slate-600",      icon: <Circle size={12}/>,       label: "Not started" };
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-slate-800 font-sans flex relative">

//       {/* Mobile overlay */}
//       {!isDesktop && isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* ── SIDEBAR (unchanged from your code) ── */}
//       <aside className={`
//         flex flex-col bg-[#F8F9FB] border-r border-slate-200 h-screen z-50 transition-all duration-300 ease-in-out
//         ${isDesktop
//           ? `sticky top-0 overflow-hidden flex-shrink-0 ${isSidebarOpen ? "w-64 p-6" : "w-0 p-0 border-0"}`
//           : `fixed inset-y-0 left-0 w-72 p-6 ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`
//         }
//       `}>
//         <div className="min-w-[208px] flex flex-col flex-1">
//           <div className="flex items-center justify-between mb-10">
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 flex-shrink-0 bg-[#F77B3A] rounded-xl flex items-center justify-center text-white font-black">T</div>
//               <span className="font-black text-lg tracking-tight">TaskMaster</span>
//             </div>
//             {!isDesktop && (
//               <button className="p-1 text-slate-400 hover:text-slate-600 transition" onClick={() => setIsSidebarOpen(false)}>
//                 <X size={24} />
//               </button>
//             )}
//           </div>
//           <nav className="space-y-1">
//             <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white rounded-xl font-bold text-sm transition">
//               <LayoutDashboard size={18} /> Dashboard
//             </Link>
//             <div className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed">
//               <BarChart3 size={18} /> Analytics
//             </div>
//             <div className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed">
//               <ListTodo size={18} /> Projects
//             </div>
//             <Link to="/teamspaces" className="flex items-center gap-3 px-4 py-3 bg-white text-[#F77B3A] shadow-sm border border-slate-100 rounded-xl font-bold text-sm transition">
//               <Building2 size={18} /> Teamspaces
//             </Link>
//           </nav>
//           <button onClick={logout} className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition w-full">
//             <LogOut size={18} /> Logout
//           </button>
//         </div>
//       </aside>

//       {/* ── MAIN CONTENT AREA ── */}
//       <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

//         {/* TOP BREADCRUMB HEADER */}
//         <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
//             <button
//               className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500 hover:text-[#F77B3A] transition flex-shrink-0 mr-2"
//               onClick={() => setIsSidebarOpen((prev) => !prev)}
//             >
//               {isSidebarOpen && isDesktop ? <ChevronsLeft size={16} /> : <Menu size={16} />}
//             </button>
//             <button onClick={() => navigate("/teamspaces")} className="hover:bg-slate-100 p-1.5 rounded-md transition">
//               <ArrowLeft size={18} />
//             </button>
//             <span className="bg-orange-100 text-orange-600 w-5 h-5 flex items-center justify-center rounded text-xs font-bold">T</span>
//             <span className="hover:underline cursor-pointer truncate max-w-[150px] sm:max-w-xs">{workspaceName}</span>
//             <span className="text-slate-300">/</span>
//             <span className="text-slate-900 font-bold flex items-center gap-1.5">
//               <CheckCircle2 size={16} className="text-emerald-500" /> Tasks Tracker
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
//               {userName[0]}
//             </div>
//           </div>
//         </header>

//         <main className="max-w-[1400px] w-full mx-auto p-6 md:p-10">

//           {/* Page Title */}
//           <div className="mb-8">
//             <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3 mb-2">
//               <CheckCircle2 size={36} className="text-emerald-500" /> Tasks Tracker
//             </h1>
//             <p className="text-slate-500 font-medium">Stay organized with tasks, your way.</p>
//           </div>

//           {/* Toolbar */}
//           <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
//             <div className="flex items-center gap-1 text-sm font-medium text-slate-600 bg-slate-50 p-1 rounded-lg border border-slate-100">
//               <button
//                 onClick={() => setActiveTab("all")}
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition ${activeTab === "all" ? "bg-white shadow-sm text-slate-900" : "hover:bg-slate-100 text-slate-500"}`}
//               >
//                 <FileText size={16} /> All Tasks
//               </button>
//               <button
//                 onClick={() => setActiveTab("me")}
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition ${activeTab === "me" ? "bg-white shadow-sm text-slate-900" : "hover:bg-slate-100 text-slate-500"}`}
//               >
//                 <User size={16} /> My Tasks
//               </button>
//             </div>

//             {/* ✅ New button — opens modal */}
//             <button
//               onClick={() => setShowModal(true)}
//               className="bg-[#F77B3A] hover:bg-[#e56d2f] text-white px-4 py-1.5 rounded-lg text-sm font-black flex items-center gap-1.5 shadow-sm transition"
//             >
//               <Plus size={15} /> New Task
//             </button>
//           </div>

//           {/* ── TABLE ── */}
//           <div className="w-full overflow-x-auto border-t border-slate-200">
//             {loading ? (
//               <div className="py-20 text-center">
//                 <Clock className="animate-spin mx-auto mb-3 text-slate-300" size={32} />
//                 <p className="text-sm text-slate-400">Loading tasks…</p>
//               </div>
//             ) : error ? (
//               <div className="py-10 text-red-500 text-center flex justify-center items-center gap-2">
//                 <AlertCircle size={20} /> {error}
//               </div>
//             ) : (
//               <table className="w-full text-left border-collapse min-w-[1000px]">
//                 <thead>
//                   <tr className="border-b border-slate-200 text-slate-500 text-sm">
//                     <th className="font-medium py-3 px-4 w-1/4">
//                       <div className="flex items-center gap-2"><span className="text-xs">Aa</span> Task name</div>
//                     </th>
//                     <th className="font-medium py-3 px-4 w-32">
//                       <div className="flex items-center gap-2"><CheckCircle2 size={14}/> Status</div>
//                     </th>
//                     <th className="font-medium py-3 px-4 w-40">
//                       <div className="flex items-center gap-2"><User size={14}/> Assignee</div>
//                     </th>
//                     <th className="font-medium py-3 px-4 w-56">
//                       <div className="flex items-center gap-2"><Minus size={14}/> Description</div>
//                     </th>
//                     <th className="font-medium py-3 px-4 w-32">
//                       <div className="flex items-center gap-2"><Calendar size={14}/> Due date</div>
//                     </th>
//                     <th className="font-medium py-3 px-4 w-28">
//                       <div className="flex items-center gap-2"><AlertCircle size={14}/> Priority</div>
//                     </th>
//                     <th className="font-medium py-3 px-4 w-44">
//                       <div className="flex items-center gap-2"><Clock size={14}/> Created time</div>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredTasks.length === 0 ? (
//                     <tr>
//                       <td colSpan="7" className="py-16 text-center text-slate-400 text-sm">
//                         <CheckCircle2 size={32} className="mx-auto mb-3 text-slate-200" />
//                         No tasks yet.{" "}
//                         <button
//                           onClick={() => setShowModal(true)}
//                           className="text-[#F77B3A] hover:underline font-bold"
//                         >
//                           Create your first task →
//                         </button>
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredTasks.map((task) => {
//                       const status = getStatusStyle(task.status, task.completed);
//                       return (
//                         <tr key={task._id} className="border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer group">
//                           <td className="py-3 px-4 font-semibold text-slate-800 text-sm">
//                             {task.text || task.title}
//                           </td>
//                           <td className="py-3 px-4">
//                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.cls}`}>
//                               {status.icon} {status.label}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="flex items-center gap-2 text-sm text-slate-600">
//                               {task.assigneeName || task.assigneeId ? (
//                                 <>
//                                   <div className="w-5 h-5 rounded-full bg-[#F77B3A]/20 text-[#F77B3A] flex items-center justify-center text-[10px] font-black">
//                                     {(task.assigneeName || "U")[0].toUpperCase()}
//                                   </div>
//                                   <span className="truncate max-w-[100px]">{task.assigneeName || "Assigned"}</span>
//                                 </>
//                               ) : (
//                                 <span className="text-slate-400 italic">Unassigned</span>
//                               )}
//                             </div>
//                           </td>
//                           <td className="py-3 px-4 text-sm text-slate-500 max-w-[200px]">
//                             <span className="truncate block">
//                               {task.description || <span className="text-slate-300">—</span>}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 text-sm text-slate-600">
//                             {task.dueDate
//                               ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
//                               : <span className="text-slate-300">—</span>}
//                           </td>
//                           <td className="py-3 px-4">
//                             <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityStyle(task.priority)}`}>
//                               {task.priority || "Medium"}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 text-sm text-slate-500">
//                             {task.createdAt
//                               ? new Date(task.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
//                               : "—"}
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}

//                   {/* Quick add row at bottom */}
//                   <tr
//                     onClick={() => setShowModal(true)}
//                     className="border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer text-slate-400"
//                   >
//                     <td colSpan="7" className="py-3 px-4">
//                       <div className="flex items-center gap-2 text-sm font-medium">
//                         <Plus size={16} /> New
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* ✅ NEW TASK MODAL */}
//       {showModal && (
//         <NewTaskModal
//           onClose={() => setShowModal(false)}
//           onSave={handleTaskSaved}
//           workspaceId={id}
//         />
//       )}
//     </div>
//   );
// }

// export default TeamspaceDetail;

import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  ArrowLeft, Plus, CheckCircle2, Circle, Calendar, AlertCircle, Clock,
  FileText, User, LayoutDashboard, BarChart3, ListTodo, Building2, LogOut,
  X, Menu, ChevronsLeft, Minus, ChevronDown, Mail
} from "lucide-react";

const LG = 1024;

// ─────────────────────────────────────────────
// TASK MODAL (Handles both Create & Edit)
// ─────────────────────────────────────────────
function TaskModal({ onClose, onSave, workspaceId, taskToEdit }) {
  // Agar taskToEdit hai, toh purana data pre-fill karo, warna khali
  const [form, setForm] = useState({
    text: taskToEdit ? taskToEdit.text : "",
    description: taskToEdit ? taskToEdit.description : "",
    status: taskToEdit ? taskToEdit.status || (taskToEdit.completed ? "Done" : "Not started") : "Not started",
    priority: taskToEdit ? taskToEdit.priority : "Medium",
    assigneeEmail: taskToEdit && taskToEdit.assigneeId ? taskToEdit.assigneeId.email : "",
    dueDate: taskToEdit && taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const isEditing = !!taskToEdit;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) {
      setErr("Task name is required.");
      return;
    }
    setSaving(true);
    try {
      let res;
      if (isEditing) {
        // Edit mode: PUT request
        res = await API.put(`/todos/${taskToEdit._id}`, form);
      } else {
        // Create mode: POST request
        res = await API.post("/todos", { ...form, workspaceId });
      }
      onSave(res.data, isEditing);
      onClose();
    } catch (err) {
      setErr("Failed to save task. Please check email address or try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#F77B3A] rounded-lg flex items-center justify-center">
              {isEditing ? <FileText size={14} className="text-white" /> : <Plus size={14} className="text-white" />}
            </span>
            {isEditing ? "Edit Task" : "New Task"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-400">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {err && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg flex items-center gap-2"><AlertCircle size={14} /> {err}</p>}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Task name <span className="text-red-400">*</span></label>
            <input autoFocus name="text" value={form.text} onChange={handleChange} placeholder="What needs to be done?" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#F77B3A]" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Add more details…" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#F77B3A] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Status</label>
              <div className="relative">
                <select name="status" value={form.status} onChange={handleChange} className="w-full appearance-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-white pr-8 outline-none focus:border-[#F77B3A]">
                  <option>Not started</option>
                  <option>In progress</option>
                  <option>Done</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Priority</label>
              <div className="relative">
                <select name="priority" value={form.priority} onChange={handleChange} className="w-full appearance-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-white pr-8 outline-none focus:border-[#F77B3A]">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Assignee Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                <input type="email" name="assigneeEmail" value={form.assigneeEmail} onChange={handleChange} placeholder="user@team.com" className="w-full pl-8 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#F77B3A]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Due date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#F77B3A]" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-black text-white bg-[#F77B3A] hover:bg-[#e56d2f] rounded-xl disabled:opacity-50">
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
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
  const [workspaceName, setWorkspaceName] = useState("Team Workspace");
  const [userName, setUserName] = useState("User");
  const [userId, setUserId] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Track task being edited

  const [isDesktop, setIsDesktop] = useState(typeof window !== "undefined" ? window.innerWidth >= LG : true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== "undefined" ? window.innerWidth >= LG : true);

  const handleResize = useCallback(() => {
    const desktop = window.innerWidth >= LG;
    if (desktop !== isDesktop) { setIsDesktop(desktop); setIsSidebarOpen(desktop); }
  }, [isDesktop]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    fetchWorkspaceTasks();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserName(decoded.name || "User");
        setUserId(decoded.id || decoded._id);
      } catch (e) {}
    }
  }, [id]);

  const fetchWorkspaceTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/todos/${id}`);
      setTasks(Array.isArray(res.data) ? res.data : res.data.todos || []);
    } catch (err) {
      if (err.response && err.response.status === 404) setTasks([]);
      else setError("Failed to load team tasks.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Naya Handler for both Create and Edit
  const handleTaskSaved = (savedTask, isEditing) => {
    if (isEditing) {
      setTasks((prev) => prev.map(t => t._id === savedTask._id ? savedTask : t));
    } else {
      setTasks((prev) => [savedTask, ...prev]);
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    // Populated object ya direct string id dono check karo
    const taskAssigneeId = task.assigneeId && typeof task.assigneeId === 'object' ? task.assigneeId._id : task.assigneeId;
    return taskAssigneeId === userId;
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":   return "bg-red-100 text-red-700";
      case "Medium": return "bg-amber-100 text-amber-700";
      case "Low":    return "bg-emerald-100 text-emerald-700";
      default:       return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusStyle = (status, completed) => {
    const s = status || (completed ? "Done" : "Not started");
    switch (s) {
      case "Done":        return { cls: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 size={12}/>, label: "Done" };
      case "In progress": return { cls: "bg-blue-100 text-blue-700",       icon: <Clock size={12}/>,        label: "In progress" };
      default:            return { cls: "bg-slate-100 text-slate-600",      icon: <Circle size={12}/>,       label: "Not started" };
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex relative">
      {!isDesktop && isSidebarOpen && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={() => setIsSidebarOpen(false)} />}

      {/* SIDEBAR (Skipped long code for brevity, it is unchanged) */}
      <aside className={`flex flex-col bg-[#F8F9FB] border-r border-slate-200 h-screen z-50 transition-all duration-300 ease-in-out ${isDesktop ? `sticky top-0 overflow-hidden flex-shrink-0 ${isSidebarOpen ? "w-64 p-6" : "w-0 p-0 border-0"}` : `fixed inset-y-0 left-0 w-72 p-6 ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}`}>
        <div className="min-w-[208px] flex flex-col flex-1">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex-shrink-0 bg-[#F77B3A] rounded-xl flex items-center justify-center text-white font-black">T</div>
              <span className="font-black text-lg tracking-tight">TaskMaster</span>
            </div>
            {!isDesktop && <button className="p-1 text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>}
          </div>
          <nav className="space-y-1">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white rounded-xl font-bold text-sm transition"><LayoutDashboard size={18} /> Dashboard</Link>
            <div className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed"><BarChart3 size={18} /> Analytics</div>
            <div className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed"><ListTodo size={18} /> Projects</div>
            <Link to="/teamspaces" className="flex items-center gap-3 px-4 py-3 bg-white text-[#F77B3A] shadow-sm border border-slate-100 rounded-xl font-bold text-sm transition"><Building2 size={18} /> Teamspaces</Link>
          </nav>
          <button onClick={logout} className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition w-full"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <button className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500 hover:text-[#F77B3A] transition flex-shrink-0 mr-2" onClick={() => setIsSidebarOpen((prev) => !prev)}>
              {isSidebarOpen && isDesktop ? <ChevronsLeft size={16} /> : <Menu size={16} />}
            </button>
            <button onClick={() => navigate("/teamspaces")} className="hover:bg-slate-100 p-1.5 rounded-md transition"><ArrowLeft size={18} /></button>
            <span className="bg-orange-100 text-orange-600 w-5 h-5 flex items-center justify-center rounded text-xs font-bold">T</span>
            <span className="hover:underline cursor-pointer truncate max-w-[150px] sm:max-w-xs">{workspaceName}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Tasks Tracker</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">{userName[0]}</div>
          </div>
        </header>

        <main className="max-w-[1400px] w-full mx-auto p-6 md:p-10">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3 mb-2">
              <CheckCircle2 size={36} className="text-emerald-500" /> Tasks Tracker
            </h1>
            <p className="text-slate-500 font-medium">Double-click any task to edit. Assign via email.</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-1 text-sm font-medium text-slate-600 bg-slate-50 p-1 rounded-lg border border-slate-100">
              <button onClick={() => setActiveTab("all")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition ${activeTab === "all" ? "bg-white shadow-sm text-slate-900" : "hover:bg-slate-100 text-slate-500"}`}><FileText size={16} /> All Tasks</button>
              <button onClick={() => setActiveTab("me")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition ${activeTab === "me" ? "bg-white shadow-sm text-slate-900" : "hover:bg-slate-100 text-slate-500"}`}><User size={16} /> My Tasks</button>
            </div>
            <button onClick={openNewTaskModal} className="bg-[#F77B3A] hover:bg-[#e56d2f] text-white px-4 py-1.5 rounded-lg text-sm font-black flex items-center gap-1.5 shadow-sm transition">
              <Plus size={15} /> New Task
            </button>
          </div>

          <div className="w-full overflow-x-auto border-t border-slate-200">
            {loading ? (
              <div className="py-20 text-center"><Clock className="animate-spin mx-auto mb-3 text-slate-300" size={32} /></div>
            ) : error ? (
              <div className="py-10 text-red-500 text-center flex justify-center items-center gap-2"><AlertCircle size={20} /> {error}</div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-sm">
                    <th className="font-medium py-3 px-4 w-1/4"><div className="flex items-center gap-2"><span className="text-xs">Aa</span> Task name</div></th>
                    <th className="font-medium py-3 px-4 w-32"><div className="flex items-center gap-2"><CheckCircle2 size={14}/> Status</div></th>
                    <th className="font-medium py-3 px-4 w-40"><div className="flex items-center gap-2"><User size={14}/> Assignee</div></th>
                    <th className="font-medium py-3 px-4 w-56"><div className="flex items-center gap-2"><Minus size={14}/> Description</div></th>
                    <th className="font-medium py-3 px-4 w-32"><div className="flex items-center gap-2"><Calendar size={14}/> Due date</div></th>
                    <th className="font-medium py-3 px-4 w-28"><div className="flex items-center gap-2"><AlertCircle size={14}/> Priority</div></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-16 text-center text-slate-400 text-sm">
                        <button onClick={openNewTaskModal} className="text-[#F77B3A] hover:underline font-bold">Create your first task →</button>
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => {
                      const status = getStatusStyle(task.status, task.completed);
                      // Check if assigneeId is populated object or just ID
                      const assignedUser = task.assigneeId && typeof task.assigneeId === 'object' ? task.assigneeId : null;

                      return (
                        <tr 
                          key={task._id} 
                          onDoubleClick={() => openEditTaskModal(task)} // ✅ DOUBLE CLICK EDIT
                          className="border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer group"
                        >
                          <td className="py-3 px-4 font-semibold text-slate-800 text-sm">{task.text}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.cls}`}>
                              {status.icon} {status.label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              {assignedUser ? (
                                <>
                                  <div className="w-5 h-5 rounded-full bg-[#F77B3A]/20 text-[#F77B3A] flex items-center justify-center text-[10px] font-black uppercase">
                                    {assignedUser.name[0]}
                                  </div>
                                  <span className="truncate max-w-[100px]">{assignedUser.name}</span>
                                </>
                              ) : (
                                <span className="text-slate-400 italic">Unassigned</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-500 max-w-[200px]">
                            <span className="truncate block">{task.description || <span className="text-slate-300">—</span>}</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : <span className="text-slate-300">—</span>}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityStyle(task.priority)}`}>{task.priority || "Medium"}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSave={handleTaskSaved}
          workspaceId={id}
          taskToEdit={editingTask}
        />
      )}
    </div>
  );
}

export default TeamspaceDetail;