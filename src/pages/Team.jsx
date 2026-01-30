import { useState, useEffect, useContext } from 'react';
import { Users, Mail, Shield, Search, UserPlus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ProjectContext from '../context/ProjectContext';
import AuthContext from '../context/AuthContext';

function Team() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allMembers, setAllMembers] = useState([]);

  const { projects } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Get unique team members from all projects
    const membersMap = new Map();

    projects.forEach((project) => {
      project.teamMembers.forEach((member) => {
        const userId = member.user._id;
        if (!membersMap.has(userId)) {
          membersMap.set(userId, {
            ...member.user,
            projects: [],
            roles: new Set(),
          });
        }
        membersMap.get(userId).projects.push({
          id: project._id,
          title: project.title,
          icon: project.icon,
          color: project.color,
          role: member.role,
        });
        membersMap.get(userId).roles.add(member.role);
      });
    });

    setAllMembers(Array.from(membersMap.values()));
  }, [projects]);

  const filteredMembers = allMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';
  };

  const getRoleBadgeColor = (roles) => {
    if (roles.has('admin')) return 'bg-purple-100 text-purple-700';
    if (roles.has('developer')) return 'bg-blue-100 text-blue-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Team</h1>
            <p className="text-slate-600">Manage your team members across all projects</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite Member
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Members</p>
              <p className="text-2xl font-bold text-slate-800">{allMembers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Admins</p>
              <p className="text-2xl font-bold text-slate-800">
                {allMembers.filter((m) => m.roles.has('admin')).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Active Projects</p>
              <p className="text-2xl font-bold text-slate-800">
                {projects.filter((p) => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No team members found</h3>
          <p className="text-slate-600">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {getInitials(member.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(member.roles).map((role) => (
                      <span
                        key={role}
                        className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getRoleBadgeColor(
                          member.roles
                        )}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Projects ({member.projects.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                      style={{ backgroundColor: `${project.color}20`, color: project.color }}
                    >
                      <span>{project.icon}</span>
                      <span className="font-medium">{project.title}</span>
                    </div>
                  ))}
                  {member.projects.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                      +{member.projects.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Team;