import {
  LayoutDashboard,
  Users,
  Briefcase,
  Database,
  User,
} from "lucide-react";
import {
  PieChart,
  MapPin,
  Network,
  Package,
  Ruler,
  ArrowLeftRight,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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

export function BottomNav() {
  const location = useLocation();
  const [masterOpen, setMasterOpen] = useState(false);
  const masterActive = location.pathname.startsWith("/master");

  return (
    <>
      <nav
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        className="fixed inset-x-4 z-50 flex h-16 items-center justify-around rounded-full border bg-background shadow-lg"
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-0.5 text-xs",
              isActive ? "text-primary" : "text-muted-foreground",
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
              "flex flex-col items-center gap-0.5 text-xs",
              isActive ? "text-primary" : "text-muted-foreground",
            )
          }
        >
          <Users className="h-5 w-5" />
          Pelanggan
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-0.5 text-xs",
              isActive ? "text-primary" : "text-muted-foreground",
            )
          }
        >
          <Briefcase className="h-5 w-5" />
          Proyek
        </NavLink>
        <button
          onClick={() => setMasterOpen(true)}
          className={cn(
            "flex flex-col items-center gap-0.5 text-xs",
            masterActive ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Database className="h-5 w-5" />
          Master
        </button>
        <NavLink
          to="/settings/account"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-0.5 text-xs",
              isActive ? "text-primary" : "text-muted-foreground",
            )
          }
        >
          <User className="h-5 w-5" />
          Akun
        </NavLink>
      </nav>

      <Sheet open={masterOpen} onOpenChange={setMasterOpen}>
        <SheetContent side="bottom" className="h-auto pb-safe">
          <SheetHeader className="mb-4">
            <SheetTitle>Master Data</SheetTitle>
          </SheetHeader>
          <div className="grid gap-2 pb-4">
            {masterItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMasterOpen(false)}
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
        </SheetContent>
      </Sheet>
    </>
  );
}
