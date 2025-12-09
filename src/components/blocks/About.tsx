import pilot from "@/assets/pilot.png";
import { Statistics } from "../statistics";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot}
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-linear-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Open Movements
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Open Movements powers <strong>School Access</strong>, a teacher-recruitment
                platform that helps school administrators discover, filter and contact
                qualified teachers by subject, experience and location.
                </p>

                <p className="text-xl text-muted-foreground mt-4">
                Our mission: simplify hiring for schools — reduce time-to-hire, improve
                candidate fit, and make recruitment transparent and reliable.
                </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
