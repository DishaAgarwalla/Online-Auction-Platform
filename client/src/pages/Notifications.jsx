import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, DollarSign, Award, Clock } from "lucide-react";
import API from "../services/api";
import socket from "../services/socket";
import toast from "react-hot-toast";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    
    socket.on("notification", (data) => {
      toast.success(data.message);
      fetchNotifications();
    });
    
    return () => {
      socket.off("notification");
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getIcon = (message) => {
    if (message.includes("Bid")) return <DollarSign className="w-5 h-5 text-green-500" />;
    if (message.includes("Won")) return <Award className="w-5 h-5 text-yellow-500" />;
    if (message.includes("ended")) return <Clock className="w-5 h-5 text-orange-500" />;
    return <Bell className="w-5 h-5 text-indigo-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 p-6">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-white" />
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                {notifications.length}
              </span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                      !notification.isRead ? "bg-indigo-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getIcon(notification.message)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-gray-800 ${!notification.isRead ? "font-semibold" : ""}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">We'll notify you when something happens</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Notifications;