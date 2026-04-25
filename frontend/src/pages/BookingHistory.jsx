// BookingHistory.jsx — User's all bookings
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import { bookingService } from "../services/bookingService";
import { notifyBookingCancelled } from "../services/notificationService";

// Status badge colors
const statusColors = {
  confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const paymentColors = {
  paid: "bg-primary/10 text-primary border-primary/20",
  unpaid: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  refunded: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function BookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null); // Which booking is cancelling

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data.bookings);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;

    setCancelling(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success("Booking cancelled");
      notifyBookingCancelled(booking); // ← இதை add பண்ணு
      fetchBookings(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white">My Bookings</h1>
          <p className="text-slate-400 text-sm mt-1">
            All your travel history in one place
          </p>
        </motion.div>

        {loading ? (
          // Skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-dark-200 border border-white/10 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-1/3 mb-3" />
                <div className="h-6 bg-white/5 rounded w-1/2 mb-3" />
                <div className="h-4 bg-white/5 rounded w-full" />
              </div>
            ))}
          </div>

        ) : bookings.length === 0 ? (
          // Empty state
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-5xl">🎟️</span>
            <h3 className="text-white text-xl font-semibold mt-4">
              No bookings yet
            </h3>
            <p className="text-slate-400 mt-2 mb-6">
              Book your first journey today!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary/80 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
            >
              Search Buses
            </motion.button>
          </motion.div>

        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-dark-200 border border-white/10 rounded-2xl p-6"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">
                        {booking.busSnapshot?.name || booking.bus?.name}
                      </h3>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {booking._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${paymentColors[booking.paymentStatus]}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Journey */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-white font-semibold capitalize">
                      {booking.busSnapshot?.from || booking.bus?.from}
                    </span>
                    <span className="text-slate-600">→</span>
                    <span className="text-white font-semibold capitalize">
                      {booking.busSnapshot?.to || booking.bus?.to}
                    </span>
                    <span className="text-slate-500 text-sm ml-auto">
                      {booking.busSnapshot?.date || booking.bus?.date}
                    </span>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="text-sm">
                      <span className="text-slate-400">Seats: </span>
                      <span className="text-white">
                        {booking.seats.sort((a, b) => a - b).join(", ")}
                      </span>
                      <span className="text-primary font-bold ml-4">
                        ₹{booking.totalAmount}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {/* Pay button — unpaid confirmed booking */}
                      {booking.paymentStatus === "unpaid" &&
                        booking.status === "confirmed" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/payment/${booking._id}`)}
                            className="text-xs bg-primary hover:bg-primary/80 text-white px-3 py-1.5 rounded-lg transition-all"
                          >
                            Pay Now
                          </motion.button>
                        )}

                      {/* Cancel button */}
                      {booking.status === "confirmed" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelling === booking._id}
                          className="text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                        >
                          {cancelling === booking._id ? "..." : "Cancel"}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}