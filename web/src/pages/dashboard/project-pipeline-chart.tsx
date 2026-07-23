import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useProjectPipeline } from "@/hooks/use-dashboard";

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

export function ProjectPipelineChart() {
  const { data: pipeline } = useProjectPipeline();

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-semibold">Pipeline Proyek</h2>
      <Card>
        <CardContent className="pt-6">
          <ChartContainer config={pipelineChartConfig} className="h-64 w-full">
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
  );
}
