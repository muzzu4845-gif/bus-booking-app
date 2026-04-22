// AuthContext.jsx — User state globally provide பண்றோம்
// எந்த component லயும் useContext(AuthContext) பண்ணி user data எடுக்கலாம்
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // App load ஆகும் போது check பண்ண

  // ── App Start ஆகும் போது localStorage check பண்ணு ──────────────────────────
  // Page refresh பண்ணாலும் login state போகாம இருக்கும்
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false); // Check முடிஞ்சது
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    // localStorage la save பண்றோம் — refresh ஆனாலும் இருக்கும்
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ── Value ──────────────────────────────────────────────────────────────────
  // இந்த values எல்லா child components கும் available ஆகும்
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,              // user இருந்தா true
    isAdmin: user?.role === "admin",      // admin-ஆ இருந்தா true
  };

  return (
    <AuthContext.Provider value={value}>
      {/* loading true-ஆ இருக்கும் போது children render பண்ணாதே */}
      {/* இல்லன்னா protected routes flicker ஆகும் */}
      {!loading && children}
    </AuthContext.Provider>
  );
}