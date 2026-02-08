import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, Search, Filter } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import TicketDetailModal from '../components/TicketDetailModal';
import AdvancedTicketFilters from '../components/AdvancedTicketFilters';
import FilterStats from '../components/FilterStats';
import ProjectContext from '../context/ProjectContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

function AllIssues() {
  const [allTickets, setAllTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    type: 'all',
    assignee: 'all',
    project: 'all',
    sortBy: 'createdAt',
    order: 'desc',
  });

  const { projects, getProjects } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getProjects();
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch tickets from all projects
      const ticketPromises = projects.map((project) =>
        axios.get(  `${import.meta.env.VITE_API_URL}/api/projects/${project._id}/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const responses = await Promise.all(ticketPromises);
      const tickets = responses.flatMap((res) => res.data);
      
      setAllTickets(tickets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projects.length > 0 && allTickets.length === 0) {
      fetchAllTickets();
    }
  }, [projects]);

  // Apply filters
  useEffect(() => {
    let result = [...allTickets];

    // Search filter
    if (filters.search) {
      result = result.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          ticket.ticketKey.toLowerCase().includes(filters.search.toLowerCase()) ||
          ticket.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((ticket) => ticket.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      result = result.filter((ticket) => ticket.priority === filters.priority);
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter((ticket) => ticket.type === filters.type);
    }

    // Assignee filter
    if (filters.assignee !== 'all') {
      if (filters.assignee === 'unassigned') {
        result = result.filter((ticket) => !ticket.assignee);
      } else if (filters.assignee === user?._id) {
        result = result.filter((ticket) => ticket.assignee?._id === user._id);
      } else {
        result = result.filter((ticket) => ticket.assignee?._id === filters.assignee);
      }
    }

    // Project filter
    if (filters.project !== 'all') {
      result = result.filter((ticket) => ticket.project._id === filters.project);
    }

    // Sort
    result.sort((a, b) => {
      const sortBy = filters.sortBy || 'createdAt';
      const order = filters.order || 'desc';
      let comparison = 0;

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        comparison = new Date(a[sortBy]) - new Date(b[sortBy]);
      } else if (sortBy === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }

      return order === 'desc' ? -comparison : comparison;
    });

    setFilteredTickets(result);
  }, [allTickets, filters]);

  const getInitials = (name) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';
  };

  // Get all unique team members from all projects
  const allTeamMembers = Array.from(
    new Set(
      projects.flatMap((p) => p.teamMembers.map((m) => JSON.stringify(m.user)))
    )
  ).map((str) => ({ user: JSON.parse(str) }));

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">All Issues</h1>
        <p className="text-slate-600">View and manage all issues across your projects</p>
      </div>

      {/* Filters with Project selector */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search all issues..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <select
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="all">All Projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.icon} {project.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <AdvancedTicketFilters
          filters={filters}
          setFilters={setFilters}
          teamMembers={allTeamMembers}
          userId={user?._id}
        />

        {filteredTickets.length > 0 && (
          <FilterStats tickets={allTickets} filteredTickets={filteredTickets} />
        )}
      </div>

      {/* Issues List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading issues...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Bug className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {allTickets.length === 0 ? 'No issues yet' : 'No matching issues'}
          </h3>
          <p className="text-slate-600 mb-6">
            {allTickets.length === 0
              ? 'Create your first issue in a project to get started'
              : 'Try adjusting your filters'}
          </p>
          {allTickets.length === 0 && (
            <button
              onClick={() => navigate('/projects')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Go to Projects
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: `${ticket.project?.color}20`,
                          color: ticket.project?.color,
                        }}
                      >
                        {ticket.ticketKey}
                      </span>
                      <span className="text-xs text-slate-500">
                        {ticket.project?.icon} {ticket.project?.title}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-md font-medium ${
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
                      <span
                        className={`text-xs px-2 py-1 rounded-md font-medium ${
                          ticket.type === 'bug'
                            ? 'bg-red-100 text-red-700'
                            : ticket.type === 'feature'
                            ? 'bg-blue-100 text-blue-700'
                            : ticket.type === 'improvement'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {ticket.type === 'bug'
                          ? '🐛'
                          : ticket.type === 'feature'
                          ? '✨'
                          : ticket.type === 'improvement'
                          ? '🚀'
                          : '📋'}{' '}
                        {ticket.type}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {ticket.title}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    {ticket.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                          {getInitials(ticket.assignee.name)}
                        </div>
                        <span className="text-xs text-slate-600">{ticket.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Unassigned</span>
                    )}
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      ticket.status === 'done'
                        ? 'bg-green-100 text-green-700'
                        : ticket.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ticket.status === 'todo'
                      ? 'To Do'
                      : ticket.status === 'in-progress'
                      ? 'In Progress'
                      : 'Done'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={() => {
            fetchAllTickets();
            setSelectedTicket(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default AllIssues;