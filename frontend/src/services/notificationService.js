// notificationService.js — Browser Push Notifications

// Permission கேளு
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Browser doesn't support notifications");
    return false;
  }

  if (Notification.permission === "granted") return true;

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

// Notification show பண்ணு
export const showNotification = (title, body, icon = "🚌") => {
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
  });
};

// Booking confirmed notification
export const notifyBookingConfirmed = (booking) => {
  showNotification(
    "Booking Confirmed! 🎉",
    `${booking.busSnapshot?.from} → ${booking.busSnapshot?.to} | Seats: ${booking.seats?.join(", ")}`
  );
};

// Payment success notification
export const notifyPaymentSuccess = (booking) => {
  showNotification(
    "Payment Successful! 💳",
    `₹${booking.totalAmount} paid for ${booking.busSnapshot?.from} → ${booking.busSnapshot?.to}`
  );
};

// Booking cancelled notification
export const notifyBookingCancelled = (booking) => {
  showNotification(
    "Booking Cancelled ❌",
    `${booking.busSnapshot?.from} → ${booking.busSnapshot?.to} booking cancelled`
  );
};