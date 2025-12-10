import React, { useRef } from "react";
import {
  ShieldCheck,
  Search,
  UserPlus,
  Clock,
  CreditCard,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. HERO ANIMATION
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-badge",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      )
        .fromTo(
          ".hero-title",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          ".hero-desc",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.6"
        )
        .fromTo(
          ".hero-btns",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4"
        );

      // 2. FEATURE CARDS (Staggered Entrance)
      gsap.fromTo(
        ".gsap-feature-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 85%",
          },
        }
      );

      // 3. INTERACTIVE SCROLL LINE (In "How it Works")
      gsap.fromTo(
        ".step-line-fill",
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".steps-container",
            start: "top 60%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );

      // 4. STEPS ENTRANCE
      gsap.fromTo(
        ".step-item",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.3,
          scrollTrigger: {
            trigger: ".steps-container",
            start: "top 70%",
          },
        }
      );

      // 5. MOCKUP CARD FLOAT
      gsap.to(".mockup-float", {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden"
    >
      {/* 1. HERO SECTION */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        <div className="container mx-auto text-center max-w-4xl">
          <div className="hero-badge inline-block">
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1 text-sm font-medium"
            >
              New Platform Feature
            </Badge>
          </div>
          <h1 className="hero-title text-4xl md:text-6xl font-bold tracking-tight mb-6">
            The Smarter Way to Recruit <br className="hidden md:block" />
            <span className="bg-linear-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">
              Qualified Teachers
            </span>
          </h1>
          <p className="hero-desc text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse anonymous, pre-screened profiles instantly. Whether you have
            a 24-hour access code or a full subscription, find your next hire
            without the noise.
          </p>
          <div className="hero-btns flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-12 px-8 text-lg cursor-pointer hover:scale-110 transition-transform duration-200 hover:bg-green-400"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-lg cursor-pointer hover:scale-110 transition-transform duration-200"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES GRID */}
      <section className="py-20 bg-muted/50 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything Administrators Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've streamlined the hiring process to be faster, fairer, and
              more direct.
            </p>
          </div>

          {/* Added 'perspective' for 3D tilt effect */}
          <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {/* Replaced standard FeatureCard with TiltFeatureCard for interactivity */}
            <TiltFeatureCard
              icon={<ShieldCheck className="w-10 h-10 text-emerald-500" />}
              title="Anonymous Browsing"
              description="View candidates without bias. Profiles show qualifications, experience, and visa status, keeping identities private until you request a connection."
            />
            <TiltFeatureCard
              icon={<Search className="w-10 h-10 text-blue-500" />}
              title="Smart Categorization"
              description="Instantly filter teachers by Department (Primary/Secondary) or Subject (Maths, Science, English). Find exactly who you need in seconds."
            />
            <TiltFeatureCard
              icon={<UserPlus className="w-10 h-10 text-purple-500" />}
              title="One-Click Requests"
              description="Found a potential match? Click 'Request Full Profile' to notify our team. We handle the introduction off-platform if the teacher agrees."
            />
            <TiltFeatureCard
              icon={<Clock className="w-10 h-10 text-amber-500" />}
              title="24-Hour Trial Access"
              description="Got a code? Unlock the full database for 24 hours. Perfect for urgent hires or testing the platform before committing."
            />
            <TiltFeatureCard
              icon={<CreditCard className="w-10 h-10 text-rose-500" />}
              title="Flexible Subscriptions"
              description="Upgrade to a monthly subscription for unlimited, ongoing access to all anonymous profiles and priority support."
            />
            <TiltFeatureCard
              icon={<FileText className="w-10 h-10 text-cyan-500" />}
              title="Detailed Metrics"
              description="See key details at a glance: Notice period, visa status, current location, and salary expectations before you even interview."
            />
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Timeline) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="steps-container relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How School Access Works
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                A simple 3-step process designed to save you time and connect
                you with candidates who are ready to move.
              </p>

              {/* NEW: Interactive Scroll Line */}
              <div className="absolute left-[23px] top-[140px] bottom-5 w-0.5 bg-border z-0">
                <div className="step-line-fill w-full bg-primary origin-top h-0"></div>
              </div>

              <div className="space-y-8 relative z-10">
                <Step
                  number="01"
                  title="Log In or Subscribe"
                  text="Enter your unique 24-hour access code or log in with your school subscription to unlock the dashboard."
                />
                <Step
                  number="02"
                  title="Browse & Shortlist"
                  text="Filter through our categorized lists of pre-screened teachers. View their qualifications, visa status, and availability."
                />
                <Step
                  number="03"
                  title="Request Connection"
                  text="Click 'Request Full Profile'. We verify interest with the teacher and connect you directly to start interviews."
                />
              </div>
            </div>

            {/* Right Visual (Mockup Card) */}
            <div className="relative">
              {/* Decorative gradient blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full"></div>

              {/* Example Teacher Card UI */}
              <div className="mockup-float relative bg-card border rounded-xl shadow-2xl p-6 md:p-8 max-w-md mx-auto">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge variant="outline" className="mb-2 text-xs">
                      SECONDARY - MATHS
                    </Badge>
                    <h3 className="text-xl font-bold">Candidate OM-T0123</h3>
                    <p className="text-sm text-muted-foreground">
                      Current: Riyadh, Saudi Arabia
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>M.Ed in Mathematics Education</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>8 Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Available: August 2026</span>
                  </div>
                </div>

                <Button className="w-full group cursor-pointer hover:scale-105 transition-transform duration-200 flex items-center justify-center hover:bg-green-400">
                  Request Full Profile
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to find your next teacher?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
            Join the schools already using Open Movements to streamline their
            recruitment process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-primary font-bold cursor-pointer hover:scale-110 transition-transform duration-200"
            >
              Get an Access Code
            </Button>
            <Button
              size="lg"
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 border cursor-pointer hover:scale-110 transition-transform duration-200"
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

// NEW: This wrapper handles the 3D Tilt interaction but keeps your design
function TiltFeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (limit to 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(card, {
      duration: 0.4,
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.02,
      ease: "power2.out",
      transformPerspective: 1000,
      boxShadow: "0 20px 30px -10px rgba(0,0,0,0.1)",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      duration: 0.6,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow: "none",
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="gsap-feature-card p-6 rounded-2xl bg-card border shadow-sm transition-shadow duration-200 cursor-pointer transform-style-3d will-change-transform"
    >
      <div className="mb-4 bg-background w-16 h-16 rounded-xl flex items-center justify-center shadow-sm border">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="step-item flex gap-6 bg-background p-2 rounded-xl">
      <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
        {number}
      </div>
      <div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

export default Features;
