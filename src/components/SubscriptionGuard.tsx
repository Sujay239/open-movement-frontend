import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CreditCard, Key, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
//   CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SubscriptionGuardProps {
  children: ReactNode;
}

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export default function SubscriptionGuard({
  children,
}: SubscriptionGuardProps) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  // --- FETCH SUBSCRIPTION STATUS ---
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${BASE_URL}/subscription/status`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Important for cookies/session
        });

        if (!res.ok) throw new Error("Failed to check subscription");

        const data = await res.json();
        setStatus(data.subscription_status); // Expected: "ACTIVE", "TRIAL", "EXPIRED", "NO_SUBSCRIPTION"
      } catch (err) {
        console.error("Subscription check failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  // 1. Loading State
  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-muted-foreground animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p>Verifying subscription status...</p>
      </div>
    );
  }

  // 2. Error State (Network issues)
  if (error) {
    return (
      <div className="p-8 flex justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Could not verify your subscription. Please check your internet
            connection or try again later.
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 bg-white text-black"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  // 3. Access Logic
  // Allow access if ACTIVE or TRIAL
  const hasAccess = status === "ACTIVE" || status === "TRIAL";

  if (hasAccess) {
    return <>{children}</>;
  }

  // 4. Lock Screen UI (No Access / Expired)
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 animate-in fade-in zoom-in duration-300">
      <Card className="w-full max-w-md border-2 border-slate-200 dark:border-zinc-800 shadow-2xl text-center overflow-hidden">
        {/* Visual Header */}
        <div className="bg-slate-50 dark:bg-zinc-900/50 py-10 border-b border-slate-100 dark:border-zinc-800 flex justify-center">
          <div className="h-24 w-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center shadow-inner ring-4 ring-white dark:ring-zinc-900">
            <Lock className="h-10 w-10 text-red-500 dark:text-red-400" />
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {status === "EXPIRED" ? "Plan Expired" : "Premium Content"}
          </CardTitle>
          <CardDescription className="text-base mt-2 max-w-xs mx-auto">
            {status === "EXPIRED"
              ? "Your subscription has ended. Renew now to regain access."
              : "This page requires an active subscription or trial access code."}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-3 p-6 bg-slate-50 dark:bg-zinc-900/30 border-t border-slate-100 dark:border-zinc-800">
          <Button
            className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            onClick={() => navigate("/school/subscription")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {status === "EXPIRED" ? "Renew Subscription" : "Subscribe Now"}
          </Button>

          <div className="relative w-full py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 dark:bg-zinc-900 px-2 text-muted-foreground font-medium">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-11 border-slate-300 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 cursor-pointer"
            onClick={() => navigate("/school/access-code")}
          >
            <Key className="mr-2 h-4 w-4" /> Enter Access Code
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
