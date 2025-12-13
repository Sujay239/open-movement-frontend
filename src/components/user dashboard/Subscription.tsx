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

  // loadData is exposed so we can re-run after cancelling
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
    // call loadData but guard if unmounted while awaiting
    (async () => {
      if (!mounted) return;
      await loadData();
    })();
    return () => {
      mounted = false;
    };
    // intentionally no deps so it runs once
  }, []);

  // helpers
  // const toDate = (s?: string | null) => (s ? new Date(s) : null);

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
   * computeProgress (returns percent *remaining*):
   * - returns a number in [0,100] measuring how much time is left relative to the plan period
   * - if start or end is missing/invalid, returns 100 (treat as "full/indeterminate" green)
   * - clamps values between 0 and 100
   */
  const computeProgress = (
    startedIso?: string | null,
    endIso?: string | null
  ): number => {
    // If there's no end date, consider it indefinite (show full/green)
    if (!endIso) return 100;

    const end = new Date(endIso).getTime();
    if (!isFinite(end)) return 100;

    // If there's no start date, we can't calculate a proper ratio — treat as full (green)
    if (!startedIso) {
      // If end is already expired, return 0
      return end <= Date.now() ? 0 : 100;
    }

    const start = new Date(startedIso).getTime();
    if (!isFinite(start)) return end <= Date.now() ? 0 : 100;

    // If end <= start, invalid period — if already expired -> 0 else full
    if (end <= start) return end <= Date.now() ? 0 : 100;

    const now = Date.now();

    // percent remaining = (end - now) / (end - start) * 100
    const remainingMs = end - now;
    const totalMs = end - start;

    // Clamp remaining between 0 and totalMs
    const clampedRemaining = Math.max(0, Math.min(remainingMs, totalMs));
    const pctRemaining = Math.round((clampedRemaining / totalMs) * 100);

    if (!isFinite(pctRemaining)) return end <= Date.now() ? 0 : 100;
    return Math.max(0, Math.min(100, pctRemaining));
  };

  // Derived UI values
  const status = subscriptionStatus?.subscription_status ?? "NO_SUBSCRIPTION";
  const plan =
    profile?.subscription_plan ??
    (status === "NO_SUBSCRIPTION" ? "Trial" : "Free");
  const startedAt = profile?.subscription_started_at ?? null;
  const endAt = subscriptionStatus?.subscription_end_at ?? null;

  const remaining = computeTimeRemaining(endAt);
  const rawPercentRemaining = computeProgress(startedAt, endAt);

  /**
   * safeProgress: numeric percent (0-100) indicating how much time is left.
   * - used for the width of the custom progress bar
   * - default to 100 when computation isn't possible (treat as full/green)
   */
  const safeProgress: number =
    typeof rawPercentRemaining === "number" && isFinite(rawPercentRemaining)
      ? Math.max(0, Math.min(100, rawPercentRemaining))
      : 100;

  // Determine progress color based on *remaining* percentage
  const getProgressColor = (pct: number) => {
    if (pct >= 67) return "bg-green-500 dark:bg-green-600"; // plenty left
    if (pct >= 34) return "bg-yellow-500 dark:bg-yellow-600"; // mid
    return "bg-red-500 dark:bg-red-600"; // low / almost expired
  };

  const progressColor = getProgressColor(safeProgress);

  // Friendly strings
  const timeRemainingLabel = (() => {
    if (!endAt) {
      if (status === "NO_SUBSCRIPTION") return "Trial access (no end date)";
      return "No subscription end date";
    }
    if (!remaining) return "—";
    if (remaining.expired) return "Expired";
    if (remaining.days > 0) return `${remaining.days}d ${remaining.hours}h`;
    if (remaining.hours > 0) return `${remaining.hours}h ${remaining.minutes}m`;
    return `${remaining.minutes}m`;
  })();

  const expiryText = (() => {
    if (!endAt) return "No expiry date set";
    if (!remaining) return "—";
    if (remaining.expired)
      return `Ended on ${new Date(endAt).toLocaleString()}`;
    return `Expires on ${new Date(endAt).toLocaleString()}`;
  })();

  // Cancel flow
  // Button label: if status === "NO_SUBSCRIPTION" treat as trial -> label "Cancel Trial"
  // otherwise "Cancel Subscription" and open confirm modal
  const isTrial = status === "NO_SUBSCRIPTION";
  const cancelButtonLabel = isTrial ? "Cancel Trial" : "Cancel Subscription";

  const onCancelClick = () => {
    if (isTrial) {
      // keep original simple behavior for trial cancellation (can be replaced)
      // Show a simple confirm prompt for trial cancellation
      if (confirm("Are you sure you want to cancel the trial access?")) {
        // Placeholder — implement trial cancellation logic if needed
        alert("Trial cancelled (placeholder).");
      }
      return;
    }

    // for non-trial (active) subscription, open confirm modal
    setCancelError(null);
    setCancelSuccess(null);
    setConfirmOpen(true);
  };

  const performCancelSubscription = async () => {
    setCancelling(true);
    setCancelError(null);
    setCancelSuccess(null);

    try {
      // Attempt API call to cancel subscription.
      // Adjust endpoint/method/payload to your backend contract.
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

      // Optionally parse JSON response
      // const data = await res.json().catch(() => ({}));

      setCancelSuccess("Subscription cancelled successfully.");
      setConfirmOpen(false);
      // refresh data to reflect cancellation
      await loadData();
    } catch (err: any) {
      console.error("Cancel subscription error:", err);
      setCancelError(err?.message ?? "Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

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
          <div
            className={`absolute top-0 left-0 w-full h-1 ${
              status === "ACTIVE" ? "bg-green-500" : "bg-amber-500"
            }`}
          ></div>

          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Current Plan</CardTitle>

                <CardDescription>
                  {loading ? (
                    "Loading plan..."
                  ) : error ? (
                    <span className="text-red-600">Failed to load data</span>
                  ) : (
                    <>
                      You are currently on the{" "}
                      <span className="font-semibold">{plan}</span> plan.
                    </>
                  )}
                </CardDescription>
              </div>

              <Badge
                variant="outline"
                className={`border ${
                  status === "ACTIVE"
                    ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20"
                    : "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                }`}
              >
                {loading
                  ? "…"
                  : status === "ACTIVE"
                    ? "Active"
                    : "Trial Active"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-zinc-400">
                  Time Remaining
                </span>
                <span className="font-bold font-mono text-amber-600 dark:text-amber-400">
                  {loading ? "…" : timeRemainingLabel}
                </span>
              </div>

              {/* CUSTOM PROGRESS BAR (colors depend on remaining time) */}
              <div className="relative w-full h-2 bg-slate-200 dark:bg-white/10 rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${progressColor}`}
                  style={{ width: `${safeProgress}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground pt-1">
                {loading ? "Loading expiry..." : expiryText}
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
                      : "Trial accounts can view anonymous profiles but cannot request contact details. Upgrade to unlock full features."}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-slate-100 dark:border-white/5 pt-6">
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="text-red-500  border-slate-200 dark:border-white/10 flex-1 cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-300"
                onClick={onCancelClick}
                disabled={cancelling}
              >
                {cancelling ? "Processing..." : cancelButtonLabel}
              </Button>

              <Button
                onClick={() => {
                  // send user to pricing section / plan upgrade
                  const el = document.getElementById("pricing");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 cursor-pointer hover:bg-green-400 hover:scale-105 transition-all duration-300"
              >
                Upgrade Plan
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

      {/* Confirmation modal for cancelling active subscription */}
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
              paid access immediately or at the end of the billing period
              depending on your plan. This action can usually be reversed by
              re-subscribing.
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
