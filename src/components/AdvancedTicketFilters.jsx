import { useState,useEffect  } from 'react';
import { Filter, X, ChevronDown, Save, RotateCcw } from 'lucide-react';
import { saveFilterPreset, getSavedFilters, deleteFilterPreset } from '../utils/filterStorage';

const FILTER_PRESETS = [
  {
    id: 'my-open',
    name: 'My Open Issues',
    icon: '👤',
    filters: { status: 'todo,in-progress', assignee: 'me' },
  },
  {
    id: 'high-priority',
    name: 'High Priority',
    icon: '🔥',
    filters: { priority: 'high,critical' },
  },
  {
    id: 'recent',
    name: 'Recently Updated',
    icon: '🕐',
    filters: { sortBy: 'updatedAt' },
  },
  {
    id: 'bugs',
    name: 'All Bugs',
    icon: '🐛',
    filters: { type: 'bug' },
  },
];

function AdvancedTicketFilters({ filters, setFilters, teamMembers, userId }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
    const [savedPresets, setSavedPresets] = useState([]);
const [presetName, setPresetName] = useState('');
  const handlePresetClick = (preset) => {
    const newFilters = { ...filters };

    // Parse preset filters
    if (preset.filters.status) {
      const statuses = preset.filters.status.split(',');
      newFilters.status = statuses[0];
    }
    if (preset.filters.priority) {
      const priorities = preset.filters.priority.split(',');
      newFilters.priority = priorities[0];
    }
    if (preset.filters.type) {
      newFilters.type = preset.filters.type;
    }
    if (preset.filters.assignee === 'me') {
      newFilters.assignee = userId;
    }

    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      type: 'all',
      assignee: 'all',
      sortBy: 'createdAt',
      order: 'desc',
    });
  };
  useEffect(() => {
  const saved = getSavedFilters();
  setSavedPresets(saved);
}, []);
  const hasActiveFilters =
    filters.search ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.type !== 'all' ||
    filters.assignee !== 'all';
    const handleSavePreset = () => {
  if (!presetName.trim()) {
    alert('Please enter a preset name');
    return;
  }

  const preset = saveFilterPreset(presetName, filters);
  setSavedPresets([...savedPresets, preset]);
  setShowSaveModal(false);
  setPresetName('');
  alert('Filter preset saved!');
};

const handleDeletePreset = (id) => {
  if (window.confirm('Delete this filter preset?')) {
    deleteFilterPreset(id);
    setSavedPresets(savedPresets.filter((p) => p.id !== id));
  }
};

const handleLoadPreset = (preset) => {
  setFilters(preset.filters);
};
  return (
    <div className="space-y-4">
      {/* Quick Filter Presets */}
      <div className="flex flex-wrap gap-2">
        {FILTER_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetClick(preset)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-blue-300 transition-all text-sm"
          >
            <span>{preset.icon}</span>
            <span className="font-medium text-slate-700">{preset.name}</span>
          </button>
        ))}
      </div>
        {/* Saved Presets */}
{savedPresets.length > 0 && (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Save className="w-4 h-4 text-slate-500" />
      <h4 className="text-sm font-semibold text-slate-700">Saved Filters</h4>
    </div>
    <div className="flex flex-wrap gap-2">
      {savedPresets.map((preset) => (
        <div
          key={preset.id}
          className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm group"
        >
          <button
            onClick={() => handleLoadPreset(preset)}
            className="font-medium text-purple-700 hover:text-purple-800"
          >
            {preset.name}
          </button>
          <button
            onClick={() => handleDeletePreset(preset.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3 text-purple-600 hover:text-purple-800" />
          </button>
        </div>
      ))}
    </div>
  </div>
)}
      {/* Advanced Filters Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-800">Filters</h3>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
             {hasActiveFilters && (
    <>
      <button
        onClick={() => setShowSaveModal(true)}
        className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
      >
        <Save className="w-4 h-4" />
        Save
      </button>
      <button
        onClick={handleClearFilters}
        className="text-sm text-slate-600 hover:text-slate-800 font-medium flex items-center gap-1"
      >
        <RotateCcw className="w-4 h-4" />
        Clear All
      </button>
    </>
  )}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showAdvanced ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Filter Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-4 transition-all ${
            showAdvanced ? 'opacity-100' : 'opacity-100'
          }`}
        >
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            >
              <option value="all">All Types</option>
              <option value="bug">🐛 Bug</option>
              <option value="feature">✨ Feature</option>
              <option value="improvement">🚀 Improvement</option>
              <option value="task">📋 Task</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Assignee
            </label>
            <select
              value={filters.assignee}
              onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              <option value={userId}>Me</option>
              {teamMembers?.map((member) => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Sort By
                </label>
                <select
                  value={filters.sortBy || 'createdAt'}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="updatedAt">Updated Date</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>

              {/* Order */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Order
                </label>
                <select
                  value={filters.order || 'desc'}
                  onChange={(e) => setFilters({ ...filters, order: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Save Preset Modal */}
{showSaveModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Save Filter Preset</h3>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Preset Name
        </label>
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="e.g., My High Priority Bugs"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          autoFocus
        />
      </div>

      {/* Current Filters Preview */}
      <div className="mb-6 p-4 bg-slate-50 rounded-xl">
        <p className="text-xs font-semibold text-slate-600 mb-2">This will save:</p>
        <div className="flex flex-wrap gap-2">
          {filters.status !== 'all' && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
              Status: {filters.status}
            </span>
          )}
          {filters.priority !== 'all' && (
            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
              Priority: {filters.priority}
            </span>
          )}
          {filters.type !== 'all' && (
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
              Type: {filters.type}
            </span>
          )}
          {filters.assignee !== 'all' && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
              Assignee filter
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setShowSaveModal(false);
            setPresetName('');
          }}
          className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSavePreset}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Save Preset
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default AdvancedTicketFilters;