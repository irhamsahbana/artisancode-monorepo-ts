import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/pages/projects/project-status";

import type { Project } from "@artisancode/api-types";

export function ContractHistoryTab({
  wonProjects,
  contactName,
  onOpenProject,
}: {
  wonProjects: Project[];
  contactName: (contactId?: string) => string;
  onOpenProject: (id: string) => void;
}) {
  if (wonProjects.length === 0) {
    return (
      <EmptyState
        title="Belum ada riwayat kontrak"
        description="Riwayat kontrak muncul dari proyek berstatus 'Berhasil'."
      />
    );
  }

  return (
    <div className="space-y-3">
      {wonProjects.map((p) => (
        <Card
          key={p.id}
          className="cursor-pointer transition-colors hover:bg-muted/40"
          onClick={() => onOpenProject(p.id)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{p.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            <span>
              Omset:{" "}
              <b className="text-foreground">
                {formatRupiah(p.estimatedValue)}
              </b>
            </span>
            <span>
              Tahun:{" "}
              <b className="text-foreground">
                {new Date(p.createdAt).getFullYear()}
              </b>
            </span>
            <span>
              PIC: <b className="text-foreground">{contactName(p.contactId)}</b>
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
