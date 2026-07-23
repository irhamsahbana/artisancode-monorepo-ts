import { Users, UserCheck, Target, TrendingUp, UserX } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard";

export function StatCards() {
  const { data: metrics } = useDashboardStats();

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
  );
}
