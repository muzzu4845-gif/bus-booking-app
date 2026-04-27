// smsService.js — SMS notifications using Fast2SMS
const axios = require("axios");

// ── Send SMS ──────────────────────────────────────────────────────────────────
const sendSMS = async (phone, message) => {
  try {
    const response = await axios.get(
      `https://www.fast2sms.com/dev/bulkV2`,
      {
        params: {
          authorization: process.env.FAST2SMS_API_KEY,
          route: "q",
          message: message,
          language: "english",
          flash: 0,
          numbers: phone,
        }
      }
    );
    console.log("SMS sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("SMS failed:", error.response?.data || error.message);
  }
};

// ── Booking Confirmed SMS ─────────────────────────────────────────────────────
exports.sendBookingConfirmedSMS = async (phone, booking) => {
  if (!phone) return;
  const message = `BusGo: Booking Confirmed! ${booking.busSnapshot?.from} to ${booking.busSnapshot?.to}. Seats: ${booking.seats?.join(", ")}. Amount: Rs.${booking.totalAmount}. Booking ID: ${booking._id.toString().slice(-6).toUpperCase()}`;
  await sendSMS(phone, message);
};

// ── Payment Success SMS ───────────────────────────────────────────────────────
exports.sendPaymentSuccessSMS = async (phone, booking) => {
  if (!phone) return;
  const message = `BusGo: Payment Successful! Rs.${booking.totalAmount} paid for ${booking.busSnapshot?.from} to ${booking.busSnapshot?.to}. Payment ID: ${booking.paymentId}`;
  await sendSMS(phone, message);
};

// ── Booking Cancelled SMS ─────────────────────────────────────────────────────
exports.sendBookingCancelledSMS = async (phone, booking) => {
  if (!phone) return;
  const message = `BusGo: Booking Cancelled. ${booking.busSnapshot?.from} to ${booking.busSnapshot?.to}. Seats: ${booking.seats?.join(", ")} released.`;
  await sendSMS(phone, message);
};