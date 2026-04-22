// SeatSelector.jsx — Visual seat map, click பண்ணி select பண்ணலாம்
import React from "react";
import { motion } from "framer-motion";

export default function SeatSelector({ totalSeats, bookedSeats, selectedSeats, onSeatClick }) {

  const getSeatStatus = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return "booked";
    if (selectedSeats.includes(seatNumber)) return "selected";
    return "available";
  };

  const getSeatStyle = (status) => {
    switch (status) {
      case "booked":
        return "bg-red-500/20 border-red-500/40 text-red-400 cursor-not-allowed";
      case "selected":
        return "bg-primary border-primary text-white cursor-pointer";
      default:
        return "bg-dark-300 border-white/10 text-slate-400 hover:border-primary/50 cursor-pointer";
    }
  };

  // Seats ஐ rows of 4 ஆ split பண்றோம் (2+2 bus layout)
  const rows = [];
  for (let i = 1; i <= totalSeats; i += 4) {
    rows.push([i, i + 1, i + 2, i + 3].filter((s) => s <= totalSeats));
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-dark-300 border border-white/10" />
          <span className="text-slate-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary border border-primary" />
          <span className="text-slate-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-red-500/20 border border-red-500/40" />
          <span className="text-slate-400">Booked</span>
        </div>
      </div>

      {/* Bus front indicator */}
      <div className="text-center mb-4">
        <span className="text-xs text-slate-500 bg-white/5 px-4 py-1 rounded-full">
          🚌 Front
        </span>
      </div>

      {/* Seat Grid */}
      <div className="space-y-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-center gap-2">
            {/* Left side — 2 seats */}
            <div className="flex gap-2">
              {row.slice(0, 2).map((seat) => {
                const status = getSeatStatus(seat);
                return (
                  <motion.button
                    key={seat}
                    whileHover={status !== "booked" ? { scale: 1.1 } : {}}
                    whileTap={status !== "booked" ? { scale: 0.95 } : {}}
                    onClick={() => status !== "booked" && onSeatClick(seat)}
                    className={`w-10 h-10 rounded-lg border text-xs font-semibold transition-all ${getSeatStyle(status)}`}
                  >
                    {seat}
                  </motion.button>
                );
              })}
            </div>

            {/* Aisle gap */}
            <div className="w-8" />

            {/* Right side — 2 seats */}
            <div className="flex gap-2">
              {row.slice(2, 4).map((seat) => {
                const status = getSeatStatus(seat);
                return (
                  <motion.button
                    key={seat}
                    whileHover={status !== "booked" ? { scale: 1.1 } : {}}
                    whileTap={status !== "booked" ? { scale: 0.95 } : {}}
                    onClick={() => status !== "booked" && onSeatClick(seat)}
                    className={`w-10 h-10 rounded-lg border text-xs font-semibold transition-all ${getSeatStyle(status)}`}
                  >
                    {seat}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}