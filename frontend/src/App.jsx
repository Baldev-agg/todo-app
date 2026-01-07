import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setTodos(res.data);
    } catch (error) {
      console.error("Error loading todos:", error);
    }
    setLoading(false);
  };

  const addTodo = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(API, { text });
      setText("");
      loadTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const markDone = async (id) => {
    try {
      await axios.put(`${API}/${id}`);
      loadTodos();
    } catch (error) {
      console.error("Error marking todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      loadTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #faf5ff 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            ✨ My Tasks
          </h1>
          <p className="text-gray-600 text-lg">Stay organized and productive</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95 border border-purple-100">
          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="px-6 pt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm font-bold text-purple-600">
                  {completedCount}/{totalCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(completedCount / totalCount) * 100}%`,
                    background:
                      "linear-gradient(90deg, #3b82f6 0%, #9333ea 100%)",
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Input Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400"
                placeholder="Add a new task..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={addTodo}
                className="px-6 py-3 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)",
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div className="p-6">
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">⏳</div>
                <p className="text-gray-600 mt-2">Loading tasks...</p>
              </div>
            )}

            {!loading && todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-gray-500 text-lg">
                  No tasks yet. Add one to get started!
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo, index) => (
                  <li
                    key={todo._id}
                    className={`group p-4 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                      todo.completed
                        ? "bg-gray-50 border border-gray-100"
                        : "border border-blue-100 hover:shadow-md"
                    }`}
                    style={
                      !todo.completed
                        ? {
                            background:
                              "linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%)",
                          }
                        : {}
                    }
                  >
                    <span className="text-gray-400 font-semibold w-6">
                      {index + 1}.
                    </span>
                    <span
                      className={`flex-1 text-lg transition-all ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800 font-medium"
                      }`}
                    >
                      {todo.text}
                    </span>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!todo.completed && (
                        <button
                          onClick={() => markDone(todo._id)}
                          className="px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                        >
                          ✓ Done
                        </button>
                      )}
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
                      >
                        🗑 Delete
                      </button>
                    </div>

                    {todo.completed && <span className="text-2xl">✅</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Stats Footer */}
          {totalCount > 0 && (
            <div
              className="px-6 py-4 border-t border-gray-100 flex justify-around text-center"
              style={{
                background: "linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%)",
              }}
            >
              <div>
                <p className="text-gray-600 text-sm">Total</p>
                <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedCount}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Remaining</p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalCount - completedCount}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>💪 Keep pushing forward! You're doing great!</p>
        </div>
      </div>
    </div>
  );
}

export default App;
