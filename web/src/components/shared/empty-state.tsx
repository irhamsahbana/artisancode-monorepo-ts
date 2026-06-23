import { InboxIcon } from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface Props {
  icon?: LucideIcon;
  title?: string;
  description?: string;
}

export function EmptyState({
  icon: Icon = InboxIcon,
  title = "Tidak ada data",
  description = "Belum ada data yang tersedia.",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="mb-4 h-12 w-12 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground/70">{description}</p>
      )}
    </div>
  );
}
