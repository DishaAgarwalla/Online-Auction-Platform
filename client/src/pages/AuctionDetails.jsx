import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, User, Calendar, Clock, Award, CreditCard, Gavel, History } from "lucide-react";
import API from "../services/api";
import socket from "../services/socket";
import toast from "react-hot-toast";

function AuctionDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuction();

    socket.emit("joinAuction", id);

    socket.on("newBid", (data) => {
      if (data.auctionId === Number(id)) {
        setAuction((prev) => ({
          ...prev,
          currentBid: data.currentBid,
          bids: [
            {
              id: Date.now(),
              amount: data.currentBid,
              bidder: data.bidder,
              createdAt: data.timestamp,
            },
            ...(prev.bids || []),
          ],
        }));
        toast.success(`New bid of ₹${data.currentBid} placed!`);
      }
    });

    return () => {
      socket.off("newBid");
    };
  }, [id]);

  const fetchAuction = async () => {
    try {
      const res = await API.get(`/auctions/${id}`);
      setAuction(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load auction details");
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async () => {
    if (!bidAmount || Number(bidAmount) <= auction.currentBid) {
      toast.error(`Bid must be greater than ₹${auction.currentBid}`);
      return;
    }

    try {
      await API.post("/bids", {
        auctionId: Number(id),
        amount: Number(bidAmount),
      });

      toast.success("Bid placed successfully!");
      setBidAmount("");
      fetchAuction();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place bid");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Auction not found</p>
      </div>
    );
  }

  const timeLeft = () => {
    const end = new Date(auction.endTime);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return "Auction Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (3600000)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m left`;
    return `${hours}h ${minutes}m left`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Image */}
              {auction.image && (
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={`http://localhost:5000${auction.image}`}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      auction.status === "active" 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                    }`}>
                      {auction.status === "active" ? "Live" : "Closed"}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{auction.title}</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">{auction.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <User className="w-5 h-5" />
                    <span>Seller: <strong>{auction.seller?.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Ends: {new Date(auction.endTime).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 text-sm">Current Bid</p>
                      <p className="text-4xl font-bold text-indigo-600">₹{auction.currentBid}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">Time Remaining</p>
                      <p className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        {timeLeft()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Bid Section */}
                {auction.status === "active" ? (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Place Your Bid</h3>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder={`Min: ₹${auction.currentBid + 1}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={placeBid}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <Gavel className="w-5 h-5" />
                        Place Bid
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-lg p-4 mb-6 text-center">
                    <p className="text-red-600 font-semibold">🔒 This auction has ended</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Winner Section */}
            {auction.status === "closed" && auction.winner && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-400"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <h3 className="text-xl font-bold text-gray-800">Winner!</h3>
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-2">{auction.winner.name}</p>
                <p className="text-gray-600 mb-4">Winning bid: ₹{auction.currentBid}</p>
                {auction.paymentStatus !== "paid" && (
                  <Link to={`/payment/${auction.id}`}>
                    <button className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Pay Now
                    </button>
                  </Link>
                )}
              </motion.div>
            )}
            
            {/* Bid History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-pink-600 p-4">
                <div className="flex items-center gap-2 text-white">
                  <History className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Bid History</h3>
                </div>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                {auction.bids?.length > 0 ? (
                  <div className="space-y-3">
                    {auction.bids.map((bid, index) => (
                      <AnimatePresence key={bid.id}>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-800">{bid.bidder?.name}</span>
                            <span className="text-indigo-600 font-bold">₹{bid.amount}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(bid.createdAt).toLocaleString()}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No bids yet. Be the first!</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionDetails;