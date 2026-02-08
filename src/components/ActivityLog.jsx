import { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';
import axios from 'axios';

function ActivityLog({ ticketId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [ticketId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}/activity`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setActivities(data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';
  };

  const formatDate = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor((now - activityDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return activityDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: activityDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-700';
      case 'status_changed':
        return 'bg-blue-100 text-blue-700';
      case 'priority_changed':
        return 'bg-orange-100 text-orange-700';
      case 'deleted':
        return 'bg-red-100 text-red-700';
      case 'assigned':
      case 'unassigned':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="mt-6 border-t border-slate-200 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-bold text-slate-800">Activity</h3>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-slate-600">Loading activity...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl">
          <Activity className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity._id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {getInitials(activity.user.name)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm text-slate-800">
                    <span className="font-semibold">{activity.user.name}</span>{' '}
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getActionColor(
                        activity.action
                      )}`}
                    >
                      {activity.action.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(activity.createdAt)}</span>
                </div>
                {activity.oldValue && activity.newValue && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-red-50 text-red-700 rounded">
                      {activity.oldValue}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                      {activity.newValue}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityLog;