import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoryList } from "@/hooks/use-categories";

import { Info } from "./info";
import { companyTypeLabel } from "./labels";

import type { Customer } from "@artisancode/api-types";

export function InfoTab({ customer }: { customer: Customer }) {
  const { data: segmentationsData } = useCategoryList("segmentation");
  const segmentations = segmentationsData?.items ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Umum</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Info
            label="Segmentasi"
            value={
              segmentations.find((s) => s.id === customer.segmentationId)
                ?.name ?? "-"
            }
          />
          <Info
            label="Tipe Perusahaan"
            value={
              (customer.companyType &&
                companyTypeLabel[customer.companyType]) ||
              "-"
            }
          />
          <Info label="Tanggal Daftar" value={customer.createdAt} />
          {customer.notes && (
            <div className="sm:col-span-2">
              <Info label="Catatan" value={customer.notes} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Info Umum Perusahaan</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Info label="NPWP" value={customer.npwp ?? "-"} />
          <Info label="SKT" value={customer.skt ?? "-"} />
          <Info label="Email Kantor" value={customer.companyEmail ?? "-"} />
          <Info label="Website" value={customer.website ?? "-"} />
          {customer.address && (
            <div className="sm:col-span-2">
              <Info label="Alamat" value={customer.address} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
