// Home.jsx — Landing page with hero section + search form
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../hooks/useAuth";

// Animation variants — staggered reveal effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.date) return;
    // Query params ஆ pass பண்றோம் — SearchBus page la read பண்ணுவோம்
    navigate(`/search?from=${form.from}&to=${form.to}&date=${form.date}`);
  };

  // Today's date — date picker la past date select பண்ண முடியாம
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(108,99,255,0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(108,99,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-3xl text-center relative z-10"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm px-4 py-1.5 rounded-full">
              🚌 Book smarter, travel better
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4"
          >
            Your journey starts
            <span className="text-primary block">here</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-lg mb-10 max-w-xl mx-auto"
          >
            Search hundreds of bus routes, pick your seats, and book in seconds.
          </motion.p>

          {/* Search Form */}
          <motion.div
            variants={itemVariants}
            className="bg-dark-200 border border-white/10 rounded-2xl p-6"
          >
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                {/* From */}
                <div className="text-left">
                  <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">
                    From
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={form.from}
                    onChange={handleChange}
                    placeholder="Chennai"
                    required
                    className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* To */}
                <div className="text-left">
                  <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">
                    To
                  </label>
                  <input
                    type="text"
                    name="to"
                    value={form.to}
                    onChange={handleChange}
                    placeholder="Bangalore"
                    required
                    className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Date */}
                <div className="text-left">
                  <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={today}
                    required
                    className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-lg transition-all"
              >
                🔍 Search Buses
              </motion.button>
            </form>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 mt-10"
          >
            {[
              { value: "500+", label: "Routes" },
              { value: "50K+", label: "Happy Travelers" },
              { value: "100%", label: "Secure Booking" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}