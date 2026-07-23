import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard";

const potentialLabel: Record<string, string> = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

function BreakdownList({ rows }: { rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <div className="space-y-3">
      {rows.map(({ label, count }) => (
        <div key={label} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 truncate text-muted-foreground">
            {label}
          </span>
          <div className="h-2 flex-1 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right font-medium tabular-nums">
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CustomerBreakdown() {
  const { data: metrics } = useDashboardStats();

  const byArea = (metrics?.byArea ?? []).map((a) => ({
    label: a.name,
    count: a.count,
  }));
  const byPotential = (metrics?.byPotential ?? []).map((p) => ({
    label: potentialLabel[p.potential] ?? p.potential,
    count: p.count,
  }));

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pelanggan per Area</CardTitle>
        </CardHeader>
        <CardContent>
          <BreakdownList rows={byArea} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pelanggan per Potensi</CardTitle>
        </CardHeader>
        <CardContent>
          <BreakdownList rows={byPotential} />
        </CardContent>
      </Card>
    </div>
  );
}
