import { Users, UserCheck, Target, TrendingUp, UserX } from "lucide-react";
import { Link } from "react-router";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";

import { InstallButton } from "@/components/shared/install-button";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useCustomers } from "@/hooks/use-customers";
import { useDashboardStats, useProjectPipeline } from "@/hooks/use-dashboard";

const pipelineStatusLabel: Record<string, string> = {
  prospect: "Prospek",
  in_progress: "Berjalan",
  won: "Menang",
  lost: "Kalah",
};

// ponytail: reusing the validated dataviz reference palette's categorical
// slots (blue/green/magenta/yellow) — they clear the CVD/contrast checks in
// both themes, unlike this app's own --chart-* tokens.
const pipelineChartConfig: ChartConfig = {
  prospect: {
    label: "Prospek",
    theme: { light: "#eda100", dark: "#c98500" },
  },
  in_progress: {
    label: "Berjalan",
    theme: { light: "#2a78d6", dark: "#3987e5" },
  },
  won: {
    label: "Menang",
    theme: { light: "#008300", dark: "#008300" },
  },
  lost: {
    label: "Kalah",
    theme: { light: "#e87ba4", dark: "#d55181" },
  },
  totalValue: { label: "Total Nilai" },
};

const compactIdr = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 1,
});

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
  const { data: pipeline } = useProjectPipeline();

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
        action={<InstallButton />}
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
        <h2 className="mb-4 text-lg font-semibold">Pipeline Proyek</h2>
        <Card>
          <CardContent className="pt-6">
            <ChartContainer
              config={pipelineChartConfig}
              className="h-64 w-full"
            >
              <BarChart data={pipeline} margin={{ top: 24 }} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => pipelineStatusLabel[value] ?? value}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      nameKey="totalValue"
                      formatter={(value, _name, item) => (
                        <div className="flex w-full items-center justify-between gap-6">
                          <span className="text-muted-foreground">
                            {(item.payload as { count: number }).count} proyek
                          </span>
                          <span className="font-mono font-medium tabular-nums">
                            {compactIdr.format(Number(value))}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="totalValue" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="totalValue"
                    position="top"
                    className="fill-foreground text-xs"
                    formatter={(value) => compactIdr.format(Number(value))}
                  />
                  {(pipeline ?? []).map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={`var(--color-${entry.status})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
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
