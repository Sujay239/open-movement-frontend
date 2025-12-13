import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Download,
  Users,
  Eye,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";

// --- MOCK DATA ---

const viewsData = [
  { date: "Mon", views: 45, requests: 2 },
  { date: "Tue", views: 52, requests: 3 },
  { date: "Wed", views: 38, requests: 1 },
  { date: "Thu", views: 65, requests: 5 },
  { date: "Fri", views: 48, requests: 2 },
  { date: "Sat", views: 20, requests: 0 },
  { date: "Sun", views: 15, requests: 0 },
];

const topSchools = [
  { name: "Riyadh Intl School", views: 145, location: "Saudi Arabia" },
  { name: "Bangkok Prep", views: 112, location: "Thailand" },
  { name: "Dubai British School", views: 89, location: "UAE" },
  { name: "Singapore American", views: 76, location: "Singapore" },
  { name: "British School Tokyo", views: 54, location: "Japan" },
];

const topTeachers = [
  { code: "OM-T8842", name: "Sarah Jenkins (Math)", hits: 34 },
  { code: "OM-T9921", name: "David Chen (Physics)", hits: 28 },
  { code: "OM-T1255", name: "Emily White (Primary)", hits: 22 },
  { code: "OM-T3341", name: "James Wilson (PE)", hits: 19 },
];

const regionData = [
  { name: "Middle East", value: 45, color: "#3b82f6" }, // blue-500
  { name: "Southeast Asia", value: 30, color: "#10b981" }, // emerald-500
  { name: "Europe", value: 15, color: "#f59e0b" }, // amber-500
  { name: "Other", value: 10, color: "#64748b" }, // slate-500
];

// --- CUSTOM TOOLTIP COMPONENT ---
// This ensures colors (text/bg) adapt automatically to Dark/Light mode
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
        {/* Label (e.g., Date) - Only show if it exists */}
        {label && (
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {label}
          </p>
        )}

        {/* Data Items */}
        <div className="flex flex-col gap-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {/* Color Dot */}
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.payload.fill }}
              />
              {/* Name */}
              <span className="text-popover-foreground font-medium">
                {entry.name}:
              </span>
              {/* Value */}
              <span className="text-popover-foreground font-bold">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <div className="space-y-6 h-full flex flex-col p-4 md:p-8">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Insights into platform usage and school activity.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* --- Overview Stats --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Profile Views
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Full Profile Requests
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">+4% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Schools
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              Logins in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.2%</div>
            <p className="text-xs text-muted-foreground">
              View to Request ratio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Main Charts Section --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Large Chart: Activity Over Time */}
        <Card className="col-span-4 min-w-0">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              Profile views vs. Requests sent over the last week.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={viewsData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  {/* FIX: Use CustomTooltip here */}
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={<CustomTooltip />}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    name="Profile Views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    name="Requests"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Side Chart: Traffic by Region */}
        <Card className="col-span-4 md:col-span-2 lg:col-span-3 min-w-0">
          <CardHeader>
            <CardTitle>School Regions</CardTitle>
            <CardDescription>
              Where are the schools viewing from?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="75%"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {/* FIX: Use CustomTooltip here */}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Leaderboards Section --- */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Schools Table */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Top Active Schools</CardTitle>
            <CardDescription>
              Schools viewing the most profiles this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSchools.map((school, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {school.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {school.location}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-sm">{school.views} views</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Teachers Table */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Most Viewed Teachers</CardTitle>
            <CardDescription>
              Profiles attracting the most attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTeachers.map((teacher, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm ${i === 0 ? "bg-yellow-100 text-yellow-700" : "bg-muted"}`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {teacher.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {teacher.code}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-sm">{teacher.hits} hits</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
