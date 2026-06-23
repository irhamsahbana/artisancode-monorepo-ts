import { Navigate, Outlet } from "react-router";

import { getToken } from "@/services/auth";

export function GuestRoute() {
  if (getToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
