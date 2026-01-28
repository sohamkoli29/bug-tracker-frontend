import { useContext, useEffect, useState } from "react";
import {
  Bug,
  FolderKanban,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ProjectContext from "../context/ProjectContext";
import TicketContext from "../context/TicketContext";
import AuthContext from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { projects } = useContext(ProjectContext);
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tickets from all projects
    const fetchAllTickets = async () => {
      setLoading(true);
      // This is a simplified version - you might want to create a backend endpoint
      // that fetches all tickets for the user
      setLoading(false);
    };

    fetchAllTickets();
  }, []);

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      color: "blue",
      trend: "+2 this month",
    },
    {
      label: "Active Issues",
      value: allTickets.filter((t) => t.status !== "done").length,
      icon: Bug,
      color: "red",
      trend: "12 in progress",
    },
    {
      label: "Completed",
      value: allTickets.filter((t) => t.status === "done").length,
      icon: CheckCircle2,
      color: "green",
      trend: "+8 this week",
    },
    {
      label: "Team Members",
      value: new Set(
        projects.flatMap((p) => p.teamMembers.map((m) => m.user._id)),
      ).size,
      icon: Users,
      color: "purple",
      trend: "Across all projects",
    },
  ];

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-slate-600">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.color === "blue"
                      ? "bg-blue-100"
                      : stat.color === "red"
                        ? "bg-red-100"
                        : stat.color === "green"
                          ? "bg-green-100"
                          : "bg-purple-100"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "red"
                          ? "text-red-600"
                          : stat.color === "green"
                            ? "text-green-600"
                            : "text-purple-600"
                    }`}
                  />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-800 mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Recent Projects
            </h2>
            <button
              onClick={() => navigate("/projects")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderKanban className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                No projects yet
              </h3>
              <p className="text-slate-600 mb-6">
                Create your first project to get started
              </p>
              <button
                onClick={() => navigate("/projects")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all cursor-pointer group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
                    style={{ backgroundColor: `${project.color}20` }}
                  >
                    {project.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-600 truncate">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-500">
                        {project.teamMembers.length} members
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          project.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/projects")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-600 rounded-xl transition-all"
              >
                <FolderKanban className="w-5 h-5" />
                <span className="font-medium">New Project</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-all">
                <Bug className="w-5 h-5" />
                <span className="font-medium">Report Issue</span>
              </button>
              <button
                onClick={() => navigate("/team")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-all"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Invite Team</span>
              </button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-slate-800">
                    <span className="font-semibold">You</span> created a new
                    project
                  </p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-slate-800">
                    <span className="font-semibold">Issue resolved</span> in
                    project
                  </p>
                  <p className="text-xs text-slate-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-slate-800">
                    <span className="font-semibold">New team member</span>{" "}
                    joined
                  </p>
                  <p className="text-xs text-slate-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default Dashboard;