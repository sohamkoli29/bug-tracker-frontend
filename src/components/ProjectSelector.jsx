import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Plus } from 'lucide-react';
import ProjectContext from '../context/ProjectContext';

function ProjectSelector({ currentProjectId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { projects, currentProject } = useContext(ProjectContext);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProjectSelect = (projectId) => {
    navigate(`/projects/${projectId}`);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all w-full max-w-xs"
      >
        {currentProject ? (
          <>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: `${currentProject.color}20` }}
            >
              {currentProject.icon}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {currentProject.title}
              </p>
              <p className="text-xs text-slate-500">{currentProject.key}</p>
            </div>
          </>
        ) : (
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-slate-800">Select Project</p>
            <p className="text-xs text-slate-500">Choose a project to work on</p>
          </div>
        )}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-w-xs">
          {/* Search */}
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Project List */}
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-600">No projects found</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => handleProjectSelect(project._id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors ${
                    project._id === currentProjectId ? 'bg-blue-50' : ''
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: `${project.color}20` }}
                  >
                    {project.icon}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-slate-500">{project.key}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Create New Project */}
          <div className="p-2 border-t border-slate-200">
            <button
              onClick={() => {
                navigate('/projects');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Create New Project</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectSelector;