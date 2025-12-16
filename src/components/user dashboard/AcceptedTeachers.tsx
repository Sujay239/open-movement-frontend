// AcceptedTeachers.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
  Copy,
  Clock,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAlert } from "../blocks/AlertProvider";

const BASE_URL = import.meta.env?.VITE_BASE_URL ?? "";

type ApiRow = {
  id: string;
  teacher_id?: string;
  teacher_code?: string;
  requested_at?: string | null;
  status?: string;
  school_message?: string;
  admin_notes?: string;
  subjects?: string[] | null;
  teacher?: {
    full_name?: string;
    email?: string;
    phone?: string;
    cv_link?: string | null;
    current_job_title?: string;
    highest_qualification?: string;
    current_country?: string;
    current_region?: string;
    visa_status?: string;
    notice_period?: string;
    will_move_sem1?: boolean;
    will_move_sem2?: boolean;
    years_experience?: string | number;
    preferred_regions?: any;
    profile_status?: string;
  } | null;
  // plus any other fields...
};

type CardData = {
  id: string;
  fullName: string;
  email: string;
  cvLink?: string | null;
  currentJobTitle?: string;
  subjects: string[];
  highestQualification?: string;
  currentRegion?: string;
  noticePeriod?: string;
  willMoveSem1?: boolean;
  willMoveSem2?: boolean;
  currentSchoolName?: string;
  experience?: string;
  avatarColor?: string;
};

