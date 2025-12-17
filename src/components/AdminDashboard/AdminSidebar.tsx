import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  School,
  Key,
  FileInput,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PanelsTopLeft,
  User2,
  User,
} from "lucide-react";

// 👇 Update this path to where your ModeToggle is located
import { ModeToggle } from "../mode-toggle";

const sidebarItems = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Requests", href: "/admin/requests", icon: FileInput },
  { title: "Teachers", href: "/admin/teachers", icon: Users },
  { title: "Schools", href: "/admin/schools", icon: School },
  { title: "Access Codes", href: "/admin/access-codes", icon: Key },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Add Admin", href: "/admin/new", icon: User2 },
  { title: "Manage Admins", href: "/admin/manage", icon: User },
];

const BASE_URL = import.meta.env?.VITE_BASE_URL;

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onNavigate?: () => void; // Callback to close mobile drawer
  isCollapsed?: boolean; // State for desktop collapse
  toggleCollapse?: () => void; // Function to toggle desktop collapse
}

export function AdminSidebar({
  className,
  onNavigate,
  isCollapsed = false,
  toggleCollapse,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Logout failed");

      // Close mobile drawer if open
      if (onNavigate) onNavigate();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background text-foreground",
        className
      )}
    >
      {/* --- HEADER --- */}
      <div
        className={cn(
          "flex items-center h-16 px-4 shrink-0",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {/* Logo Logic */}
        {!isCollapsed ? (
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight">
              Open Movements
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Admin
            </span>
          </div>
        ) : (
          <PanelsTopLeft className="h-6 w-6 text-primary" />
        )}

        {/* Desktop Collapse Toggle Button */}
        {toggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-8 w-8 text-muted-foreground hover:bg-muted"
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <Separator />

      {/* --- NAVIGATION --- */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <Button
                key={index}
                asChild
                // Square button if collapsed, wide if expanded
                size={isCollapsed ? "icon" : "default"}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full transition-all duration-200",
                  // If collapsed, center content. If expanded, align left.
                  isCollapsed ? "justify-center" : "justify-start",
                  isActive && "font-semibold"
                )}
                // This closes the mobile drawer when a link is clicked
                onClick={() => {
                  if (onNavigate) onNavigate();
                }}
                title={isCollapsed ? item.title : undefined}
              >
                <Link to={item.href} className="flex items-center">
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      // Add margin only if expanded
                      isCollapsed ? "mr-0" : "mr-3"
                    )}
                  />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-auto p-4 border-t shrink-0">
        <div
          className={cn(
            "flex gap-2 items-center",
            isCollapsed ? "flex-col justify-center" : "flex-row"
          )}
        >
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            className={cn(
              "text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors cursor-pointer",
              isCollapsed ? "w-full justify-center" : "flex-1 justify-start"
            )}
            onClick={handleLogout}
            title="Log Out"
          >
            <LogOut className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
            {!isCollapsed && "Log Out"}
          </Button>

          <div className={isCollapsed ? "mt-2" : ""}>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
