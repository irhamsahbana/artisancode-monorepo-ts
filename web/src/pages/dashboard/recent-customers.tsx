import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomers } from "@/hooks/use-customers";

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

export function RecentCustomers() {
  const { data: customersData } = useCustomers({ per_page: 5 });

  return (
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
  );
}
