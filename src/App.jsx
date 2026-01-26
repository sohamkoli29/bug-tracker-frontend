import { BrowserRouter as Router } from 'react-router-dom';
import { Bell, Search, Plus, ChevronDown, LayoutDashboard, FolderKanban, Users, Settings, Bug } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        {/* Top Navigation */}
        <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                  <Bug className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    BugTracker
                  </h1>
                  <p className="text-xs text-slate-500">Project Management</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search issues, projects, or team members..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <button className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
                
                <div className="h-8 w-px bg-slate-200"></div>
                
                <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                    JD
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-slate-700">John Doe</p>
                    <p className="text-xs text-slate-500">Developer</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex max-w-[1400px] mx-auto">
          {/* Sidebar */}
          <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white/60 backdrop-blur-sm border-r border-slate-200/60 p-4">
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 mb-6">
              <Plus className="w-5 h-5" />
              New Issue
            </button>

            <nav className="space-y-1">
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-xl font-medium transition-all">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <FolderKanban className="w-5 h-5" />
                Projects
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <Bug className="w-5 h-5" />
                All Issues
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <Users className="w-5 h-5" />
                Team
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <Settings className="w-5 h-5" />
                Settings
              </a>
            </nav>

            <div className="mt-8 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/50">
              <h3 className="font-semibold text-sm text-slate-800 mb-2">💡 Pro Tip</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use keyboard shortcuts to navigate faster. Press <kbd className="px-1.5 py-0.5 bg-white rounded text-xs border">?</kbd> to see all shortcuts
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-600">Total Issues</p>
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Bug className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">847</h3>
                <p className="text-xs text-green-600 mt-2">↑ 12% from last week</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-600">In Progress</p>
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">124</h3>
                <p className="text-xs text-slate-500 mt-2">23 updated today</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">623</h3>
                <p className="text-xs text-green-600 mt-2">↑ 8% completion rate</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-600">High Priority</p>
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 19h20L12 2zm0 4.5l7 12H5l7-12z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">37</h3>
                <p className="text-xs text-orange-600 mt-2">Needs attention</p>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl shadow-blue-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Welcome to BugTracker! 🎉
                </h2>
                <p className="text-blue-100 mb-6 max-w-2xl leading-relaxed">
                  Day 1 Setup Complete - Your modern project management platform is ready to use. Start tracking issues, managing projects, and collaborating with your team.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-3 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium text-sm">React + Tailwind</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-3 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium text-sm">Express Server</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-3 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium text-sm">MongoDB Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-800 mb-4">🚀 Quick Start</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Create your first project</p>
                      <p className="text-xs text-slate-500 mt-0.5">Organize your work into projects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Invite team members</p>
                      <p className="text-xs text-slate-500 mt-0.5">Collaborate with your team</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Track your first issue</p>
                      <p className="text-xs text-slate-500 mt-0.5">Start managing bugs and tasks</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-800 mb-4">📈 Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-slate-600">System initialized successfully</p>
                    <span className="ml-auto text-xs text-slate-400">Just now</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-slate-600">Database connected</p>
                    <span className="ml-auto text-xs text-slate-400">1m ago</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <p className="text-sm text-slate-600">Frontend ready</p>
                    <span className="ml-auto text-xs text-slate-400">2m ago</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;