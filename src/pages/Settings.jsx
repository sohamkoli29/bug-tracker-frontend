import { useState, useContext } from "react";
import { User, Bell, Lock, Palette, Save } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import AuthContext from "../context/AuthContext";

function Settings() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    issueAssigned: true,
    issueUpdated: true,
    comments: true,
    mentions: true,
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Profile Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-sm text-slate-600">
                          Receive notifications for this event
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              [key]: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}

                  <button
                    onClick={handleSaveNotifications}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Security Settings
                </h2>
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-2">
                      Change Password
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Update your password to keep your account secure
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Change Password →
                    </button>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-2">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Enable 2FA →
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Appearance
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 border-2 border-blue-500 rounded-xl cursor-pointer bg-white">
                        <div className="w-full h-20 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg mb-2"></div>
                        <p className="text-sm font-medium text-center">Light</p>
                      </div>
                      <div className="p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300">
                        <div className="w-full h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-2"></div>
                        <p className="text-sm font-medium text-center">Dark</p>
                      </div>
                      <div className="p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300">
                        <div className="w-full h-20 bg-gradient-to-br from-slate-50 via-slate-800 to-blue-50 rounded-lg mb-2"></div>
                        <p className="text-sm font-medium text-center">Auto</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default Settings;
