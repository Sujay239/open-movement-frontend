// import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Timer, // Changed icon
  Activity,
  School,
  ArrowUpRight,
} from "lucide-react";
import { OverviewChart } from "@/components/AdminDashboard/OverviewChart";
import { RecentRequests } from "@/components/AdminDashboard/RecentRequests";

export default function AdminOverview() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Overview of school trials, subscriptions, and teacher connections.
          </p>
        </div>

      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Active Trials (Replaces Revenue) */}
        {/* This tracks schools currently inside their 24h window */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
            <Timer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              Schools using 24h codes
            </p>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Paid Subscriptions
            </CardTitle>
            <School className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              +4 this month
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Total Teachers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Teachers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground mt-1">
              Profiles in database
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Pending Requests (Highlighted - Action Required) */}
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Pending Requests
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <div className="mt-1">
              <Badge
                variant="outline"
                className="border-blue-200 text-blue-600 bg-white dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
              >
                Action Required
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart & List Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Chart (Spans 4 cols on large screens) */}
        <Card className="col-span-1 lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>
              New teacher profiles vs. School signups
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0 sm:pl-2">
            <OverviewChart />
          </CardContent>
        </Card>

        {/* List (Spans 3 cols on large screens) */}
        <Card className="col-span-1 lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Schools requesting full profiles.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentRequests />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
