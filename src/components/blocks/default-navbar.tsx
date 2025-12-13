import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createHashedLink, normalizePath, type AppRoute } from "@/routes/utils";
import { Link, useLocation } from "react-router";
import { ModeToggle } from "../mode-toggle";
import { LogIn } from "lucide-react";

// --- 1. IMPORT BOTH LOGOS HERE ---
// Make sure you have the actual file for the dark logo!
import LogoLight from "@/assets/open movement logo.png";
import LogoDark from "@/assets/dark-logo.png"; // CHANGE THIS to your dark logo path
import { useNavigate } from "react-router";

type DefaultNavbarProps = {
  routes: AppRoute[];
};



const BASE_URL = import.meta.env?.VITE_BASE_URL;
const labelFromPath = (path: string) => {
  const p = normalizePath(path);
  if (!p) return "Home";
  return p
    .split("/")
    .map((segment) =>
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .join(" / ");
};

export default function DefaultNavbar({ routes }: DefaultNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const links = routes
    .filter((route) => route.path !== "*")
    .map((route) => {
      const href = createHashedLink(route.path);
      const key = normalizePath(route.path);
      return {
        key,
        href,
        label: labelFromPath(route.path),
        rawPath: route.path,
      };
    });

  async function handleLoginRequest(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/auth/isLoggedin`, {
        method: "POST",
        credentials: "include", // 🔑 REQUIRED to send cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: {
        loggedIn: boolean;
        role: string | null;
      } = await response.json();

      if (!data.loggedIn || !data.role) {
        navigate("/login");
        return;
      }

      // 🔁 Role-based navigation
      if (data.role === "school") {
        navigate("/school/dashboard");
      } else if (data.role === "admin") {
        navigate("/admin");
      } else {
        // fallback
        navigate("/");
      }
    } catch (error) {
      console.error("Login check failed:", error);
    }
  }

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-22 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 lg:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {links.map((link) => {
                    const active =
                      location.pathname ===
                      (normalizePath(link.rawPath)
                        ? `/${normalizePath(link.rawPath)}`
                        : "/");

                    return (
                      <NavigationMenuItem key={link.key}>
                        <NavigationMenuLink
                          active={active}
                          className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                          href={link.href}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>

          {/* Main nav */}
          <div className="flex items-center gap-6">
            <Link
              className="text-primary justify-center items-center hover:text-primary/90 flex flex-col gap-0.5 max-lg:flex-row lg:gap-2"
              to="/"
            >
              {/* --- 2. CSS-BASED IMAGE SWITCHING --- */}

              {/* Light Mode Image: Visible by default, hidden when 'dark' class exists on parent */}
              <img
                src={LogoLight}
                className="w-12 h-12 dark:hidden"
                alt="Open Movement Logo"
              />

              {/* Dark Mode Image: Hidden by default, visible (block) when 'dark' class exists */}
              <img
                src={LogoDark}
                className="w-12 h-12 hidden dark:block"
                alt="Open Movement Logo"
              />

              <span className="text-[16px] font-bold">Open Movement</span>
            </Link>

            {/* Navigation menu */}
            <NavigationMenu className="max-lg:hidden">
              <NavigationMenuList className="gap-2">
                {links.map((link) => {
                  const active =
                    location.pathname ===
                    (normalizePath(link.rawPath)
                      ? `/${normalizePath(link.rawPath)}`
                      : "/");

                  return (
                    <NavigationMenuItem key={link.key}>
                      <NavigationMenuLink
                        active={active}
                        className="py-1.5 lg:font-medium text-[10px] xl:text-base text-muted-foreground hover:text-primary"
                        href={link.href}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Right side */}
        <div className="flex justify-center items-center gap-4">
          <ModeToggle />
          <Button
            asChild
            className="text-sm hover:scale-105 transition-transform duration-200 max-lg:hidden cursor-pointer"
            size="sm"
          >
            <Button onClick={handleLoginRequest} className="cursor-pointer">
              Log In
              <LogIn className=" w-5 h-5 cursor-pointer" />
            </Button>
          </Button>
          <Button
            asChild
            className="text-sm hover:scale-105 transition-transform duration-200 max-lg:hidden"
            size="sm"
            variant="outline"
          >
            <a href="#">Enter Access Code</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
