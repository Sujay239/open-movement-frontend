import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, UserCheck, Calendar } from "lucide-react";
import cubeLeg from "@/assets/cube-leg.png";

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
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Client-Centric{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis
            dolor.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceItem) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
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
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="About services"
        />
      </div>
    </section>
  );
};
