// AlertProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";

// safe defaults to avoid crashes if context is missing
const AlertContext = createContext({
  showSuccess: (message: string) => {},
  showError: (message: string) => {},
});

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState({
    show: false,
    type: "success", // "success" | "error"
    message: "",
  });

  // auto-hide
  useEffect(() => {
    if (!alert.show) return;
    const t = setTimeout(() => {
      setAlert((s) => ({ ...s, show: false }));
    }, 3000);
    return () => clearTimeout(t);
  }, [alert.show]);

  const showSuccess = (message : string) =>
    setAlert({ show: true, type: "success", message: String(message ?? "") });

  const showError = (message : string) =>
    setAlert({ show: true, type: "error", message: String(message ?? "") });

  return (
    <AlertContext.Provider value={{ showSuccess, showError }}>
      {children}

      {/* Simple inline-styled toast */}
      {alert.show && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 9999,
            minWidth: 220,
            maxWidth: 420,
            padding: "12px 16px",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            color: "#fff",
            background: alert.type === "success" ? "#16a34a" : "#dc2626",
            fontFamily:
              "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
            fontSize: 14,
            lineHeight: "20px",
          }}
        >
          {alert.message}
        </div>
      )}
    </AlertContext.Provider>
  );
}

// Hook consumers will use
export const useAlert = () => useContext(AlertContext);
