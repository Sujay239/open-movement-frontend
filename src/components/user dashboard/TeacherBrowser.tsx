import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAlert } from "../blocks/AlertProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  FileText,
  ArrowRight,
  User,
  GraduationCap,
  Lock,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import iso3166_2 from "iso-3166-2.json";

const BASE_URL = import.meta.env?.VITE_BASE_URL ?? "";

const INITIAL_TEACHERS: any[] = [];

export default function TeacherBrowser() {
  const container = useRef<HTMLDivElement | null>(null);

  // --- STATE ---
  const [teachers, setTeachers] =
    useState<typeof INITIAL_TEACHERS>(INITIAL_TEACHERS);
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null
  ); // Local state for status
  const { showError } = useAlert();
  const [query, setQuery] = useState<string>("");

  const COUNTRY_NAMES = useMemo(() => {
    const names: string[] = [];
    for (const code in iso3166_2) {
      const country = iso3166_2[code as keyof typeof iso3166_2];
      if (country?.name) names.push(country.name);
    }
    return names.sort();
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        ".teacher-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    },
    { scope: container }
  );

  // --- 1. FETCH SUBSCRIPTION STATUS & TEACHERS ---
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (!BASE_URL) return;
      setLoading(true);

      try {
        // A. Fetch Subscription Status
        const statusRes = await fetch(`${BASE_URL}/subscription/status`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (mounted) {
            // Sets 'ACTIVE', 'TRIAL', 'EXPIRED', etc.
            setSubscriptionStatus(statusData.subscription_status);
          }
        }

        // B. Fetch Teachers
        const teachersRes = await fetch(`${BASE_URL}/portal/teachers`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!teachersRes.ok) {
          const text = await teachersRes.text().catch(() => "");
          throw new Error(`Server responded ${teachersRes.status}: ${text}`);
        }

        const data = await teachersRes.json();

        if (!mounted) return;

        const mapTeacher = (t: any) => ({
          id: t.id,
          code:
            t.teacher_code ??
            `remote-${Math.random().toString(36).slice(2, 9)}`,
          subject: t.highest_qualification ?? t.subject ?? "Unknown",
          level: t.level ?? "Senior",
          exp: t.years_experience ? `${t.years_experience} Years` : "N/A",
          location: t.current_country ?? t.location ?? "Unknown",
          visa: t.visa_status ?? "Unknown",
          bio: t.bio ?? "No bio available.",
          // Mapped the status from backend
          status: t.profile_status ?? "ACTIVE",
        });

        if (Array.isArray(data)) {
          const mapped = data.map(mapTeacher);
          setTeachers((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const toAdd = mapped.filter((m) => !existingIds.has(m.id));
            return [...prev, ...toAdd];
          });
        } else if (data?.data && Array.isArray(data.data)) {
          const mapped = data.data.map(mapTeacher);
          setTeachers((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const toAdd = mapped.filter((m: any) => !existingIds.has(m.id));
            return [...prev, ...toAdd];
          });
        }
      } catch (err: any) {
        console.error("Failed to load data", err);
        if (mounted) showError(err.message ?? "Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = teachers.filter(
    (t) =>
      t.subject.toLowerCase().includes(query.toLowerCase()) ||
      (t.location ?? "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={container} className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center bg-white dark:bg-zinc-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by subject or location..."
            className="pl-9 bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Select>
            <SelectTrigger className="w-[140px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 cursor-pointer">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary" className="cursor-pointer">
                Primary
              </SelectItem>
              <SelectItem value="secondary" className="cursor-pointer">
                Secondary
              </SelectItem>
              <SelectItem value="highSecondary" className="cursor-pointer">
                Higher Secondary
              </SelectItem>
              <SelectItem value="leadership" className="cursor-pointer">
                Leadership
              </SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[140px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 cursor-pointer">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_NAMES.map((country) => (
                <SelectItem
                  key={country}
                  value={country}
                  className="cursor-pointer"
                >
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-slate-500">Loading teachers…</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            data={teacher}
            subscriptionStatus={subscriptionStatus}
          />
        ))}
      </div>
    </div>
  );
}

