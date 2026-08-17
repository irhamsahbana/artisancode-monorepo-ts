import { Star, Plus, History } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomers } from "@/hooks/use-customers";
import { useProjects } from "@/hooks/use-projects";
import { useRatings } from "@/hooks/use-ratings";
import { summarizeRatings } from "@/services/rating";

import { HistoryDialog } from "./history-dialog";
import { RatingDialog } from "./rating-dialog";
import { riskLabel, riskVariant } from "./rating-status";

export function RatingList() {
  const { data: customersData } = useCustomers({ per_page: 100 });
  const { data } = useRatings();
  const { data: wonProjectsData } = useProjects({ status: "won" });

  // Only customers with at least one won project are eligible for rating
  // (riwayat kontrak = won projects, see contract-history-from-projects.md).
  const eligible = useMemo(() => {
    const withWonProject = new Set(
      (wonProjectsData?.items ?? []).map((p) => p.customerId),
    );
    return (customersData?.items ?? []).filter((c) => withWonProject.has(c.id));
  }, [customersData, wonProjectsData]);

  const summary = useMemo(() => summarizeRatings(data?.items ?? []), [data]);

  const customerName = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of customersData?.items ?? []) map.set(c.id, c.name);
    return map;
  }, [customersData]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyFor, setHistoryFor] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Penilaian Pelanggan"
        description="Skor pembayaran & hubungan untuk pelanggan berkontrak."
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah Penilaian
          </Button>
        }
      />

      {eligible.length === 0 ? (
        <EmptyState
          title="Belum ada pelanggan berkontrak"
          description="Penilaian hanya berlaku untuk pelanggan dengan riwayat kontrak."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {eligible.map((c) => {
            const s = summary.get(c.id);
            const avg = s ? s.avgTotal / 2 : 0;
            return (
              <Card key={c.id}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        to={`/customers/${c.id}`}
                        className="block truncate font-medium hover:underline"
                      >
                        {c.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {s ? `${s.count} penilaian` : "Belum dinilai"}
                      </p>
                    </div>
                    {s && (
                      <Badge variant={riskVariant[s.latest.riskLevel]}>
                        Risiko {riskLabel[s.latest.riskLevel]}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-2xl font-semibold">
                      {s ? avg.toFixed(1) : "-"}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 5</span>
                  </div>

                  {s && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>
                        Pembayaran:{" "}
                        <b className="text-foreground">
                          {s.avgPayment.toFixed(1)}
                        </b>
                      </span>
                      <span>
                        Hubungan:{" "}
                        <b className="text-foreground">
                          {s.avgRelationship.toFixed(1)}
                        </b>
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHistoryFor(c.id)}
                    >
                      <History className="mr-1 h-4 w-4" />
                      Riwayat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <RatingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        eligible={eligible.map((c) => ({ id: c.id, name: c.name }))}
      />

      <HistoryDialog
        customerId={historyFor}
        customerName={historyFor ? (customerName.get(historyFor) ?? "-") : "-"}
        ratings={data?.items ?? []}
        onClose={() => setHistoryFor(null)}
      />
    </div>
  );
}
