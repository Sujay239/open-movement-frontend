import React, { useState, useEffect } from "react";
import {
  FileText,
  ShieldAlert,
  CreditCard,
  Users,
  Clock,
  Lock,
  Scale,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  // Simple scroll spy to highlight active section in sidebar
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 300) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 mt-3">
      {/* HEADER */}
      <div className="bg-muted/30 border-b rounded-2xl relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 text-center max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-primary/10 rounded-full">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-muted-foreground">
            Please read these terms carefully before using the School Access
            platform.
            <br className="hidden md:inline" /> These rules ensure a fair and
            secure experience for schools and teachers.
          </p>
          <p className="mt-4 text-sm font-medium text-primary">
            Last Updated: December 10, 2025
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
        {/* SIDEBAR NAVIGATION (Sticky) */}
        <aside className="lg:w-1/4 hidden lg:block relative">
          <div className="sticky top-24 space-y-1 border-l-2 border-muted pl-4">
            <NavItem
              id="introduction"
              label="1. Introduction"
              active={activeSection === "introduction"}
              onClick={() => scrollTo("introduction")}
            />
            <NavItem
              id="access-codes"
              label="2. Access Codes & Trials"
              active={activeSection === "access-codes"}
              onClick={() => scrollTo("access-codes")}
            />
            <NavItem
              id="subscriptions"
              label="3. Subscriptions & Billing"
              active={activeSection === "subscriptions"}
              onClick={() => scrollTo("subscriptions")}
            />
            <NavItem
              id="recruitment"
              label="4. Recruitment Process"
              active={activeSection === "recruitment"}
              onClick={() => scrollTo("recruitment")}
            />
            <NavItem
              id="privacy"
              label="5. Data & Anonymity"
              active={activeSection === "privacy"}
              onClick={() => scrollTo("privacy")}
            />
            <NavItem
              id="liability"
              label="6. Liability"
              active={activeSection === "liability"}
              onClick={() => scrollTo("liability")}
            />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="lg:w-3/4 space-y-16 max-w-3xl">
          {/* 1. INTRODUCTION */}
          <Section
            id="introduction"
            title="1. Introduction"
            icon={<FileText />}
          >
            <p className="mb-4">
              Welcome to <strong>Open Movements</strong> ("we," "our," or "us").
              By accessing our website, using our "School Access" portal, or
              purchasing a subscription, you agree to be bound by these Terms
              and Conditions.
            </p>
            <p>
              These terms apply specifically to{" "}
              <strong>School Administrators</strong> ("Schools") accessing our
              database of teacher profiles. If you do not agree with any part of
              these terms, you must not use our services.
            </p>
          </Section>

          {/* 2. ACCESS CODES */}
          <Section
            id="access-codes"
            title="2. Access Codes & Trials"
            icon={<Clock />}
          >
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900 mb-6">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Important: 24-Hour Limit
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Trial Access Codes are valid for exactly{" "}
                <strong>24 hours</strong> from the moment of first use. Once
                this period expires, access to the portal will be automatically
                revoked unless a paid subscription is purchased.
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-3 text-muted-foreground marker:text-primary">
              <li>
                <strong>Non-Transferable:</strong> Access codes are assigned to
                a specific school or administrator. Sharing codes with third
                parties or other institutions is strictly prohibited.
              </li>
              <li>
                <strong>One-Time Use:</strong> Each school is typically entitled
                to one trial period. Creating multiple accounts to abuse the
                trial system may result in a permanent ban.
              </li>
              <li>
                <strong>Expiry:</strong> We are not responsible if you fail to
                utilize the platform during the 24-hour window once the code has
                been activated.
              </li>
            </ul>
          </Section>

          {/* 3. SUBSCRIPTIONS */}
          <Section
            id="subscriptions"
            title="3. Subscriptions & Payments"
            icon={<CreditCard />}
          >
            <p className="mb-4">
              To maintain ongoing access to our candidate database after a
              trial, Schools must purchase a subscription plan.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <Card
                title="Payment Terms"
                content="Payments are processed securely via Stripe/Wix Payments. Subscriptions are billed in advance on a monthly or annual basis, depending on your selected plan."
              />
              <Card
                title="Cancellation"
                content="You may cancel your subscription at any time via your School Dashboard. Access will continue until the end of your current billing cycle. No refunds are provided for partial months."
              />
            </div>
          </Section>

          {/* 4. RECRUITMENT PROCESS */}
          <Section
            id="recruitment"
            title="4. Recruitment Process"
            icon={<Users />}
          >
            <p className="mb-4">
              Our platform acts as a connector between Schools and Teachers. We
              facilitate the initial introduction but are not the employer of
              any candidate.
            </p>
            <ul className="list-disc pl-6 space-y-3 text-muted-foreground marker:text-primary">
              <li>
                <strong>Requesting Profiles:</strong> Clicking "Request Full
                Profile" notifies the Open Movements admin team. It does{" "}
                <strong>not</strong> guarantee an interview. We must first
                obtain consent from the teacher.
              </li>
              <li>
                <strong>Off-Platform Hiring:</strong> Once a connection is made,
                all interviews, contract negotiations, and visa processing are
                handled directly between the School and the Teacher
                off-platform.
              </li>
              <li>
                <strong>Fair Usage:</strong> You agree to only request profiles
                for legitimate vacancies. Mass-requesting or "spamming" profile
                requests is prohibited.
              </li>
            </ul>
          </Section>

          {/* 5. PRIVACY & ANONYMITY */}
          <Section id="privacy" title="5. Data & Anonymity" icon={<Lock />}>
            <p className="mb-4">
              We take the privacy of our teachers seriously. Profiles on the
              public portal are <strong>anonymous</strong>.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 h-full min-h-[50px] bg-primary/30 rounded-full"></div>
                <div>
                  <h4 className="font-semibold">Prohibited Conduct</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    You must not attempt to identify, locate, or contact
                    teachers through outside means (e.g., social media) based on
                    their anonymous profile data without going through the
                    formal "Request Full Profile" process.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 h-full min-h-[50px] bg-primary/30 rounded-full"></div>
                <div>
                  <h4 className="font-semibold">Confidentiality</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    If we provide you with a full CV or contact details, you
                    agree to keep this information confidential and use it
                    solely for recruitment purposes within your school.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* 6. LIABILITY */}
          <Section
            id="liability"
            title="6. Limitation of Liability"
            icon={<ShieldAlert />}
          >
            <p className="mb-6">
              Open Movements provides candidate information in good faith based
              on data provided by the teachers. However:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground marker:text-primary">
              <li>
                We do not guarantee the accuracy of qualifications or work
                history stated in CVs. Schools are responsible for conducting
                their own background checks and referencing.
              </li>
              <li>
                We are not liable for any employment disputes, contract
                breaches, or visa issues that arise after a successful
                placement.
              </li>
              <li>
                We do not guarantee that the platform will be error-free or
                uninterrupted, though we strive for high availability.
              </li>
            </ul>
          </Section>

          <Separator className="my-12" />

          {/* FOOTER CTA */}
          <div className="bg-muted rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Have questions about these terms?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our support team is happy to clarify any points regarding access
              codes or subscriptions.
            </p>
            <Button size="lg" className="gap-2 cursor-pointer hover:scale-115 transition-transform duration-200 hover:bg-green-400">
              Contact Support <ArrowRight className="w-4 h-4" />
            </Button>
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
      className={`cursor-pointer text-sm text-left w-full py-2 pl-4 border-l-2 transition-all duration-200 ${
        active
          ? "border-primary text-primary font-medium bg-primary/5"
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
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
    <section id={id} className="scroll-mt-32 animate-in fade-in duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary w-fit">
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="text-lg leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function Card({ title, content }: { title: string; content: string }) {
  return (
    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
    </div>
  );
}


export default TermsAndConditions;
