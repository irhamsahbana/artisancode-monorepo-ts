import { Building2 } from "lucide-react";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import type { useServerTable } from "@/hooks/use-server-table";

import type { ContactSearchResult } from "@artisancode/api-types";

export function RecipientsTable({
  contactTable,
  selectedContactIds,
  onSelectAll,
  onToggleContact,
}: {
  contactTable: ReturnType<typeof useServerTable<ContactSearchResult>>;
  selectedContactIds: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onToggleContact: (contactId: string, checked: boolean) => void;
}) {
  const columns: Column<ContactSearchResult>[] = [
    {
      key: "select",
      label: "Pilih",
      render: (r) => (
        <input
          type="checkbox"
          checked={selectedContactIds.has(r.contact.id)}
          onChange={(e) => onToggleContact(r.contact.id, e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
      ),
    },
    {
      key: "name",
      label: "Nama",
      render: (r) => (
        <div>
          <p className="text-sm font-medium">{r.contact.name}</p>
          <p className="text-xs text-muted-foreground">
            {r.contact.position ?? "-"}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      label: "Perusahaan",
      render: (r) => (
        <span className="flex items-center gap-1 text-sm">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          {r.customer.name}
        </span>
      ),
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      render: (r) => (
        <span className="text-sm text-muted-foreground">
          {r.contact.whatsapp ?? "-"}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={
            contactTable.loadedItems.length > 0 &&
            contactTable.loadedItems.every((r) =>
              selectedContactIds.has(r.contact.id),
            )
          }
          onChange={(e) => onSelectAll(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <span className="text-sm text-muted-foreground">
          Pilih Semua (
          <span className="font-medium">{selectedContactIds.size}</span>/
          <span className="font-medium">{contactTable.loadedItems.length}</span>
          )
        </span>
      </div>

      <DataTable
        data={contactTable.items}
        loadedData={contactTable.loadedItems}
        columns={columns}
        searchPlaceholder="Cari nama key person / perusahaan..."
        query={contactTable.query}
        onQueryChange={contactTable.onQueryChange}
        page={contactTable.page}
        totalPages={contactTable.totalPages}
        totalCount={contactTable.totalCount}
        onPageChange={contactTable.onPageChange}
        hasMore={contactTable.hasMore}
        onLoadMore={contactTable.onLoadMore}
      />
    </>
  );
}
