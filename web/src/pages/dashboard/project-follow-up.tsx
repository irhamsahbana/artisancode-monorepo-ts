import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useProjectFollowUps } from "@/hooks/use-dashboard";
import {
  projectStatusLabel,
  projectStatusVariant,
} from "@/pages/projects/project-status";

const MAX_ITEMS = 5;

export function ProjectFollowUp() {
  const { data: followUps } = useProjectFollowUps();
  const items = (followUps ?? []).slice(0, MAX_ITEMS);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-semibold">Proyek Perlu Follow-up</h2>
      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Tidak ada proyek aktif saat ini.
            </p>
          ) : (
            <div className="divide-y">
              {items.map(({ project, daysSinceLastVisit }) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {project.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {project.picName ?? project.location ?? "-"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge variant={projectStatusVariant[project.status]}>
                      {projectStatusLabel[project.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {daysSinceLastVisit === null
                        ? "Belum pernah dikunjungi"
                        : `${daysSinceLastVisit} hari lalu`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
