// helpers.js — Utility functions: date formatting, price formatting, etc.
// TODO: Added as needed

export const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IN");
export const formatPrice = (amount) => `₹${amount.toLocaleString("en-IN")}`;
