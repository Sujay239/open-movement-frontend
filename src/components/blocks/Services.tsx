import { useRef } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, UserCheck, Calendar } from "lucide-react";
import cubeLeg from "@/assets/cube-leg.png";

// GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const serviceList: ServiceItem[] = [
  {
    title: "Teacher Search",
    description:
      "Search verified teacher profiles by subject, location, certifications and experience to find candidates that match your vacancy.",
    icon: <Search className="w-5 h-5" aria-hidden="true" />,
  },
  {
    title: "Shortlist & Notes",
    description:
      "Save candidates, add private notes and collaborate with your hiring team to track progress and share feedback.",
    icon: <UserCheck className="w-5 h-5" aria-hidden="true" />,
  },
  {
    title: "Interview Scheduler",
    description:
      "Schedule interviews directly from candidate profiles and sync availability with calendar invites — streamline the whole process.",
    icon: <Calendar className="w-5 h-5" aria-hidden="true" />,
  },
];

export const Services = () => {
  const container = useRef<HTMLOptionElement>(null);

  useGSAP(
    () => {
      // 1. Header & Text Animation
      gsap.fromTo(
        ".service-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".service-header",
            start: "top 85%",
          },
        }
      );

      // 2. Service Cards Staggered Entrance
      gsap.fromTo(
        ".service-card",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".card-container",
            start: "top 80%",
          },
        }
      );

      // 3. Image Entrance
      gsap.fromTo(
        ".service-image",
        { x: 50, opacity: 0, scale: 0.9 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".service-image",
            start: "top 75%",
          },
          onComplete: () => {
            // 4. Continuous Floating Animation after entrance
            gsap.to(".service-image", {
              y: -15,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        }
      );
    },
    { scope: container }
  );

  return (
    <section ref={container} className="container py-24 sm:py-32 mx-auto">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="service-header text-3xl md:text-4xl font-bold opacity-0">
            <span className="bg-linear-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Client-Centric{" "}
            </span>
            Services
          </h2>

          <p className="service-header text-muted-foreground text-xl mt-4 mb-8 opacity-0">
            School Access streamlines the entire recruitment lifecycle with
            tools designed for modern administrators.
          </p>

          <div className="card-container flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceItem) => (
              <Card
                key={title}
                className="service-card opacity-0 hover:shadow-lg transition-shadow duration-300 hover:border-primary/50"
              >
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl text-primary">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src={cubeLeg}
          className="service-image w-[300px] md:w-[500px] lg:w-[600px] object-contain opacity-0"
          alt="About services"
        />
      </div>
    </section>
  );
};
