import {
  LayoutDashboard,
  Users,
  Briefcase,
  Menu,
  Star,
  FileText,
  Megaphone,
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
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { clearToken } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const menuItems = [
  { to: "/projects/map", label: "Peta Proyek", icon: Map },
  { to: "/ratings", label: "Penilaian", icon: Star },
  { to: "/quotations", label: "Penawaran", icon: FileText },
  { to: "/broadcasts", label: "Broadcast", icon: Megaphone },
];

const masterItems = [
  { to: "/master/segmentation", label: "Segmentasi", icon: PieChart },
  { to: "/master/areas", label: "Area", icon: MapPin },
  { to: "/master/relation-status", label: "Status Relasi", icon: Network },
  { to: "/master/products", label: "Produk", icon: Package },
  { to: "/master/uoms", label: "Satuan", icon: Ruler },
  {
    to: "/master/unit-conversions",
    label: "Konversi Satuan",
    icon: ArrowLeftRight,
  },
];

const settingsItems = [
  { to: "/settings/profile", label: "Profil Bisnis", icon: Building2 },
  { to: "/settings/account", label: "Akun", icon: User },
  { to: "/settings/roles", label: "Roles & Hak Akses", icon: ShieldCheck },
];

const moreActivePrefixes = [
  "/projects/map",
  "/ratings",
  "/quotations",
  "/broadcasts",
  "/master",
  "/settings",
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = moreActivePrefixes.some((p) =>
    location.pathname.startsWith(p),
  );

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  return (
    <>
      <nav
        style={{ bottom: "calc(2rem + env(safe-area-inset-bottom))" }}
        className="fixed inset-x-4 z-50 flex h-16 items-center justify-around rounded-full border bg-background px-2 shadow-lg"
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 rounded-full px-4 py-2.5 text-[10px] font-medium transition-colors",
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
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 rounded-full px-4 py-2.5 text-[10px] font-medium transition-colors",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted",
            )
          }
        >
          <Users className="h-5 w-5" />
          Pelanggan
        </NavLink>
        <NavLink
          to="/projects"
          className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-full px-4 py-2.5 text-[10px] font-medium transition-colors",
            location.pathname === "/projects" ||
              (location.pathname.startsWith("/projects/") &&
                location.pathname !== "/projects/map")
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          <Briefcase className="h-5 w-5" />
          Proyek
        </NavLink>
        <button
          onClick={() => setMoreOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-full px-4 py-2.5 text-[10px] font-medium transition-colors",
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
  items: { to: string; label: string; icon: typeof Star }[];
  onNavigate: () => void;
}) {
  return (
    <div className="grid gap-1">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </div>
  );
}
