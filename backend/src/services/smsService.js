// smsService.js — SMS using Android SMS Gateway via ngrok
const axios = require("axios");

const NGROK_URL = process.env.SMS_GATEWAY_URL || "https://entire-aqueduct-custard.ngrok-free.dev";

const sendSMS = async (phone, message) => {
  try {
    const response = await axios.post(
      `${NGROK_URL}/send-sms`,
      {
        phone: phone,
        message: message,
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
  const message = `BusGo: Payment of Rs.${booking.totalAmount} successful! Payment ID: ${booking.paymentId}`;
  await sendSMS(phone, message);
};

exports.sendBookingCancelledSMS = async (phone, booking) => {
  if (!phone) return;
  const message = `BusGo: Booking Cancelled. ${booking.busSnapshot?.from} to ${booking.busSnapshot?.to}. Seats released.`;
  await sendSMS(phone, message);
};