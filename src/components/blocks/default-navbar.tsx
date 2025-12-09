import Logo from "@/assets/react.svg";
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

type DefaultNavbarProps = {
  routes: AppRoute[];
}

const labelFromPath = (path: string) => {
  const p = normalizePath(path)
  if (!p) return "Home"
  return p
    .split('/')
    .map((segment) => 
      segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    )
    .join(' / ')
}

export default function DefaultNavbar({ routes }: DefaultNavbarProps) {

  const location = useLocation()

  const links = routes
    .filter((route) => route.path!=='*')
    .map((route) => {
      const href = createHashedLink(route.path)
      const key = normalizePath(route.path)
      return {
        key,
        href,
        label: labelFromPath(route.path),
        rawPath: route.path
      }
    })

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
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
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">

                  {
                    links.map((link) => {
                      const active  = location.pathname === (normalizePath(link.rawPath) ? `/${normalizePath(link.rawPath)}` : '/')

                      return(
                        <NavigationMenuItem key={link.key}>
                          <NavigationMenuLink
                            active={active}
                            className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                            href={link.href}
                          >
                            {link.label}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      )
                    })
                  }

                  
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <Link className="text-primary hover:text-primary/90 flex flex-row gap-4" to="/">
              {/* <Logo /> */}
              <img src={Logo}/>
              <span className="text-2xl">School Access</span>
            </Link>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">

                {
                  links.map((link) => {
                    const active  = location.pathname === (normalizePath(link.rawPath) ? `/${normalizePath(link.rawPath)}` : '/')

                    return(
                      <NavigationMenuItem key={link.key}>
                        <NavigationMenuLink
                          active={active}
                          className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                          href={link.href}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })
                }

              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button asChild className="text-sm" size="sm" >
            <a href="#">Log In</a>
          </Button>
          <Button asChild className="text-sm" size="sm" variant="outline">
            <a href="#">Enter Access Code</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
