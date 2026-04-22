// BookingPage.jsx — Seat select பண்ணி booking confirm பண்றது
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import SeatSelector from "../components/booking/SeatSelector";
import { busService } from "../services/busService";
import { bookingService } from "../services/bookingService";

export default function BookingPage() {
  const { busId } = useParams(); // URL la இருந்து busId எடு
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(false);

  // Bus details fetch பண்ணு
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const data = await busService.getBus(busId);
        setBus(data.bus);
      } catch (error) {
        toast.error("Bus not found");
        navigate("/search");
      } finally {
        setLoading(false);
      }
    };
    fetchBus();
  }, [busId, navigate]);

  // Seat click — select or deselect
  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber) // Already selected — remove
        : [...prev, seatNumber]                 // Not selected — add
    );
  };

  // Booking confirm
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    setBooking(true);
    try {
      const data = await bookingService.createBooking(busId, selectedSeats);
      toast.success("Booking confirmed! 🎉");
      // Payment page க்கு redirect பண்ணு
      navigate(`/payment/${data.booking._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-300 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const totalAmount = bus.price * selectedSeats.length;

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >

          {/* Left — Seat Selector */}
          <div className="md:col-span-2 bg-dark-200 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-lg mb-1">
              Select Seats
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {bus.name} • {bus.from} → {bus.to} • {bus.date}
            </p>

            <SeatSelector
              totalSeats={bus.totalSeats}
              bookedSeats={bus.bookedSeats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
            />
          </div>

          {/* Right — Booking Summary */}
          <div className="space-y-4">

            {/* Bus Info */}
            <div className="bg-dark-200 border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Trip Details</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">From</span>
                  <span className="text-white capitalize">{bus.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">To</span>
                  <span className="text-white capitalize">{bus.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>
                  <span className="text-white">{bus.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Departure</span>
                  <span className="text-white">{bus.departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration</span>
                  <span className="text-white">{bus.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bus Type</span>
                  <span className="text-primary">{bus.busType}</span>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-dark-200 border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Price Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Price per seat</span>
                  <span className="text-white">₹{bus.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected seats</span>
                  <span className="text-white">
                    {selectedSeats.length > 0
                      ? selectedSeats.sort((a, b) => a - b).join(", ")
                      : "None"}
                  </span>
                </div>
                <div className="border-t border-white/5 pt-2 mt-2 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-primary font-bold text-lg">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || booking}
              className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {booking
                ? "Confirming..."
                : `Confirm Booking${selectedSeats.length > 0 ? ` (${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""})` : ""}`}
            </motion.button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}