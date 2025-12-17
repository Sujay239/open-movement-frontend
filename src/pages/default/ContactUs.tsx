import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  Building2,
  Globe,
  Map,
  Loader2,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAlert } from "@/components/blocks/AlertProvider";

// Constants
const BASE_URL = import.meta.env?.VITE_BASE_URL ?? "";
const CONTACT_EMAIL = import.meta.env?.VITE_CONTACT_EMAIL;
const CONTACT_PHONE = import.meta.env?.VITE_CONTACT_PHONE;
const CONTACT_LOCATION = import.meta.env?.VITE_CONTACT_ELOCATION;

export const ContactUs = () => {
  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Alert context
  const { showSuccess, showError } = useAlert();

  // --- STATE MANAGEMENT ---
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    country: "",
    region: "",
    address: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/contact/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showSuccess("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          school: "",
          country: "",
          region: "",
          address: "",
          message: "",
        });
      } else {
        showError("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      showError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      /* FIXED CLASSES:
         1. min-h-screen: Grows with content on mobile.
         2. lg:h-screen: Fixed height only on Desktop.
         3. overflow-x-hidden: Prevents side scrolling from blobs.
         4. REMOVED overflow-y-auto: Lets the browser handle vertical scrolling naturally.
      */
      className="min-h-screen lg:h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-zinc-950 relative overflow-x-hidden py-12 lg:py-4 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500/30 text-foreground transition-colors duration-300"
    >
      {/* 1. ANIMATED BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] opacity-20"></div>
        {/* Moving Blobs - Resized for mobile */}
        <div className="blob-contact-1 absolute top-0 left-0 w-64 h-64 md:w-[600px] md:h-[600px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[80px] md:blur-[120px]"></div>
        <div className="blob-contact-2 absolute bottom-0 right-0 w-64 h-64 md:w-[600px] md:h-[600px] bg-purple-500/20 dark:bg-cyan-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col h-full lg:justify-center">
        {/* Header */}
        <div className="contact-header text-center mb-8 lg:mb-8 space-y-2 shrink-0">
          <h2 className="text-blue-600 dark:text-cyan-400 font-semibold tracking-wide uppercase text-xs">
            Get in Touch
          </h2>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            We'd love to hear from you
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
            Have a question? Send us a message below.
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-8 grow-0 pb-8 lg:pb-0">
          {/* LEFT SIDE: Contact Info */}
          <div
            ref={infoRef}
            className="flex flex-col gap-6 lg:col-span-4 justify-center order-last lg:order-first"
          >
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <ContactInfoCard
                icon={<Mail className="w-5 h-5" />}
                title="Email Us"
                content={CONTACT_EMAIL || "contact@example.com"}
                subContent="We reply within 24h."
              />
              <ContactInfoCard
                icon={<Phone className="w-5 h-5" />}
                title="Call Us"
                content={CONTACT_PHONE || "+1 234 567 890"}
                subContent="Mon-Fri 8am-5pm"
              />
              <ContactInfoCard
                icon={<MapPin className="w-5 h-5" />}
                title="Visit Us"
                content={CONTACT_LOCATION || "San Francisco, CA"}
                subContent="HQ Office"
              />
            </div>

            {/* Social Proof */}
            <div className="hidden sm:block bg-white/60 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 rounded-2xl p-5 backdrop-blur-sm shadow-sm">
              <div className="flex -space-x-3 mb-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`https://randomuser.me/api/portraits/men/${
                        20 + i
                      }.jpg`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-white">
                  +2k
                </div>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 text-xs">
                Trusted by{" "}
                <span className="text-slate-900 dark:text-white font-semibold">
                  2,000+
                </span>{" "}
                schools worldwide.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: The Form */}
          <div
            ref={formRef}
            className="lg:col-span-8 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-900/5 dark:shadow-black/50 relative group order-first lg:order-last"
          >
            {/* Top Shine Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500/50 dark:via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Name & Email - Stack on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  id="name"
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  icon={<User className="w-5 h-5" />}
                  focused={focusedField === "name"}
                  setFocus={setFocusedField}
                />
                <FloatingInput
                  id="email"
                  type="email"
                  label="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  icon={<Mail className="w-5 h-5" />}
                  focused={focusedField === "email"}
                  setFocus={setFocusedField}
                />
              </div>

              {/* Row 2: Phone & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  id="phone"
                  type="tel"
                  label="Phone (Optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={<Phone className="w-5 h-5" />}
                  focused={focusedField === "phone"}
                  setFocus={setFocusedField}
                />
                <FloatingInput
                  id="country"
                  label="Country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  icon={<Globe className="w-5 h-5" />}
                  focused={focusedField === "country"}
                  setFocus={setFocusedField}
                />
              </div>

              {/* Row 3: Region & School */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  id="region"
                  label="Region (Optional)"
                  value={formData.region}
                  onChange={handleChange}
                  icon={<Map className="w-5 h-5" />}
                  focused={focusedField === "region"}
                  setFocus={setFocusedField}
                />
                <FloatingInput
                  id="school"
                  label="School (Optional)"
                  value={formData.school}
                  onChange={handleChange}
                  icon={<Building2 className="w-5 h-5" />}
                  focused={focusedField === "school"}
                  setFocus={setFocusedField}
                />
              </div>

              {/* Row 4: Address */}
              <div>
                <FloatingInput
                  id="address"
                  label="Address (Optional)"
                  value={formData.address}
                  onChange={handleChange}
                  icon={<MapPin className="w-5 h-5" />}
                  focused={focusedField === "address"}
                  setFocus={setFocusedField}
                />
              </div>

              {/* Row 5: Message */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 dark:text-zinc-400 ml-1">
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
                      required
                      id="message"
                      placeholder="Tell us how we can help..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      className="border-0 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus-visible:ring-0 resize-none p-4 min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-bold bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 hover:shadow-blue-500/40 dark:hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 rounded-xl cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
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
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/40 dark:bg-white/5 lg:bg-transparent lg:hover:bg-slate-100 lg:dark:hover:bg-white/5 transition-colors duration-300 group cursor-default border border-white/10 lg:border-transparent">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20 group-hover:scale-110 group-hover:bg-linear-to-br group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/5">
        {icon}
      </div>
      <div>
        <h3 className="text-slate-900 dark:text-white font-semibold text-sm md:text-base">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-zinc-300 font-medium text-xs md:text-sm break-all">
          {content}
        </p>
        <p className="text-slate-400 dark:text-zinc-500 text-[10px] md:text-xs mt-0.5">
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
  value,
  onChange,
  required = false,
  focused,
  setFocus,
}: {
  id: string;
  label: string;
  type?: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
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
          value={value}
          onChange={onChange}
          required={required}
          placeholder=" "
          onFocus={() => setFocus(id)}
          onBlur={() => setFocus(null)}
          className="peer block w-full h-12 bg-transparent border-0 text-slate-900 dark:text-white placeholder-transparent focus-visible:ring-0 pl-12 pt-5 pb-1 rounded-xl z-10"
        />
        {/* Floating Label */}
        <Label
          htmlFor={id}
          className={`absolute left-12 transition-all duration-200 pointer-events-none z-20
            ${
              focused || value
                ? "top-2 text-[10px] text-blue-500 dark:text-cyan-400 uppercase tracking-wider font-bold"
                : "top-3.5 text-sm text-slate-500 dark:text-zinc-500"
            }
          `}
        >
          {label} {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
      </div>
    </div>
  );
}
