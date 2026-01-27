import { useState, useContext } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import ProjectContext from '../context/ProjectContext';

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

const ICONS = ['📁', '🚀', '💼', '🎯', '💡', '🛠️', '📱', '🌐', '🎨', '⚡'];

function CreateProjectModal({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    key: '',
    color: '#3b82f6',
    icon: '📁',
  });
  const [loading, setLoading] = useState(false);

  const { createProject, getProjects } = useContext(ProjectContext);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-generate key from title
    if (name === 'title') {
      const generatedKey = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 10);
      setFormData((prev) => ({ ...prev, key: generatedKey }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await createProject(formData);

    if (result.success) {
      toast.success('Project created successfully!');
      await getProjects();
      onClose();
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Create New Project</h2>
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
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="E-Commerce Platform"
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
              placeholder="Describe your project..."
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Project Key */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Project Key * <span className="text-slate-500 font-normal">(Auto-generated)</span>
            </label>
            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={onChange}
              placeholder="ECOM"
              required
              maxLength={10}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase"
            />
            <p className="text-xs text-slate-500 mt-1">
              Maximum 10 characters, uppercase letters and numbers only
            </p>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Project Color
            </label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    formData.color === color
                      ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Project Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                    formData.icon === icon
                      ? 'bg-blue-100 ring-2 ring-blue-500 scale-110'
                      : 'bg-slate-100 hover:bg-slate-200 hover:scale-105'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-sm font-semibold text-slate-700 mb-3">Preview</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                {formData.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">
                  {formData.title || 'Project Title'}
                </h4>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-md inline-block mt-1"
                  style={{
                    backgroundColor: `${formData.color}20`,
                    color: formData.color,
                  }}
                >
                  {formData.key || 'KEY'}
                </span>
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
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;