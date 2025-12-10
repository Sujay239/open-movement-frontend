import { Suspense } from "react";
import type { AppRoute } from "./utils";
import LandingPage from "@/pages/default/LandingPage";
import Features from "@/pages/default/Features";
import TermsAndConditions from "@/pages/default/TermsAndConditions";
import PrivacyPolicy from "@/pages/default/PrivacyPolicy";
import NotFoundPage from "@/pages/default/NotFoundPage";
import ContactUs from "@/pages/default/ContactUs";

export const defaultRoutes: AppRoute[] = [
  {
    path: "/",
    element: (
      <Suspense>
        <LandingPage />
      </Suspense>
    ),
  },

  {
    path: "/features",
    element: (
      <Suspense>
        <Features />
      </Suspense>
    ),
  },

  {
    path: "/terms-conditions",
    element: (
      <Suspense>
        <TermsAndConditions />
      </Suspense>
    ),
  },

  {
    path: "/privacy-policy",
    element: (
      <Suspense>
        <PrivacyPolicy />
      </Suspense>
    ),
  },

  {
    path: "/contact-us",
    element: (
      <Suspense>
        <ContactUs />
      </Suspense>
    ),
  },

  {
    path: "*",
    element: (
      <Suspense>
        <NotFoundPage />
      </Suspense>
    ),
  },
];
