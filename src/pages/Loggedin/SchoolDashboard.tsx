import React, { useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Users,
  FileText,
  CreditCard,
  Settings,
  LifeBuoy,
  LogOut,
  Menu,
  ShieldCheck,
  Clock,
  UserStar,
  Sparkles,
  Zap,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// --- SIDEBAR NAVIGATION ITEMS ---
const navItems = [
  { label: "Browse Teachers", href: "/school/dashboard", icon: Users },
  { label: "My Requests", href: "/school/requests", icon: FileText },
  { label: "Accepted Teachers", href: "/school/accepted", icon: UserStar },
  { label: "Subscription", href: "/school/subscription", icon: CreditCard },
  { label: "School Settings", href: "/school/settings", icon: Settings },
  { label: "Help & Support", href: "/school/support", icon: LifeBuoy },
];

const BASE_URL = import.meta.env?.VITE_BASE_URL ?? "";

export default function SchoolLayout() {
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // School / profile info
  const [school, setSchool] = useState<{ user: string; name: string }>({
    user: "",
    name: "",
  });

  // subscription info
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null
  );

  // --- TRIAL COUNTDOWN STATE ---
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [trialLoading, setTrialLoading] = useState<boolean>(true);
  const [trialError, setTrialError] = useState<string | null>(null);

  // Animation for desktop sidebar entrance
  useGSAP(
    () => {
      gsap.fromTo(
        ".sidebar-item",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    },
    { scope: sidebarRef }
  );

  // Fetch profile (auth/me) AND subscription status once on mount
  useEffect(() => {
    let mounted = true;
    let ticker: number | null = null;

    async function loadProfileAndStatus() {
      // Load profile (/auth/me)
      try {
        const profileRes = await fetch(`${BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (profileRes.ok) {
          const pdata = await profileRes.json();
          if (!mounted) return;
          setSchool({
            user: pdata.contact_name ?? "",
            name: pdata.name ?? "",
          });

          if (pdata.subscription_plan) {
            setSubscriptionPlan(pdata.subscription_plan);
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }

      // Load subscription status
      try {
        setTrialLoading(true);
        const statusRes = await fetch(`${BASE_URL}/subscription/status`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!statusRes.ok) {
          throw new Error(`Status fetch failed: ${statusRes.status}`);
        }

        const sdata = await statusRes.json();

        if (!mounted) return;

        if (sdata.subscription_plan) {
          setSubscriptionPlan(sdata.subscription_plan);
        }

        setSubscriptionStatus(sdata.subscription_status ?? null);

        const endIso = sdata.subscription_end_at ?? null;
        if (!endIso) {
          setRemainingMs(null);
          setTrialLoading(false);
          return;
        }

        const endMs = new Date(endIso).getTime();
        if (!isFinite(endMs)) {
          setRemainingMs(null);
          setTrialError("Invalid expiry date");
          setTrialLoading(false);
          return;
        }

        // initialize tick
        const diff = Math.max(0, endMs - Date.now());
        setRemainingMs(diff);
        setTrialLoading(false);
        setTrialError(null);

        if (ticker) {
          window.clearInterval(ticker);
          ticker = null;
        }

        ticker = window.setInterval(() => {
          setRemainingMs((prev) => {
            if (prev === null) return null;
            const next = prev - 1000;
            if (next <= 0) {
              if (ticker) {
                window.clearInterval(ticker);
                ticker = null;
              }
              return 0;
            }
            return next;
          });
        }, 1000);
      } catch (err: any) {
        if (!mounted) return;
        setTrialError(err?.message ?? "Failed to load trial info");
        setTrialLoading(false);
      }
    }

    loadProfileAndStatus();

    return () => {
      mounted = false;
      if (ticker) window.clearInterval(ticker);
    };
  }, []);

  const getPlanLabel = () => {
    if (subscriptionPlan) return subscriptionPlan;
    if (subscriptionStatus === "ACTIVE") return "Active";
    if (!subscriptionStatus) return "No Plan";
    return subscriptionStatus;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex font-sans selection:bg-blue-500/20">
      {/* 1. DESKTOP SIDEBAR */}
      <aside
        ref={sidebarRef}
        className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 backdrop-blur-xl h-screen sticky top-0 z-50"
      >
        <SidebarContent
          location={location}
          remainingMs={remainingMs}
          trialLoading={trialLoading}
          trialError={trialError}
          planLabel={getPlanLabel()}
          subscriptionStatus={subscriptionStatus}
        />
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden -ml-2">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 p-0 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-white/10"
              >
                <SidebarContent
                  location={location}
                  isMobile={true}
                  remainingMs={remainingMs}
                  trialLoading={trialLoading}
                  trialError={trialError}
                  planLabel={getPlanLabel()}
                  subscriptionStatus={subscriptionStatus}
                />
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold text-slate-900 dark:text-white hidden md:block">
              {navItems.find(
                (i) =>
                  i.href === location.pathname ||
                  (location.pathname.startsWith(i.href) && i.href !== "/school")
              )?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {school.user}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-500">
                  {school.name}
                </p>
              </div>
              <Avatar className="border-2 border-white dark:border-zinc-800 shadow-sm cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* 3. THE OUTLET */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// --- REUSABLE SIDEBAR COMPONENT ---
function SidebarContent({
  location,
  isMobile = false,
  remainingMs,
  trialLoading,
  trialError,
  planLabel,
  subscriptionStatus,
}: {
  location: any;
  isMobile?: boolean;
  remainingMs?: number | null;
  trialLoading?: boolean;
  trialError?: string | null;
  planLabel?: string | null;
  subscriptionStatus?: string | null;
}) {
  // Determine plan type
  const getPlanType = (label?: string | null, status?: string | null) => {
    const l = label?.toLowerCase() ?? "";
    if (l.includes("ultimate") || l.includes("enterprise")) return "ultimate";
    if (l.includes("pro") || l.includes("premium") || l.includes("paid"))
      return "pro";
    if (l.includes("trial") || status === "NO_SUBSCRIPTION") return "trial";
    if (status === "ACTIVE") return "pro";
    return "unknown";
  };

  const planType = getPlanType(planLabel, subscriptionStatus);

  // --- IMPROVED CARD STYLING ---
  const getCardStyles = (type: string) => {
    switch (type) {
      case "ultimate":
        return {
          // Dark, sleek, premium gold accents
          container:
            "relative bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden",
          bgEffect:
            "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/40 via-zinc-900 to-zinc-950",
          iconBg: "bg-amber-500/10 text-amber-500",
          title: "text-white",
          subtitle: "text-zinc-400",
          counter: "text-amber-500",
          button: "bg-amber-600 hover:bg-amber-700 text-white border-0",
          icon: Sparkles,
          upgradeDisabled: true,
        };
      case "pro":
        return {
          // Vibrant Blue/Purple Gradient - The "SaaS Pro" look
          container:
            "relative bg-blue-600 border border-blue-500 shadow-lg shadow-blue-500/20 overflow-hidden",
          bgEffect:
            "bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)]",
          iconBg: "bg-white/20 text-white",
          title: "text-white",
          subtitle: "text-blue-100",
          counter: "text-white",
          button: "bg-white hover:bg-blue-50 text-blue-700 border-0",
          icon: Zap,
          upgradeDisabled: false,
        };
      case "trial":
        return {
          // Attention-grabbing but clean. White/Dark card with colored border.
          container:
            "relative bg-white dark:bg-zinc-900 border-2 border-amber-400/60 dark:border-amber-500/40 shadow-sm",
          bgEffect: "bg-amber-50/50 dark:bg-amber-900/10",
          iconBg:
            "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
          title: "text-slate-900 dark:text-white",
          subtitle: "text-slate-500 dark:text-zinc-400",
          counter: "text-amber-600 dark:text-amber-500",
          button:
            "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90",
          icon: AlertCircle,
          upgradeDisabled: false,
        };
      default:
        // Generic fallback
        return {
          container:
            "relative bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-white/10",
          bgEffect: "",
          iconBg:
            "bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-400",
          title: "text-slate-900 dark:text-white",
          subtitle: "text-slate-500 dark:text-zinc-400",
          counter: "text-slate-900 dark:text-white",
          button:
            "bg-white dark:bg-zinc-700 border border-slate-200 dark:border-white/10 hover:bg-slate-50",
          icon: Clock,
          upgradeDisabled: false,
        };
    }
  };

  const styles = getCardStyles(planType);
  const Icon = styles.icon;

  const formatRemaining = (ms?: number | null) => {
    if (ms === undefined || ms === null) return "—";
    if (ms <= 0) return "Expired";
    let totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    totalSeconds %= 24 * 3600;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    if (days > 0)
      return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  async function handleLogout(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    window.location.href = "/";
  }

  return (
    <div className="flex flex-col h-full">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-2 border-b border-slate-100 dark:border-white/5">
        <div className="bg-blue-600/10 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
          School Access
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/school"
              ? location.pathname === "/school"
              : location.pathname.startsWith(item.href);

          const LinkComponent = (
            <Link
              to={item.href}
              className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );

          return isMobile ? (
            <SheetClose asChild key={item.href}>
              {LinkComponent}
            </SheetClose>
          ) : (
            <React.Fragment key={item.href}>{LinkComponent}</React.Fragment>
          );
        })}
      </nav>

      {/* Subscription Widget */}
      <div className="p-4 sidebar-item mt-auto">
        <div className={`rounded-2xl p-5 ${styles.container}`}>
          {/* Background Effect Layer */}
          <div className={`absolute inset-0 ${styles.bgEffect}`} />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col">
                <span
                  className={`text-xs font-bold uppercase tracking-wider opacity-90 ${styles.title}`}
                >
                  {planLabel ?? "Current Plan"}
                </span>
                <span className={`text-[10px] font-medium ${styles.subtitle}`}>
                  {subscriptionStatus
                    ? subscriptionStatus.replace("_", " ")
                    : "Status Unknown"}
                </span>
              </div>
              <div className={`p-1.5 rounded-lg ${styles.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1 my-4">
              <span
                className={`text-[10px] uppercase font-semibold opacity-80 ${styles.subtitle}`}
              >
                {remainingMs === null
                  ? "Validity"
                  : remainingMs > 0
                    ? "Expires in"
                    : "Status"}
              </span>
              <p
                className={`text-2xl font-mono font-bold tracking-tight ${styles.counter}`}
              >
                {trialLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  formatRemaining(remainingMs)
                )}
              </p>
            </div>

            {trialError ? (
              <p className="mt-2 text-xs text-red-500 bg-red-500/10 p-1 rounded">
                Error loading info
              </p>
            ) : (
              <Button
                size="sm"
                className={`w-full h-9 text-xs font-bold shadow-sm transition-transform active:scale-95 ${styles.button}`}
                disabled={styles.upgradeDisabled}
                onClick={() => {
                  if (styles.upgradeDisabled) return;
                  window.location.href = "/school/subscription";
                }}
              >
                {styles.upgradeDisabled ? "Plan Active" : "Upgrade Plan"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-white/5">
        <Button
          variant="ghost"
          className="w-[95%] justify-start text-red-500 hover:bg-red-500 hover:text-white cursor-pointer transition-all duration-300 hover:scale-110"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
