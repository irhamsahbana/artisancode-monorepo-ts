import {
  LayoutDashboard,
  Users,
  Tag,
  PieChart,
  MapPin,
  Network,
  Building2,
  User,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router'

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
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/customers', label: 'Pelanggan', icon: Users },
]

const masterNav = [
  { to: '/master/customer-types', label: 'Jenis Pelanggan', icon: Tag },
  { to: '/master/segmentation', label: 'Segmentasi', icon: PieChart },
  { to: '/master/areas', label: 'Area', icon: MapPin },
  { to: '/master/relation-status', label: 'Status Relasi', icon: Network },
]

const settingsNav = [
  { to: '/settings/profile', label: 'Profil Bisnis', icon: Building2 },
  { to: '/settings/account', label: 'Akun', icon: User },
]

export function DesktopSidebar() {
  const [masterOpen, setMasterOpen] = useState(true)

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
                        cn('flex items-center gap-2', isActive && 'font-medium text-primary')
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
              className={cn('h-4 w-4 transition-transform', masterOpen && 'rotate-180')}
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
                              cn('flex items-center gap-2', isActive && 'font-medium text-primary')
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
                        cn('flex items-center gap-2', isActive && 'font-medium text-primary')
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

      <SidebarFooter className="border-t px-4 py-3 text-xs text-muted-foreground">
        v0.1.0
      </SidebarFooter>
    </Sidebar>
  )
}
