const axios = require("axios");

const sendSMS = async (phone, message) => {
  const gatewayUrl = process.env.SMS_GATEWAY_URL;
  console.log("Gateway URL from env:", gatewayUrl);
  
  if (!gatewayUrl) {
    console.error("SMS_GATEWAY_URL not set!");
    return;
  }

  const url = `${gatewayUrl}/send-sms`;
  console.log("Full SMS URL:", url);

  try {
    const response = await axios.post(url, {
      phone: phone,
      message: message,
    });
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
  const message = `BusGo: Payment of Rs.${booking.totalAmount} successful!`;
  await sendSMS(phone, message);
};

exports.sendBookingCancelledSMS = async (phone, booking) => {
  if (!phone) return;
  const message = `BusGo: Booking Cancelled. ${booking.busSnapshot?.from} to ${booking.busSnapshot?.to}.`;
  await sendSMS(phone, message);
};