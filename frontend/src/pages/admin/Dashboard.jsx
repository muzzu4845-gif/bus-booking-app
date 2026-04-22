// Dashboard.jsx — Admin overview page
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import { busService } from "../../services/busService";
import { bookingService } from "../../services/bookingService";
import api from "../../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [busRes, bookingRes] = await Promise.all([
        api.get("/buses/admin/all"),
        api.get("/bookings/admin/all"),
      ]);

      const bookings = bookingRes.data.bookings;
      const totalRevenue = bookings
        .filter((b) => b.paymentStatus === "paid")
        .reduce((sum, b) => sum + b.totalAmount, 0);

      setStats({
        totalBuses: busRes.data.count,
        totalBookings: bookings.length,
        totalRevenue,
        recentBookings: bookings.slice(0, 5), // Latest 5
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Buses",
      value: stats.totalBuses,
      icon: "🚌",
      color: "from-primary/20 to-primary/5",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: "🎟️",
      color: "from-secondary/20 to-secondary/5",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: "💰",
      color: "from-green-500/20 to-green-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Overview of your bus booking system
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/buses")}
            className="bg-primary hover:bg-primary/80 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
          >
            + Add Bus
          </motion.button>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${card.color} border border-white/10 rounded-2xl p-6`}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <div className="text-slate-400 text-sm mt-1">{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-200 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Recent Bookings</h2>
            <span className="text-slate-500 text-xs">Latest 5</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats.recentBookings.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">
              No bookings yet
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-3 bg-dark-300 rounded-xl"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {booking.user?.name || "Unknown"}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {booking.busSnapshot?.from} → {booking.busSnapshot?.to} •{" "}
                      {booking.seats?.length} seat(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-semibold text-sm">
                      ₹{booking.totalAmount}
                    </p>
                    <p
                      className={`text-xs ${
                        booking.paymentStatus === "paid"
                          ? "text-green-400"
                          : "text-slate-500"
                      }`}
                    >
                      {booking.paymentStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}