import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Mail, Linkedin, Lightbulb, Globe } from "lucide-react";
import { Link } from "react-router";

export const HeroCards = () => {
  return (
    // CHANGE: 'lg:block' -> 'xl:block'.
    // This container stays flex-col (stacked) until 1280px width.
    <div className="flex flex-col xl:block gap-8 relative w-full xl:w-[700px] h-auto xl:h-[500px] mx-2.5">
      {/* Testimonial Card */}
      {/* CHANGE: 'lg:absolute' -> 'xl:absolute' */}
      <Card className="xl:absolute w-full xl:w-[340px] xl:-top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 mb-4 xl:mb-0">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt="Photo of Maria Lopez, Head of Hiring"
              src="https://randomuser.me/api/portraits/women/68.jpg"
            />
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">Maria Lopez</CardTitle>
            <CardDescription>
              Head of Hiring, Lincoln High School
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="text-sm">
          “School Access helped our team find and contact qualified teachers by
          subject and experience in days. The candidate categories and
          instant-contact flow saved us hours during recruitment.”
        </CardContent>
      </Card>

      {/* Team Card */}
      <Card className="xl:absolute xl:right-5 xl:top-4 w-full xl:w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10 mb-4 xl:mb-0 mag-lg:mt-4">
        <CardHeader className="mt-8 flex flex-col justify-center items-center pb-2">
          <img
            src="https://i.pravatar.cc/150?img=47"
            alt="Profile photo of Ananya Kapoor"
            className="absolute grayscale-0 -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center text-nowrap">
            Ananya Kapoor
          </CardTitle>
          <CardDescription className="font-normal text-primary text-nowrap">
            Head of School Partnerships
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center text-sm pb-2">
          I connect schools with qualified teachers by subject, experience and
          location — simplifying the hiring workflow so administrators can fill
          positions faster.
        </CardContent>

        <CardFooter>
          <div>
            <a
              rel="noreferrer noopener"
              href="mailto:ananya@openmovements.example"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Mail icon</span>
              <Mail className="w-5 h-5" />
            </a>

            <a
              rel="noreferrer noopener"
              href="https://www.linkedin.com/in/ananya-kapoor"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Linkedin icon</span>
              <Linkedin size="20" />
            </a>

            <a
              rel="noreferrer noopener"
              href="https://www.openmovements.com.au/"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Site icon</span>
              <Globe size="20" />
            </a>
          </div>
        </CardFooter>
      </Card>

      {/* Pricing Card */}
      <Card className="xl:absolute xl:top-56 xl:left-[50px] w-full xl:w-72 drop-shadow-xl shadow-black/10 dark:shadow-white/10 mb-4 xl:mb-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <p>Recruiter Plan</p>
            <Badge variant="secondary" className="text-sm text-primary">
              Most popular
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$49</span>
            <span className="text-muted-foreground"> /month</span>
          </div>

          <CardDescription className="text-primary">
            Find, contact and shortlist qualified teachers by subject,
            experience and location — powered by Open Movements.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full cursor-pointer hover:scale-110 transition-transform duration-300">
            <Link to="/login">Start a 24 hour Free Trial</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Service Card */}
      <Card className="xl:absolute w-full xl:w-[350px] xl:right-0 xl:bottom-6 drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <Lightbulb />
          </div>
          <div>
            <CardTitle>Smart matching & filters</CardTitle>
            <CardDescription className="text-md mt-2">
              Find qualified teachers fast — filter by subject, experience,
              qualifications and location.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
