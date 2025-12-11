// src/pages/dashboard/TeacherCard.tsx
// import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin, Briefcase,  Clock } from "lucide-react";

interface TeacherData {
  id: string;
  subject: string;
  level: string;
  exp: string;
  location: string;
  visa: string;
}

export const TeacherCard = ({ data }: { data: TeacherData }) => {
  return (
    <Card className="teacher-card group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-white dark:bg-zinc-900/40 backdrop-blur-sm overflow-hidden border-slate-200 dark:border-white/10">
      {/* Header with Anonymous Identifier */}
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2 bg-background">
              {data.level}
            </Badge>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {data.subject}
            </h3>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              ID: {data.id}
            </p>
          </div>
          {/* Anonymous Avatar Placeholder */}
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-slate-200 to-slate-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
            <span className="text-xl font-bold text-slate-500 dark:text-zinc-400">
              {data.subject.charAt(0)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
            <Briefcase className="w-4 h-4 text-primary/70" />
            <span>{data.exp}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
            <MapPin className="w-4 h-4 text-primary/70" />
            <span className="truncate">{data.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 col-span-2">
            <Clock className="w-4 h-4 text-primary/70" />
            <span className="truncate">Visa: {data.visa}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 gap-3">
        <Button
          variant="outline"
          className="flex-1 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
        >
          View Details
        </Button>
        <Button className="flex-1 bg-linear-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
          Request Profile
        </Button>
      </CardFooter>
    </Card>
  );
};
