import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Navbar/>

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