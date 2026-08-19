import { Clock } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

interface Props {
  title?: string;
}

export function ComingSoon({ title = "Segera Hadir" }: Props) {
  return (
    <EmptyState
      icon={Clock}
      title={title}
      description="Fitur ini sedang dalam pengembangan."
    />
  );
}
