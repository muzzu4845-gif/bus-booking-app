// Login.jsx — Login page with form
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login(form);
      login(data.user, data.token);       // AuthContext la save பண்றோம்
      toast.success(`Welcome back, ${data.user.name}!`);

      // Admin-ஆ இருந்தா dashboard, இல்லன்னா home
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center px-4">

      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-dark-200 border border-white/10 rounded-2xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl">🚌</span>
            <h1 className="text-2xl font-bold text-white mt-2">
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Login to continue your journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

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
                placeholder="••••••••"
                required
                className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Register Link */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}