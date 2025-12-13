import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"admin" | "school">;
}

const BASE_URL = import.meta.env?.VITE_BASE_URL;

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/protect`, {
          credentials: "include",
        });

        if (!res.ok) {
          setAuthenticated(false);
          return;
        }

        const data = await res.json();
        setAuthenticated(true);
        setRole(data.role); // 👈 expects { role: "admin" | "school" }
      } catch (err) {
        console.error("Auth check failed", err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="font-bold text-4xl flex justify-center items-center">
        Loading...
      </div>
    );
  }

  // not logged in
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // logged in but wrong role
  if (allowedRoles && role && !allowedRoles.includes(role as any)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
