import {
  LayoutDashboard,
  Users,
  Briefcase,
  Star,
  FileText,
  Megaphone,
  Gift,
  PieChart,
  MapPin,
  Map,
  Network,
  Package,
  Ruler,
  ArrowLeftRight,
  Building2,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { logout, useMe } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

import type { Permission } from "@artisancode/api-types";

// `permission: undefined` = always accessible (no module in the permission
// catalog covers it, e.g. self-service or uncatalogued pages).
const mainNav: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission?: Permission;
}[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    to: "/customers",
    label: "Pelanggan",
    icon: Users,
    permission: "customers.view",
  },
  {
    to: "/projects",
    label: "Proyek",
    icon: Briefcase,
    permission: "projects.view",
  },
  {
    to: "/projects/map",
    label: "Peta Proyek",
    icon: Map,
    permission: "projects.view",
  },
  {
    to: "/ratings",
    label: "Penilaian",
    icon: Star,
    permission: "customer_ratings.view",
  },
  {
    to: "/quotations",
    label: "Penawaran",
    icon: FileText,
    permission: "quotations.view",
  },
  {
    to: "/broadcasts",
    label: "Broadcast",
    icon: Megaphone,
    permission: "broadcast_templates.view",
  },
  {
    to: "/birthdays",
    label: "Ulang Tahun",
    icon: Gift,
    permission: "contacts.view",
  },
];

const masterNav: {
  to: string;
  label: string;
  icon: typeof PieChart;
  permission?: Permission;
}[] = [
  {
    to: "/master/segmentation",
    label: "Segmentasi",
    icon: PieChart,
    permission: "categories.view",
  },
  {
    to: "/master/areas",
    label: "Area",
    icon: MapPin,
    permission: "categories.view",
  },
  {
    to: "/master/relation-status",
    label: "Status Relasi",
    icon: Network,
    permission: "categories.view",
  },
  {
    to: "/master/products",
    label: "Produk",
    icon: Package,
    permission: "products.view",
  },
  { to: "/master/uoms", label: "Satuan", icon: Ruler, permission: "uoms.view" },
  {
    to: "/master/unit-conversions",
    label: "Konversi Satuan",
    icon: ArrowLeftRight,
    permission: "unit_conversions.view" as Permission,
  },
];

const settingsNav: {
  to: string;
  label: string;
  icon: typeof Building2;
  permission?: Permission;
}[] = [
  {
    to: "/settings/profile",
    label: "Profil Bisnis",
    icon: Building2,
    permission: "business_profiles.view",
  },
  { to: "/settings/account", label: "Akun", icon: User },
  {
    to: "/settings/roles",
    label: "Roles & Hak Akses",
    icon: ShieldCheck,
    permission: "roles.view",
  },
  {
    to: "/settings/users",
    label: "Pengguna",
    icon: UserCog,
    permission: "users.view",
  },
];

export function DesktopSidebar() {
  const [masterOpen, setMasterOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: me } = useMe();

  function isAllowed(permission?: Permission) {
    return !permission || (me?.permissions.includes(permission) ?? false);
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <span className="text-lg font-semibold tracking-tight">CRM Wika</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map(({ to, label, icon: Icon, permission }) => {
                const isActive =
                  to === "/projects"
                    ? location.pathname === "/projects" ||
                      (location.pathname.startsWith("/projects/") &&
                        location.pathname !== "/projects/map")
                    : location.pathname.startsWith(to);
                const allowed = isAllowed(permission);
                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={to}
                        aria-disabled={!allowed}
                        tabIndex={allowed ? undefined : -1}
                        onClick={(e) => !allowed && e.preventDefault()}
                        className={cn(
                          "flex items-center gap-2",
                          isActive && "font-medium text-primary",
                          !allowed && "pointer-events-none opacity-50",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setMasterOpen((o) => !o)}
          >
            Master Data
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                masterOpen && "rotate-180",
              )}
            />
          </SidebarGroupLabel>
          {masterOpen && (
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSub>
                    {masterNav.map(({ to, label, icon: Icon, permission }) => {
                      const isActive = location.pathname.startsWith(to);
                      const allowed = isAllowed(permission);
                      return (
                        <SidebarMenuSubItem key={to}>
                          <SidebarMenuSubButton asChild isActive={isActive}>
                            <NavLink
                              to={to}
                              aria-disabled={!allowed}
                              tabIndex={allowed ? undefined : -1}
                              onClick={(e) => !allowed && e.preventDefault()}
                              className={cn(
                                "flex items-center gap-2",
                                isActive && "font-medium text-primary",
                                !allowed && "pointer-events-none opacity-50",
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {label}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNav.map(({ to, label, icon: Icon, permission }) => {
                const isActive = location.pathname.startsWith(to);
                const allowed = isAllowed(permission);
                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={to}
                        aria-disabled={!allowed}
                        tabIndex={allowed ? undefined : -1}
                        onClick={(e) => !allowed && e.preventDefault()}
                        className={cn(
                          "flex items-center gap-2",
                          isActive && "font-medium text-primary",
                          !allowed && "pointer-events-none opacity-50",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-2 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full cursor-pointer text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
