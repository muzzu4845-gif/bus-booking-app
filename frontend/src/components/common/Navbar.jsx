// Navbar.jsx — Top navigation bar
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-200/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">🚌</span>
            <span className="text-xl font-bold text-white">
              Bus<span className="text-primary">Go</span>
            </span>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/search"
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            Search Buses
          </Link>

          {isAuthenticated && (
            <Link
              to="/history"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              My Bookings
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">
                Hi, <span className="text-white">{user?.name}</span>
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-white/10 rounded-lg hover:border-white/30 transition-all"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/80 transition-all"
                >
                  Register
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-dark-200 border-b border-white/5 px-4 py-4 flex flex-col gap-4"
          >
            <Link to="/search" className="text-slate-400 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>
              Search Buses
            </Link>
            {isAuthenticated && (
              <Link to="/history" className="text-slate-400 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>
                My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-slate-400 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-left text-slate-400 hover:text-white text-sm">
                Logout
              </button>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-slate-400 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="text-primary text-sm" onClick={() => setMenuOpen(false)}>Register</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}