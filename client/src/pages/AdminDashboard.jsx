import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Gavel, TrendingUp, Clock, CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, auctionsRes] = await Promise.all([
        API.get("/admin/dashboard"),
        API.get("/admin/users"),
        API.get("/admin/auctions"),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setAuctions(auctionsRes.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This action cannot be undone.`)) return;

    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const deleteAuction = async (id, title) => {
    if (!window.confirm(`Delete auction "${title}"? This action cannot be undone.`)) return;

    try {
      await API.delete(`/admin/auctions/${id}`);
      toast.success("Auction deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete auction");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: "Total Users", value: stats?.totalUsers || 0, color: "from-blue-500 to-cyan-500" },
    { icon: Gavel, label: "Total Auctions", value: stats?.totalAuctions || 0, color: "from-purple-500 to-pink-500" },
    { icon: Clock, label: "Active Auctions", value: stats?.activeAuctions || 0, color: "from-green-500 to-emerald-500" },
    { icon: CheckCircle, label: "Closed Auctions", value: stats?.closedAuctions || 0, color: "from-orange-500 to-red-500" },
    { icon: TrendingUp, label: "Total Bids", value: stats?.totalBids || 0, color: "from-indigo-500 to-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage users, auctions, and monitor platform activity</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${stat.color} rounded-xl p-6 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stat.value}</span>
              </div>
              <p className="text-white/90 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 p-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Manage Users</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "admin" 
                          ? "bg-purple-100 text-purple-600" 
                          : "bg-blue-100 text-blue-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteUser(user.id, user.name)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Auctions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 p-6">
            <div className="flex items-center gap-3">
              <Gavel className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Manage Auctions</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Bid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {auctions.map((auction) => (
                  <tr key={auction.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm text-gray-900">{auction.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{auction.title}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-indigo-600">₹{auction.currentBid}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        auction.status === "active" 
                          ? "bg-green-100 text-green-600" 
                          : "bg-red-100 text-red-600"
                      }`}>
                        {auction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{auction.seller?.name}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteAuction(auction.id, auction.title)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;