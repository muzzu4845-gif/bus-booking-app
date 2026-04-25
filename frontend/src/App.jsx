// App.jsx — Routing setup + AuthProvider wrap பண்றோம்
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchBus from "./pages/SearchBus";
import BookingPage from "./pages/BookingPage";
import BookingHistory from "./pages/BookingHistory";
import Payment from "./pages/Payment";
import Dashboard from "./pages/admin/Dashboard";
import ManageBuses from "./pages/admin/ManageBuses";
import { requestNotificationPermission } from "./services/notificationService";

export default function App() {

  // ← இதை add பண்ணு
  useEffect(() => {
    requestNotificationPermission();
  }, []); 
  
  return (
    <BrowserRouter>
      {/* AuthProvider — எல்லா pages க்கும் user state கிடைக்கும் */}
      <AuthProvider>

        {/* Toast notifications — react-hot-toast */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1E1E2E",
              color: "#e2e8f0",
              border: "1px solid #6C63FF",
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchBus />} />

          {/* Protected Routes — login வேணும் */}
          <Route
            path="/booking/:busId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes — admin மட்டும் */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/buses"
            element={
              <ProtectedRoute adminOnly={true}>
                <ManageBuses />
              </ProtectedRoute>
            }
          />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}