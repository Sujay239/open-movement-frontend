import  { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PricingSection from "../ui/PricingSection";

export const SubscriptionPage = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".sub-card",
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
    <div ref={container} className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Subscription & Billing
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Manage your school access plan and payment methods.
        </p>
      </div>

      <div className="flex gap-8 flex-col">
        {/* CURRENT PLAN CARD */}
        <Card className="sub-card md:col-span-12 lg:col-span-7 bg-white dark:bg-zinc-900/50 border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Current Plan</CardTitle>
                <CardDescription>
                  You are currently on the Trial Access plan.
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
              >
                Trial Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-zinc-400">
                  Time Remaining
                </span>
                <span className="font-bold font-mono text-amber-600 dark:text-amber-400">
                  14h : 20m
                </span>
              </div>
              <Progress
                value={45}
                className="h-2 bg-slate-100 dark:bg-white/10"
              />
              <p className="text-xs text-muted-foreground pt-1">
                Your trial access will expire automatically on Oct 26, 2025 at
                4:00 PM.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 flex items-start gap-4 border border-slate-100 dark:border-white/5">
              <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Access Limitations</p>
                <p className="text-xs text-muted-foreground">
                  Trial accounts can view anonymous profiles but cannot request
                  contact details. Upgrade to unlock full features.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 dark:border-white/5 pt-6">
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-slate-200 dark:border-white/10"
            >
              Cancel Trial
            </Button>
          </CardFooter>
        </Card>

       <PricingSection />
      </div>
    </div>
  );
};

export default SubscriptionPage;
