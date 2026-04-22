// BusCard.jsx — ஒரு bus result எப்படி தெரியணும்னு define பண்றோம்
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function BusCard({ bus }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBook = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a seat");
      navigate("/login");
      return;
    }
    navigate(`/booking/${bus._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-dark-200 border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all"
    >
      {/* Top Row — Bus name + Type badge */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg">{bus.name}</h3>
          <p className="text-slate-500 text-xs mt-0.5">{bus.busNumber}</p>
        </div>
        <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full border border-primary/20">
          {bus.busType}
        </span>
      </div>

      {/* Journey Info — From → To */}
      <div className="flex items-center gap-4 mb-5">

        {/* Departure */}
        <div className="text-center">
          <p className="text-white text-xl font-bold">{bus.departureTime}</p>
          <p className="text-slate-400 text-sm capitalize">{bus.from}</p>
        </div>

        {/* Duration line */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <p className="text-slate-500 text-xs">{bus.duration}</p>
          <div className="w-full flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs">🚌</span>
            <div className="flex-1 h-px bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-secondary" />
          </div>
        </div>

        {/* Arrival */}
        <div className="text-center">
          <p className="text-white text-xl font-bold">{bus.arrivalTime}</p>
          <p className="text-slate-400 text-sm capitalize">{bus.to}</p>
        </div>
      </div>

      {/* Amenities */}
      {bus.amenities?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {bus.amenities.map((item) => (
            <span
              key={item}
              className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-md"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Row — Price + Seats + Book */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">

        <div>
          <span className="text-2xl font-bold text-white">
            ₹{bus.price}
          </span>
          <span className="text-slate-500 text-sm"> / seat</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Available seats */}
          <span className={`text-sm ${bus.availableSeats < 5 ? "text-red-400" : "text-green-400"}`}>
            {bus.availableSeats} seats left
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBook}
            disabled={bus.availableSeats === 0}
            className="bg-primary hover:bg-primary/80 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {bus.availableSeats === 0 ? "Full" : "Book Now"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}