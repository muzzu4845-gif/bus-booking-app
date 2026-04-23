// SearchBus.jsx — Search results page
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";
import BusCard from "../components/bus/BusCard";
import { busService } from "../services/busService";

const CITIES = [
  "Chennai", "Bangalore", "Tirupattur", "Vellore",
  "Salem", "Coimbatore", "Madurai", "Trichy",
  "Hyderabad", "Mumbai"
];

export default function SearchBus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    date: searchParams.get("date") || "",
  });

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Page load ஆகும் போது auto search
  useEffect(() => {
    if (form.from && form.to) {
      handleSearch();
    }
  }, []); // eslint-disable-line

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!form.from || !form.to) return;

    setLoading(true);
    setSearched(true);

    try {
      const data = await busService.searchBuses(form.from, form.to, form.date);
      setBuses(data.buses);

      const dateQuery = form.date ? `&date=${form.date}` : "";
      navigate(`/search?from=${form.from}&to=${form.to}${dateQuery}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Search failed:", error);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-200 border border-white/10 rounded-2xl p-5 mb-8"
        >
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

              {/* From Dropdown */}
              <select
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                required
                className="bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">From</option>
                {CITIES.map((city) => (
                  <option key={city} value={city.toLowerCase()}>{city}</option>
                ))}
              </select>

              {/* To Dropdown */}
              <select
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                required
                className="bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">To</option>
                {CITIES.filter(c => c.toLowerCase() !== form.from).map((city) => (
                  <option key={city} value={city.toLowerCase()}>{city}</option>
                ))}
              </select>

              {/* Date — Optional */}
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                min={today}
                className="bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary hover:bg-primary/80 text-white text-sm font-semibold py-2.5 rounded-lg transition-all"
              >
                Search
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-dark-200 border border-white/10 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-1/3 mb-3" />
                <div className="h-8 bg-white/5 rounded w-1/2 mb-3" />
                <div className="h-4 bg-white/5 rounded w-full" />
              </div>
            ))}
          </div>
        ) : searched && buses.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <span className="text-5xl">🚌</span>
            <h3 className="text-white text-xl font-semibold mt-4">No buses found</h3>
            <p className="text-slate-400 mt-2">Try a different route or date</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {searched && (
              <p className="text-slate-400 text-sm">
                <span className="text-white font-semibold">{buses.length}</span> buses found
              </p>
            )}
            {buses.map((bus) => (
              <BusCard key={bus._id} bus={bus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}