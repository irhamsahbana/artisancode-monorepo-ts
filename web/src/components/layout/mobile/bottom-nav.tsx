import {
  LayoutDashboard,
  Users,
  Contact,
  Briefcase,
  Menu,
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
  MessageSquare,
  Building2,
  User,
  LogOut,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { logout, useMe } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

import type { Permission } from "@artisancode/api-types";

// `permission: undefined` = always accessible (no module in the permission
// catalog covers it, e.g. self-service or uncatalogued pages).
const menuItems: {
  to: string;
  label: string;
  icon: typeof Star;
  permission?: Permission;
}[] = [
  {
    to: "/contacts",
    label: "Kontak",
    icon: Contact,
    permission: "contacts.view",
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

const masterItems: {
  to: string;
  label: string;
  icon: typeof Star;
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
  {
    to: "/master/visit-topics",
    label: "Topik Kunjungan",
    icon: MessageSquare,
    permission: "categories.view",
  },
];

const settingsItems: {
  to: string;
  label: string;
  icon: typeof Star;
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

const moreActivePrefixes = [
  "/contacts",
  "/projects/map",
  "/ratings",
  "/quotations",
  "/broadcasts",
  "/birthdays",
  "/master",
  "/settings",
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const { data: me } = useMe();
  const canViewCustomers = me?.permissions.includes("customers.view") ?? false;
  const canViewProjects = me?.permissions.includes("projects.view") ?? false;
  const moreActive = moreActivePrefixes.some((p) =>
    location.pathname.startsWith(p),
  );

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <>
      <nav
        style={{ bottom: "calc(2rem + env(safe-area-inset-bottom))" }}
        className="fixed inset-x-4 z-50 flex h-16 items-center justify-around rounded-full border bg-background p-1.5 shadow-lg"
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "flex h-full flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-colors",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted",
            )
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink
          to="/customers"
          aria-disabled={!canViewCustomers}
          tabIndex={canViewCustomers ? undefined : -1}
          onClick={(e) => !canViewCustomers && e.preventDefault()}
          className={({ isActive }) =>
            cn(
              "flex h-full flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-colors",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted",
              !canViewCustomers && "pointer-events-none opacity-50",
            )
          }
        >
          <Users className="h-5 w-5" />
          Pelanggan
        </NavLink>
        <NavLink
          to="/projects"
          aria-disabled={!canViewProjects}
          tabIndex={canViewProjects ? undefined : -1}
          onClick={(e) => !canViewProjects && e.preventDefault()}
          className={cn(
            "flex h-full flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-colors",
            location.pathname === "/projects" ||
              (location.pathname.startsWith("/projects/") &&
                location.pathname !== "/projects/map")
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted",
            !canViewProjects && "pointer-events-none opacity-50",
          )}
        >
          <Briefcase className="h-5 w-5" />
          Proyek
        </NavLink>
        <button
          onClick={() => setMoreOpen(true)}
          className={cn(
            "flex h-full flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-colors",
            moreActive
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          <Menu className="h-5 w-5" />
          Lainnya
        </button>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[80vh] pb-safe">
          <SheetHeader className="mb-2">
            <SheetTitle>Menu Lainnya</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 overflow-y-auto pb-4">
            <NavGroup items={menuItems} onNavigate={() => setMoreOpen(false)} />
            <div>
              <p className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">
                Master Data
              </p>
              <NavGroup
                items={masterItems}
                onNavigate={() => setMoreOpen(false)}
              />
            </div>
            <div>
              <p className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">
                Pengaturan
              </p>
              <NavGroup
                items={settingsItems}
                onNavigate={() => setMoreOpen(false)}
              />
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function NavGroup({
  items,
  onNavigate,
}: {
  items: {
    to: string;
    label: string;
    icon: typeof Star;
    permission?: Permission;
  }[];
  onNavigate: () => void;
}) {
  const { data: me } = useMe();

  return (
    <div className="grid gap-1">
      {items.map(({ to, label, icon: Icon, permission }) => {
        const allowed =
          !permission || (me?.permissions.includes(permission) ?? false);
        return (
          <NavLink
            key={to}
            to={to}
            aria-disabled={!allowed}
            tabIndex={allowed ? undefined : -1}
            onClick={(e) => {
              if (!allowed) {
                e.preventDefault();
                return;
              }
              onNavigate();
            }}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
                !allowed && "pointer-events-none opacity-50",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        );
      })}
    </div>
  );
}
