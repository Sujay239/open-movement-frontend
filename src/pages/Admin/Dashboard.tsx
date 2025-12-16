import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Timer, Activity, School, ArrowUpRight } from "lucide-react";
import { OverviewChart } from "@/components/AdminDashboard/OverviewChart";
import { RecentRequests } from "@/components/AdminDashboard/RecentRequests";

// Define the shape of your API data
interface DashboardStats {
  activeTrials: number;
  paidSubscriptions: number;
  totalSchools: number;
  totalTeachers: number;
  pendingRequests: number;
}

export default function AdminOverview() {
  // 1. State to hold real data
  const [stats, setStats] = useState<DashboardStats>({
    activeTrials: 0,
    paidSubscriptions: 0,
    totalSchools: 0,
    totalTeachers: 0,
    pendingRequests: 0,
  });
  const [growthData, setGrowthData] = useState([]);
  const [recentReqs, setRecentReqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch data from your 3 endpoints
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const BASE_URL = import.meta.env?.VITE_BASE_URL;

        const [statsRes, growthRes, recentRes] = await Promise.all([
          fetch(`${BASE_URL}/admin/dashboard/stats`, {
            credentials: "include",
          }),
          fetch(`${BASE_URL}/admin/dashboard/growth`, {
            credentials: "include",
          }),
          fetch(`${BASE_URL}/admin/requests/recent`, {
            credentials: "include",
          }),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (growthRes.ok) setGrowthData(await growthRes.json());
        if (recentRes.ok) setRecentReqs(await recentRes.json());
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {/* KPI 1: Active Trials */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
            <Timer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "-" : stats.activeTrials}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Schools using 24h codes
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Paid Subs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Paid Subscriptions
            </CardTitle>
            <School className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "-" : stats.paidSubscriptions}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" /> Active
              plans
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Total Schools */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "-" : stats.totalSchools}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Profiles in database
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Total Teachers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Teachers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "-" : stats.totalTeachers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Profiles in database
            </p>
          </CardContent>
        </Card>

        {/* KPI 5: Pending Requests */}
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Pending Requests
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "-" : stats.pendingRequests}
            </div>
            <div className="mt-1">
              {stats.pendingRequests > 0 ? (
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-600 bg-white dark:bg-blue-950 dark:text-blue-300"
                >
                  Action Required
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground">
                  All caught up
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart & List Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-1 lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>
              New teacher profiles vs. School signups (6 Months)
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0 sm:pl-2">
            {/* PASSING DATA AS PROP */}
            <OverviewChart data={growthData} />
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card className="col-span-1 lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Schools requesting full profiles.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* PASSING DATA AS PROP */}
            <RecentRequests data={recentReqs} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
