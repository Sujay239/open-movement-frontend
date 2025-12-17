import { createBrowserRouter } from "react-router";
import type { RouteObject } from "react-router";

import { defaultRoutes } from "./default";
import {
  normalizePath,
  // generateRouterConfig
} from "./utils";
import PublicLayout from "@/layouts/PublicLayout";
import LoginForm from "@/pages/default/Login";
import RegisterForm from "@/pages/default/Register";
import PricingSection from "@/pages/default/PricingSection";
import { schoolRoutes } from "./SchoolRoutes";
import { adminRoutes } from "./AdminRoutes";
import Unauthorized from "@/pages/default/Unauthorized";
import DefaultAccessCode from "@/pages/default/DefaultAcessCode";
import Password from "@/pages/default/ForgotPassword";

/**
 * Convert defaultRoutes (AppRoute[]) into RouteObject[] children for PublicLayout.
 * - If normalizePath(path) === '' we make it an index/root child (path: '') so it matches '/'
 * - Keep wildcard '*' if present, added as the last child
 */
const publicChildren: RouteObject[] = defaultRoutes
  .filter((r) => normalizePath(r.path) !== "*") // keep wildcard for later
  .map((r) => {
    const p = normalizePath(r.path);
    return {
      path: p === "" ? "" : p,
      element: r.element,
    } as RouteObject;
  });

// Add wildcard 404 child if it exists
const notFound = defaultRoutes.find((r) => normalizePath(r.path) === "*");
if (notFound) {
  publicChildren.push({
    path: "*",
    element: notFound.element,
  });
}

// Parent route using PublicLayout which will render DefaultNavbar and Outlet
const publicRoute: RouteObject = {
  path: "/",
  element: <PublicLayout routes={defaultRoutes} />,
  children: publicChildren,
};

const loginRoute: RouteObject = {
  path: "/login",
  element: <LoginForm />,
};

const registerRoute: RouteObject = {
  path: "/register",
  element: <RegisterForm />,
};

const pricingRoute: RouteObject = {
  path: "/pricing",
  element: <PricingSection />,
};

const unauthorized: RouteObject = {
  path: "/unauthorized",
  element: <Unauthorized />,
};

const useAccessCode: RouteObject = {
  path: "/use-access-code",
  element: <DefaultAccessCode />,
};

const ForgotPassword: RouteObject = {
  path: "/forgot-password",
  element: <Password />,
};

// If you have other top-level AppRoute areas (admin, teacher, etc.), convert them with generateRouterConfig
// const otherRoutes = generateRouterConfig(otherAppRoutes); // returns RouteObject[]
// const routerConfig = [publicRoute, ...otherRoutes];

const routerConfig: RouteObject[] = [
  publicRoute,
  loginRoute,
  registerRoute,
  pricingRoute,
  schoolRoutes,
  adminRoutes,
  unauthorized,
  useAccessCode,
  ForgotPassword,
];

export const appRouter = createBrowserRouter(routerConfig);
export default appRouter;
