import { useState, useContext, useEffect } from "react";
import { User, LogOut, Lock, Palette, Save, Eye, EyeOff, Trash2, Shield } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import AuthContext from "../context/AuthContext";
import axios from "axios";

function Settings() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    issueAssigned: true,
    issueUpdated: true,
    comments: true,
    mentions: true,
  });

  // Theme state
  const [theme, setTheme] = useState("light");

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
      if (user.preferences) {
        setNotifications(user.preferences.notifications || notifications);
        setTheme(user.preferences.theme || "light");
      }
    }
  }, [user]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
   
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const getConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        profileData,
        getConfig()
      );

      toast.success("Profile updated successfully!");
      
      // Update user context with new data
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, name: data.name, email: data.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Force page reload to update context
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        "http://localhost:5000/api/users/password",
        passwordData,
        getConfig()
      );

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);

    try {
      await axios.put(
        "http://localhost:5000/api/users/preferences",
        { notifications },
        getConfig()
      );

      toast.success("Notification preferences saved!");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!deletePassword) {
      toast.error("Please enter your password to confirm");
      return;
    }

    setLoading(true);

    try {
      await axios.delete("http://localhost:5000/api/users/account", {
        ...getConfig(),
        data: { password: deletePassword },
      });

      toast.success("Account deleted successfully");
      logout();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  return (
    <DashboardLayout>
     <div className="mb-8 flex items-start justify-between">
  <div>
    <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
    <p className="text-slate-600">
      Manage your account settings and preferences
    </p>
  </div>

 <button
    onClick={handleLogout}
    className="text-slate-600 hover:text-red-500 transition"
    title="Logout"
  >
    <LogOut />
  </button>
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
                <form onSubmit={handleSaveProfile} className="space-y-6">
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
                      required
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
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Security Settings
                </h2>

                {/* Change Password */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          required
                          minLength={6}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                          minLength={6}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <Shield className="w-5 h-5" />
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>

                {/* Delete Account */}
                <div className="pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-bold text-red-600 mb-4">
                    Delete Account
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Once you delete your account, there is no going back. Please be
                    certain.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </button>
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
                      <button
                        onClick={() => setTheme("light")}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          theme === "light"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="w-full h-20 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg mb-2"></div>
                        <p className="text-sm font-medium text-center">Light</p>
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          theme === "dark"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="w-full h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-2"></div>
                        <p className="text-sm font-medium text-center">Dark</p>
                      </button>
                      <button
                        onClick={() => setTheme("auto")}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          theme === "auto"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="w-full h-20 bg-gradient-to-br from-slate-50 via-slate-800 to-blue-50 rounded-lg mb-2"></div>
                        <p className="text-sm font-medium text-center">Auto</p>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">
                    Theme customization coming soon
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Delete Account
            </h2>
            <p className="text-slate-600 mb-6">
              This action cannot be undone. All your data will be permanently
              deleted.
            </p>

            <form onSubmit={handleDeleteAccount}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="Enter password"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                  }}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Settings;