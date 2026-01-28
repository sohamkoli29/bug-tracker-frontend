import { useState, useContext, useEffect } from 'react';
import {
  X,
  Edit,
  Trash2,
  User,
  Calendar,
  Tag,
  Clock,
  AlertCircle,
  CheckCircle2,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import TicketContext from '../context/TicketContext';
import ProjectContext from '../context/ProjectContext';
import AuthContext from '../context/AuthContext';

const TYPES = [
  { value: 'bug', label: '🐛 Bug', color: 'red' },
  { value: 'feature', label: '✨ Feature', color: 'blue' },
  { value: 'improvement', label: '🚀 Improvement', color: 'purple' },
  { value: 'task', label: '📋 Task', color: 'green' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'slate' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' },
];

const STATUSES = [
  { value: 'todo', label: 'To Do', icon: AlertCircle, color: 'slate' },
  { value: 'in-progress', label: 'In Progress', icon: Clock, color: 'blue' },
  { value: 'done', label: 'Done', icon: CheckCircle2, color: 'green' },
];

function TicketDetailModal({ ticket, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    priority: '',
    status: '',
    assignee: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { updateTicket, deleteTicket } = useContext(TicketContext);
  const { currentProject } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        type: ticket.type,
        priority: ticket.priority,
        status: ticket.status,
        assignee: ticket.assignee?._id || '',
        dueDate: ticket.dueDate ? ticket.dueDate.split('T')[0] : '',
      });
    }
  }, [ticket]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateTicket(ticket._id, formData);

    if (result.success) {
      toast.success('Ticket updated successfully!');
      setIsEditing(false);
      if (onUpdate) onUpdate(result.data);
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);

    const result = await deleteTicket(ticket._id);

    if (result.success) {
      toast.success('Ticket deleted successfully!');
      onClose();
      if (onUpdate) onUpdate();
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  const handleQuickStatusUpdate = async (newStatus) => {
    const result = await updateTicket(ticket._id, { status: newStatus });

    if (result.success) {
      toast.success('Status updated!');
      if (onUpdate) onUpdate(result.data);
    } else {
      toast.error(result.message);
    }
  };

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

  const canEdit = ticket?.reporter?._id === user?._id || currentProject?.owner === user?._id;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-semibold px-3 py-1 rounded-lg"
              style={{
                backgroundColor: `${ticket.project?.color}20`,
                color: ticket.project?.color,
              }}
            >
              {ticket.ticketKey}
            </span>
            <h2 className="text-xl font-bold text-slate-800">
              {isEditing ? 'Edit Issue' : ticket.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <form onSubmit={handleUpdate} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {/* Type, Priority, Status */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assignee and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Assignee
                </label>
                <select
                  name="assignee"
                  value={formData.assignee}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="">Unassigned</option>
                  {currentProject?.teamMembers.map((member) => (
                    <option key={member.user._id} value={member.user._id}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-xs px-3 py-1 rounded-md font-medium ${
                  ticket.type === 'bug'
                    ? 'bg-red-100 text-red-700'
                    : ticket.type === 'feature'
                    ? 'bg-blue-100 text-blue-700'
                    : ticket.type === 'improvement'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {TYPES.find((t) => t.value === ticket.type)?.label}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-md font-medium ${
                  ticket.priority === 'critical'
                    ? 'bg-red-100 text-red-700'
                    : ticket.priority === 'high'
                    ? 'bg-orange-100 text-orange-700'
                    : ticket.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Priority: {ticket.priority}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
              <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </p>
            </div>

            {/* Quick Status Update */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Status Update</h3>
              <div className="flex gap-2">
                {STATUSES.map((status) => {
                  const Icon = status.icon;
                  const isActive = ticket.status === status.value;
                  return (
                    <button
                      key={status.value}
                      onClick={() => !isActive && handleQuickStatusUpdate(status.value)}
                      disabled={isActive}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? status.value === 'done'
                            ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                            : status.value === 'in-progress'
                            ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                            : 'bg-slate-100 text-slate-700 ring-2 ring-slate-500'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {status.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Assignee */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-semibold">Assignee</span>
                </div>
                {ticket.assignee ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                      {getInitials(ticket.assignee.name)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{ticket.assignee.name}</p>
                      <p className="text-xs text-slate-500">{ticket.assignee.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">Unassigned</p>
                )}
              </div>

              {/* Reporter */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-semibold">Reporter</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials(ticket.reporter.name)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{ticket.reporter.name}</p>
                    <p className="text-xs text-slate-500">{ticket.reporter.email}</p>
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">Due Date</span>
                </div>
                <p className="font-medium text-slate-800">
                  {ticket.dueDate ? formatDate(ticket.dueDate) : 'No due date'}
                </p>
              </div>

              {/* Created */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold">Created</span>
                </div>
                <p className="font-medium text-slate-800">{formatDate(ticket.createdAt)}</p>
              </div>
            </div>

            {/* Tags */}
            {ticket.tags && ticket.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm font-semibold">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 rounded-2xl">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Issue?</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this issue? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketDetailModal;