import { useRef, useState } from "react";
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
  MessageCircle,
  FileQuestion,
  Zap,
  Send,
  Mail,
  Search,
  // CheckCircle2,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAlert } from "../blocks/AlertProvider";

const BASE_URL = import.meta.env?.VITE_BASE_URL;
export const SupportPage = () => {
  const container = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issueType, setIssueType] = useState<string>("Billing & Subscription");
  const [message, setMessage] = useState<string>("");

    const {showError,showSuccess} = useAlert();
  useGSAP(
    () => {
      // 1. Header & Left Content Entrance
      gsap.fromTo(
        ".support-left",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );

      // 2. Contact Form Entrance (From Right)
      gsap.fromTo(
        ".support-right",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.1 }
      );

      // 3. FAQ Section Entrance (From Bottom)
      gsap.fromTo(
        ".support-bottom",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.3 }
      );
    },
    { scope: container }
  );

  const handleSendSupportEmail = async () => {
    setIsSubmitting(true);
    if(message === ""){
      showError("Message cannot be empty.");
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/support/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials : 'include',
        body: JSON.stringify({
          issueType,
          message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send support email");

      showSuccess("Your request has been sent successfully!");
    } catch (err) {
      console.error(err);
      showError("Failed to send email. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div ref={container} className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* TOP SECTION: Split into Header/Links (Left) and Contact Form (Right) */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* --- LEFT SIDE: Header & Quick Links --- */}
        <div className="lg:col-span-2 space-y-8 support-left">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              Help Center
              <Badge
                variant="outline"
                className="border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 gap-1 text-sm py-1"
              >
                <Zap className="w-3 h-3 fill-current" /> Priority Support
              </Badge>
            </h1>
            <p className="text-lg text-slate-500 dark:text-zinc-400 max-w-xl leading-relaxed">
              We are here to help. Find answers to common questions below or get
              in touch with our dedicated support team directly.
            </p>

            {/* Search Bar */}
            <div className="relative w-full max-w-md pt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documentation, FAQs, or topics..."
                className="pl-10 h-12 text-base bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 shadow-sm"
              />
            </div>
          </div>

          {/* Quick Stats / Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <Card className="group hover:border-purple-500/50 transition-all duration-300 hover:shadow-md cursor-pointer bg-white/60 dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileQuestion className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-base">Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Browse detailed guides on billing, profile management, and more.
              </CardContent>
            </Card>

            <Card className="group hover:border-green-500/50 transition-all duration-300 hover:shadow-md cursor-pointer bg-white/60 dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-base">Live Chat</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Chat with an agent. Available Mon-Fri, 9am - 5pm EST.
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- RIGHT SIDE: Contact Form (Upper Side) --- */}
        <div className="lg:col-span-1 support-right h-full">
          <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 shadow-xl h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-purple-500" />

            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <LifeBuoy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Contact Support
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Typical response time: Under 2 hours.
              </p>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 gap-4">
              {/* Issue Type */}
              <div className="space-y-2">
                <Label htmlFor="issue-type">Issue Type</Label>
                <select
                  id="issue-type"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-sm"
                >
                  <option>Billing & Subscription</option>
                  <option>Technical Issue</option>
                  <option>Feature Request</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-2 flex flex-col flex-1">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="bg-slate-50 dark:bg-zinc-950 resize-none flex-1 min-h-[120px] focus-visible:ring-blue-500"
                />
              </div>

              {/* SEND BUTTON */}
              <div className="pt-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                  onClick={handleSendSupportEmail} // <-- IMPORTANT CHANGE
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
                <span>support@openmovements.com</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* BOTTOM SECTION: FAQ (Full Width) */}
      <div className="support-bottom">
        <div className="border-t border-slate-200 dark:border-white/10 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="item-1"
                className="border-slate-200 dark:border-white/10"
              >
                <AccordionTrigger className="text-slate-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 hover:no-underline">
                  How do I request a full profile?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Navigate to the "Browse Teachers" page, click "View Details"
                  on a candidate card, and then click the "Request Full Profile"
                  button. Our admin team will be notified immediately.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border-slate-200 dark:border-white/10"
              >
                <AccordionTrigger className="text-slate-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 hover:no-underline">
                  Can I upgrade from Trial to Pro instantly?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Yes! Go to the Subscription tab in your dashboard sidebar.
                  Select the "Pro" plan, complete the payment via Stripe, and
                  your account limits will be lifted instantly.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border-slate-200 dark:border-white/10"
              >
                <AccordionTrigger className="text-slate-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 hover:no-underline">
                  Are candidate profiles anonymous?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Yes. To protect teacher privacy, we hide names and contact
                  details until you formally request a profile and the teacher
                  consents to connect.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="item-4"
                className="border-slate-200 dark:border-white/10"
              >
                <AccordionTrigger className="text-slate-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 hover:no-underline">
                  What if a teacher declines my request?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  If a teacher is not interested or no longer available, the
                  request status will change to "Teacher Declined". This does
                  not count against your monthly request limit on Pro plans.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="border-slate-200 dark:border-white/10"
              >
                <AccordionTrigger className="text-slate-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 hover:no-underline">
                  Is there a limit to how many requests I can send?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Trial accounts are limited to 3 requests total. Pro accounts
                  have unlimited requests. You can view your current usage in
                  the Dashboard Overview.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-6"
                className="border-slate-200 dark:border-white/10"
              >
                <AccordionTrigger className="text-slate-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 hover:no-underline">
                  How do I reset my password?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Go to the Settings page and click "Security". You will need
                  your current password to set a new one. If you have lost
                  access, use the "Forgot Password" link on the login screen.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
