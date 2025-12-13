import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { AdminSidebar } from "../components/AdminDashboard/AdminSidebar";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside
        className={`hidden md:flex flex-col border-r bg-background transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <AdminSidebar
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <AdminSidebar onNavigate={() => setIsMobileOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="font-bold text-lg">Open Movements</span>
      </div>

      <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 bg-muted/5">
        <Outlet />
      </main>
    </div>
  );
}
