import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, UserPlus, AlertCircle, CheckCircle, ChevronLeft, Eye, EyeOff } from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    
    try {
      await API.post("/auth/register", { name, email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans antialiased text-slate-900 relative overflow-hidden flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      {/* Decorative Background Blobs (Matching Landing & Login) */}
      <div className="absolute top-0 right-0 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-orange-100/50 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[350px] h-[300px] sm:h-[350px] bg-indigo-100/40 rounded-full blur-[80px] -z-10 -translate-x-1/4 translate-y-1/4"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link to="/landing" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors mb-6 text-sm font-semibold group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Register Card */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex w-16 h-16 bg-orange-500 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-orange-200">
              <UserPlus className="text-white" size={30} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Create Account</h1>
            <p className="text-slate-400 mt-2 font-medium text-sm sm:text-base">Join TaskMaster AI today</p>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-green-700 text-sm font-bold">Account created!</p>
                <p className="text-green-600 text-xs font-medium">Redirecting to login...</p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Baldev Aggarwal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-slate-800 placeholder:text-slate-300 font-medium text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-slate-800 placeholder:text-slate-300 font-medium text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-4 pr-12 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-slate-800 placeholder:text-slate-300 font-medium text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors flex-shrink-0"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 sm:py-4 rounded-2xl transition-all shadow-xl shadow-orange-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 font-medium text-sm">Already have an account? <Link to="/login" className="text-orange-500 hover:text-orange-600 font-bold">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;