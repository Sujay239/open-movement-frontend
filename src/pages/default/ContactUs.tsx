import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, User, Building2 } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const ContactUs = () => {
  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Focus state management for floating labels/styles
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useGSAP(
    () => {
      // 1. Background Blobs Animation
      gsap.to(".blob-contact-1", {
        x: 100,
        y: -50,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".blob-contact-2", {
        x: -80,
        y: 80,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      // 2. Entrance Animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".contact-header",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
        .fromTo(
          infoRef.current,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          formRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8 },
          "-=0.6"
        );
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-zinc-950 relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500/30 text-foreground transition-colors duration-300"
    >
      {/* 1. ANIMATED BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] opacity-20"></div>
        {/* Moving Blobs */}
        <div className="blob-contact-1 absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="blob-contact-2 absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/20 dark:bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="contact-header text-center mb-16 space-y-4">
          <h2 className="text-blue-600 dark:text-cyan-400 font-semibold tracking-wide uppercase text-sm">
            Get in Touch
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            We'd love to hear from you
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
            Have a question about our recruitment platform? Want to partner with
            Open Movements? Send us a message below.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          {/* LEFT SIDE: Contact Info */}
          <div
            ref={infoRef}
            className="lg:col-span-5 flex flex-col justify-between space-y-8"
          >
            {/* Info Cards */}
            <div className="space-y-6">
              <ContactInfoCard
                icon={<Mail className="w-6 h-6" />}
                title="Email Us"
                content="contact@openmovements.com"
                subContent="We usually reply within 24 hours."
              />
              <ContactInfoCard
                icon={<Phone className="w-6 h-6" />}
                title="Call Us"
                content="+1 (555) 123-4567"
                subContent="Mon-Fri from 8am to 5pm."
              />
              <ContactInfoCard
                icon={<MapPin className="w-6 h-6" />}
                title="Visit Us"
                content="123 Innovation Street"
                subContent="San Francisco, CA 94102"
              />
            </div>

            {/* Social Proof / Trust */}
            <div className="bg-white/60 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-sm">
              <div className="flex -space-x-3 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-xs text-slate-900 dark:text-white overflow-hidden"
                  >
                    <img
                      src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-white">
                  +2k
                </div>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 text-sm">
                Trusted by{" "}
                <span className="text-slate-900 dark:text-white font-semibold">
                  2,000+
                </span>{" "}
                schools and teachers worldwide.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: The Form */}
          <div
            ref={formRef}
            className="lg:col-span-7 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-blue-900/5 dark:shadow-black/50 relative group"
          >
            {/* Top Shine Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500/50 dark:via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FloatingInput
                  id="name"
                  label="Full Name"
                  icon={<User className="w-5 h-5" />}
                  focused={focusedField === "name"}
                  setFocus={setFocusedField}
                />
                <FloatingInput
                  id="email"
                  type="email"
                  label="Email Address"
                  icon={<Mail className="w-5 h-5" />}
                  focused={focusedField === "email"}
                  setFocus={setFocusedField}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FloatingInput
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  icon={<Phone className="w-5 h-5" />}
                  focused={focusedField === "phone"}
                  setFocus={setFocusedField}
                />
                <FloatingInput
                  id="school"
                  label="School Name (Optional)"
                  icon={<Building2 className="w-5 h-5" />}
                  focused={focusedField === "school"}
                  setFocus={setFocusedField}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-zinc-400 ml-1">
                  Message
                </label>
                <div
                  className={`relative transition-all duration-300 rounded-xl p-px ${
                    focusedField === "message"
                      ? "bg-linear-to-r from-blue-500 to-cyan-500"
                      : "bg-slate-200 dark:bg-zinc-800"
                  }`}
                >
                  <div className="relative bg-white dark:bg-zinc-950 rounded-xl overflow-hidden">
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help..."
                      rows={5}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      className="border-0 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus-visible:ring-0 resize-none p-4"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="button"
                className="w-full h-14 text-base font-bold bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 hover:shadow-blue-500/40 dark:hover:shadow-cyan-500/40 hover:scale-[1.05] active:scale-[0.99] transition-all duration-200 rounded-xl cursor-pointer"
              >
                Send Message
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB COMPONENTS --- */

function ContactInfoCard({
  icon,
  title,
  content,
  subContent,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  subContent: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors duration-300 group cursor-default">
      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20 group-hover:scale-110 group-hover:bg-linear-to-br group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/5">
        {icon}
      </div>
      <div>
        <h3 className="text-slate-900 dark:text-white font-semibold text-lg">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-zinc-300 font-medium">
          {content}
        </p>
        <p className="text-slate-400 dark:text-zinc-500 text-sm mt-1">
          {subContent}
        </p>
      </div>
    </div>
  );
}

function FloatingInput({
  id,
  label,
  type = "text",
  icon,
  focused,
  setFocus,
}: {
  id: string;
  label: string;
  type?: string;
  icon: React.ReactNode;
  focused: boolean;
  setFocus: (id: string | null) => void;
}) {
  return (
    <div className="relative group">
      {/* Border Gradient Container */}
      <div
        className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
          focused
            ? "bg-linear-to-r from-blue-500 to-cyan-500 opacity-100 p-px"
            : "bg-slate-200 dark:bg-zinc-800 p-px opacity-100"
        }`}
      >
        <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-xl" />
      </div>

      <div className="relative flex items-center">
        {/* Icon */}
        <div
          className={`absolute left-4 transition-colors duration-300 ${
            focused
              ? "text-blue-500 dark:text-cyan-400"
              : "text-slate-400 dark:text-zinc-500"
          }`}
        >
          {icon}
        </div>
        {/* Input */}
        <Input
          id={id}
          type={type}
          placeholder=" " // Required for peer-placeholder-shown
          onFocus={() => setFocus(id)}
          onBlur={() => setFocus(null)}
          className="peer block w-full h-14 bg-transparent border-0 text-slate-900 dark:text-white placeholder-transparent focus-visible:ring-0 pl-12 pt-5 pb-1 rounded-xl z-10"
        />
        {/* Floating Label */}
        <Label
          htmlFor={id}
          className={`absolute left-12 transition-all duration-200 pointer-events-none z-20
            ${
              focused ||
              (document.getElementById(id) as HTMLInputElement)?.value
                ? "top-2.5 text-[10px] text-blue-500 dark:text-cyan-400 uppercase tracking-wider font-bold"
                : "top-4 text-sm text-slate-500 dark:text-zinc-500"
            }
            peer-placeholder-shown:text-slate-500 dark:peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
            peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:text-blue-500 dark:peer-focus:text-cyan-400 peer-focus:uppercase peer-focus:tracking-wider peer-focus:font-bold
          `}
        >
          {label}
        </Label>
      </div>
    </div>
  );
}

export default ContactUs;
