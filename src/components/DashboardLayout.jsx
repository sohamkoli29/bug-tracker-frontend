import { useEffect, useContext } from 'react';
import { Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import ProjectSelector from './ProjectSelector';
import ProjectContext from '../context/ProjectContext';

function DashboardLayout({ children, showProjectSelector = false, currentProjectId = null }) {
  const { getProjects } = useContext(ProjectContext);

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            {/* Left: Project Selector or Search */}
            <div className="flex items-center gap-4 flex-1">
              {showProjectSelector && currentProjectId ? (
                <ProjectSelector currentProjectId={currentProjectId} />
              ) : (
                <div className="hidden md:block relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Right: Notifications */}
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 pb-20 lg:pb-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;