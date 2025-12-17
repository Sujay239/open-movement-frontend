import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes"; // Ensure this path is correct relative to this file

// Layouts & Pages
import DashboardLayout from "@/pages/Loggedin/SchoolDashboard";
import TeacherBrowser from "@/components/user dashboard/TeacherBrowser";
import RequestsPage from "@/components/user dashboard/RequestsPage";
import SubscriptionPage from "@/components/user dashboard/Subscription";
import SettingsPage from "@/components/user dashboard/SettingPage";
import SupportPage from "@/components/user dashboard/SupportPage";
import AcceptedTeachers from "@/components/user dashboard/AcceptedTeachers";
import AccessCodePage from "@/components/user dashboard/AccessCodePage";
import SubscriptionGuard from "@/components/SubscriptionGuard";

export const schoolRoutes: RouteObject = {
  path: "/school",
  element: (
    <ProtectedRoute allowedRoles={["school"]}>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: "dashboard",
      element: (
        <SubscriptionGuard>
          <TeacherBrowser />
        </SubscriptionGuard>
      ),
    },
    {
      path: "requests",
      element: (
        <SubscriptionGuard>
          <RequestsPage />
        </SubscriptionGuard>
      ),
    },
    {
      path: "subscription",
      element: <SubscriptionPage />,
    },
    // Placeholders for future routes
    {
      path: "settings",
      element: <SettingsPage />,
    },
    {
      path: "support",
      element: <SupportPage />,
    },
    {
      path: "accepted",
      element: (
        <SubscriptionGuard>
          <AcceptedTeachers />
        </SubscriptionGuard>
      ),
    },
    {
      path: "access-code",
      element: <AccessCodePage />,
    },
  ],
};
