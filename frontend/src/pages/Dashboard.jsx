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

  // Load todos on mount
  useEffect(() => {
    loadTodos();
    // Try to get user name from localStorage (you can decode JWT if needed)
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
        todos.map((t) => (t._id === id ? { ...t, completed: !completed } : t)),
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

  // Helper function to check if todo is overdue (>24 hours old OR past due date)
  const isOverdue = (todo) => {
    if (todo.completed) return false;

    // If dueDate is set, check if it's in the past
    if (todo.dueDate) {
      const dueDate = new Date(todo.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate < today;
    }

    // Otherwise, check if created more than 24 hours ago
    const createdDate = new Date(todo.createdAt);
    const now = new Date();
    const hoursDifference = (now - createdDate) / (1000 * 60 * 60);
    return hoursDifference >= 24;
  };

  // Helper function to get priority badge styling
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-yellow-400 text-black";
      case "Low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  // Helper function to get priority dot color
  const getPriorityDotColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-600";
      case "Medium":
        return "bg-yellow-400";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  // Helper function to format due date
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

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log(
        "Logout endpoint error (proceeding with client-side logout):",
        error.message,
      );
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/landing";
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const overdueCount = todos.filter((t) => isOverdue(t)).length;

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

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              👋 Welcome, {userName}!
            </h1>
            <p className="text-purple-100 text-lg">Let's organize your day</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">
              Total Tasks
            </div>
            <div className="text-3xl font-bold text-white mt-2">
              {totalCount}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Completed</div>
            <div className="text-3xl font-bold text-green-400 mt-2">
              {completedCount}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Remaining</div>
            <div className="text-3xl font-bold text-yellow-400 mt-2">
              {totalCount - completedCount}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Overdue</div>
            <div className="text-3xl font-bold text-red-400 mt-2">
              {overdueCount}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle
                className="text-red-500 flex-shrink-0 mt-0.5"
                size={20}
              />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Add Todo Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Add New Task
            </label>
            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What needs to be done?"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
                <button
                  onClick={addTodo}
                  disabled={addingTodo || !text.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2 transform hover:scale-105 whitespace-nowrap"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>

              {/* Priority and Due Date Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  >
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="High">🔴 High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Todos List */}
          {loading ? (
            <div className="text-center py-12">
              <Clock className="inline text-gray-400 mb-3" size={48} />
              <p className="text-gray-500 mt-4">Loading your tasks...</p>
            </div>
          ) : totalCount === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block bg-purple-100 rounded-full p-4 mb-4">
                <Check className="text-purple-600" size={48} />
              </div>
              <p className="text-gray-500 text-lg">
                No tasks yet! Add one to get started 🎉
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className={`relative flex items-center gap-4 p-5 mt-5 rounded-2xl border-2 transition-all duration-300 ${
                    todo.completed
                      ? "bg-gray-50 border-gray-200 opacity-60"
                      : isOverdue(todo)
                        ? "bg-red-50 border-red-500 shadow-lg" // Due hone par Red border aur Red background
                        : "bg-white border-purple-100 hover:border-purple-300 shadow-sm"
                  }`}
                >
                  {/* Priority Dot Indicator - Left side */}
                  {/* <div
                    className={`flex-shrink-0 w-4 h-4 rounded-full shadow-lg ${getPriorityDotColor(
                      todo.priority,
                    )}`}
                    title={`Priority: ${todo.priority}`}
                  /> */}

                  {/* Overdue Badge - Top Right */}
                  {isOverdue(todo) && (
                    <div
                      className="absolute -top-3 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-600 text-white shadow-lg animate-pulse border border-red-800"
                      style={{ zIndex: 20 }}
                    >
                      <AlertTriangle size={12} fill="white" />
                      DUE
                    </div>
                  )}

                  {/* Priority Badge - Top Left */}
                  <div
                    className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md border ${getPriorityStyles(todo.priority)}`}
                    style={{ zIndex: 10 }}
                  >
                    {todo.priority}
                  </div>

                  {/* Priority Dot Indicator - Right side */}
                  {/* <div>
                    {todo.priority === "High" && "🔴"}
                    {todo.priority === "Medium" && "🟡"}
                    {todo.priority === "Low" && "🟢"}
                  </div> */}

                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo._id, todo.completed)}
                    className="flex-shrink-0 transition duration-200"
                    title="Mark as done"
                  >
                    {todo.completed ? (
                      <CircleCheck className="text-green-500" size={24} />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-400 rounded-full hover:border-purple-500 transition hover:scale-110" />
                    )}
                  </button>

                  {/* Task Text and Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === todo._id ? (
                      <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyPress={(e) => handleEditKeyPress(e, todo._id)}
                          autoFocus
                          className="w-full px-3 py-2 border border-purple-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <select
                            value={editingPriority}
                            onChange={(e) => setEditingPriority(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          >
                            <option value="Low">🟢 Low</option>
                            <option value="Medium">🟡 Medium</option>
                            <option value="High">🔴 High</option>
                          </select>
                          <input
                            type="date"
                            value={editingDueDate}
                            onChange={(e) => setEditingDueDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span
                          className={`block text-lg transition duration-200 ${
                            todo.completed
                              ? "line-through text-gray-400"
                              : "text-gray-800 font-medium"
                          }`}
                        >
                          {todo.text}
                        </span>
                        {todo.dueDate && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
                            <Calendar size={14} />
                            <span>Due: {formatDueDate(todo.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {editingId === todo._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(todo._id)}
                          className="flex-shrink-0 text-green-500 hover:text-green-700 hover:bg-green-50 p-2 rounded-lg transition duration-200"
                          title="Save (Enter)"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-shrink-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition duration-200"
                          title="Cancel (Esc)"
                        >
                          <Trash2 size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            startEdit(
                              todo._id,
                              todo.text,
                              todo.priority,
                              todo.dueDate,
                            )
                          }
                          className="flex-shrink-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition duration-200"
                          title="Edit"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo._id)}
                          className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition duration-200"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-100 text-sm">
          <p>Stay focused and productive with your task manager 🚀</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
