// Payment.jsx — Razorpay payment integration
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import { bookingService } from "../services/bookingService";
import api from "../services/api";

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  
useEffect(() => {
  fetchBooking();
  // Razorpay script load பண்ணு
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.onload = () => console.log("Razorpay loaded ✅");
  script.onerror = () => console.log("Razorpay failed ❌");
  document.body.appendChild(script);
}, []);

  const fetchBooking = async () => {
    try {
      const data = await bookingService.getMyBookings();
      const found = data.bookings.find((b) => b._id === bookingId);
      if (!found) {
        toast.error("Booking not found");
        navigate("/history");
        return;
      }
      setBooking(found);
      if (found.paymentStatus === "paid") setPaid(true);
    } catch (error) {
      toast.error("Failed to load booking");
      navigate("/history");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      // Step 1 — Razorpay order create பண்ணு
      const res = await api.post(`/bookings/${bookingId}/create-order`);
      const { order, key } = res.data;

      // Step 2 — Razorpay checkout popup open பண்ணு
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "BusGo",
        description: `Booking #${bookingId.slice(-6).toUpperCase()}`,
        order_id: order.id,
        handler: async (response) => {
          // Step 3 — Payment success — verify பண்ணு
          try {
            await api.post(`/bookings/${bookingId}/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPaid(true);
            toast.success("Payment successful! 🎉");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: booking?.user?.name || "",
          email: booking?.user?.email || "",
        },
        theme: {
          color: "#6C63FF",
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-300 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-200 border border-white/10 rounded-2xl p-8"
        >
          {/* Success State */}
          {paid ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Payment Successful!
              </h2>
              <p className="text-slate-400 text-sm mb-2">
                Your seats are confirmed
              </p>
              {booking?.paymentId && (
                <p className="text-xs text-slate-500 mb-6">
                  Payment ID: {booking.paymentId}
                </p>
              )}

              <div className="bg-dark-300 rounded-xl p-4 text-left mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Route</span>
                  <span className="text-white capitalize">
                    {booking?.busSnapshot?.from} → {booking?.busSnapshot?.to}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Seats</span>
                  <span className="text-white">
                    {booking?.seats?.sort((a, b) => a - b).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Amount Paid</span>
                  <span className="text-primary font-bold">
                    ₹{booking?.totalAmount}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/history")}
                  className="flex-1 bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  View Bookings
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/")}
                  className="flex-1 border border-white/10 text-slate-400 hover:text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Home
                </motion.button>
              </div>
            </motion.div>

          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-6">
                Complete Payment
              </h2>

              {/* Order Summary */}
              <div className="bg-dark-300 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Bus</span>
                  <span className="text-white">{booking?.busSnapshot?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Route</span>
                  <span className="text-white capitalize">
                    {booking?.busSnapshot?.from} → {booking?.busSnapshot?.to}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Seats</span>
                  <span className="text-white">
                    {booking?.seats?.sort((a, b) => a - b).join(", ")}
                  </span>
                </div>
                <div className="border-t border-white/5 pt-2 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-primary font-bold text-lg">
                    ₹{booking?.totalAmount}
                  </span>
                </div>
              </div>

              {/* Razorpay Info */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                <p className="text-xs text-slate-400 text-center">
                  🔒 Secured by Razorpay — Test Mode
                </p>
                <p className="text-xs text-slate-500 text-center mt-1">
                  Test Card: 4111 1111 1111 1111 | CVV: 123 | Expiry: 12/28
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={paying}
                className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {paying ? "Opening Payment..." : `Pay ₹${booking?.totalAmount}`}
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}