import { Link } from "react-router-dom";    
import { motion } from "framer-motion";
import { Clock, DollarSign, User, Eye } from "lucide-react";

function AuctionCard({ auction }) {
  const timeLeft = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        {auction.image ? (
          <img
            src={`http://localhost:5000${auction.image}`}
            alt={auction.title}
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <DollarSign className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            auction.status === "active" 
              ? "bg-green-500 text-white" 
              : "bg-red-500 text-white"
          }`}>
            {auction.status === "active" ? "Live" : "Closed"}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {auction.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {auction.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Current Bid</span>
            </div>
            <span className="text-xl font-bold text-indigo-600">
              ₹{auction.currentBid}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Time Left</span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {timeLeft(auction.endTime)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">Seller</span>
            </div>
            <span className="text-sm text-gray-700">
              {auction.seller?.name}
            </span>
          </div>
        </div>
        
        <Link to={`/auction/${auction.id}`}>
          <button className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group">
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
            View Details
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

export default AuctionCard;
