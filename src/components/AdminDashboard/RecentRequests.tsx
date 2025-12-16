// import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router"; // or 'react-router-dom'

// Define API item type
interface RequestItem {
  id: number | string;
  schoolName: string;
  teacherId: string;
  requestedAt: string | null;
  time: string | null; // ✅ FIXED TYPE
  status: string;
}

export function RecentRequests({ data }: { data: RequestItem[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        No recent requests found.
      </div>
    );
  }

  // ✅ SAFE LOCAL DATE + TIME FORMATTER
  const formatTime = (value?: string | null) => {
    if (!value) return "—";

    const date = new Date(value);
    if (isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-GB", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0 overflow-hidden">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {item.schoolName
                  ? item.schoolName.substring(0, 2).toUpperCase()
                  : "??"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 min-w-0">
              <p className="text-sm font-medium leading-none truncate">
                {item.schoolName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Req: <span className="font-mono">{item.teacherId}</span>
              </p>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-xs text-muted-foreground font-medium whitespace-nowrap ml-2">
            {formatTime(item.time)}
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        className="w-full mt-4 cursor-pointer"
        size="sm"
        asChild
      >
        <Link to="/admin/requests">View All Requests</Link>
      </Button>
    </div>
  );
}
