import React from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Slack,
  Twitter,
  Youtube,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

interface SponsorProps {
  // lucide icons are React components that accept SVG props
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  name: string;
}

const sponsors: SponsorProps[] = [
  { icon: Facebook, name: "Facebook" },
  { icon: Linkedin, name: "LinkedIn" },
  { icon: Slack, name: "Slack" },
  { icon: Youtube, name: "YouTube" },
  { icon: Instagram, name: "Instagram" },
  { icon: Twitter, name: "Twitter" },
];

export const Sponsors: React.FC = () => {
  return (
    <section id="sponsors" className="container pt-24 sm:py-32">
      <h2 className="text-center text-md lg:text-xl font-bold mb-10 text-primary">
        Investors and founders
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-12 xl:gap-16">
        {sponsors.map(({ icon: Icon, name }) => (
          <div
            key={name}
            className="flex items-center gap-3 text-muted-foreground/60"
            aria-label={`${name} logo`}
          >
            {/* Render the icon component */}
            <Icon className="w-6 h-6" aria-hidden="true" />
            <h3 className="text-xl font-bold">{name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};
