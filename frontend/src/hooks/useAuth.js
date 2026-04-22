// useAuth.js — AuthContext use பண்ண shortcut hook
// import { useContext } from "react" எழுதாம இதை use பண்ணலாம்
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}