import { Navigate, Outlet } from "react-router";

import { useMe } from "@/hooks/use-auth";
import { getToken } from "@/services/auth";

export function ProtectedRoute() {
  const token = getToken();
  const { isError } = useMe();

  if (!token || isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
