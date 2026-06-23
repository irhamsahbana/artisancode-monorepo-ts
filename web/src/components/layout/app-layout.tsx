import { Outlet } from "react-router";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

import { DesktopHeader } from "./desktop/header";
import { DesktopSidebar } from "./desktop/sidebar";
import { BottomNav } from "./mobile/bottom-nav";
import { MobileHeader } from "./mobile/mobile-header";

function DesktopLayout() {
  return (
    <SidebarProvider>
      <DesktopSidebar />
      <SidebarInset>
        <DesktopHeader />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function MobileLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <MobileHeader />
      <main className="flex-1 overflow-auto p-4 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

export function AppLayout() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
