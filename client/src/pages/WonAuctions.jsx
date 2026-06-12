import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, CreditCard, Calendar, DollarSign, User } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

function WonAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWonAuctions();
  }, []);

  const fetchWonAuctions = async () => {
    try {
      const res = await API.get("/users/won-auctions");
      setAuctions(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load won auctions");
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Won Auctions
          </h1>
          <p className="text-gray-600 mt-2">Congratulations on your wins! Complete payment to claim your items.</p>
        </motion.div>

        {auctions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Won Auctions Yet</h3>
            <p className="text-gray-500">Start bidding to win amazing items!</p>
            <Link to="/auctions">
              <button className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                Browse Auctions
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {auctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="md:flex">
                  {auction.image && (
                    <div className="md:w-48 h-48 md:h-auto overflow-hidden">
                      <img
                        src={`http://localhost:5000${auction.image}`}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{auction.title}</h2>
                        <p className="text-gray-600">{auction.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        auction.paymentStatus === "paid" 
                          ? "bg-green-100 text-green-600" 
                          : "bg-orange-100 text-orange-600"
                      }`}>
                        {auction.paymentStatus === "paid" ? "Paid" : "Pending Payment"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>Winning Bid: <strong className="text-indigo-600">₹{auction.currentBid}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Seller: {auction.seller?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Ended: {new Date(auction.endTime).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {auction.paymentStatus !== "paid" && (
                      <Link to={`/payment/${auction.id}`}>
                        <button className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Pay Now
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WonAuctions;