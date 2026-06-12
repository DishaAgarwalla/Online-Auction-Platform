import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Shield, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

function Payment() {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuction();
  }, []);

  const fetchAuction = async () => {
    try {
      const res = await API.get(`/auctions/${auctionId}`);
      setAuction(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load auction details");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await API.post(`/payments/create-order/${auctionId}`);
      const order = res.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "BidSphere",
        description: `Payment for ${auction.title}`,
        image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            await API.post("/payments/verify", {
              auctionId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment Successful!");
            fetchAuction();
            setTimeout(() => navigate("/dashboard"), 2000);
          } catch (error) {
            console.log(error);
            toast.error("Payment Verification Failed");
          }
        },
        prefill: {
          name: "BidSphere User",
          email: "user@example.com",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create payment order");
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 p-6">
            <button
              onClick={() => navigate(-1)}
              className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-white" />
              <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
            </div>
          </div>

          <div className="p-6">
            {/* Auction Details */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{auction.title}</h2>
              <p className="text-gray-600 mb-4">{auction.description}</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Winning Amount:</span>
                  <span className="text-3xl font-bold text-indigo-600">₹{auction.currentBid}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {auction.paymentStatus === "paid" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 rounded-lg p-6 text-center border-2 border-green-500"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-600 mb-2">Payment Completed!</h3>
                <p className="text-gray-600">Thank you for your purchase. The item will be shipped soon.</p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Payment Info */}
                <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      Your payment is secured by Razorpay. We never store your card details.
                    </p>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay ₹{auction.currentBid}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <AlertCircle className="w-3 h-3" />
                  <span>You'll be redirected to Razorpay's secure payment gateway</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Payment;