import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Edit,
  Trash2,
  UserPlus,
  X,
  Plus,
  Bug,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProjectContext from '../context/ProjectContext';
import TicketContext from '../context/TicketContext';
import AuthContext from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import CreateTicketModal from '../components/CreateTicketModal';
import TicketFilters from '../components/TicketFilters';
import TicketDetailModal from '../components/TicketDetailModal';
import KanbanBoard from '../components/KanbanBoard';
function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, getProject, updateProject, deleteProject, addTeamMember, removeTeamMember, loading } =
    useContext(ProjectContext);
  const { user } = useContext(AuthContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: '',
    color: '',
    icon: '',
  });
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('developer');
  const [actionLoading, setActionLoading] = useState(false);

  // Ticket states
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    type: 'all',
    assignee: 'all',
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [projectTickets, setProjectTickets] = useState([]);
  const [ticketLoading, setTicketLoading] = useState(false);

  const { tickets, getTickets } = useContext(TicketContext);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'

  useEffect(() => {
    getProject(id);
  }, [id]);

  useEffect(() => {
    if (currentProject) {
      setEditFormData({
        title: currentProject.title,
        description: currentProject.description,
        status: currentProject.status,
        color: currentProject.color,
        icon: currentProject.icon,
      });
    }
  }, [currentProject]);

  // Load tickets when component mounts
  useEffect(() => {
    if (id) {
      loadTickets();
    }
  }, [id]);

  const loadTickets = async () => {
    setTicketLoading(true);
    await getTickets(id);
    setTicketLoading(false);
  };

  // Update local tickets when context tickets change
  useEffect(() => {
    setProjectTickets(tickets);
  }, [tickets]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOwner = currentProject?.owner?._id === user?._id;
  const userMember = currentProject?.teamMembers?.find(
    (member) => member.user._id === user?._id
  );
  const isAdmin = userMember?.role === 'admin' || isOwner;

  const handleEditProject = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const result = await updateProject(id, editFormData);

    if (result.success) {
      toast.success('Project updated successfully!');
      setShowEditModal(false);
    } else {
      toast.error(result.message);
    }

    setActionLoading(false);
  };

  const handleDeleteProject = async () => {
    setActionLoading(true);

    const result = await deleteProject(id);

    if (result.success) {
      toast.success('Project deleted successfully!');
      navigate('/projects');
    } else {
      toast.error(result.message);
    }

    setActionLoading(false);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const result = await addTeamMember(id, {
      email: memberEmail,
      role: memberRole,
    });

    if (result.success) {
      toast.success('Team member added successfully!');
      setShowAddMemberModal(false);
      setMemberEmail('');
      setMemberRole('developer');
    } else {
      toast.error(result.message);
    }

    setActionLoading(false);
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      const result = await removeTeamMember(id, memberId);

      if (result.success) {
        toast.success('Team member removed successfully!');
      } else {
        toast.error(result.message);
      }
    }
  };

  // Filter tickets based on active filters
  const filteredTickets = projectTickets.filter((ticket) => {
    // Search filter
    if (
      filters.search &&
      !ticket.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !ticket.description.toLowerCase().includes(filters.search.toLowerCase()) &&
      !ticket.ticketKey.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && ticket.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) {
      return false;
    }

    // Type filter
    if (filters.type !== 'all' && ticket.type !== filters.type) {
      return false;
    }

    // Assignee filter
    if (filters.assignee !== 'all') {
      if (filters.assignee === 'unassigned' && ticket.assignee) {
        return false;
      }
      if (filters.assignee !== 'unassigned' && ticket.assignee?._id !== filters.assignee) {
        return false;
      }
    }

    return true;
  });

  if (loading) {
    return (
      <DashboardLayout showProjectSelector currentProjectId={id}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading project...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentProject) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Project not found</h2>
            <button
              onClick={() => navigate('/projects')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout showProjectSelector currentProjectId={id}>
      {/* Project Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
        <div
          className="h-2"
          style={{ backgroundColor: currentProject.color }}
        ></div>
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                style={{ backgroundColor: `${currentProject.color}20` }}
              >
                {currentProject.icon}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-800">
                    {currentProject.title}
                  </h1>
                  <span
                    className="text-sm font-semibold px-3 py-1 rounded-lg"
                    style={{
                      backgroundColor: `${currentProject.color}20`,
                      color: currentProject.color,
                    }}
                  >
                    {currentProject.key}
                  </span>
                </div>
                <p className="text-slate-600">{currentProject.description}</p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"
                  title="Edit Project"
                >
                  <Edit className="w-5 h-5" />
                </button>
                {isOwner && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">
                Created {formatDate(currentProject.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">
                {currentProject.teamMembers.length} team members
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentProject.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : currentProject.status === 'on-hold'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {currentProject.status}
            </span>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Team Members</h2>
          {isAdmin && (
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentProject.teamMembers.map((member) => (
            <div
              key={member.user._id}
              className="bg-slate-50 rounded-xl p-4 flex items-center justify-between hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg">
                  {getInitials(member.user.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800">
                      {member.user.name}
                    </p>
                    {member.user._id === currentProject.owner._id && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        Owner
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{member.user.email}</p>
                  <p className="text-xs text-slate-500 mt-1 capitalize">
                    {member.role}
                  </p>
                </div>
              </div>

              {isAdmin && member.user._id !== currentProject.owner._id && (
                <button
                  onClick={() => handleRemoveMember(member.user._id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  title="Remove member"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Project Stats and Tickets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bug className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Issues</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {projectTickets.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">In Progress</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {projectTickets.filter(t => t.status === 'in-progress').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Completed</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {projectTickets.filter(t => t.status === 'done').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">High Priority</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {projectTickets.filter(t => t.priority === 'high' || t.priority === 'critical').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <TicketFilters
            filters={filters}
            setFilters={setFilters}
            teamMembers={currentProject?.teamMembers}
          />

          <div className="bg-white rounded-2xl shadow-xl p-6">
           <div className="flex items-center justify-between mb-6">
  <div>
    <h3 className="text-lg font-bold text-slate-800">Issues</h3>
    <p className="text-sm text-slate-600">
      Showing {filteredTickets.length} of {projectTickets.length} issues
    </p>
  </div>
  <div className="flex items-center gap-2">
    {/* View Mode Toggle */}
    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-md transition-all ${
          viewMode === 'list'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-800'
        }`}
        title="List View"
      >
        <LayoutList className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode('kanban')}
        className={`p-2 rounded-md transition-all ${
          viewMode === 'kanban'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-800'
        }`}
        title="Kanban View"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
    <button
      onClick={() => setShowCreateTicketModal(true)}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
    >
      <Plus className="w-4 h-4" />
      New Issue
    </button>
  </div>
</div>

           {viewMode === 'list' ? (
  // Existing ticket list code
  ticketLoading ? (
    <div className="text-center py-8">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-sm text-slate-600">Loading issues...</p>
    </div>
  ) : filteredTickets.length === 0 ? (
    <div className="text-center py-12">
      <Bug className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h4 className="text-lg font-bold text-slate-800 mb-2">
        {projectTickets.length === 0 ? 'No issues yet' : 'No matching issues'}
      </h4>
      <p className="text-slate-600 mb-6">
        {projectTickets.length === 0
          ? 'Create your first issue to get started'
          : 'Try adjusting your filters'}
      </p>
      {projectTickets.length === 0 && (
        <button
          onClick={() => setShowCreateTicketModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Create Issue
        </button>
      )}
    </div>
  ) : (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {/* Your existing ticket cards code */}
    </div>
  )
) : (
  // Kanban View
  <div className="mt-6">
    <KanbanBoard
      projectId={id}
      tickets={filteredTickets}
      onTicketClick={(ticket) => setSelectedTicket(ticket)}
      onCreateTicket={() => setShowCreateTicketModal(true)}
    />
  </div>
)}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateTicketModal && (
        <CreateTicketModal
          projectId={id}
          onClose={() => setShowCreateTicketModal(false)}
          onSuccess={() => {
            loadTickets();
          }}
        />
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={(updatedTicket) => {
            if (updatedTicket) {
              setProjectTickets(
                projectTickets.map((t) => (t._id === updatedTicket._id ? updatedTicket : t))
              );
              setSelectedTicket(updatedTicket);
            } else {
              // Ticket was deleted, reload tickets
              loadTickets();
              setSelectedTicket(null);
            }
          }}
        />
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Edit Project</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleEditProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Add Team Member</h2>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Role
                </label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="viewer">Viewer</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                </select>
              </div><div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}  {/* Delete Confirmation Modal */}
  {showDeleteModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Delete Project?</h2>
          <p className="text-slate-600 mb-6">
            Are you sure you want to delete this project? This action cannot be undone and
            will delete all associated issues and data.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProject}
              disabled={actionLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              {actionLoading ? 'Deleting...' : 'Delete Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</DashboardLayout>
);
}
export default ProjectDetail;