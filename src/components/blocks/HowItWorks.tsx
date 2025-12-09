import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Mail, CheckCircle } from "lucide-react";

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
  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        How It{" "}
        <span className="bg-linear-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works
        </span>
        — Step-by-Step
      </h2>

      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        School Access streamlines teacher recruitment — from discovery to hire. Follow
        four simple steps to find, evaluate and onboard the right candidates faster.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                {icon}
              </div>

              <CardTitle className="text-center text-xl">{title}</CardTitle>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
          </Card>
        ))}
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
