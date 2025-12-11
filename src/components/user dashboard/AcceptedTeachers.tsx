import React, { useRef } from "react";
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
//   ExternalLink,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// --- MOCK DATA (Fully Unlocked) ---
const acceptedTeachers = [
  {
    id: "OM-T0123",
    fullName: "Sarah Jenkins",
    email: "sarah.j@example.com",
    cvLink: "#",
    currentJobTitle: "Head of Mathematics",
    subjects: ["Mathematics", "Further Maths", "Physics"],
    highestQualification: "Master of Education (M.Ed)",
    currentRegion: "Riyadh, Saudi Arabia",
    noticePeriod: "3 Months",
    willMoveSem1: true,
    willMoveSem2: false,
    currentSchoolName: "British International School of Riyadh",
    experience: "8 Years",
    avatarColor: "from-emerald-500 to-teal-500",
  },
  {
    id: "OM-T0126",
    fullName: "David Chen",
    email: "d.chen88@example.com",
    cvLink: "#",
    currentJobTitle: "Secondary Science Teacher",
    subjects: ["Biology", "General Science"],
    highestQualification: "PGCE Secondary Science",
    currentRegion: "Ho Chi Minh City, Vietnam",
    noticePeriod: "1 Month",
    willMoveSem1: true,
    willMoveSem2: true,
    currentSchoolName: "ABC International School",
    experience: "5 Years",
    avatarColor: "from-blue-500 to-indigo-500",
  },
];

export const AcceptedTeachers = () => {
  const container = useRef<HTMLDivElement>(null);

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
            {acceptedTeachers.length} Profiles Unlocked
          </Badge>
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          These teachers have accepted your connection request. You can now view
          their full details and download their CVs.
        </p>
      </div>

      {/* Grid of Unlocked Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {acceptedTeachers.map((teacher) => (
          <UnlockedTeacherCard key={teacher.id} data={teacher} />
        ))}
      </div>
    </div>
  );
};

/* --- UNLOCKED CARD COMPONENT --- */

const UnlockedTeacherCard = ({
  data,
}: {
  data: (typeof acceptedTeachers)[0];
}) => {
  return (
    <Card className="accepted-card group relative overflow-hidden bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-green-500/30 transition-all duration-300 flex flex-col">
      {/* Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-emerald-500 to-teal-500" />

      <CardHeader className="pb-4 pt-6 px-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 items-center">
            {/* Avatar with Initials */}
            <div
              className={`w-16 h-16 rounded-2xl bg-linear-to-br ${data.avatarColor} flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/20`}
            >
              {data.fullName.charAt(0)}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                {data.fullName}
                {/* Verified Badge */}
                <span className="inline-flex" title="Verified Profile">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                </span>
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {data.currentJobTitle}
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                ID: {data.id}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="hidden sm:flex border-slate-200 dark:border-white/10"
            onClick={() => navigator.clipboard.writeText(data.email)}
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
            value={data.email}
            isEmail
          />
          <DetailRow
            icon={<Building2 className="text-purple-500" />}
            label="Current School"
            value={data.currentSchoolName || "Not Disclosed"}
          />
          <DetailRow
            icon={<MapPin className="text-red-500" />}
            label="Region"
            value={data.currentRegion}
          />
          <DetailRow
            icon={<GraduationCap className="text-amber-500" />}
            label="Qualification"
            value={data.highestQualification}
          />
        </div>

        {/* 2. Availability & Notice */}
        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-100 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Notice Period
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {data.noticePeriod}
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
                  data.willMoveSem1
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "opacity-50"
                }
              >
                Sem 1
              </Badge>
              <Badge
                variant="secondary"
                className={
                  data.willMoveSem2
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
            {data.subjects.map((sub) => (
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
        <Button className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-md">
          <Mail className="w-4 h-4 mr-2" />
          Email Teacher
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-slate-200 dark:border-white/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Download CV
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper for data rows
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
        className={`font-semibold text-sm truncate ${isEmail ? "text-blue-600 dark:text-blue-400 underline decoration-blue-300 underline-offset-2 cursor-pointer" : "text-slate-900 dark:text-zinc-200"}`}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}

export default AcceptedTeachers;
