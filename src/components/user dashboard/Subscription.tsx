import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PricingSection from "../ui/PricingSection";

const BASE_URL = import.meta.env?.VITE_BASE_URL ?? "";

type SubscriptionStatusResp = {
  subscription_status?: string | null;
  subscription_end_at?: string | null; // ISO string
};

type SchoolProfileResp = {
  subscription_plan?: string | null;
  subscription_started_at?: string | null; // ISO string
};

export const SubscriptionPage: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatusResp | null>(null);
  const [profile, setProfile] = useState<SchoolProfileResp | null>(null);

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".sub-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.1,
        }
      );
    },
    { scope: container }
  );

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [statusRes, profileRes] = await Promise.all([
        fetch(`${BASE_URL}/subscription/status`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        }),
        fetch(`${BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        }),
      ]);

      if (!statusRes.ok) {
        const txt = await statusRes.text().catch(() => "");
        throw new Error(`Status fetch failed: ${statusRes.status} ${txt}`);
      }
      if (!profileRes.ok) {
        const txt = await profileRes.text().catch(() => "");
        throw new Error(`Profile fetch failed: ${profileRes.status} ${txt}`);
      }

      const statusData: SubscriptionStatusResp = await statusRes.json();
      const profileData: SchoolProfileResp = await profileRes.json();

      setSubscriptionStatus(statusData ?? null);
      setProfile(profileData ?? null);
    } catch (err: any) {
      console.error("Failed to load subscription/profile:", err);
      setError(err?.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await loadData();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const computeTimeRemaining = (endIso?: string | null) => {
    if (!endIso) return null;
    const end = new Date(endIso).getTime();
    const now = Date.now();
    if (!isFinite(end)) return null;
    const diff = end - now;
    if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0 };
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    return { expired: false, days, hours, minutes, totalMs: diff };
  };

  /**
   * computeProgress:
   * Returns 0 for NO_SUBSCRIPTION to show an empty bar (implies nothing to track).
   * Returns 0-100 for active subscriptions.
   */
  const computeProgress = (
    status: string,
    startedIso?: string | null,
    endIso?: string | null
  ): number => {
    // If no subscription, progress is 0 (empty bar)
    if (status === "NO_SUBSCRIPTION") return 0;

    if (!endIso) return 100; // Indefinite active plan

    const end = new Date(endIso).getTime();
    if (!isFinite(end)) return 100;

    if (!startedIso) {
      return end <= Date.now() ? 0 : 100;
    }

    const start = new Date(startedIso).getTime();
    if (!isFinite(start)) return end <= Date.now() ? 0 : 100;
    if (end <= start) return end <= Date.now() ? 0 : 100;

    const now = Date.now();
    const remainingMs = end - now;
    const totalMs = end - start;
    const clampedRemaining = Math.max(0, Math.min(remainingMs, totalMs));
    const pctRemaining = Math.round((clampedRemaining / totalMs) * 100);

    if (!isFinite(pctRemaining)) return end <= Date.now() ? 0 : 100;
    return Math.max(0, Math.min(100, pctRemaining));
  };

  // --- DERIVED UI VALUES ---

  const status = subscriptionStatus?.subscription_status ?? "NO_SUBSCRIPTION";

  // Use "Free Tier" text instead of just "Free" to sound less like a specific plan
  const planName = profile?.subscription_plan ?? "Free Tier";

  const startedAt = profile?.subscription_started_at ?? null;
  const endAt = subscriptionStatus?.subscription_end_at ?? null;

  const remaining = computeTimeRemaining(endAt);
  const rawPercentRemaining = computeProgress(status, startedAt, endAt);

  const safeProgress: number =
    typeof rawPercentRemaining === "number" && isFinite(rawPercentRemaining)
      ? Math.max(0, Math.min(100, rawPercentRemaining))
      : 0;

  // Determine progress color
  const getProgressColor = (pct: number) => {
    // If NO_SUBSCRIPTION (0%), make it slate/gray to look "inactive"
    if (status === "NO_SUBSCRIPTION") return "bg-slate-200 dark:bg-zinc-700";

    if (pct >= 67) return "bg-green-500 dark:bg-green-600";
    if (pct >= 34) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-red-500 dark:bg-red-600";
  };

  const progressColor = getProgressColor(safeProgress);

  // Friendly strings - UPDATED for better context
  const timeRemainingLabel = (() => {
    if (status === "NO_SUBSCRIPTION") return "Not Subscribed"; // Clear status

    if (!endAt) return "Active (Recurring)";
    if (!remaining) return "—";
    if (remaining.expired) return "Expired";
    if (remaining.days > 0) return `${remaining.days}d ${remaining.hours}h`;
    if (remaining.hours > 0) return `${remaining.hours}h ${remaining.minutes}m`;
    return `${remaining.minutes}m`;
  })();

  const expiryText = (() => {
    if (status === "NO_SUBSCRIPTION") return "No active billing cycle"; // Clear limitation

    if (!endAt) return "Renews automatically";
    if (!remaining) return "—";
    if (remaining.expired)
      return `Ended on ${new Date(endAt).toLocaleString()}`;
    return `Expires on ${new Date(endAt).toLocaleString()}`;
  })();

  // Cancel flow
  const hasActiveSubscription =
    status !== "NO_SUBSCRIPTION" && status !== "CANCELED";
  const cancelButtonLabel = "Cancel Subscription";

  const onCancelClick = () => {
    setCancelError(null);
    setCancelSuccess(null);
    setConfirmOpen(true);
  };

  const performCancelSubscription = async () => {
    setCancelling(true);
    setCancelError(null);
    setCancelSuccess(null);

    try {
      const res = await fetch(`${BASE_URL}/subscription/cancel`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ reason: "cancelled_by_user" }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Cancel failed: ${res.status} ${txt}`);
      }

      setCancelSuccess("Subscription cancelled successfully.");
      setConfirmOpen(false);
      await loadData();
    } catch (err: any) {
      console.error("Cancel subscription error:", err);
      setCancelError(err?.message ?? "Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  // Determine Badge Styling
  const badgeVariantStyles =
    status === "ACTIVE"
      ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20"
      : "border-slate-300 text-slate-500 bg-slate-100 dark:bg-zinc-800 dark:border-zinc-700";

  const badgeText = loading
    ? "…"
    : status === "ACTIVE"
      ? "Active"
      : "Free Tier"; // More humble than "Free Plan"

  return (
    <div ref={container} className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Subscription & Billing
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Manage your school access plan and payment methods.
        </p>
      </div>

      <div className="flex gap-8 flex-col">
        {/* CURRENT PLAN CARD */}
        <Card className="sub-card md:col-span-12 lg:col-span-7 bg-white dark:bg-zinc-900/50 border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
          {/* Only show colored top bar if Active */}
          <div
            className={`absolute top-0 left-0 w-full h-1 ${
              status === "ACTIVE" ? "bg-green-500" : "bg-transparent"
            }`}
          ></div>

          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Plan Status</CardTitle>

                <CardDescription>
                  {loading ? (
                    "Loading plan..."
                  ) : error ? (
                    <span className="text-red-600">Failed to load data</span>
                  ) : status === "NO_SUBSCRIPTION" ? (
                    // Updated Text for No Subscription
                    <span className="text-slate-500">
                      You are currently not subscribed to any plan.
                    </span>
                  ) : (
                    // Text for Active Subscription
                    <>
                      You are currently on the{" "}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {planName}
                      </span>{" "}
                      plan.
                    </>
                  )}
                </CardDescription>
              </div>

              <Badge
                variant="outline"
                className={`border ${badgeVariantStyles}`}
              >
                {badgeText}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-zinc-400">
                  {status === "NO_SUBSCRIPTION"
                    ? "Subscription Status"
                    : "Time Remaining"}
                </span>
                <span
                  className={`font-bold font-mono ${status === "NO_SUBSCRIPTION" ? "text-slate-400" : "text-slate-700 dark:text-slate-300"}`}
                >
                  {loading ? "…" : timeRemainingLabel}
                </span>
              </div>

              {/* PROGRESS BAR */}
              {/* If Free Tier, this bar will now be empty (width 0%) */}
              <div className="relative w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${progressColor}`}
                  style={{ width: `${safeProgress}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground pt-1">
                {loading ? "Loading..." : expiryText}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 flex items-start gap-4 border border-slate-100 dark:border-white/5">
              <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Access Limitations</p>
                <p className="text-xs text-muted-foreground">
                  {loading
                    ? "Checking access..."
                    : status === "ACTIVE"
                      ? "Your subscription is active — full access granted."
                      : "You are viewing the limited free version. Upgrade to a premium plan to unlock full features."}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-slate-100 dark:border-white/5 pt-6">
            <div className="flex gap-3 w-full">
              {/* Only show Cancel button if there is an ACTIVE subscription */}
              {hasActiveSubscription && (
                <Button
                  variant="outline"
                  className="text-red-500 border-slate-200 dark:border-white/10 flex-1 cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-300"
                  onClick={onCancelClick}
                  disabled={cancelling}
                >
                  {cancelling ? "Processing..." : cancelButtonLabel}
                </Button>
              )}

              <Button
                onClick={() => {
                  const el = document.getElementById("pricing");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex-1 cursor-pointer hover:bg-green-400 hover:scale-105 transition-all duration-300 ${!hasActiveSubscription ? "w-full" : ""}`}
              >
                {status === "NO_SUBSCRIPTION"
                  ? "Get Full Access"
                  : "Upgrade Plan"}
              </Button>
            </div>
          </CardFooter>
        </Card>

        <PricingSection />
      </div>

      {cancelError && (
        <div className="text-sm text-red-600 max-w-5xl mx-auto">
          {cancelError}
        </div>
      )}

      {cancelSuccess && (
        <div className="text-sm text-green-600 max-w-5xl mx-auto">
          {cancelSuccess}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 max-w-5xl mx-auto">{error}</div>
      )}

      {/* Confirmation modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              if (!cancelling) setConfirmOpen(false);
            }}
          />
          <div className="relative z-10 max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Confirm cancellation
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
              Are you sure you want to cancel your subscription? You will lose
              paid access immediately.
            </p>

            {cancelError && (
              <div className="mt-3 text-sm text-red-600">{cancelError}</div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => !cancelling && setConfirmOpen(false)}
                className="border-slate-200 dark:border-white/10 cursor-pointer max-md:w-[100px] max-md:text-[10px]"
              >
                Keep subscription
              </Button>

              <Button
                onClick={performCancelSubscription}
                className="bg-red-600 hover:bg-red-700 cursor-pointer hover:font-bold max-md:w-[150px] max-md:text-[10px]"
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Yes, cancel subscription"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
