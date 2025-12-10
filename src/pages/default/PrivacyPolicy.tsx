import React, { useState, useRef } from "react";
import {
  Lock,
  Eye,
  Database,
  Cookie,
  ShieldCheck,
  UserCog,
  Mail,
  // Pointer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState("collection");
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Hero Animation (Shield Float)
      gsap.to(".hero-icon", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 2. Section Entrance Animations
      gsap.utils.toArray<HTMLElement>(".privacy-section").forEach((section) => {
        gsap.fromTo(
          section,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // 3. SCROLL SPY (The Fix!)
      // This updates the active sidebar link as you scroll down
      const sections = [
        "collection",
        "anonymity",
        "sharing",
        "security",
        "cookies",
        "rights",
      ];

      sections.forEach((sectionId) => {
        ScrollTrigger.create({
          trigger: `#${sectionId}`,
          start: "top center", // When top of section hits center of viewport
          end: "bottom center", // When bottom of section hits center
          onEnter: () => setActiveSection(sectionId),
          onEnterBack: () => setActiveSection(sectionId),
        });
      });
    },
    { scope: container }
  );

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for the sticky header (if you have one)
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id); // Instant update on click
    }
  };

  return (
    <div
      ref={container}
      className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 mt-3"
    >
      {/* HEADER */}
      <div className="bg-muted/30 border-b relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 -z-10 opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

        <div className="container mx-auto px-4 py-20 text-center max-w-4xl">
          <div className="hero-icon inline-flex items-center justify-center p-4 mb-6 bg-background rounded-full shadow-xl border text-primary">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            At Open Movements, we value the trust you place in us. This policy
            explains how we keep teacher identities anonymous and how we handle
            school data securely.
          </p>
          <p className="mt-4 text-xs font-semibold text-primary uppercase tracking-wider">
            Effective Date: December 2025
          </p>
        </div>
      </div>

      {/* FIX: Added 'items-start' here.
         Without this, flex children stretch to full height, breaking 'sticky'.
      */}
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-16 items-start">
        {/* SIDEBAR NAVIGATION (Sticky) */}
        {/* FIX: Added 'h-fit' (Height Fit) so it doesn't stretch */}
        <aside className="lg:w-1/4 hidden lg:block sticky top-24 h-fit">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 pl-4">
              Contents
            </p>
            <NavItem
              id="collection"
              label="1. Information We Collect"
              active={activeSection === "collection"}
              onClick={() => scrollTo("collection")}
            />
            <NavItem
              id="anonymity"
              label="2. Profile Anonymity"
              active={activeSection === "anonymity"}
              onClick={() => scrollTo("anonymity")}
            />
            <NavItem
              id="sharing"
              label="3. How We Share Data"
              active={activeSection === "sharing"}
              onClick={() => scrollTo("sharing")}
            />
            <NavItem
              id="security"
              label="4. Data Security"
              active={activeSection === "security"}
              onClick={() => scrollTo("security")}
            />
            <NavItem
              id="cookies"
              label="5. Cookies & Tracking"
              active={activeSection === "cookies"}
              onClick={() => scrollTo("cookies")}
            />
            <NavItem
              id="rights"
              label="6. Your Rights"
              active={activeSection === "rights"}
              onClick={() => scrollTo("rights")}
            />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="lg:w-3/4 space-y-20 max-w-3xl pb-20">
          {/* 1. COLLECTION */}
          <Section
            id="collection"
            title="1. Information We Collect"
            icon={<Database />}
          >
            <p className="mb-6">
              We collect information to facilitate the recruitment process. This
              differs depending on whether you are a School Administrator or a
              Teacher.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard title="For Schools">
                <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
                  <li>School Name & Contact Person</li>
                  <li>Email Address (for login & notifications)</li>
                  <li>Billing Information (processed via Stripe)</li>
                  <li>History of profile requests</li>
                </ul>
              </InfoCard>
              <InfoCard title="For Teachers">
                <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
                  <li>CV / Resume (kept private)</li>
                  <li>Qualifications & Experience</li>
                  <li>Visa Status & Current Location</li>
                  <li>Contact Details (Hidden until consent)</li>
                </ul>
              </InfoCard>
            </div>
          </Section>

          {/* 2. ANONYMITY */}
          <Section id="anonymity" title="2. Profile Anonymity" icon={<Eye />}>
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" /> The "Anonymous First"
                Standard
              </h4>
              <p className="mb-4">
                We employ a strict anonymity protocol. On the public "School
                Access" portal, teacher profiles are de-identified.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>What is Visible:</strong> "Secondary Maths Teacher", "8
                Years Experience", "Currently in Saudi Arabia".
                <br />
                <strong>What is Hidden:</strong> Name, Email, Phone Number,
                Current School Name, CV File.
              </p>
            </div>
          </Section>

          {/* 3. SHARING */}
          <Section id="sharing" title="3. How We Share Data" icon={<UserCog />}>
            <p className="mb-4">
              We do not sell your personal data. Data is only shared under
              specific recruitment circumstances:
            </p>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500" />
                <span>
                  <strong>Request Flow:</strong> When a school clicks "Request
                  Full Profile", the admin receives the request. No data is
                  transferred automatically.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <div className="mt-1 w-2 h-2 rounded-full bg-purple-500" />
                <span>
                  <strong>Teacher Consent:</strong> We contact the teacher
                  manually. Only if the teacher agrees do we share their CV and
                  contact details with the requesting school.
                </span>
              </li>
            </ul>
          </Section>

          {/* 4. SECURITY */}
          <Section id="security" title="4. Data Security" icon={<Lock />}>
            <p className="mb-4">
              We use industry-standard measures to protect your data, including:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted border">
                <h4 className="font-bold text-sm mb-1">Encryption</h4>
                <p className="text-xs text-muted-foreground">
                  Data is encrypted in transit (TLS) and at rest.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted border">
                <h4 className="font-bold text-sm mb-1">Access Control</h4>
                <p className="text-xs text-muted-foreground">
                  Only authorized admins can access full teacher CVs.
                </p>
              </div>
            </div>
          </Section>

          {/* 5. COOKIES */}
          <Section id="cookies" title="5. Cookies & Tracking" icon={<Cookie />}>
            <p className="mb-4">
              We use essential cookies to manage your login session,
              specifically for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground marker:text-primary">
              <li>
                <strong>24-Hour Access Codes:</strong> Tracking the countdown
                timer for trial accounts.
              </li>
              <li>
                <strong>Authentication:</strong> Keeping you logged in while you
                browse.
              </li>
              <li>
                <strong>Analytics:</strong> Anonymous usage data to improve our
                platform.
              </li>
            </ul>
          </Section>

          {/* 6. RIGHTS */}
          <Section id="rights" title="6. Your Rights" icon={<UserCog />}>
            <p className="mb-6">
              You have the right to access, correct, or delete your personal
              information at any time.
            </p>
            <div className="bg-card border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold mb-2">Want to remove your data?</h4>
              <p className="text-muted-foreground text-sm mb-4">
                If you are a teacher and wish to remove your profile from our
                database, or a school wishing to close your account, please
                contact us immediately.
              </p>
              <Button
                variant="outline"
                className="gap-2 cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <Mail className="w-4 h-4" /> Contact Privacy Officer
              </Button>
            </div>
          </Section>

          <Separator className="my-12" />

          {/* FOOTER NOTE */}
          <div className="text-center pb-10">
            <p className="text-muted-foreground text-sm">
              If you have any questions about this policy, please email{" "}
              <a
                href="mailto:admin@openmovements.com"
                className="text-primary hover:underline hover:font-bold transition-transform hover:text-green-400 duration-200"
              >
                admin@openmovements.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

function NavItem({
  label,
  active,
  onClick,
}: {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer text-sm text-left w-full py-3 pl-4 border-l-2 transition-all duration-300 ${
        active
          ? "border-primary text-primary font-bold bg-primary/5 translate-x-1"
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
      }`}
    >
      {label}
    </button>
  );
}

function Section({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="privacy-section scroll-mt-32">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {React.cloneElement(icon as React.ReactElement, { size: 24 } as any)}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="text-lg leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <h3 className="font-bold text-lg mb-4 pb-2 border-b">{title}</h3>
      {children}
    </div>
  );
}

export default PrivacyPage;
