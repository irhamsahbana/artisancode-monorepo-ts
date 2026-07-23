import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useCallback, useRef } from "react";
import { Outlet } from "react-router";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { cn } from "@/lib/utils";

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
  const containerRef = useRef<HTMLElement>(null);
  const queryClient = useQueryClient();
  const onRefresh = useCallback(
    () => queryClient.refetchQueries(),
    [queryClient],
  );
  const { pullDistance, refreshing, threshold } = usePullToRefresh(
    containerRef,
    onRefresh,
  );

  return (
    <div className="flex h-dvh flex-col">
      <MobileHeader />
      <main
        ref={containerRef}
        className="relative flex-1 overflow-auto p-4 pb-36"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden"
          style={{ height: pullDistance, opacity: pullDistance > 0 ? 1 : 0 }}
        >
          <RefreshCw
            className={cn(
              "mt-3 h-5 w-5 text-muted-foreground transition-opacity",
              refreshing && "animate-spin",
            )}
            style={{ opacity: Math.min(pullDistance / threshold, 1) }}
          />
        </div>
        <div style={{ transform: `translateY(${pullDistance}px)` }}>
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export function AppLayout() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
