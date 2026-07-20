import {
  LayoutDashboard,
  Users,
  Briefcase,
  Star,
  FileText,
  Megaphone,
  PieChart,
  MapPin,
  Network,
  Building2,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";

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
import { clearToken } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Pelanggan", icon: Users },
  { to: "/projects", label: "Proyek", icon: Briefcase },
  { to: "/ratings", label: "Penilaian", icon: Star },
  { to: "/quotations", label: "Penawaran", icon: FileText },
  { to: "/broadcasts", label: "Broadcast", icon: Megaphone },
];

const masterNav = [
  { to: "/master/segmentation", label: "Segmentasi", icon: PieChart },
  { to: "/master/areas", label: "Area", icon: MapPin },
  { to: "/master/relation-status", label: "Status Relasi", icon: Network },
];

const settingsNav = [
  { to: "/settings/profile", label: "Profil Bisnis", icon: Building2 },
  { to: "/settings/account", label: "Akun", icon: User },
];

export function DesktopSidebar() {
  const [masterOpen, setMasterOpen] = useState(true);
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
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
              {mainNav.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2",
                          isActive && "font-medium text-primary",
                        )
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                    {masterNav.map(({ to, label, icon: Icon }) => (
                      <SidebarMenuSubItem key={to}>
                        <SidebarMenuSubButton asChild>
                          <NavLink
                            to={to}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center gap-2",
                                isActive && "font-medium text-primary",
                              )
                            }
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
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
              {settingsNav.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2",
                          isActive && "font-medium text-primary",
                        )
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