// --- TEACHER CARD COMPONENT ---
function TeacherCard({
  data,
  subscriptionStatus,
}: {
  data: any;
  subscriptionStatus: string | null;
}) {
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess } = useAlert();
  const navigate = useNavigate();

  // 2. CHECK STATUS: If not 'ACTIVE', restrict access
  const isRestricted = subscriptionStatus !== "ACTIVE";

  // --- DYNAMIC STATUS CONFIGURATION ---
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PLACED":
        return {
          label: "Already Placed",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-100 dark:border-blue-900/30",
          text: "text-blue-700 dark:text-blue-400",
          dotBg: "bg-blue-500",
          dotPing: "bg-blue-400",
        };
      case "INACTIVE":
        return {
          label: "Currently Unavailable",
          bg: "bg-slate-100 dark:bg-zinc-800",
          border: "border-slate-200 dark:border-zinc-700",
          text: "text-slate-500 dark:text-zinc-400",
          dotBg: "bg-slate-400",
          dotPing: "hidden", // No ping for inactive
        };
      case "ACTIVE":
      default:
        return {
          label: "Available to Hire",
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-100 dark:border-green-900/30",
          text: "text-green-700 dark:text-green-400",
          dotBg: "bg-green-500",
          dotPing: "bg-green-400",
        };
    }
  };

  const statusConfig = getStatusConfig(data.status);

  const handleRequestClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRestricted) {
      navigate("/school/subscription");
    } else {
      setIsRequestOpen(true);
    }
  };

  async function confirmRequest() {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/requests/teachers/${data.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message }),
      });

      if (res.ok) {
        setIsRequestOpen(false);
        setMessage("");
        showSuccess("Request sent successfully.");
      } else {
        const text = await res.text();
        console.error("Failed to send request:", text);
        showError("Failed to sent request. Try again.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function trackView(teacherId: string) {
    try {
      await fetch(`${BASE_URL}/school/track-view/${teacherId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to track view:", error);
    }
  }

  return (
    <>
      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 z-200">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">
              Request Connection
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400">
              Send a message to the {data.subject} teacher regarding your
              requirements.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                id="message"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-3 bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 h-24 text-start align-top pt-2"
              />
            </div>
          </div>

          <DialogFooter className="flex-row gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsRequestOpen(false)}
              className="border-slate-200 dark:border-white/10 cursor-pointer"
            >
              Close
            </Button>
            <Button
              onClick={confirmRequest}
              disabled={isSubmitting || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {isSubmitting ? "Sending..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <Card className="teacher-card group relative overflow-hidden bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full rounded-3xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardHeader className="pb-4 pt-6 px-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-white to-slate-100 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <span className="text-2xl font-bold bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {String(data.subject ?? "U").charAt(0)}
                  </span>
                </div>
                <div className="space-y-1">
                  {/* <Badge
                    variant="secondary"
                    className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-500 dark:text-zinc-400 px-2 py-0.5"
                  >
                    {data.level}
                  </Badge> */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {data.subject}
                  </h3>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 px-6 space-y-4 grow">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Experience
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {data.exp}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Location
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {data.location}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0 pb-6 px-6 gap-3">
            <DialogTrigger asChild>
              <Button
                onClick={() => trackView(data.id)}
                variant="outline"
                className="flex-1 h-11 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 font-medium rounded-xl transition-all cursor-pointer hover:scale-105"
              >
                View Profile
              </Button>
            </DialogTrigger>

            {/* RESTRICTED BUTTON UI */}
            <Button
              onClick={handleRequestClick}
              className={`flex-1 h-11 transition-all shadow-lg rounded-xl font-semibold cursor-pointer hover:scale-110
                ${
                  isRestricted
                    ? "bg-slate-200 dark:bg-zinc-800 text-slate-500 hover:bg-slate-300 dark:hover:bg-zinc-700"
                    : "bg-white text-slate-900 dark:text-slate-900 hover:text-white hover:bg-green-400 hover:shadow-blue-500/25"
                }`}
            >
              {isRestricted ? (
                <>
                  <Lock className="w-4 h-4 mr-2" /> Upgrade
                </>
              ) : (
                "Request Full Profile"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Detailed Profile View Content */}
        <DialogContent className="w-[95vw] sm:max-w-[600px] z-150 p-0 gap-0 bg-white dark:bg-zinc-950 border-0 shadow-2xl rounded-2xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="overflow-y-auto custom-scrollbar">
            <div className="h-24 sm:h-32 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 relative shrink-0">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute -bottom-8 left-6 sm:-bottom-10 sm:left-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white dark:bg-zinc-950 p-1.5 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center border border-slate-100 dark:border-white/10">
                    <span className="text-3xl sm:text-4xl font-black bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {String(data.subject ?? "U").charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-8 pt-12 sm:pt-14 pb-6 sm:pb-8">
              <DialogHeader className="mb-6 sm:mb-8 text-left">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                  <div>
                    <DialogTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2 sm:gap-3">
                      {data.subject} Teacher
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 mt-2 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-md px-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-0"
                      >
                        {data.code}
                      </Badge>
                      <span className="hidden sm:inline">•</span>
                      <span>{data.level} Level</span>
                    </DialogDescription>
                  </div>

                  {/* DYNAMIC STATUS BADGE */}
                  <div
                    className={`self-start flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusConfig.bg} ${statusConfig.border}`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.dotPing}`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${statusConfig.dotBg}`}
                      ></span>
                    </span>
                    <span
                      className={`text-xs font-semibold whitespace-nowrap ${statusConfig.text}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <DetailItem
                  icon={<Briefcase />}
                  label="Experience"
                  value={data.exp}
                />
                <DetailItem
                  icon={<MapPin />}
                  label="Current Location"
                  value={data.location}
                />
                <DetailItem
                  icon={<FileText />}
                  label="Visa Status"
                  value={data.visa}
                  highlight
                />
                <DetailItem
                  icon={<GraduationCap />}
                  label="Qualification"
                  value={data.subject}
                />
              </div>

              <div className="bg-slate-50 dark:bg-white/5 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-white/5 mb-6 sm:mb-8">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  Candidate Summary
                </h4>
                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {data.bio}
                </p>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-3">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-12 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 order-2 sm:order-1 cursor-pointer hover:scale-105 transition-transform"
                  >
                    Close
                  </Button>
                </DialogClose>

                {/* RESTRICTED BUTTON UI INSIDE MODAL */}
                <Button
                  className={`w-full sm:w-auto h-12 rounded-xl text-base font-semibold group order-1 sm:order-2 cursor-pointer transition-transform
                    ${
                      isRestricted
                        ? "bg-slate-200 dark:bg-zinc-800 text-slate-400 hover:bg-slate-300 dark:hover:bg-zinc-700"
                        : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20 hover:scale-105"
                    }`}
                  onClick={handleRequestClick}
                >
                  {isRestricted ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" /> Upgrade to Request
                    </>
                  ) : (
                    <>
                      Request Full Profile
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailItem({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-white/2 shadow-sm">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          highlight
            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            : "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400"
        }`}
      >
        {React.cloneElement(icon as React.ReactElement, { size: 18 } as any)}
      </div>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-0.5">
          {label}
        </div>
        <div className="font-semibold text-slate-900 dark:text-white text-sm">
          {value}
        </div>
      </div>
    </div>
  );
}
