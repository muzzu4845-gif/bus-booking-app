// bookingService.js — Booking related API calls
import api from "./api";

export const bookingService = {
  createBooking: async (busId, seats) => {
    const res = await api.post("/bookings", { busId, seats });
    return res.data;
  },

  getMyBookings: async () => {
    const res = await api.get("/bookings/my");
    return res.data;
  },

  cancelBooking: async (id) => {
    const res = await api.put(`/bookings/${id}/cancel`);
    return res.data;
  },

  payBooking: async (id) => {
    const res = await api.post(`/bookings/${id}/pay`);
    return res.data;
  },
};