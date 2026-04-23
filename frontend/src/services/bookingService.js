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

  createOrder: async (id) => {
    const res = await api.post(`/bookings/${id}/create-order`);
    return res.data;
  },

  verifyPayment: async (id, paymentData) => {
    const res = await api.post(`/bookings/${id}/verify-payment`, paymentData);
    return res.data;
  },
};