export const AcceptedTeachers: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const [teachers, setTeachers] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {showError,showSuccess} = useAlert();

  useGSAP(
    () => {
      gsap.fromTo(
        ".accepted-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.1,
        }
      );
    },
    { scope: container }
  );

  useEffect(() => {
    let mounted = true;

    async function loadAccepted() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE_URL}/requests/teachers`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Server responded ${res.status}: ${text}`);
        }

        const data: ApiRow[] = await res.json();

        if (!mounted) return;

        // Filter accepted statuses (handle both API formats)
        const acceptedRows = (Array.isArray(data) ? data : []).filter(
          (r) =>
            r?.status === "TEACHER_ACCEPTED" ||
            r?.status === "Teacher Accepted" ||
            String(r?.status).toLowerCase().includes("accept")
        );

        // Map to card data
        const mapped: CardData[] = acceptedRows.map((r : any) => {
          const t = r.teacher ?? ({} as ApiRow["teacher"]);
          const subjects =
            Array.isArray(r.subjects) && r.subjects.length
              ? r.subjects
              : Array.isArray(t?.subjects)
                ? (t!.subjects as string[])
                : ((r.subjects as string[]) ?? []);

          // small avatar color chooser based on first subject (deterministic)
          const colorSeed =
            (subjects[0] || t?.full_name || "").charCodeAt(0 || 0) % 3;
          const avatarColor =
            colorSeed === 0
              ? "from-emerald-500 to-teal-500"
              : colorSeed === 1
                ? "from-blue-500 to-indigo-500"
                : "from-pink-500 to-rose-500";

                const country =  t.current_region + ", "+ t.current_country ;
          return {
            id: r.teacher_code,
            fullName: t.full_name ?? `${t?.full_name ?? "Unknown Teacher"}`,
            email: t.email ?? "not-provided@example.com",
            cvLink: t.cv_link ?? null,
            currentJobTitle: t.current_job_title ?? "—",
            subjects: subjects,
            highestQualification: t.highest_qualification ?? "—",
            currentRegion:  country ?? "—",
            noticePeriod: t.notice_period ?? "—",
            willMoveSem1: Boolean(t.will_move_sem1),
            willMoveSem2: Boolean(t.will_move_sem2),
            currentSchoolName: r.school_message ?? undefined,
            experience:
              t.years_experience != null
                ? String(t.years_experience)
                : undefined,
            avatarColor,
          };
        });

        setTeachers(mapped);
      } catch (err: any) {
        console.error("Failed to load accepted teachers", err);
        setError(err?.message ?? "Failed to fetch accepted teachers");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAccepted();

    return () => {
      mounted = false;
    };
  }, []);

  // helper actions
  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      // lightweight feedback - replace with your toast if available
      showSuccess("Email copied to clipboard");
    } catch {
      showError("Failed to copy email");
    }
  };

  const handleOpenGmail = (email: string) => {
    const subject = "Inquiry regarding Teacher";
    const body = `Hello,\n\nI would like to inquire about ${email}.\n\nThanks.`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  const handleDownloadCv = (cvLink?: string | null) => {
    if (!cvLink) {
      showError("CV not available");
      return;
    }
    window.open(cvLink, "_blank");
  };

  return (
    <div ref={container} className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-white/10 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          Accepted Requests
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30 gap-1.5 px-3 py-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {loading ? "…" : `${teachers.length} Profiles Unlocked`}
          </Badge>
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          These teachers have accepted your connection request. You can now view
          their full details and download their CVs.
        </p>
      </div>

      {loading && <div className="text-sm text-slate-500">Loading…</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}

      {/* Grid of Unlocked Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teachers.map((teacher) => (
          <Card
            key={teacher.id}
            className="accepted-card group relative overflow-hidden bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-green-500/30 transition-all duration-300 flex flex-col"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-emerald-500 to-teal-500" />

            <CardHeader className="pb-4 pt-6 px-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-linear-to-br ${teacher.avatarColor} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                  >
                    {String(teacher.fullName || "U").charAt(0)}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                      {teacher.fullName}
                      <span className="inline-flex" title="Verified Profile">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                      </span>
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {teacher.currentJobTitle ?? "—"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                      CODE: {teacher.id}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="hidden sm:flex border-slate-200 dark:border-white/10 cursor-pointer"
                  onClick={() => handleCopyEmail(teacher.email)}
                >
                  <Copy className="w-3.5 h-3.5 mr-2" />
                  Copy Email
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6 grow">
              {/* 1. Core Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <DetailRow
                  icon={<Mail className="text-blue-500" />}
                  label="Email"
                  value={teacher.email}
                  isEmail
                />
                <DetailRow
                  icon={<Building2 className="text-purple-500" />}
                  label="Current School"
                  value={teacher.currentSchoolName ?? "Not Disclosed"}
                />
                <DetailRow
                  icon={<MapPin className="text-red-500" />}
                  label="Region"
                  value={teacher.currentRegion ?? "—"}
                />
                <DetailRow
                  icon={<GraduationCap className="text-amber-500" />}
                  label="Qualification"
                  value={teacher.highestQualification ?? "—"}
                />
              </div>

              {/* 2. Availability & Notice */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-100 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Notice Period
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {teacher.noticePeriod ?? "—"}
                  </span>
                </div>

                <div className="h-px bg-slate-200 dark:bg-white/10" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Move Availability
                  </span>
                  <div className="flex gap-2">
                    <Badge
                      variant="secondary"
                      className={
                        teacher.willMoveSem1
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "opacity-50"
                      }
                    >
                      Sem 1
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        teacher.willMoveSem2
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "opacity-50"
                      }
                    >
                      Sem 2
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 3. Subjects Tags */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Teaching Subjects
                </span>
                <div className="flex flex-wrap gap-2">
                  {(teacher.subjects && teacher.subjects.length
                    ? teacher.subjects
                    : ["Not specified"]
                  ).map((sub) => (
                    <Badge
                      key={sub}
                      variant="secondary"
                      className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
                    >
                      {sub}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 gap-3">
              <Button
                className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-md cursor-pointer"
                onClick={() => handleOpenGmail(teacher.email)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Teacher
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-slate-200 dark:border-white/10 cursor-pointer"
                onClick={() => handleDownloadCv(teacher.cvLink)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* Helper for data rows */
function DetailRow({
  icon,
  label,
  value,
  isEmail = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEmail?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase tracking-wide">
        {React.cloneElement(icon as React.ReactElement, { size: 14 } as any)}
        {label}
      </div>
      <div
        className={`font-semibold text-sm truncate ${
          isEmail
            ? "text-blue-600 dark:text-blue-400 underline decoration-blue-300 underline-offset-2 cursor-pointer"
            : "text-slate-900 dark:text-zinc-200"
        }`}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}

export default AcceptedTeachers;
