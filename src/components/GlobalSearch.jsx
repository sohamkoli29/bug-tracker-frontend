import { useState, useEffect, useRef, useContext } from 'react';
import { Search, X, FolderKanban, Bug, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectContext from '../context/ProjectContext';
import TicketContext from '../context/TicketContext';
import { saveRecentSearch, getRecentSearches } from '../utils/filterStorage';

function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({ projects: [], tickets: [] });
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { projects } = useContext(ProjectContext);
  const { tickets } = useContext(TicketContext);
    const [recentSearches, setRecentSearches] = useState([]);
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search logic
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults({ projects: [], tickets: [] });
      return;
    }

    const term = searchTerm.toLowerCase();

    // Search projects
    const matchedProjects = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(term) ||
        project.key.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term)
    );

    // Search tickets (you'd need to fetch all tickets or have them in context)
    const matchedTickets = tickets.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(term) ||
        ticket.ticketKey.toLowerCase().includes(term) ||
        ticket.description.toLowerCase().includes(term)
    );

    setResults({
      projects: matchedProjects.slice(0, 5),
      tickets: matchedTickets.slice(0, 5),
    });
  }, [searchTerm, projects, tickets]);

  const handleSearchSubmit = (term) => {
  if (term.trim()) {
    saveRecentSearch(term);
    setRecentSearches(getRecentSearches());
  }
};
  useEffect(() => {
  setRecentSearches(getRecentSearches());
}, []);
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleTicketClick = (ticket) => {
    navigate(`/projects/${ticket.project._id}`);
    setIsOpen(false);
    setSearchTerm('');
  };

  const highlightText = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-slate-900">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getInitials = (name) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 w-64"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search...</span>
        <kbd className="ml-auto text-xs px-2 py-0.5 bg-white rounded border border-slate-300">
          ⌘K
        </kbd>
      </button>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Search className="w-5 h-5 text-slate-600" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center pt-20 px-4">
          <div
            ref={searchRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[600px] overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-200">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects, issues, or anything..."
                className="flex-1 outline-none text-slate-800 placeholder:text-slate-400"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
              <kbd className="text-xs px-2 py-1 bg-slate-100 rounded border border-slate-200">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="overflow-y-auto max-h-[500px]">
              {searchTerm === '' ? (
  <div className="p-8">
    {recentSearches.length > 0 ? (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700">Recent Searches</h3>
        </div>
        <div className="space-y-2">
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => setSearchTerm(search)}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-sm text-slate-700"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    ) : null}
    <div className="text-center">
      <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-600 mb-2">Start typing to search</p>
      <p className="text-sm text-slate-500">
        Search across projects, issues, and more
      </p>
    </div>
  </div>
) : results.projects.length === 0 && results.tickets.length === 0 ? (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 mb-2">No results found</p>
                  <p className="text-sm text-slate-500">
                    Try searching for something else
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-6">
                  {/* Projects */}
                  {results.projects.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 px-2">
                        <FolderKanban className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                          Projects ({results.projects.length})
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {results.projects.map((project) => (
                          <button
                            key={project._id}
                            onClick={() => handleProjectClick(project._id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                              style={{ backgroundColor: `${project.color}20` }}
                            >
                              {project.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 truncate">
                                {highlightText(project.title, searchTerm)}
                              </p>
                              <p className="text-sm text-slate-600 truncate">
                                {highlightText(project.key, searchTerm)} •{' '}
                                {project.teamMembers.length} members
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tickets */}
                  {results.tickets.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 px-2">
                        <Bug className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                          Issues ({results.tickets.length})
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {results.tickets.map((ticket) => (
                          <button
                            key={ticket._id}
                            onClick={() => handleTicketClick(ticket)}
                            className="w-full flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className="text-xs font-semibold px-2 py-0.5 rounded"
                                  style={{
                                    backgroundColor: `${ticket.project?.color}20`,
                                    color: ticket.project?.color,
                                  }}
                                >
                                  {ticket.ticketKey}
                                </span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                                    ticket.priority === 'critical'
                                      ? 'bg-red-100 text-red-700'
                                      : ticket.priority === 'high'
                                      ? 'bg-orange-100 text-orange-700'
                                      : ticket.priority === 'medium'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {ticket.priority}
                                </span>
                              </div>
                              <p className="font-semibold text-slate-800 mb-1">
                                {highlightText(ticket.title, searchTerm)}
                              </p>
                              <p className="text-sm text-slate-600 line-clamp-1">
                                {highlightText(ticket.description, searchTerm)}
                              </p>
                            </div>
                            {ticket.assignee && (
                              <div
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                                title={ticket.assignee.name}
                              >
                                {getInitials(ticket.assignee.name)}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">
                    ↓
                  </kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">
                    Enter
                  </kbd>
                  to select
                </span>
              </div>
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalSearch;