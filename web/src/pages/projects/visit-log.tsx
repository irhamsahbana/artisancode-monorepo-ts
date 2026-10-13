import { Plus } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHasPermission } from "@/hooks/use-auth";

import { VisitLogDialog } from "./visit-log-dialog";

export function VisitLog({
  projectId,
  customerId,
  visits,
}: {
  projectId: string;
  customerId: string;
  visits: {
    id: string;
    visitDate: string;
    metWith?: string;
    topic?: string;
    notes?: string;
  }[];
}) {
  const [open, setOpen] = useState(false);
  const canCreate = useHasPermission("project_visits.create");

  const sorted = [...visits].sort((a, b) =>
    b.visitDate.localeCompare(a.visitDate),
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Log Kunjungan / Follow-up</CardTitle>
        <Button
          size="sm"
          variant="outline"
          disabled={!canCreate}
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-1 h-4 w-4" />
          Tambah Log
        </Button>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <EmptyState
            title="Belum ada log kunjungan"
            description="Catat hasil follow-up sales di sini."
          />
        ) : (
          <ul className="space-y-4">
            {sorted.map((v) => (
              <li key={v.id} className="rounded-md border px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {v.topic ?? "Kunjungan"}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {v.visitDate}
                  </span>
                </div>
                {v.metWith && (
                  <p className="text-xs text-muted-foreground">
                    Bertemu: {v.metWith}
                  </p>
                )}
                {v.notes && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {v.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <VisitLogDialog
        open={open}
        onOpenChange={setOpen}
        projectId={projectId}
        customerId={customerId}
      />
    </Card>
  );
}
