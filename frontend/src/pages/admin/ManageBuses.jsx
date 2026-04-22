// ManageBuses.jsx — Admin can add, view, delete buses
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

const emptyForm = {
  name: "",
  busNumber: "",
  from: "",
  to: "",
  departureTime: "",
  arrivalTime: "",
  duration: "",
  price: "",
  totalSeats: "",
  busType: "AC",
  amenities: "",
  date: "",
};

export default function ManageBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const res = await api.get("/buses/admin/all");
      setBuses(res.data.buses);
    } catch (error) {
      toast.error("Failed to load buses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Amenities — comma separated string → array
      const payload = {
        ...form,
        price: Number(form.price),
        totalSeats: Number(form.totalSeats),
        from: form.from.toLowerCase(),
        to: form.to.toLowerCase(),
        amenities: form.amenities
          ? form.amenities.split(",").map((a) => a.trim())
          : [],
      };

      await api.post("/buses", payload);
      toast.success("Bus added successfully! 🚌");
      setForm(emptyForm);
      setShowForm(false);
      fetchBuses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add bus");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (busId) => {
    if (!window.confirm("Remove this bus?")) return;
    try {
      await api.delete(`/buses/${busId}`);
      toast.success("Bus removed");
      fetchBuses();
    } catch (error) {
      toast.error("Failed to remove bus");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Buses</h1>
            <p className="text-slate-400 text-sm mt-1">
              {buses.length} buses total
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/80 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
          >
            {showForm ? "✕ Cancel" : "+ Add Bus"}
          </motion.button>
        </motion.div>

        {/* Add Bus Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-dark-200 border border-white/10 rounded-2xl p-6 mb-6 overflow-hidden"
            >
              <h2 className="text-white font-semibold mb-5">Add New Bus</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                  {[
                    { name: "name", placeholder: "Bus Name (e.g. Sri Travels)", label: "Bus Name" },
                    { name: "busNumber", placeholder: "Bus Number (e.g. TN01AB1234)", label: "Bus Number" },
                    { name: "from", placeholder: "From City", label: "From" },
                    { name: "to", placeholder: "To City", label: "To" },
                    { name: "departureTime", placeholder: "08:00", label: "Departure Time", type: "time" },
                    { name: "arrivalTime", placeholder: "14:30", label: "Arrival Time", type: "time" },
                    { name: "duration", placeholder: "e.g. 6h 30m", label: "Duration" },
                    { name: "price", placeholder: "Price per seat", label: "Price (₹)", type: "number" },
                    { name: "totalSeats", placeholder: "e.g. 40", label: "Total Seats", type: "number" },
                    { name: "date", placeholder: "", label: "Travel Date", type: "date" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">
                        {field.label}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        min={field.type === "date" ? today : undefined}
                        required
                        className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  ))}

                  {/* Bus Type */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">
                      Bus Type
                    </label>
                    <select
                      name="busType"
                      value={form.busType}
                      onChange={handleChange}
                      className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    >
                      {["AC", "Non-AC", "Sleeper", "Semi-Sleeper"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">
                      Amenities (comma separated)
                    </label>
                    <input
                      type="text"
                      name="amenities"
                      value={form.amenities}
                      onChange={handleChange}
                      placeholder="WiFi, USB Charging, Water Bottle"
                      className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add Bus"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bus List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-dark-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : buses.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-4xl">🚌</span>
            <p className="text-slate-400 mt-3">No buses yet — add one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {buses.map((bus, index) => (
              <motion.div
                key={bus._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-dark-200 border rounded-2xl p-5 flex items-center justify-between ${
                  bus.isActive ? "border-white/10" : "border-red-500/20 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-semibold">{bus.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {bus.busType}
                    </span>
                    {!bus.isActive && (
                      <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    {bus.busNumber} • {bus.from} → {bus.to} • {bus.date}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {bus.departureTime} → {bus.arrivalTime} •{" "}
                    <span className="text-green-400">{bus.availableSeats} seats left</span> •{" "}
                    <span className="text-primary">₹{bus.price}</span>
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(bus._id)}
                  disabled={!bus.isActive}
                  className="text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all disabled:opacity-30"
                >
                  Remove
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}