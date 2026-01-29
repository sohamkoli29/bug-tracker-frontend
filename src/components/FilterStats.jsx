import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function FilterStats({ tickets, filteredTickets }) {
  const total = tickets.length;
  const filtered = filteredTickets.length;
  const percentage = total > 0 ? Math.round((filtered / total) * 100) : 0;

  const statusCounts = {
    todo: filteredTickets.filter((t) => t.status === 'todo').length,
    'in-progress': filteredTickets.filter((t) => t.status === 'in-progress').length,
    done: filteredTickets.filter((t) => t.status === 'done').length,
  };

  const priorityCounts = {
    critical: filteredTickets.filter((t) => t.priority === 'critical').length,
    high: filteredTickets.filter((t) => t.priority === 'high').length,
    medium: filteredTickets.filter((t) => t.priority === 'medium').length,
    low: filteredTickets.filter((t) => t.priority === 'low').length,
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-800">Filter Results</h4>
        <div className="flex items-center gap-2">
          {filtered === total ? (
            <Minus className="w-4 h-4 text-slate-500" />
          ) : filtered < total ? (
            <TrendingDown className="w-4 h-4 text-blue-600" />
          ) : (
            <TrendingUp className="w-4 h-4 text-green-600" />
          )}
          <span className="text-sm font-bold text-slate-800">
            {filtered} / {total}
          </span>
          <span className="text-xs text-slate-600">({percentage}%)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Status Breakdown */}
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs font-semibold text-slate-600 mb-2">By Status</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">To Do</span>
              <span className="font-semibold text-slate-800">{statusCounts.todo}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">In Progress</span>
              <span className="font-semibold text-blue-600">
                {statusCounts['in-progress']}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Done</span>
              <span className="font-semibold text-green-600">{statusCounts.done}</span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs font-semibold text-slate-600 mb-2">By Priority</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Critical</span>
              <span className="font-semibold text-red-600">
                {priorityCounts.critical}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">High</span>
              <span className="font-semibold text-orange-600">{priorityCounts.high}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Medium/Low</span>
              <span className="font-semibold text-slate-600">
                {priorityCounts.medium + priorityCounts.low}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterStats;