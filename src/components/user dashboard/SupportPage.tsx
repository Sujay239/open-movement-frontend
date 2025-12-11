import  { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LifeBuoy,
  Book,
  MessageCircle,
  FileQuestion,
  Zap,
  Send,
  Mail,
  Search,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const SupportPage = () => {
  const container = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useGSAP(
    () => {
      // 1. Header Entrance
      gsap.fromTo(
        ".support-header",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );

      // 2. Cards Stagger
      gsap.fromTo(
        ".support-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.2,
        }
      );

      // 3. Content Sections
      gsap.fromTo(
        ".support-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.4,
        }
      );
    },
    { scope: container }
  );

  return (
    <div ref={container} className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* HEADER */}
      <div className="support-header flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Help Center
            <Badge
              variant="outline"
              className="border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 gap-1"
            >
              <Zap className="w-3 h-3 fill-current" /> Priority Support Active
            </Badge>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 max-w-xl">
            Find answers to common questions or get in touch with our dedicated
            support team.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            className="pl-9 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10"
          />
        </div>
      </div>

      {/* QUICK LINKS GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="support-card group hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer bg-white/60 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg">Documentation</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Browse detailed guides on how to search, filter, and interview
            candidates effectively.
          </CardContent>
        </Card>

        <Card className="support-card group hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 cursor-pointer bg-white/60 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <FileQuestion className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-lg">FAQs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Quick answers to common questions about billing, account access, and
            candidate privacy.
          </CardContent>
        </Card>

        <Card className="support-card group hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 cursor-pointer bg-white/60 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg">Live Chat</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Chat with a support agent in real-time. Available Mon-Fri, 9am - 5pm
            EST.
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: FAQ */}
        <div className="lg:col-span-2 space-y-6 support-content">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="item-1"
              className="border-slate-200 dark:border-white/10"
            >
              <AccordionTrigger className="text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                How do I request a full profile?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-zinc-400">
                Navigate to the "Browse Teachers" page, click "View Details" on
                a candidate card, and then click the "Request Full Profile"
                button. Our admin team will be notified immediately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border-slate-200 dark:border-white/10"
            >
              <AccordionTrigger className="text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                Can I upgrade from Trial to Pro instantly?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-zinc-400">
                Yes! Go to the Subscription tab in your dashboard sidebar.
                Select the "Pro" plan, complete the payment via Stripe, and your
                account limits will be lifted instantly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border-slate-200 dark:border-white/10"
            >
              <AccordionTrigger className="text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                Are candidate profiles anonymous?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-zinc-400">
                Yes. To protect teacher privacy, we hide names and contact
                details until you formally request a profile and the teacher
                consents to connect.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border-slate-200 dark:border-white/10"
            >
              <AccordionTrigger className="text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                What if a teacher declines my request?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-zinc-400">
                If a teacher is not interested or no longer available, the
                request status will change to "Teacher Declined". This does not
                count against your monthly request limit on Pro plans.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* RIGHT COLUMN: Contact Widget */}
        <div className="support-content">
          <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="issue-type">Issue Type</Label>
                <select
                  id="issue-type"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>Billing & Subscription</option>
                  <option>Technical Issue</option>
                  <option>Feature Request</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue..."
                  className="min-h-[120px] bg-slate-50 dark:bg-zinc-950/50 resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsSubmitting(true)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Request <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                <Mail className="w-3 h-3" />
                <span>Or email us at support@openmovements.com</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
