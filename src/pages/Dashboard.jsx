import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BugTracker
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Welcome, {user?.name}! 🎉
          </h2>
          <p className="text-slate-600 mb-6">
            Day 2 Complete - Authentication is working!
          </p>
          <div className="flex gap-4 justify-center">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              ✅ JWT Authentication
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              ✅ Protected Routes
            </div>
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
              ✅ User Context
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;