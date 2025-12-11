import type { RouteObject } from "react-router-dom";
import ProtectedRouteClient from "./ProtectedRoutes"; // Ensure this path is correct relative to this file

// Layouts & Pages
import DashboardLayout from "@/pages/Loggedin/SchoolDashboard";
import TeacherBrowser from "@/components/user dashboard/TeacherBrowser";
import RequestsPage from "@/components/user dashboard/RequestsPage";
import SubscriptionPage from "@/components/user dashboard/Subscription";
import SettingsPage from "@/components/user dashboard/SettingPage";
import SupportPage from "@/components/user dashboard/SupportPage";
import AcceptedTeachers from "@/components/user dashboard/AcceptedTeachers";

export const schoolRoutes: RouteObject = {
  path: "/school",
  element: (
    <ProtectedRouteClient>
      <DashboardLayout />
    </ProtectedRouteClient>
  ),
  children: [
    {
      path : "dashboard",
      element: <TeacherBrowser />,
    },
    {
      path: "requests",
      element: <RequestsPage />,
    },
    {
      path: "subscription",
      element: <SubscriptionPage />,
    },
    // Placeholders for future routes
    {
      path: "settings",
      element: <SettingsPage />
    },
    {
      path: "support",
      element: <SupportPage />,
    },
    {
      path: "accepted",
      element: <AcceptedTeachers />,
    },
  ],
};
