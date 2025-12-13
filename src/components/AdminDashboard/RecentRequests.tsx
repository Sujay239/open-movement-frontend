// import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function RecentRequests() {
  const requests = [
    {
      school: "Riyadh International School",
      teacherId: "OM-T0123",
      time: "2m ago",
    },
    { school: "Bangkok Prep", teacherId: "OM-T9942", time: "1h ago" },
    { school: "Dubai British School", teacherId: "OM-T1255", time: "4h ago" },
    {
      school: "Jakarta Intercultural",
      teacherId: "OM-T3321",
      time: "Yesterday",
    },
    {
      school: "Seoul Foreign School",
      teacherId: "OM-T8812",
      time: "Yesterday",
    },
  ];

  return (
    <div className="space-y-8">
      {requests.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0 overflow-hidden">
            {/* Avatar stays fixed size */}
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {item.school.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Text container shrinks if needed */}
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-medium leading-none truncate">
                {item.school}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Req: <span className="font-mono">{item.teacherId}</span>
              </p>
            </div>
          </div>

          {/* Timestamp stays visible but doesn't grow */}
          <div className="text-xs text-muted-foreground font-medium whitespace-nowrap ml-2">
            {item.time}
          </div>
        </div>
      ))}

      <Button variant="outline" className="w-full mt-4 cursor-pointer" size="sm">
        <Link to='/admin/requests'>View All</Link>
      </Button>
    </div>
  );
}
