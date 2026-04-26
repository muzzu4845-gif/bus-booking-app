// Register.jsx — New account create பண்ண
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register(form);
      login(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}! 🎉`);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center px-4">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-200 border border-white/10 rounded-2xl p-8">

          <div className="text-center mb-8">
            <span className="text-4xl">🎟️</span>
            <h1 className="text-2xl font-bold text-white mt-2">
              Create account
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Start booking your journeys today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </motion.button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}