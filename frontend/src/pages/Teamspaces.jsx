import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { 
  Building2, Plus, ArrowRight, X, Clock, AlertCircle,
  Search, UserPlus, Mail, CheckCircle, ChevronDown
} from "lucide-react";

function Teamspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
  
  // Create Workspace Modal States
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  // Invite Modal States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeWsId, setActiveWsId] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState("");

  useEffect(() => {
    fetchWorkspaces();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserName(decoded.name || "User");
      } catch (e) {}
    }
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await API.get("/workspaces");
      setWorkspaces(res.data);
    } catch (err) {
      setError("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    
    try {
      const res = await API.post("/workspaces", {
        name: newName,
        description: newDesc
      });
      setWorkspaces([...workspaces, { 
        _id: res.data.workspace._id, 
        name: res.data.workspace.name, 
        description: res.data.workspace.description || "", 
        myRole: "Owner" 
      }]);
      setShowModal(false);
      setNewName("");
      setNewDesc("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create workspace");
    } finally {
      setCreating(false);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setError("");
    setInviteSuccess("");

    try {
      await API.post(`/workspaces/${activeWsId}/invite`, {
        email: inviteEmail,
        role: inviteRole
      });
      setInviteSuccess(`Invitation sent to ${inviteEmail}!`);
      setInviteEmail("");
      setInviteRole("Member");
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const openInviteModal = (wsId) => {
    setActiveWsId(wsId);
    setShowInviteModal(true);
    setError("");
    setInviteSuccess("");
  };

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center gap-3 mb-8 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight truncate dark:text-white">Teamspaces</h1>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Manage your teamspaces and collaborations</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-1 justify-end max-w-xs">
          <div className="w-9 h-9 flex-shrink-0 bg-indigo-50 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-500 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-800 uppercase text-sm">
            {userName[0]}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#F77B3A] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e66a29] transition shadow-lg shadow-orange-100 dark:shadow-orange-900/20"
          >
            <Plus size={18} /> New teamspace
          </button>
        </div>

        {/* Workspace List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <div className="col-span-5 md:col-span-4">Name</div>
            <div className="col-span-3 hidden md:block">Description</div>
            <div className="col-span-2 hidden md:block text-center">My Role</div>
            <div className="col-span-7 md:col-span-3 text-center">Actions</div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 dark:text-slate-500">
              <Clock className="animate-spin mx-auto mb-3" size={32} />
              <p className="font-bold text-sm">Loading your spaces...</p>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="py-20 text-center text-slate-400 dark:text-slate-500">
              <Building2 className="mx-auto mb-3 opacity-50" size={48} />
              <p className="font-bold text-sm">You are not part of any teamspace yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {workspaces.map((ws) => (
                <div key={ws._id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                  <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900 text-orange-500 dark:text-orange-300 flex items-center justify-center font-black uppercase shrink-0">
                      {ws.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white">{ws.name}</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 md:hidden truncate">{ws.description}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-3 hidden md:block text-sm text-slate-500 dark:text-slate-400 truncate">
                    {ws.description || "No description"}
                  </div>

                  <div className="col-span-2 hidden md:flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ws.myRole === 'Owner' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 
                      ws.myRole === 'Admin' ? 'bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {ws.myRole}
                    </span>
                  </div>

                  <div className="col-span-7 md:col-span-3 flex justify-center items-center gap-3">
                    {/* Invite Button (Only visible for Owner/Admin) */}
                    {(ws.myRole === 'Owner' || ws.myRole === 'Admin') && (
                      <button 
                        onClick={() => openInviteModal(ws._id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 text-xs font-bold transition"
                      >
                        <UserPlus size={14} /> <span className="hidden sm:inline">Invite</span>
                      </button>
                    )}

                    <Link to={`/teamspace/${ws._id}`} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-orange-50 dark:hover:bg-orange-900 hover:text-orange-500 dark:hover:text-orange-300 transition">
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE WORKSPACE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Create Teamspace</h2>
            {error && <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 text-xs font-bold rounded-xl flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}

            <form onSubmit={handleCreateWorkspace} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Workspace Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Engineering HQ" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none transition font-medium dark:text-white dark:placeholder-slate-400" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Description (Optional)</label>
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="What is this workspace for?" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none transition font-medium resize-none h-24 dark:text-white dark:placeholder-slate-400" />
              </div>
              <button type="submit" disabled={creating || !newName.trim()} className="w-full py-4 bg-[#F77B3A] text-white rounded-xl font-black hover:bg-[#e66a29] transition disabled:opacity-50 mt-4">
                {creating ? "Creating..." : "Create Teamspace"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INVITE MEMBER MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowInviteModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Invite People</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">Send an email invitation to join this workspace.</p>
            
            {error && <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 text-xs font-bold rounded-xl flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}
            {inviteSuccess && <div className="p-3 mb-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2"><CheckCircle size={16}/>{inviteSuccess}</div>}

            <form onSubmit={handleSendInvite} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                  <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@example.com" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition font-medium dark:text-white dark:placeholder-slate-400" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Assign Role</label>
                <div className="relative">
                  <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition font-medium appearance-none cursor-pointer dark:text-white">
                    <option value="Admin">Admin (Can edit settings & invite)</option>
                    <option value="Member">Member (Can edit tasks)</option>
                    <option value="Viewer">Viewer (Read-only access)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
                </div>
              </div>
              <button type="submit" disabled={inviting || !inviteEmail.trim()} className="w-full py-4 bg-indigo-600 dark:bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 dark:hover:bg-indigo-700 transition disabled:opacity-50 mt-4 flex items-center justify-center gap-2">
                {inviting ? "Sending..." : <><Mail size={18} /> Send Invitation</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Teamspaces;