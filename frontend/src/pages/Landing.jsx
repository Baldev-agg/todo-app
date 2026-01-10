import { Link } from "react-router-dom";
import { CheckCircle, Zap, Lock, BarChart3, LogIn, UserPlus, ArrowRight } from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-white" size={32} />
          <h1 className="text-2xl font-bold text-white">TaskMaster Ai</h1>
        </div>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="flex items-center gap-2 bg-white/20 backdrop-blur hover:bg-white/30 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
          >
            <LogIn size={18} />
            Sign In
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-2 bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-lg transition duration-200"
          >
            <UserPlus size={18} />
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Stay Organized, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Stay Productive</span>
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Manage your tasks effortlessly with our modern, intuitive task manager. Keep track of what matters, complete your goals, and achieve more every day.
            </p>
            <div className="flex gap-4 mb-12">
              <Link
                to="/register"
                className="flex items-center gap-2 bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-white/20 backdrop-blur hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-lg transition duration-200 border border-white/30"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <p className="text-purple-200 text-sm">Active Users</p>
              </div>
              <div>
                <div className="text-3xl font-bold">100K+</div>
                <p className="text-purple-200 text-sm">Tasks Completed</p>
              </div>
              <div>
                <div className="text-3xl font-bold">99%</div>
                <p className="text-purple-200 text-sm">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl blur-3xl opacity-30"></div>
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="space-y-4">
                {[
                  { title: "Complete Project Proposal", done: true },
                  { title: "Review Client Feedback", done: false },
                  { title: "Prepare Presentation", done: true },
                  { title: "Schedule Meeting", done: false },
                ].map((task, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      task.done ? "bg-green-400 border-green-400" : "border-white/50"
                    }`}>
                      {task.done && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <span className={task.done ? "line-through text-white/50" : "text-white"}>{task.title}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-purple-200 text-sm">2 of 4 tasks completed today</p>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full" style={{ width: "50%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/5 backdrop-blur border-t border-white/10 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">Why Choose TaskMaster?</h3>
            <p className="text-xl text-purple-200">Everything you need to manage your tasks effectively</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 hover:border-white/40 transition">
              <div className="inline-block bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg p-3 mb-4">
                <Zap className="text-white" size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Lightning Fast</h4>
              <p className="text-purple-200">
                Create, update, and manage tasks in milliseconds with our optimized performance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 hover:border-white/40 transition">
              <div className="inline-block bg-gradient-to-br from-pink-400 to-red-500 rounded-lg p-3 mb-4">
                <Lock className="text-white" size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Secure & Private</h4>
              <p className="text-purple-200">
                Your data is encrypted and only accessible to you. We take privacy seriously.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 hover:border-white/40 transition">
              <div className="inline-block bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg p-3 mb-4">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Smart Analytics</h4>
              <p className="text-purple-200">
                Track your productivity with detailed insights and completion statistics.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 hover:border-white/40 transition">
              <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-3 mb-4">
                <CheckCircle className="text-white" size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Easy to Use</h4>
              <p className="text-purple-200">
                Intuitive interface designed for everyone. No learning curve needed.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 hover:border-white/40 transition">
              <div className="inline-block bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg p-3 mb-4">
                <Zap className="text-white" size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Cloud Sync</h4>
              <p className="text-purple-200">
                Access your tasks from anywhere, anytime. Automatic sync across all devices.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 hover:border-white/40 transition">
              <div className="inline-block bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg p-3 mb-4">
                <CheckCircle className="text-white" size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">100% Free</h4>
              <p className="text-purple-200">
                All features are completely free. No hidden charges or premium plans.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur rounded-3xl p-12 border border-white/20 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of users managing their tasks efficiently with TaskMaster
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-purple-600 hover:bg-gray-100 font-semibold px-10 py-4 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Create Free Account Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-purple-200 text-sm">
          <p>&copy; 2026 TaskMaster Ai. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
