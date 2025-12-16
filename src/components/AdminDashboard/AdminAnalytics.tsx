import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { useAlert } from "../blocks/AlertProvider";
// import { toast } from "sonner";

// --- MOCK DATA (RETAINED FOR CLIENT DEMO BACKUP) ---
// To use this instead of API, initialize your useState with these variables.
const DEMO_viewsData = [
  { date: "Mon", views: 45, requests: 2 },
  { date: "Tue", views: 52, requests: 3 },
  { date: "Wed", views: 38, requests: 1 },
  { date: "Thu", views: 65, requests: 5 },
  { date: "Fri", views: 48, requests: 2 },
  { date: "Sat", views: 20, requests: 0 },
  { date: "Sun", views: 15, requests: 0 },
];

const DEMO_topSchools = [
  { name: "Riyadh Intl School", views: 145, location: "Saudi Arabia" },
  { name: "Bangkok Prep", views: 112, location: "Thailand" },
  { name: "Dubai British School", views: 89, location: "UAE" },
  { name: "Singapore American", views: 76, location: "Singapore" },
  { name: "British School Tokyo", views: 54, location: "Japan" },
];

const DEMO_topTeachers = [
  { code: "OM-T8842", name: "Sarah Jenkins (Math)", hits: 34 },
  { code: "OM-T9921", name: "David Chen (Physics)", hits: 28 },
  { code: "OM-T1255", name: "Emily White (Primary)", hits: 22 },
  { code: "OM-T3341", name: "James Wilson (PE)", hits: 19 },
];

const DEMO_regionData = [
  { name: "Middle East", value: 45, color: "#3b82f6" },
  { name: "Southeast Asia", value: 30, color: "#10b981" },
  { name: "Europe", value: 15, color: "#f59e0b" },
  { name: "Other", value: 10, color: "#64748b" },
];

// --- TOOLTIP COMPONENT ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
        {label && (
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {label}
          </p>
        )}
        <div className="flex flex-col gap-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.payload.fill }}
              />
              <span className="text-popover-foreground font-medium">
                {entry.name}:
              </span>
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
  const [isLoading, setIsLoading] = useState(true);
    const {showError } = useAlert();

  // --- STATE (Starts Empty -> Fills from API) ---
  const [stats, setStats] = useState({
    totalViews: 0,
    requests: 0,
    activeSchools: 0,
    conversion: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [schoolData, setSchoolData] = useState<any[]>([]);
  const [teacherData, setTeacherData] = useState<any[]>([]);
  const [geoData, setGeoData] = useState<any[]>([]);

  // --- API FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // NOTE: Ensure your backend has this route implemented
        const res = await fetch(
          `http://localhost:5000/api/admin/analytics?range=${timeRange}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch analytics");

        const data = await res.json();

        // Update state with Real API Data
        setStats(
          data.stats || {
            totalViews: 0,
            requests: 0,
            activeSchools: 0,
            conversion: 0,
          }
        );
        setChartData(data.chartData || []);
        setSchoolData(data.topSchools || []);
        setTeacherData(data.topTeachers || []);
        setGeoData(data.regionData || []);
      } catch (error) {
        console.error("API Error, falling back to empty/demo:", error);
        showError("Could not load live analytics.");








        // OPTIONAL:  this block want to AUTO-FALLBACK to demo data on error

        // setStats({ totalViews: 2345, requests: 145, activeSchools: 48, conversion: 6.2 });
        // setChartData(DEMO_viewsData);
        // setSchoolData(DEMO_topSchools);
        // setTeacherData(DEMO_topTeachers);
        // setGeoData(DEMO_regionData);







      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return (
    <div className="space-y-6 h-full flex flex-col p-4 md:p-8">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Analytics
            {isLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h2>
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
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">in selected range</p>
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
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.requests}
            </div>
            <p className="text-xs text-muted-foreground">in selected range</p>
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
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.activeSchools}
            </div>
            <p className="text-xs text-muted-foreground">Logins recorded</p>
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
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.conversion}%
            </div>
            <p className="text-xs text-muted-foreground">
              View to Request ratio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Main Charts Section --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Activity Chart */}
        <Card className="col-span-4 min-w-0">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Profile views vs. Requests sent.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Loading chart...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
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
              )}
            </div>
          </CardContent>
        </Card>

        {/* Region Chart */}
        <Card className="col-span-4 md:col-span-2 lg:col-span-3 min-w-0">
          <CardHeader>
            <CardTitle>School Regions</CardTitle>
            <CardDescription>
              Where are the schools viewing from?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {isLoading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : geoData.length === 0 ? (
                <div className="text-muted-foreground text-sm">
                  No location data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={geoData}
                      cx="50%"
                      cy="50%"
                      innerRadius="50%"
                      outerRadius="75%"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {geoData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || "#8884d8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Leaderboards Section --- */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Schools */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Top Active Schools</CardTitle>
            <CardDescription>
              Schools viewing the most profiles this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schoolData.length === 0 && !isLoading && (
                <div className="text-sm text-muted-foreground">
                  No data available.
                </div>
              )}
              {schoolData.map((school, i) => (
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

        {/* Top Teachers */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Most Viewed Teachers</CardTitle>
            <CardDescription>
              Profiles attracting the most attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teacherData.length === 0 && !isLoading && (
                <div className="text-sm text-muted-foreground">
                  No data available.
                </div>
              )}
              {teacherData.map((teacher, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm ${
                        i === 0 ? "bg-yellow-100 text-yellow-700" : "bg-muted"
                      }`}
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
