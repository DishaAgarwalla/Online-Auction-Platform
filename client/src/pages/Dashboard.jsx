import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Award, Gavel, Package, History, Trophy } from "lucide-react";
import API from "../services/api";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [myAuctions, setMyAuctions] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, analyticsRes, auctionsRes, bidsRes, wonRes] = await Promise.all([
        API.get("/users/profile"),
        API.get("/users/analytics"),
        API.get("/users/my-auctions"),
        API.get("/users/my-bids"),
        API.get("/users/won-auctions"),
      ]);

      setProfile(profileRes.data);
      setAnalytics(analyticsRes.data);
      setMyAuctions(auctionsRes.data);
      setMyBids(bidsRes.data);
      setWonAuctions(wonRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
    { icon: Gavel, label: "My Auctions", value: analytics?.totalAuctions || 0, color: "from-blue-500 to-cyan-500" },
    { icon: History, label: "Total Bids", value: analytics?.totalBids || 0, color: "from-purple-500 to-pink-500" },
    { icon: Trophy, label: "Won Auctions", value: analytics?.wonAuctions || 0, color: "from-yellow-500 to-orange-500" },
    { icon: TrendingUp, label: "Success Rate", value: `${analytics?.totalBids ? Math.round((analytics.wonAuctions / analytics.totalBids) * 100) : 0}%`, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl p-8 mb-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.name}! 👋</h1>
          <p className="text-white/90">{profile?.email}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* My Auctions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">My Auctions</h2>
          </div>
          {myAuctions.length > 0 ? (
            <div className="space-y-4">
              {myAuctions.map((auction, index) => (
                <motion.div
                  key={auction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{auction.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{auction.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-indigo-600 font-semibold">₹{auction.currentBid}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          auction.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}>
                          {auction.status}
                        </span>
                        <span className="text-gray-500">Payment: {auction.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No auctions created yet.</p>
          )}
        </motion.div>

        {/* My Bids Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <History className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">My Bids</h2>
          </div>
          {myBids.length > 0 ? (
            <div className="space-y-4">
              {myBids.map((bid, index) => (
                <motion.div
                  key={bid.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{bid.auction?.title || "Auction"}</h3>
                      <p className="text-sm text-gray-500">{new Date(bid.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-indigo-600 font-bold text-lg">₹{bid.amount}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No bids placed yet.</p>
          )}
        </motion.div>

        {/* Won Auctions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-800">Won Auctions</h2>
          </div>
          {wonAuctions.length > 0 ? (
            <div className="space-y-4">
              {wonAuctions.map((auction, index) => (
                <motion.div
                  key={auction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-2 border-yellow-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{auction.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{auction.description}</p>
                      <div className="flex gap-4 items-center">
                        <span className="text-yellow-600 font-bold">Winning: ₹{auction.currentBid}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          auction.paymentStatus === "paid" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                        }`}>
                          {auction.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No won auctions yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;