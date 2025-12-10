import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Mail, CheckCircle } from "lucide-react";

// GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <Search className="w-6 h-6" aria-hidden="true" />,
    title: "Find Teachers",
    description:
      "Search our verified teacher database by subject, location and experience to discover candidates that match your vacancy.",
  },
  {
    icon: <Users className="w-6 h-6" aria-hidden="true" />,
    title: "Filter & Shortlist",
    description:
      "Use advanced filters and saved searches to quickly shortlist the best-fit teachers for interviews.",
  },
  {
    icon: <Mail className="w-6 h-6" aria-hidden="true" />,
    title: "Contact Instantly",
    description:
      "Message candidates directly from their profile — schedule interviews or request additional documents in one click.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" aria-hidden="true" />,
    title: "Verify & Hire",
    description:
      "Confirm qualifications, track the hiring progress, and complete onboarding — all from the same platform.",
  },
];

export const HowItWorks = () => {
  const container = useRef<HTMLOptionElement>(null);

  useGSAP(
    () => {
      // 1. Header Animation
      gsap.fromTo(
        ".hiw-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".hiw-header",
            start: "top 85%",
          },
        }
      );

      // 2. Description Animation
      gsap.fromTo(
        ".hiw-desc",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".hiw-desc",
            start: "top 85%",
          },
        }
      );

      // 3. Cards Staggered Entrance
      gsap.fromTo(
        ".hiw-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2, // This makes them appear one by one
          ease: "back.out(1.7)", // Slight bounce effect
          scrollTrigger: {
            trigger: ".hiw-grid",
            start: "top 80%",
          },
        }
      );
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="hiw-header text-3xl md:text-4xl font-bold opacity-0">
        How It{" "}
        <span className="bg-linear-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works
        </span>
        — Step-by-Step
      </h2>

      <p className="hiw-desc md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground opacity-0">
        School Access streamlines teacher recruitment — from discovery to hire.
        Follow four simple steps to find, evaluate and onboard the right
        candidates faster.
      </p>

      <div className="hiw-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }) => (
          <Card
            key={title}
            className="hiw-card bg-muted/50 hover:bg-muted/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg opacity-0"
          >
            <CardHeader className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
                {icon}
              </div>

              <CardTitle className="text-center text-xl">{title}</CardTitle>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">
              {description}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
