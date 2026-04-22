// ProtectedRoute.jsx — Login இல்லன்னா /login page க்கு redirect பண்ணும்
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// adminOnly={true} pass பண்ணா admin மட்டும் access பண்ணலாம்
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}