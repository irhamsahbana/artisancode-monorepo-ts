import { FileText } from "lucide-react";
import { Link } from "react-router";

import { Card, CardContent } from "@/components/ui/card";
import { useQuotations } from "@/hooks/use-quotations";

export function QuotationAlert() {
  const { data } = useQuotations();
  const newCount = (data?.items ?? []).filter((q) => q.status === "new").length;

  if (newCount === 0) return null;

  return (
    <Link to="/quotations?status=new" className="mt-8 block">
      <Card className="border-yellow-500/50 bg-yellow-500/5 transition-colors hover:bg-yellow-500/10">
        <CardContent className="flex items-center gap-3 py-4">
          <FileText className="h-5 w-5 shrink-0 text-yellow-600" />
          <p className="text-sm">
            <span className="font-semibold">
              {newCount} permintaan penawaran
            </span>{" "}
            baru belum direspon.
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
