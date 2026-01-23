import { useEffect, useState } from "react";
import API from "../services/api";
import { LogOut, Plus, Trash2, Check, CircleCheck, Clock, AlertCircle, Edit2, CheckCircle } from "lucide-react";

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
  const [addingTodo, setAddingTodo] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

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
      const res = await API.post("/todos", { text });
      setTodos([...todos, res.data]);
      setText("");
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
      setTodos(todos.map((t) => (t._id === id ? { ...t, completed: !completed } : t)));
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

  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) {
      setError("Task text cannot be empty");
      return;
    }
    try {
      const res = await API.put(`/todos/${id}`, { text: editingText.trim() });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditingText("");
      setError("");
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await API.post("/auth/logout");
    } catch (error) {
      // 404 or other errors on logout endpoint - still proceed with client-side logout
      console.log("Logout endpoint error (proceeding with client-side logout):", error.message);
    } finally {
      // Always clear token and redirect
      localStorage.removeItem("token");
      window.location.href = "/landing";
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

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
    <div className="min-h-screen py-8 px-4" 
         style={{
           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
         }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">👋 Welcome, {userName}!</h1>
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Total Tasks</div>
            <div className="text-3xl font-bold text-white mt-2">{totalCount}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Completed</div>
            <div className="text-3xl font-bold text-green-400 mt-2">{completedCount}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Remaining</div>
            <div className="text-3xl font-bold text-yellow-400 mt-2">{totalCount - completedCount}</div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Add Todo Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Add New Task</label>
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
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add</span>
              </button>
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
              <p className="text-gray-500 text-lg">No tasks yet! Add one to get started 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition duration-200 ${
                    todo.completed
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-purple-200 hover:border-purple-400"
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo._id, todo.completed)}
                    className="flex-shrink-0"
                  >
                    {todo.completed ? (
                      <CircleCheck className="text-green-500" size={24} />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full hover:border-purple-500 transition" />
                    )}
                  </button>

                  {editingId === todo._id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => handleEditKeyPress(e, todo._id)}
                      autoFocus
                      className="flex-1 px-3 py-2 border border-purple-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    />
                  ) : (
                    <span
                      className={`flex-1 text-lg transition duration-200 ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800 font-medium"
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
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
                          onClick={() => startEdit(todo._id, todo.text)}
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
