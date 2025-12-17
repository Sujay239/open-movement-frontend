import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes"; // Using the same protection wrapper

import AdminLayout from "@/layouts/AdminLayout";
import AdminOverview from "@/pages/Admin/Dashboard";
import RequestsManagement from "@/components/AdminDashboard/RequestManagement";
import TeacherManagement from "@/components/AdminDashboard/TeacherManagement";
import SchoolManagement from "@/components/AdminDashboard/SchoolManagement";
import AccessCodes from "@/components/AdminDashboard/AccessCode";
import AdminAnalytics from "@/components/AdminDashboard/AdminAnalytics";
import AddAdminDialog from "@/components/AdminDashboard/AddAdmin";
import ManageAdmins from "@/components/AdminDashboard/ManageAdmins";

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: (
    // Assuming you might want a specific 'role="admin"' prop here later
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index : true,
      element: <AdminOverview />,
    },

    {
      path: "requests",
      element: <RequestsManagement />,
    },

    {
      path: "teachers",
      element: <TeacherManagement />,
    },

    {
      path: "schools",
      element: <SchoolManagement />,
    },

    {
      path: "access-codes",
      element: <AccessCodes />,
    },

    {
      path: "analytics",
      element: <AdminAnalytics />,
    },

    {
      path : 'new',
      element : <AddAdminDialog />
    },
    {
      path : 'manage',
      element : <ManageAdmins />
    }
  ],
};
