import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";

import { GuestRoute } from "@/components/guest-route";
import { AppLayout } from "@/components/layout/app-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { Toaster } from "@/components/ui/sonner";
import { persister } from "@/lib/query-persister";
import { AccountSettings } from "@/pages/account-settings";
import { BroadcastDetail } from "@/pages/broadcasts/broadcast-detail";
import { BroadcastForm } from "@/pages/broadcasts/broadcast-form";
import { BroadcastList } from "@/pages/broadcasts/broadcast-list";
import { BusinessProfile } from "@/pages/business-profile";
import { CustomerDetail } from "@/pages/customers/customer-detail";
import { CustomerForm } from "@/pages/customers/customer-form";
import { CustomerList } from "@/pages/customers/customer-list";
import { Dashboard } from "@/pages/dashboard";
import { Login } from "@/pages/login";
import { Areas } from "@/pages/master/areas";
import { Products } from "@/pages/master/products";
import { RelationStatus } from "@/pages/master/relation-status";
import { Segmentation } from "@/pages/master/segmentation";
import { UnitConversions } from "@/pages/master/unit-conversions";
import { Uoms } from "@/pages/master/uoms";
import { ProjectDetail } from "@/pages/projects/project-detail";
import { ProjectForm } from "@/pages/projects/project-form";
import { ProjectList } from "@/pages/projects/project-list";
import { QuotationForm } from "@/pages/public/quotation-form";
import { QuotationList } from "@/pages/quotations/quotation-list";
import { RatingList } from "@/pages/ratings/rating-list";
import { registerPwa } from "@/register-sw";
import "./index.css";

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

const router = createBrowserRouter([
  {
    path: "/login",
    element: <GuestRoute />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/rfq",
    element: <QuotationForm />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "customers", element: <CustomerList /> },
          { path: "customers/new", element: <CustomerForm /> },
          { path: "customers/:id", element: <CustomerDetail /> },
          { path: "customers/:id/edit", element: <CustomerForm /> },
          { path: "projects", element: <ProjectList /> },
          { path: "projects/new", element: <ProjectForm /> },
          { path: "projects/:id", element: <ProjectDetail /> },
          { path: "projects/:id/edit", element: <ProjectForm /> },
          { path: "ratings", element: <RatingList /> },
          { path: "quotations", element: <QuotationList /> },
          { path: "broadcasts", element: <BroadcastList /> },
          { path: "broadcasts/new", element: <BroadcastForm /> },
          { path: "broadcasts/:id", element: <BroadcastDetail /> },
          { path: "master/segmentation", element: <Segmentation /> },
          { path: "master/areas", element: <Areas /> },
          { path: "master/relation-status", element: <RelationStatus /> },
          { path: "master/products", element: <Products /> },
          { path: "master/uoms", element: <Uoms /> },
          { path: "master/unit-conversions", element: <UnitConversions /> },
          { path: "settings/profile", element: <BusinessProfile /> },
          { path: "settings/account", element: <AccountSettings /> },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: { queries: { gcTime: ONE_DAY_MS } },
});

registerPwa();

const elem = document.getElementById("root");
if (!elem) throw new Error("Missing #root element");

const app = (
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: ONE_DAY_MS }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  </StrictMode>
);

if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  createRoot(elem).render(app);
}
