import { HeroCards } from "../hero-cards";
import { Button } from "../ui/button";
import { Key, LogIn } from "lucide-react";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-linear-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              School Access
            </span>{" "}
            recruiting platform 
          </h1>{" "}
          for{" "}
          <h2 className="inline">
            <span className="inline bg-linear-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              School
            </span>{" "}
            administrators
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          A smart hiring solution by <strong>Open Movements</strong> — helping schools discover qualified teachers by category and connect with them instantly.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="md:w-1/3" size='lg'>
            Log In
            <LogIn className="ml-2 w-5 h-5" />
          </Button>
          
          <Button className="md:w-1/3" variant="outline" size='lg'>
            Enter Access Code
            <Key className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
