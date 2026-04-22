// busService.js — Bus related API calls
import api from "./api";

export const busService = {
  // Search buses — query params pass பண்றோம்
  searchBuses: async (from, to, date) => {
    const res = await api.get(`/buses/search?from=${from}&to=${to}&date=${date}`);
    return res.data;
  },

  // Single bus details
  getBus: async (id) => {
    const res = await api.get(`/buses/${id}`);
    return res.data;
  },
};