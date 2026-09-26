import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000; // ms
  } catch {
    return null;
  }
}

export default function useSessionTimeout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    const msLeft = expiry - Date.now();
    if (msLeft <= 0) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true, state: { reason: "session_expired" } });
      return;
    }

    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login", { replace: true, state: { reason: "session_expired" } });
    }, msLeft);

    return () => clearTimeout(timer);
  }, [navigate]);
}