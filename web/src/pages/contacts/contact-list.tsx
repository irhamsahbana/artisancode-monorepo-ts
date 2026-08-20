import { Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useServerTable } from "@/hooks/use-server-table";
import { queryKeys } from "@/lib/query-keys";
import { contactService } from "@/services/contact";

import type { ContactPersonGroup } from "@artisancode/api-types";

// Satu baris per orang, semua perusahaan terkaitnya (bisa 2+ jika orang yang
// sama ada di beberapa perusahaan) — grouping dan pagination dilakukan di
// server (lihat contact.repo/search.ts).
const columns: Column<ContactPersonGroup>[] = [
  {
    key: "contactName",
    label: "Nama",
    render: (g) => (
      <Link
        to={`/contacts/${g.entries[0]?.contact.id}`}
        className="block hover:underline"
      >
        <p className="text-sm font-medium">{g.name}</p>
        <p className="text-xs text-muted-foreground">
          {g.entries[0]?.contact.position ?? "-"}
        </p>
      </Link>
    ),
  },
  {
    key: "customer",
    label: "Perusahaan",
    render: (g) => {
      const first = g.entries[0];
      const rest = g.entries.length - 1;
      if (!first) return null;
      return (
        <div className="flex flex-col gap-1">
          <Link
            to={`/customers/${first.customer.id}`}
            className="flex items-center gap-1 text-sm hover:underline"
          >
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            {first.customer.name}
          </Link>
          {rest > 0 && (
            <Badge variant="outline" className="w-fit text-[10px]">
              {rest} Perusahaan Lainnya
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    render: (g) => (
      <span className="text-sm text-muted-foreground">
        {g.entries.find((r) => r.contact.whatsapp)?.contact.whatsapp ?? "-"}
      </span>
    ),
  },
  {
    key: "isPrimary",
    label: "Utama",
    render: (g) =>
      g.entries.some((r) => r.contact.isPrimary) ? (
        <Badge variant="secondary" className="text-[10px]">
          Ya
        </Badge>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      ),
  },
];

export function ContactList() {
  const navigate = useNavigate();

  const table = useServerTable<ContactPersonGroup>({
    queryKey: (params) => queryKeys.contacts.searchPersons(params),
    fetcher: (params) => contactService.searchPersons(params),
    pageSize: 10,
  });

  return (
    <div>
      <PageHeader
        title="Kontak"
        description="Key person lintas perusahaan pelanggan."
      />

      <DataTable
        data={table.items}
        loadedData={table.loadedItems}
        columns={columns}
        searchPlaceholder="Cari nama key person atau perusahaan..."
        query={table.query}
        onQueryChange={table.onQueryChange}
        page={table.page}
        totalPages={table.totalPages}
        totalCount={table.totalCount}
        onPageChange={table.onPageChange}
        hasMore={table.hasMore}
        onLoadMore={table.onLoadMore}
        loading={table.loading}
        actions={(g) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/customers/${g.entries[0]?.customer.id}`)}
          >
            <Building2 className="h-4 w-4" />
          </Button>
        )}
      />
    </div>
  );
}
