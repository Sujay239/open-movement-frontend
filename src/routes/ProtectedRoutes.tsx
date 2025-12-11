import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  cookieName?: string; // defaults to "token"
}

/** Simple cookie getter */
function getCookie(name: string): string | null {
  const matches = document.cookie.match(
    new RegExp(
      "(^|;)\\s*" + name.replace(/[-.+*]/g, "\\$&") + "\\s*=\\s*([^;]+)"
    )
  );
  return matches ? decodeURIComponent(matches[2]) : null;
}

export default function ProtectedRouteClient({
  children,
  cookieName = "token",
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // synchronous check of cookie presence
    const token = getCookie(cookieName);
    setHasToken(!!token);
    setLoading(false);
  }, [cookieName]);

  if (loading) return <div>Loading...</div>;

  if (!hasToken) {
    // not authenticated — redirect to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
