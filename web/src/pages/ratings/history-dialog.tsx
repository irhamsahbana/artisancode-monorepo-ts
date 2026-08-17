import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { riskLabel, riskVariant } from "./rating-status";

import type { RiskLevel } from "@artisancode/api-types";

export function HistoryDialog({
  customerId,
  customerName,
  ratings,
  onClose,
}: {
  customerId: string | null;
  customerName: string;
  ratings: {
    id: string;
    customerId: string;
    ratingDate: string;
    paymentScore: number;
    relationshipScore: number;
    riskLevel: RiskLevel;
    notes?: string;
    problemNotes?: string;
  }[];
  onClose: () => void;
}) {
  const items = customerId
    ? ratings
        .filter((r) => r.customerId === customerId)
        .sort((a, b) => b.ratingDate.localeCompare(a.ratingDate))
    : [];

  return (
    <Dialog open={!!customerId} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Riwayat Penilaian</DialogTitle>
          <DialogDescription>{customerName}</DialogDescription>
        </DialogHeader>
        {items.length === 0 ? (
          <EmptyState title="Belum ada riwayat penilaian" />
        ) : (
          <ul className="max-h-[60vh] space-y-3 overflow-auto">
            {items.map((r) => (
              <li key={r.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{r.ratingDate}</span>
                  <Badge variant={riskVariant[r.riskLevel]}>
                    {riskLabel[r.riskLevel]}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 text-xs text-muted-foreground">
                  <span>
                    Pembayaran:{" "}
                    <b className="text-foreground">{r.paymentScore}</b>
                  </span>
                  <span>
                    Hubungan:{" "}
                    <b className="text-foreground">{r.relationshipScore}</b>
                  </span>
                </div>
                {r.problemNotes && (
                  <p className="mt-1 text-xs text-destructive">
                    {r.problemNotes}
                  </p>
                )}
                {r.notes && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
