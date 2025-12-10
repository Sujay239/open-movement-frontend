import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image from "@/assets/growth.png";
import image3 from "@/assets/reflecting.png";
import image4 from "@/assets/looking-ahead.png";

// GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const features: FeatureProps[] = [
  {
    title: "AI-Powered Matching",
    description:
      "Automatically surface the best-fit teachers using subject, experience, qualifications and location signals.",
    image: image4,
  },
  {
    title: "Candidate Profiles",
    description:
      "Rich teacher profiles with qualifications, sample lesson plans, references and availability.",
    image: image3,
  },
  {
    title: "Interview & Hire Workflow",
    description:
      "Shortlist, message, schedule interviews, and track hires — all from a single dashboard.",
    image: image,
  },
];

const featureList: string[] = [
  "Verified Teachers",
  "Advanced Filters",
  "Saved Searches",
  "Direct Messaging",
  "Shortlist & Notes",
  "Interview Scheduler",
  "Reports & Analytics",
  "Team Access",
  "Priority Support",
];

export const FeatureSection = () => {
  const container = useRef<HTMLOptionElement>(null);

  useGSAP(
    () => {
      // 1. Header Text Animation
      gsap.fromTo(
        ".feature-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".feature-header",
            start: "top 85%",
          },
        }
      );

      // 2. Badges "Pop" Animation
      gsap.fromTo(
        ".feature-badge",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05, // Fast ripple effect
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".badge-container",
            start: "top 80%",
          },
        }
      );

      // 3. Feature Cards Slide Up
      gsap.fromTo(
        ".feature-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".card-grid",
            start: "top 75%",
          },
        }
      );
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <div className="space-y-4">
        <h2 className="feature-header text-3xl lg:text-4xl font-bold md:text-center opacity-0">
          Powerful{" "}
          <span className="bg-linear-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Features&nbsp;
          </span>
          for School Recruitment
        </h2>

        <p className="feature-header md:w-3/4 mx-auto text-center text-xl text-muted-foreground opacity-0">
          School Access gives administrators the tools to discover, evaluate and
          hire qualified teachers faster — from discovery to onboarding.
        </p>
      </div>

      <div className="badge-container flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature} className="feature-badge opacity-0">
            <Badge variant="secondary" className="text-sm">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="card-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }) => (
          <Card
            key={title}
            className="feature-card overflow-hidden opacity-0 hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-center">
              <img
                src={image}
                alt={`${title} illustration`}
                className="w-[200px] lg:w-[300px] mx-auto transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
