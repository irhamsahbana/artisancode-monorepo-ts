import { Users, UserCheck, Target, TrendingUp, UserX } from "lucide-react";
import { Link } from "react-router";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomers } from "@/hooks/use-customers";
import { useDashboardStats } from "@/hooks/use-dashboard";

const statusLabel: Record<string, string> = {
  active: "Aktif",
  prospect: "Prospek",
  inactive: "Tidak Aktif",
};

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  prospect: "secondary",
  inactive: "outline",
};

export function Dashboard() {
  const { data: metrics } = useDashboardStats();
  const { data: customersData } = useCustomers({ per_page: 5 });

  const statCards = [
    {
      label: "Total Pelanggan",
      value: metrics?.totalCustomers ?? 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Pelanggan Aktif",
      value: metrics?.totalActive ?? 0,
      icon: UserCheck,
      color: "text-green-500",
    },
    {
      label: "Prospek",
      value: metrics?.totalProspects ?? 0,
      icon: Target,
      color: "text-yellow-500",
    },
    {
      label: "Potensi Tinggi",
      value: metrics?.highPotential ?? 0,
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      label: "Tidak Aktif",
      value: metrics?.totalInactive ?? 0,
      icon: UserX,
      color: "text-red-400",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Ringkasan data pelanggan Anda."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Pelanggan Terbaru</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {(customersData?.items ?? []).map((c) => (
                <Link
                  key={c.id}
                  to={`/customers/${c.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.createdAt}
                    </p>
                  </div>
                  <Badge variant={statusVariant[c.status]}>
                    {statusLabel[c.status]}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
