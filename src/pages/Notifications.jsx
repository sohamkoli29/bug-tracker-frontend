import { useContext, useEffect, useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Bug,
  FolderKanban,
  MessageSquare,
  UserPlus,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import NotificationContext from '../context/NotificationContext';

function Notifications() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
  } = useContext(NotificationContext);

  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const navigate = useNavigate();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ticket_assigned':
      case 'ticket_updated':
        return <Bug className="w-5 h-5" />;
      case 'ticket_commented':
      case 'ticket_mentioned':
        return <MessageSquare className="w-5 h-5" />;
      case 'project_added':
        return <FolderKanban className="w-5 h-5" />;
      case 'project_role_changed':
        return <UserPlus className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'ticket_assigned':
        return 'bg-blue-100 text-blue-600';
      case 'ticket_updated':
        return 'bg-purple-100 text-purple-600';
      case 'ticket_commented':
      case 'ticket_mentioned':
        return 'bg-green-100 text-green-600';
      case 'project_added':
      case 'project_role_changed':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInSeconds = Math.floor((now - notifDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return notifDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: notifDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Notifications</h1>
        <p className="text-slate-600">Stay updated with all your project activities</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread ({unreadCount})</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All Read
              </button>
            )}
            {notifications.some((n) => n.read) && (
              <button
                onClick={clearReadNotifications}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Clear Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {filter === 'unread'
                ? 'No unread notifications'
                : filter === 'read'
                ? 'No read notifications'
                : 'No notifications'}
            </h3>
            <p className="text-slate-600">
              {filter === 'unread'
                ? "You're all caught up!"
                : 'Notifications will appear here when you have activity'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-6 hover:bg-slate-50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-bold text-slate-800 mb-1">
                          {notification.title}
                        </p>
                        <p className="text-slate-600">{notification.message}</p>
                      </div>
                      {!notification.read && (
                        <span className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>{formatTime(notification.createdAt)}</span>
                        {notification.actionBy && (
                          <span>by {notification.actionBy.name}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCheck className="w-4 h-4 text-slate-600" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
