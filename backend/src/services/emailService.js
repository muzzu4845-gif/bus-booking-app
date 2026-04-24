// emailService.js — Email notifications using Nodemailer
const nodemailer = require("nodemailer");

// Gmail transporter create பண்ணு
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Booking Confirmation Email ─────────────────────────────────────────────
exports.sendBookingConfirmation = async (userEmail, userName, booking) => {
  const mailOptions = {
    from: `"BusGo 🚌" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Booking Confirmed! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D14; color: #e2e8f0; padding: 30px; border-radius: 12px;">
        <h1 style="color: #6C63FF; text-align: center;">🚌 BusGo</h1>
        <h2 style="text-align: center;">Booking Confirmed!</h2>
        
        <div style="background: #1E1E2E; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Your booking is confirmed! 🎉</p>
          
          <hr style="border-color: #333; margin: 15px 0;">
          
          <p>🚌 <strong>Bus:</strong> ${booking.busSnapshot?.name}</p>
          <p>📍 <strong>Route:</strong> ${booking.busSnapshot?.from} → ${booking.busSnapshot?.to}</p>
          <p>🕐 <strong>Departure:</strong> ${booking.busSnapshot?.departureTime}</p>
          <p>💺 <strong>Seats:</strong> ${booking.seats?.join(", ")}</p>
          <p>💰 <strong>Total:</strong> ₹${booking.totalAmount}</p>
          <p>🎫 <strong>Booking ID:</strong> ${booking._id}</p>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 12px;">
          Thank you for choosing BusGo! Have a safe journey. 🙏
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ── Payment Success Email ──────────────────────────────────────────────────
exports.sendPaymentSuccess = async (userEmail, userName, booking) => {
  const mailOptions = {
    from: `"BusGo 🚌" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Payment Successful! 💳",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D14; color: #e2e8f0; padding: 30px; border-radius: 12px;">
        <h1 style="color: #6C63FF; text-align: center;">🚌 BusGo</h1>
        <h2 style="text-align: center;">Payment Successful! 💳</h2>
        
        <div style="background: #1E1E2E; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Your payment has been received successfully!</p>
          
          <hr style="border-color: #333; margin: 15px 0;">
          
          <p>📍 <strong>Route:</strong> ${booking.busSnapshot?.from} → ${booking.busSnapshot?.to}</p>
          <p>💺 <strong>Seats:</strong> ${booking.seats?.join(", ")}</p>
          <p>💰 <strong>Amount Paid:</strong> ₹${booking.totalAmount}</p>
          <p>🧾 <strong>Payment ID:</strong> ${booking.paymentId}</p>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 12px;">
          Thank you for choosing BusGo! Have a safe journey. 🙏
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ── Booking Cancelled Email ────────────────────────────────────────────────
exports.sendBookingCancellation = async (userEmail, userName, booking) => {
  const mailOptions = {
    from: `"BusGo 🚌" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Booking Cancelled",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D14; color: #e2e8f0; padding: 30px; border-radius: 12px;">
        <h1 style="color: #6C63FF; text-align: center;">🚌 BusGo</h1>
        <h2 style="text-align: center;">Booking Cancelled</h2>
        
        <div style="background: #1E1E2E; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Your booking has been cancelled.</p>
          
          <hr style="border-color: #333; margin: 15px 0;">
          
          <p>📍 <strong>Route:</strong> ${booking.busSnapshot?.from} → ${booking.busSnapshot?.to}</p>
          <p>💺 <strong>Seats:</strong> ${booking.seats?.join(", ")}</p>
          <p>💰 <strong>Amount:</strong> ₹${booking.totalAmount}</p>
          ${booking.paymentStatus === "refunded" ? "<p>💸 <strong>Refund:</strong> Will be processed in 5-7 days</p>" : ""}
        </div>
        
        <p style="text-align: center; color: #666; font-size: 12px;">
          We hope to see you again on BusGo! 🙏
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};