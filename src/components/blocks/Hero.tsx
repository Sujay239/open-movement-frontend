import { useRef } from "react";
import { HeroCards } from "../hero-cards";
import { Button } from "../ui/button";
import { Key, LogIn } from "lucide-react";

// GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router";

export const Hero = () => {
  const container = useRef<HTMLOptionElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Title Animation (Slide Up + Fade)
      tl.fromTo(
        ".hero-title",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      )
        // 2. Description Animation (Staggered slightly after title)
        .fromTo(
          ".hero-desc",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.6"
        )
        // 3. Buttons Animation
        .fromTo(
          ".hero-btns",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.6"
        )
        // 4. Hero Cards (Slide in from right)
        .fromTo(
          ".hero-visual",
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power2.out" },
          "-=0.8"
        );
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="container grid xl:grid-cols-2 place-items-center py-10 md:py-32 gap-10"
    >
      {/* LEFT SIDE: Text Content */}
      <div className="text-center xl:text-start space-y-6 w-full">
        {/* Added 'hero-title' class for animation */}
        <main className="hero-title text-4xl sm:text-5xl md:text-6xl font-bold leading-tight opacity-0">
          <h1 className="inline">
            <span className="inline bg-linear-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
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

        <p className="hero-desc text-lg md:text-xl text-muted-foreground md:w-10/12 mx-auto xl:mx-0 opacity-0">
          A smart hiring solution by <strong>Open Movements</strong> — helping
          schools discover qualified teachers by category and connect with them
          instantly.
        </p>

        <div className="hero-btns flex flex-col md:flex-row gap-4 justify-center xl:justify-start opacity-0">
          <Link to="/login">
            <Button
              className="w-full md:w-auto cursor-pointer hover:scale-105 transition-transform duration-200"
              size="lg"
            >
              Log In
              <LogIn className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <Link to="/use-access-code">
            <Button
              className="w-full md:w-auto cursor-pointer hover:scale-105 transition-transform duration-200"
              variant="outline"
              size="lg"
            >
              Enter Access Code
              <Key className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE: Hero Cards */}
      {/* Added 'hero-visual' class for animation */}
      <div className="hero-visual z-10 w-full flex justify-center xl:justify-end opacity-0">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
