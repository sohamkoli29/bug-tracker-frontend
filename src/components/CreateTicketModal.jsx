import { useState, useContext } from 'react';
import { X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import TicketContext from '../context/TicketContext';
import ProjectContext from '../context/ProjectContext';

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

function CreateTicketModal({ projectId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'bug',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  const { createTicket, getTickets } = useContext(TicketContext);
  const { currentProject } = useContext(ProjectContext);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ticketData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      priority: formData.priority,
      assignee: formData.assignee || null,
      dueDate: formData.dueDate || null,
      tags: formData.tags ? formData.tags.split(',').map((tag) => tag.trim()) : [],
    };

    const result = await createTicket(projectId, ticketData);

    if (result.success) {
      toast.success('Ticket created successfully!');
      await getTickets(projectId);
      if (onSuccess) onSuccess();
      onClose();
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-slate-800">Create New Issue</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
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
              placeholder="Brief description of the issue"
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
              placeholder="Detailed description of the issue..."
              required
              rows={6}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Type *
              </label>
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
                Priority *
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
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tags <span className="text-slate-500 font-normal">(comma separated)</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={onChange}
              placeholder="frontend, urgent, security"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
            <p className="text-sm font-semibold text-slate-700 mb-3">Preview</p>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 mb-1">
                  {formData.title || 'Issue title will appear here'}
                </h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-md font-medium ${
                      formData.type === 'bug'
                        ? 'bg-red-100 text-red-700'
                        : formData.type === 'feature'
                        ? 'bg-blue-100 text-blue-700'
                        : formData.type === 'improvement'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {TYPES.find((t) => t.value === formData.type)?.label}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-md font-medium ${
                      formData.priority === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : formData.priority === 'high'
                        ? 'bg-orange-100 text-orange-700'
                        : formData.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {formData.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {formData.description || 'Description will appear here'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicketModal;