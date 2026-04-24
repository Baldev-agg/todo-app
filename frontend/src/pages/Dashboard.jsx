// import { useEffect, useState } from "react";
// import API from "../services/api";
// import {
//   LogOut,
//   Plus,
//   Trash2,
//   Check,
//   CircleCheck,
//   Clock,
//   AlertCircle,
//   Edit2,
//   CheckCircle,
//   Calendar,
//   AlertTriangle,
//   LayoutDashboard,
//   BarChart3,
//   ListTodo,
//   Search,
//   ChevronDown,
//   Rocket, // Fixed: Added Rocket import
//   MoreVertical,
// } from "lucide-react";

// function Dashboard() {
//   const [todos, setTodos] = useState([]);
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userName, setUserName] = useState("User");
//   const [addingTodo, setAddingTodo] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [editingText, setEditingText] = useState("");
//   const [editingPriority, setEditingPriority] = useState("Medium");
//   const [editingDueDate, setEditingDueDate] = useState("");
//   const [priority, setPriority] = useState("Medium");
//   const [dueDate, setDueDate] = useState("");

//   // Load todos on mount
//   useEffect(() => {
//     loadTodos();
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = JSON.parse(atob(token.split(".")[1]));
//         setUserName(decoded.name || "User");
//       } catch (e) {
//         console.log("Could not decode token");
//       }
//     }
//   }, []);

//   const loadTodos = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/todos");
//       setTodos(res.data);
//       setError("");
//     } catch (err) {
//       setError("Failed to load tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addTodo = async () => {
//     if (!text.trim()) return;
//     setAddingTodo(true);
//     try {
//       const res = await API.post("/todos", {
//         text: text.trim(),
//         priority,
//         dueDate: dueDate || null,
//       });
//       setTodos([...todos, res.data]);
//       setText("");
//       setPriority("Medium");
//       setDueDate("");
//       setError("");
//     } catch (err) {
//       setError("Failed to add task");
//     } finally {
//       setAddingTodo(false);
//     }
//   };

//   const toggleTodo = async (id, completed) => {
//     try {
//       await API.put(`/todos/${id}`, { completed: !completed });
//       setTodos(
//         todos.map((t) => (t._id === id ? { ...t, completed: !completed } : t))
//       );
//     } catch (err) {
//       setError("Failed to update task");
//     }
//   };

//   const deleteTodo = async (id) => {
//     try {
//       await API.delete(`/todos/${id}`);
//       setTodos(todos.filter((t) => t._id !== id));
//     } catch (err) {
//       setError("Failed to delete task");
//     }
//   };

//   const startEdit = (id, currentText, currentPriority, currentDueDate) => {
//     setEditingId(id);
//     setEditingText(currentText);
//     setEditingPriority(currentPriority || "Medium");
//     setEditingDueDate(currentDueDate ? currentDueDate.split("T")[0] : "");
//   };

//   const saveEdit = async (id) => {
//     if (!editingText.trim()) {
//       setError("Task text cannot be empty");
//       return;
//     }
//     try {
//       const res = await API.put(`/todos/${id}`, {
//         text: editingText.trim(),
//         priority: editingPriority,
//         dueDate: editingDueDate || null,
//       });
//       setTodos(todos.map((t) => (t._id === id ? res.data : t)));
//       setEditingId(null);
//       setEditingText("");
//       setEditingPriority("Medium");
//       setEditingDueDate("");
//       setError("");
//     } catch (err) {
//       setError("Failed to update task");
//     }
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditingText("");
//     setEditingPriority("Medium");
//     setEditingDueDate("");
//   };

//   const isOverdue = (todo) => {
//     if (todo.completed) return false;
//     const now = new Date();
//     const createdDate = new Date(todo.createdAt);
//     if (todo.dueDate) {
//       const dueDateObj = new Date(todo.dueDate);
//       return dueDateObj < now;
//     }
//     const diffHours = (now - createdDate) / (1000 * 60 * 60);
//     return diffHours > 24;
//   };

//   const getPriorityStyles = (priority) => {
//     switch (priority) {
//       case "High": return "bg-red-500 text-white shadow-red-100";
//       case "Medium": return "bg-amber-400 text-black shadow-amber-100";
//       case "Low": return "bg-emerald-500 text-white shadow-emerald-100";
//       default: return "bg-gray-400 text-white";
//     }
//   };

//   const formatDueDate = (dueDate) => {
//     if (!dueDate) return null;
//     const date = new Date(dueDate);
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     if (date.toDateString() === today.toDateString()) return "Today";
//     if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/landing";
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !addingTodo) {
//       addTodo();
//     }
//   };

//   const handleEditKeyPress = (e, id) => {
//     if (e.key === "Enter") {
//       saveEdit(id);
//     } else if (e.key === "Escape") {
//       cancelEdit();
//     }
//   };

//   const priorityWeight = { High: 1, Medium: 2, Low: 3 };

//   const sortedTodos = [...todos].sort((a, b) => {
//     const aOverdue = isOverdue(a);
//     const bOverdue = isOverdue(b);
//     if (aOverdue && !bOverdue) return -1;
//     if (!aOverdue && bOverdue) return 1;
//     if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
//       return priorityWeight[a.priority] - priorityWeight[b.priority];
//     }
//     return new Date(a.createdAt) - new Date(b.createdAt);
//   });

//   return (
//     <div className="min-h-screen bg-[#F8F9FB] flex font-sans antialiased text-slate-800">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen p-6">
//         <div className="flex items-center gap-3 mb-10">
//           <div className="w-9 h-9 bg-[#F77B3A] rounded-xl flex items-center justify-center text-white font-black">T</div>
//           <span className="font-black text-lg tracking-tight">TaskMaster</span>
//         </div>
//         <nav className="space-y-1 flex-1">
//           <div className="flex items-center gap-3 px-4 py-3 bg-[#FFF0E8] text-[#F77B3A] rounded-xl font-bold text-sm">
//             <LayoutDashboard size={18} /> Dashboard
//           </div>
//           <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-600 rounded-xl font-bold text-sm transition cursor-not-allowed">
//             <BarChart3 size={18} /> Analytics
//           </div>
//           <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-600 rounded-xl font-bold text-sm transition cursor-not-allowed">
//             <ListTodo size={18} /> Projects
//           </div>
//         </nav>
//         <button onClick={logout} className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition">
//           <LogOut size={18} /> Logout
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden">
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
//           <div>
//             <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
//             <p className="text-slate-400 text-sm font-medium">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
//           </div>
//           <div className="flex items-center gap-4 w-full md:w-auto">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
//               <input type="text" placeholder="Search tasks..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/5 transition shadow-sm" />
//             </div>
//             <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 font-bold border border-indigo-100 uppercase">{userName[0]}</div>
//           </div>
//         </header>

//         <div className="grid lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-8">
//             <div className="bg-gradient-to-br from-[#FFECD8] to-[#FFD9B8] p-8 rounded-[2rem] relative overflow-hidden group">
//               <div className="relative z-10">
//                 <h2 className="text-xl font-black mb-2">Hi, {userName} 👋</h2>
//                 <p className="text-slate-600 text-sm max-w-xs leading-relaxed font-medium">
//                   You have <span className="font-bold text-slate-900">{todos.filter(t => !t.completed).length} tasks</span> pending today. Let's finish them!
//                 </p>
//               </div>
//               <Rocket size={100} className="absolute -right-4 -bottom-4 text-[#F77B3A] opacity-10 group-hover:translate-x-2 transition-transform duration-700" />
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
//                 <p className="text-2xl font-black">{todos.length}</p>
//               </div>
//               <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center text-emerald-600">
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Done</p>
//                 <p className="text-2xl font-black">{todos.filter(t => t.completed).length}</p>
//               </div>
//               <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center text-amber-500">
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending</p>
//                 <p className="text-2xl font-black">{todos.filter(t => !t.completed).length}</p>
//               </div>
//               <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center text-red-500">
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Due</p>
//                 <p className="text-2xl font-black">{todos.filter(t => isOverdue(t)).length}</p>
//               </div>
//             </div>

//             {/* Add Task Input */}
//             <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
//               <div className="flex gap-3">
//                 <input
//                   type="text"
//                   value={text}
//                   onChange={(e) => setText(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="What needs to be done?"
//                   className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium"
//                 />
//                 <button
//                   onClick={addTodo}
//                   disabled={addingTodo || !text.trim()}
//                   className="bg-[#F77B3A] hover:bg-[#e67a3f] text-white font-black px-8 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
//                 >
//                   <Plus size={20} />
//                   <span className="hidden sm:inline uppercase text-xs tracking-tighter">Add</span>
//                 </button>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm cursor-pointer">
//                   <option value="Low">🟢 Low Priority</option>
//                   <option value="Medium">🟡 Medium Priority</option>
//                   <option value="High">🔴 High Priority</option>
//                 </select>
//                 <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
//               </div>
//             </div>

//             {/* Todos List Area */}
//             <div className="space-y-4">
//               {loading ? (
//                 <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
//                   <Clock className="animate-spin text-slate-200 mx-auto mb-4" size={40} />
//                   <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Syncing tasks...</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {sortedTodos.map((todo) => (
//                     <div
//                       key={todo._id}
//                       className={`relative group flex items-center gap-4 p-5 bg-white rounded-[2rem] border transition-all duration-300 ${
//                         todo.completed ? "border-slate-100 opacity-60" : isOverdue(todo) ? "border-red-200 shadow-xl shadow-red-50" : "border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/50"
//                       }`}
//                     >
//                       <div className={`absolute -top-3 left-8 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border border-white ${getPriorityStyles(todo.priority)}`}>
//                         {todo.priority}
//                       </div>

//                       {isOverdue(todo) && !todo.completed && (
//                         <div className="absolute -top-3 right-8 px-3 py-0.5 bg-red-500 text-white rounded-full text-[9px] font-black uppercase tracking-tighter animate-pulse border border-white">
//                           ⚠️ DUE
//                         </div>
//                       )}

//                       <button onClick={() => toggleTodo(todo._id, todo.completed)} className="transition-all hover:scale-110 active:scale-90">
//                         {todo.completed ? <CircleCheck className="text-emerald-500" size={28} /> : <div className="w-7 h-7 rounded-full border-4 border-slate-100 group-hover:border-orange-100 transition-colors" />}
//                       </button>

//                       <div className="flex-1 min-w-0">
//                         {editingId === todo._id ? (
//                           <div className="space-y-3 p-2 bg-slate-50 rounded-2xl">
//                             <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} onKeyPress={(e) => handleEditKeyPress(e, todo._id)} className="w-full bg-white px-3 py-2 rounded-xl outline-none text-sm font-medium" autoFocus />
//                             <div className="flex gap-2">
//                               <select value={editingPriority} onChange={(e) => setEditingPriority(e.target.value)} className="flex-1 bg-white px-2 py-2 rounded-xl text-[11px] font-bold outline-none border border-slate-100">
//                                 <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
//                               </select>
//                               <input type="datetime-local" value={editingDueDate} onChange={(e) => setEditingDueDate(e.target.value)} className="flex-1 bg-white px-2 py-2 rounded-xl text-[11px] font-bold outline-none border border-slate-100" />
//                             </div>
//                             <div className="flex gap-2 justify-end px-2">
//                                 <button onClick={() => saveEdit(todo._id)} className="text-emerald-500 font-bold text-xs uppercase">Save</button>
//                                 <button onClick={cancelEdit} className="text-slate-400 font-bold text-xs uppercase">Cancel</button>
//                             </div>
//                           </div>
//                         ) : (
//                           <div>
//                             <p className={`text-lg font-bold leading-tight ${todo.completed ? "line-through text-slate-300" : "text-slate-800"}`}>{todo.text}</p>
//                             {todo.dueDate && (
//                               <div className={`flex items-center gap-1.5 mt-2 text-[10px] font-black uppercase tracking-tighter ${isOverdue(todo) && !todo.completed ? 'text-red-500' : 'text-slate-400'}`}>
//                                 <Calendar size={12} /> {formatDueDate(todo.dueDate)}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button onClick={() => !todo.completed && startEdit(todo._id, todo.text, todo.priority, todo.dueDate)} disabled={todo.completed} className={`p-2 rounded-xl transition ${todo.completed ? 'text-slate-200' : 'text-slate-400 hover:text-[#F77B3A] hover:bg-orange-50'}`}><Edit2 size={18}/></button>
//                         <button onClick={() => !todo.completed && deleteTodo(todo._id)} disabled={todo.completed} className={`p-2 rounded-xl transition ${todo.completed ? 'text-slate-200' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}><Trash2 size={18}/></button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Panel */}
//           <div className="space-y-8">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
//               <div className="w-20 h-20 bg-gradient-to-tr from-amber-200 to-[#F77B3A] rounded-[2rem] mx-auto mb-4 flex items-center justify-center text-white text-2xl font-black shadow-lg uppercase">
//                 {userName[0]}
//               </div>
//               <h4 className="font-black text-lg tracking-tight uppercase">{userName}</h4>
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Master Planner</p>
//               <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
//                 <div><p className="text-xl font-black">{todos.length}</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tasks</p></div>
//                 <div className="border-l border-slate-50"><p className="text-xl font-black">{todos.filter(t => t.completed).length}</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Achieved</p></div>
//               </div>
//             </div>

//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
//               <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex justify-between items-center">Ongoing <MoreVertical size={14}/></h4>
//               <div className="space-y-6">
//                 {sortedTodos.slice(0, 3).filter(t => !t.completed).map((t, i) => (
//                   <div key={i} className="flex gap-4 items-start">
//                     <div className={`w-2 h-2 rounded-full mt-1.5 ${t.priority === 'High' ? 'bg-red-400' : 'bg-amber-400'}`} />
//                     <div className="min-w-0">
//                       <p className="text-xs font-black text-slate-800 truncate">{t.text}</p>
//                       <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">{t.priority}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Dashboard;

import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LogOut,
  Plus,
  Trash2,
  Check,
  CircleCheck,
  Clock,
  AlertCircle,
  Edit2,
  CheckCircle,
  Calendar,
  AlertTriangle,
  LayoutDashboard,
  BarChart3,
  ListTodo,
  Search,
  ChevronDown,
  Rocket, 
  MoreVertical,
  Menu, // Hamburger icon
  X     // Close icon
} from "lucide-react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load todos on mount
  useEffect(() => {
    loadTodos();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserName(decoded.name || "User");
      } catch (e) {
        console.log("Could not decode token");
      }
    }
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const res = await API.get("/todos");
      setTodos(res.data);
      setError("");
    } catch (err) {
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
    } catch (err) {
      setError("Failed to add task");
    } finally {
      setAddingTodo(false);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await API.put(`/todos/${id}`, { completed: !completed });
      setTodos(
        todos.map((t) => (t._id === id ? { ...t, completed: !completed } : t))
      );
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
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
    } catch (err) {
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
    const createdDate = new Date(todo.createdAt);
    if (todo.dueDate) {
      const dueDateObj = new Date(todo.dueDate);
      return dueDateObj < now;
    }
    const diffHours = (now - createdDate) / (1000 * 60 * 60);
    return diffHours > 24;
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High": return "bg-red-500 text-white shadow-red-100";
      case "Medium": return "bg-amber-400 text-black shadow-amber-100";
      case "Low": return "bg-emerald-500 text-white shadow-emerald-100";
      default: return "bg-gray-400 text-white";
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/landing";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !addingTodo) {
      addTodo();
    }
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === "Enter") {
      saveEdit(id);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const priorityWeight = { High: 1, Medium: 2, Low: 3 };

  const sortedTodos = [...todos].sort((a, b) => {
    const aOverdue = isOverdue(a);
    const bOverdue = isOverdue(b);
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans antialiased text-slate-800 relative">
      
      {/* ── MOBILE OVERLAY ── */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 p-6 flex flex-col h-screen
        transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between mb-10 lg:justify-start lg:gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#F77B3A] rounded-xl flex items-center justify-center text-white font-black">T</div>
            <span className="font-black text-lg tracking-tight">TaskMaster</span>
          </div>
          {/* Close Button For Mobile */}
          <button className="lg:hidden p-1 text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="space-y-1 flex-1">
          <div className="flex items-center gap-3 px-4 py-3 bg-[#FFF0E8] text-[#F77B3A] rounded-xl font-bold text-sm">
            <LayoutDashboard size={18} /> Dashboard
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-600 rounded-xl font-bold text-sm transition cursor-not-allowed">
            <BarChart3 size={18} /> Analytics
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-600 rounded-xl font-bold text-sm transition cursor-not-allowed">
            <ListTodo size={18} /> Projects
          </div>
        </nav>
        <button onClick={logout} className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden min-w-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button For Mobile */}
            <button 
              className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24}/>
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
              <p className="text-slate-400 text-sm font-medium hidden sm:block">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Search tasks..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/5 transition shadow-sm" />
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 font-bold border border-indigo-100 uppercase">{userName[0]}</div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-[#FFECD8] to-[#FFD9B8] p-8 rounded-[2rem] relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-xl font-black mb-2">Hi, {userName} 👋</h2>
                <p className="text-slate-600 text-sm max-w-xs leading-relaxed font-medium">
                  You have <span className="font-bold text-slate-900">{todos.filter(t => !t.completed).length} tasks</span> pending today. Let's finish them!
                </p>
              </div>
              <Rocket size={100} className="absolute -right-4 -bottom-4 text-[#F77B3A] opacity-10 group-hover:translate-x-2 transition-transform duration-700" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                <p className="text-2xl font-black">{todos.length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center text-emerald-600">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Done</p>
                <p className="text-2xl font-black">{todos.filter(t => t.completed).length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center text-amber-500">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending</p>
                <p className="text-2xl font-black">{todos.filter(t => !t.completed).length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center text-red-500">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Due</p>
                <p className="text-2xl font-black">{todos.filter(t => isOverdue(t)).length}</p>
              </div>
            </div>

            {/* Add Task Input */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What needs to be done?"
                  className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium"
                />
                <button
                  onClick={addTodo}
                  disabled={addingTodo || !text.trim()}
                  className="bg-[#F77B3A] hover:bg-[#e67a3f] text-white font-black px-8 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline uppercase text-xs tracking-tighter">Add</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm cursor-pointer">
                  <option value="Low">🟢 Low Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="High">🔴 High Priority</option>
                </select>
                <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
              </div>
            </div>

            {/* Todos List Area */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <Clock className="animate-spin text-slate-200 mx-auto mb-4" size={40} />
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Syncing tasks...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedTodos.map((todo) => (
                    <div
                      key={todo._id}
                      className={`relative group flex items-center gap-4 p-5 bg-white rounded-[2rem] border transition-all duration-300 ${
                        todo.completed ? "border-slate-100 opacity-60" : isOverdue(todo) ? "border-red-200 shadow-xl shadow-red-50" : "border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/50"
                      }`}
                    >
                      <div className={`absolute -top-3 left-8 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border border-white ${getPriorityStyles(todo.priority)}`}>
                        {todo.priority}
                      </div>

                      {isOverdue(todo) && !todo.completed && (
                        <div className="absolute -top-3 right-8 px-3 py-0.5 bg-red-500 text-white rounded-full text-[9px] font-black uppercase tracking-tighter animate-pulse border border-white">
                          ⚠️ DUE
                        </div>
                      )}

                      <button onClick={() => toggleTodo(todo._id, todo.completed)} className="transition-all hover:scale-110 active:scale-90">
                        {todo.completed ? <CircleCheck className="text-emerald-500" size={28} /> : <div className="w-7 h-7 rounded-full border-4 border-slate-100 group-hover:border-orange-100 transition-colors" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        {editingId === todo._id ? (
                          <div className="space-y-3 p-2 bg-slate-50 rounded-2xl">
                            <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} onKeyPress={(e) => handleEditKeyPress(e, todo._id)} className="w-full bg-white px-3 py-2 rounded-xl outline-none text-sm font-medium" autoFocus />
                            <div className="flex gap-2">
                              <select value={editingPriority} onChange={(e) => setEditingPriority(e.target.value)} className="flex-1 bg-white px-2 py-2 rounded-xl text-[11px] font-bold outline-none border border-slate-100">
                                <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                              </select>
                              <input type="datetime-local" value={editingDueDate} onChange={(e) => setEditingDueDate(e.target.value)} className="flex-1 bg-white px-2 py-2 rounded-xl text-[11px] font-bold outline-none border border-slate-100" />
                            </div>
                            <div className="flex gap-2 justify-end px-2">
                                <button onClick={() => saveEdit(todo._id)} className="text-emerald-500 font-bold text-xs uppercase">Save</button>
                                <button onClick={cancelEdit} className="text-slate-400 font-bold text-xs uppercase">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className={`text-lg font-bold leading-tight ${todo.completed ? "line-through text-slate-300" : "text-slate-800"}`}>{todo.text}</p>
                            {todo.dueDate && (
                              <div className={`flex items-center gap-1.5 mt-2 text-[10px] font-black uppercase tracking-tighter ${isOverdue(todo) && !todo.completed ? 'text-red-500' : 'text-slate-400'}`}>
                                <Calendar size={12} /> {formatDueDate(todo.dueDate)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => !todo.completed && startEdit(todo._id, todo.text, todo.priority, todo.dueDate)} disabled={todo.completed} className={`p-2 rounded-xl transition ${todo.completed ? 'text-slate-200' : 'text-slate-400 hover:text-[#F77B3A] hover:bg-orange-50'}`}><Edit2 size={18}/></button>
                        <button onClick={() => !todo.completed && deleteTodo(todo._id)} disabled={todo.completed} className={`p-2 rounded-xl transition ${todo.completed ? 'text-slate-200' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}><Trash2 size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-200 to-[#F77B3A] rounded-[2rem] mx-auto mb-4 flex items-center justify-center text-white text-2xl font-black shadow-lg uppercase">
                {userName[0]}
              </div>
              <h4 className="font-black text-lg tracking-tight uppercase">{userName}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Master Planner</p>
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                <div><p className="text-xl font-black">{todos.length}</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tasks</p></div>
                <div className="border-l border-slate-50"><p className="text-xl font-black">{todos.filter(t => t.completed).length}</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Achieved</p></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex justify-between items-center">Ongoing <MoreVertical size={14}/></h4>
              <div className="space-y-6">
                {sortedTodos.slice(0, 3).filter(t => !t.completed).map((t, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${t.priority === 'High' ? 'bg-red-400' : 'bg-amber-400'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{t.text}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">{t.priority}</p>
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