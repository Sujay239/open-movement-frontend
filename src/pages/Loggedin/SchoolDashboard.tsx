import React, { useRef } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"; // Added SheetClose for UX
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

export default function SchoolLayout() {
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex font-sans selection:bg-blue-500/20">
      {/* 1. DESKTOP SIDEBAR */}
      <aside
        ref={sidebarRef}
        className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 backdrop-blur-xl h-screen sticky top-0 z-50"
      >
        <SidebarContent location={location} />
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* --- MOBILE MENU TRIGGER (Sheet) --- */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden -ml-2">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              {/* FIX: Mobile Sidebar Content Added Here */}
              <SheetContent
                side="left"
                className="w-72 p-0 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-white/10"
              >
                <SidebarContent location={location} isMobile={true} />
              </SheetContent>
            </Sheet>

            {/* Dynamic Page Title */}
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
                  Principal Skinner
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-500">
                  Springfield High
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
// This ensures the sidebar looks identical on Mobile and Desktop
function SidebarContent({
  location,
  isMobile = false,
}: {
  location: any;
  isMobile?: boolean;
}) {
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
          // Exact match for root, startsWith for others
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
                className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"}`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );

          // If mobile, wrap in SheetClose to close menu on click
          return isMobile ? (
            <SheetClose asChild key={item.href}>
              {LinkComponent}
            </SheetClose>
          ) : (
            <React.Fragment key={item.href}>{LinkComponent}</React.Fragment>
          );
        })}
      </nav>

      {/* Trial Countdown Widget */}
      <div className="p-4 sidebar-item mt-auto">
        <div className="bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Trial Access
            </span>
          </div>
          <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white mb-1">
            14:20:05
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-500">
            Time remaining
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-3 h-8 text-xs border-amber-500/30 hover:bg-amber-500/10 bg-transparent text-amber-700 dark:text-amber-300"
          >
            Upgrade Now
          </Button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-white/5">
        <Button
          variant="ghost"
          className="w-[95%] justify-start text-red-500 hover:bg-red-500 hover:text-white cursor-pointer transition-all duration-300 hover:scale-110"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
