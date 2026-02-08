import { useEffect, useContext } from 'react';

import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import ProjectSelector from './ProjectSelector';
import ProjectContext from '../context/ProjectContext';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';
function DashboardLayout({ children, showProjectSelector = false, currentProjectId = null }) {
  const { getProjects } = useContext(ProjectContext);

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content with margin to account for fixed sidebar */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            {/* Left: Project Selector or Search */}
            <div className="flex items-center gap-4 flex-1">
              {showProjectSelector && currentProjectId ? (
                <ProjectSelector currentProjectId={currentProjectId} />
              ) : (
                <GlobalSearch />
              )}
            </div>

            {/* Right: Notifications */}
            <div className="flex items-center gap-3">
              <NotificationDropdown />
              
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