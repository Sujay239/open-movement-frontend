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
  Key,
  ChevronLeft,
  ChevronRight,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// --- SIDEBAR NAVIGATION ITEMS ---
const navItems = [
  { label: "Browse Teachers", href: "/school/dashboard", icon: Users },
  { label: "My Requests", href: "/school/requests", icon: FileText },
  { label: "Accepted Teachers", href: "/school/accepted", icon: UserStar },
  { label: "Use Access Code", href: "/school/access-code", icon: Key },
  { label: "Subscription", href: "/school/subscription", icon: CreditCard },
  { label: "School Settings", href: "/school/settings", icon: Settings },
  { label: "Help & Support", href: "/school/support", icon: LifeBuoy },
];

const BASE_URL = import.meta.env?.VITE_BASE_URL ?? "";

export default function SchoolLayout() {
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Sidebar State
  const [isExpanded, setIsExpanded] = useState(true);

  // School / profile info
  const [school, setSchool] = useState<{ user: string; name: string }>({
    user: "",
    name: "",
  });

  // Subscription info
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null
  );

  // Trial countdown state
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [trialLoading, setTrialLoading] = useState<boolean>(true);
  const [trialError, setTrialError] = useState<string | null>(null);

  // Animation for sidebar items
  useGSAP(
    () => {
      if (isExpanded) {
        gsap.fromTo(
          ".sidebar-text",
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
        );
      }
    },
    { scope: sidebarRef, dependencies: [isExpanded] }
  );

  // --- FETCH DATA ---
  useEffect(() => {
    let mounted = true;
    let ticker: number | null = null;

    async function loadProfileAndStatus() {
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
          if (pdata.subscription_plan)
            setSubscriptionPlan(pdata.subscription_plan);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }

      try {
        setTrialLoading(true);
        const statusRes = await fetch(`${BASE_URL}/subscription/status`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!statusRes.ok) throw new Error("Status fetch failed");
        const sdata = await statusRes.json();

        if (!mounted) return;
        if (sdata.subscription_plan)
          setSubscriptionPlan(sdata.subscription_plan);
        setSubscriptionStatus(sdata.subscription_status ?? null);

        const endIso = sdata.subscription_end_at ?? null;
        if (!endIso) {
          setRemainingMs(null);
          setTrialLoading(false);
          return;
        }

        const endMs = new Date(endIso).getTime();
        if (isFinite(endMs)) {
          const diff = Math.max(0, endMs - Date.now());
          setRemainingMs(diff);
          setTrialLoading(false);
          setTrialError(null);

          if (ticker) clearInterval(ticker);
          ticker = window.setInterval(() => {
            setRemainingMs((prev) => {
              if (prev === null) return null;
              const next = prev - 1000;
              return next <= 0 ? 0 : next;
            });
          }, 1000);
        } else {
          setRemainingMs(null);
          setTrialLoading(false);
        }
      } catch (err: any) {
        if (!mounted) return;
        setTrialError(err?.message);
        setTrialLoading(false);
      }
    }

    loadProfileAndStatus();
    return () => {
      mounted = false;
      if (ticker) clearInterval(ticker);
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
        className={`
          hidden lg:flex flex-col border-r border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 backdrop-blur-xl h-screen sticky top-0 z-50
          transition-all duration-300 ease-in-out
          ${isExpanded ? "w-72" : "w-20"}
        `}
      >
        <SidebarContent
          location={location}
          isExpanded={isExpanded}
          remainingMs={remainingMs}
          trialLoading={trialLoading}
          trialError={trialError}
          planLabel={getPlanLabel()}
          subscriptionStatus={subscriptionStatus}
          onToggle={() => setIsExpanded(!isExpanded)}
        />
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Header */}
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
                  isExpanded={true}
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
                <Link to="/school/settings">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>PS</AvatarFallback>
                </Link>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// --- SIDEBAR CONTENT ---
function SidebarContent({
  location,
  isMobile = false,
  isExpanded = true,
  remainingMs,
  trialLoading,
  // trialError,
  planLabel,
  subscriptionStatus,
  onToggle,
}: {
  location: any;
  isMobile?: boolean;
  isExpanded?: boolean;
  remainingMs?: number | null;
  trialLoading?: boolean;
  trialError?: string | null;
  planLabel?: string | null;
  subscriptionStatus?: string | null;
  onToggle?: () => void;
}) {
  // Plan Logic
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

  const getCardStyles = (type: string) => {
    switch (type) {
      case "ultimate":
        return {
          container:
            "relative bg-red-950 border border-red-900 shadow-xl overflow-hidden",
          bgEffect:
            "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/50 via-red-950 to-black",
          iconBg: "bg-red-500/10 text-red-500",
          title: "text-white",
          subtitle: "text-red-300/70",
          counter: "text-red-500",
          button: "bg-red-600 hover:bg-red-700 text-white border-0",
          icon: Sparkles,
          upgradeDisabled: true,
        };
      case "pro":
        return {
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

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
    window.location.href = "/";
  }

  // --- LOGIC: Mobile vs Desktop Nav Link ---
  const renderNavLink = (item: any) => {
    const isActive =
      item.href === "/school"
        ? location.pathname === "/school"
        : location.pathname.startsWith(item.href);

    // 1. Create the shared Link component
    const LinkComponent = (
      <Link
        to={item.href}
        className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
          ${
            isActive
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
          }
          ${!isExpanded && !isMobile ? "justify-center px-2" : ""}
        `}
      >
        <item.icon
          className={`w-5 h-5 shrink-0 transition-colors ${
            isActive
              ? "text-white"
              : "text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          }`}
        />
        {(isExpanded || isMobile) && (
          <span className="font-medium whitespace-nowrap overflow-hidden sidebar-text">
            {item.label}
          </span>
        )}
      </Link>
    );

    // 2. Mobile: Return Link directly (SheetClose handles the rest in the parent map)
    if (isMobile) {
      return LinkComponent;
    }

    // 3. Desktop: Wrap in Tooltip
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{LinkComponent}</TooltipTrigger>
          {!isExpanded && (
            <TooltipContent side="right" className="font-semibold ml-2">
              {item.label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* 1. Logo Section */}
      <div
        className={`p-6 flex items-center ${
          isExpanded ? "justify-between" : "justify-center"
        } border-b border-slate-100 dark:border-white/5 h-20 transition-all duration-300`}
      >
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/10 p-2 rounded-lg transition-transform hover:scale-105">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          {isExpanded && (
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white sidebar-text">
              School Access
            </span>
          )}

          {/* SIDEBAR TOGGLE BUTTON (Hidden on Mobile) */}
          {!isMobile && onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className={` mt-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ${
                isExpanded ? "justify-end" : "justify-center"
              }`}
            >
              {isExpanded ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* 2. Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) =>
          isMobile ? (
            // Mobile: Use SheetClose to close sidebar on click
            <SheetClose asChild key={item.href}>
              {renderNavLink(item)}
            </SheetClose>
          ) : (
            // Desktop: Standard Fragment
            <React.Fragment key={item.href}>
              {renderNavLink(item)}
            </React.Fragment>
          )
        )}
      </nav>

      {/* 3. Subscription Widget (Hidden if Collapsed, Visible if Mobile) */}
      <div className="p-4 mt-auto">
        {isExpanded || isMobile ? (
          <div className={`rounded-2xl p-5 ${styles.container} sidebar-text`}>
            <div className={`absolute inset-0 ${styles.bgEffect}`} />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider opacity-90 ${styles.title}`}
                  >
                    {planLabel ?? "Current Plan"}
                  </span>
                  <span
                    className={`text-[10px] font-medium ${styles.subtitle}`}
                  >
                    {subscriptionStatus
                      ? subscriptionStatus.replace("_", " ")
                      : "Status Unknown"}
                  </span>
                </div>
                <div className={`p-1.5 rounded-lg ${styles.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* TIMER DISPLAY */}
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

              {!styles.upgradeDisabled && (
                <Button
                  size="sm"
                  className={`w-full h-9 text-xs font-bold shadow-sm ${styles.button} cursor-pointer hover:bg-green-400 hover:scale-105 transition-transform `}
                  onClick={() =>
                    (window.location.href = "/school/subscription")
                  }
                >
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        ) : (
          // COLLAPSED: MINI ICON ONLY
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex justify-center items-center p-3 rounded-xl cursor-pointer ${styles.iconBg}`}
                  onClick={() =>
                    (window.location.href = "/school/subscription")
                  }
                >
                  <Icon className="w-5 h-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-bold">
                Plan: {planLabel}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2 ">
        {/* Log Out Button */}
        {isMobile ? (
          <Button
            variant="ghost"
            className={`w-[90%] cursor-pointer justify-start text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300`}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="sidebar-text">Log Out</span>
          </Button>
        ) : (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-[90%] cursor-pointer ${
                    isExpanded ? "justify-start" : "justify-center px-0"
                  } text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110`}
                  onClick={handleLogout}
                >
                  <LogOut className={`w-4 h-4 ${isExpanded ? "mr-2" : ""}`} />
                  {isExpanded && <span className="sidebar-text">Log Out</span>}
                </Button>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right">Log Out</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
