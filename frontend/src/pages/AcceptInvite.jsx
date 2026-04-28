import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Verifying your invitation...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid invitation link. No token found.");
      return;
    }

    const checkToken = async () => {
      const authToken = localStorage.getItem("token");
      
      // Agar user logged in nahi hai, toh usey login pe bhejo
      // URL mein se original intent store kar lo
      if (!authToken) {
        localStorage.setItem("redirectAfterLogin", `/invite/accept?token=${token}`);
        navigate("/login");
        return;
      }

      try {
        const res = await API.post(`/workspaces/accept-invite/${token}`);
        setStatus("success");
        setMessage(res.data.message || "You have successfully joined the workspace!");
        
        // 3 second baad teamspaces page par bhej do
        setTimeout(() => {
          navigate("/teamspaces");
        }, 3000);

      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Failed to accept invitation. It might be expired or invalid.");
      }
    };

    checkToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white max-w-md w-full rounded-[2.5rem] p-10 shadow-2xl text-center relative overflow-hidden border border-slate-100">
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#F77B3A]"></div>

        <div className="mb-6 flex justify-center">
          {status === "loading" && (
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
              <Loader2 className="text-indigo-500 animate-spin" size={40} />
            </div>
          )}
          {status === "success" && (
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle className="text-emerald-500" size={40} />
            </div>
          )}
          {status === "error" && (
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="text-red-500" size={40} />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-3">
          {status === "loading" ? "Joining Workspace..." : status === "success" ? "Welcome Aboard!" : "Oops!"}
        </h2>
        
        <p className="text-slate-500 font-medium leading-relaxed mb-8">
          {message}
        </p>

        {status === "error" && (
          <button 
            onClick={() => navigate("/teamspaces")}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
          >
            Go to Library
          </button>
        )}
      </div>
    </div>
  );
}

export default AcceptInvite;