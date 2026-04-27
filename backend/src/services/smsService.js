// smsService.js — SMS using TextBelt (1 free SMS/day)
const axios = require("axios");

const sendSMS = async (phone, message) => {
  try {
    const response = await axios.post(
      "https://textbelt.com/text",
      {
        phone: `+91${phone}`,
        message: message,
        key: "textbelt", // free key — 1 SMS/day
      }
    );
    console.log("SMS sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("SMS failed:", error.message);
  }
};

exports.sendBookingConfirmedSMS = async (phone, booking) => {
  if (!phone) return;
  const message = `BusGo: Booking Confirmed! ${booking.busSnapshot?.from} to ${booking.busSnapshot?.to}. Seats: ${booking.seats?.join(", ")}. Amount: Rs.${booking.totalAmount}.`;
  await sendSMS(phone, message);
};

exports.sendPaymentSuccessSMS = async (phone, booking) => {
  if (!phone) return;
  const message = `BusGo: Payment Successful! Rs.${booking.totalAmount} paid. Payment ID: ${booking.paymentId}`;
  await sendSMS(phone, message);
};

exports.sendBookingCancelledSMS = async (phone, booking) => {
  if (!phone) return;
  const message = `BusGo: Booking Cancelled. ${booking.busSnapshot?.from} to ${booking.busSnapshot?.to}. Seats released.`;
  await sendSMS(phone, message);
};
