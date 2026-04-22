// Payment.jsx — Mock payment page
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import { bookingService } from "../services/bookingService";

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  // Booking details fetch பண்ணு
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // My bookings la இருந்து இந்த booking கண்டுபிடி
        const data = await bookingService.getMyBookings();
        const found = data.bookings.find((b) => b._id === bookingId);
        if (!found) {
          toast.error("Booking not found");
          navigate("/history");
          return;
        }
        setBooking(found);
        // Already paid-ஆ இருந்தா paid state set பண்ணு
        if (found.paymentStatus === "paid") setPaid(true);
      } catch (error) {
        toast.error("Failed to load booking");
        navigate("/history");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, navigate]);

  const handlePayment = async () => {
    setPaying(true);
    try {
      await bookingService.payBooking(bookingId);
      setPaid(true);
      toast.success("Payment successful! 🎉");
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed. Try again!");
    } finally {
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

              {/* Ticket summary */}
              <div className="bg-dark-300 rounded-xl p-4 text-left mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Route</span>
                  <span className="text-white capitalize">
                    {booking?.busSnapshot?.from} → {booking?.busSnapshot?.to}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Date</span>
                  <span className="text-white">{booking?.busSnapshot?.date}</span>
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
            // Payment Form
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
                  <span className="text-slate-400">Date</span>
                  <span className="text-white">{booking?.busSnapshot?.date}</span>
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

              {/* Mock Card UI */}
              <div className="bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 rounded-xl p-5 mb-6">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">
                  Mock Payment — No real money involved
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number: 4242 4242 4242 4242"
                    disabled
                    className="w-full bg-dark-300/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-500 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY: 12/28"
                      disabled
                      className="bg-dark-300/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-500 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="CVV: 123"
                      disabled
                      className="bg-dark-300/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={paying}
                className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {paying ? "Processing..." : `Pay ₹${booking?.totalAmount}`}
              </motion.button>

              <p className="text-center text-xs text-slate-600 mt-3">
                🔒 This is a mock payment — no real transaction
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}