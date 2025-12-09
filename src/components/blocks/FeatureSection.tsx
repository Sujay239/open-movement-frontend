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
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Powerful{" "}
        <span className="bg-linear-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Features&nbsp;
        </span>
        for School Recruitment
      </h2>

      <p className="md:w-3/4 mx-auto text-center text-xl text-muted-foreground">
        School Access gives administrators the tools to discover, evaluate and
        hire qualified teachers faster — from discovery to onboarding.
      </p>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }) => (
          <Card key={title} className="overflow-hidden">
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
                className="w-[200px] lg:w-[300px] mx-auto"
                loading="lazy"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
