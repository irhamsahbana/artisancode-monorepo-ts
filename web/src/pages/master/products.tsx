import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUpdateProduct } from "@/hooks/use-products";
import { useServerTable } from "@/hooks/use-server-table";
import { queryKeys } from "@/lib/query-keys";
import { productService } from "@/services/product";

import { ProductDialog } from "./product-dialog";

import type { Product } from "@artisancode/api-types";

export function Products() {
  const { mutate: update } = useUpdateProduct();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const table = useServerTable<Product>({
    queryKey: (params) => queryKeys.products.list(params),
    fetcher: (params) => productService.list(params),
    pageSize: 10,
  });

  function toggleActive(item: Product) {
    update(
      { id: item.id, isActive: !item.isActive },
      {
        onSuccess: () =>
          toast.success(item.isActive ? "Dinonaktifkan." : "Diaktifkan."),
      },
    );
  }

  const columns: Column<Product>[] = [
    {
      key: "name",
      label: "Nama Produk",
      render: (i) => <span className="font-medium">{i.name}</span>,
    },
    {
      key: "unit",
      label: "Satuan",
      render: (i) => i.unit,
    },
    {
      key: "status",
      label: "Status",
      render: (i) => (
        <Badge
          variant={i.isActive ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => toggleActive(i)}
        >
          {i.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
  ];

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(item: Product) {
    setEditing(item);
    setOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Produk"
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        }
      />
      <DataTable
        data={table.items}
        loadedData={table.loadedItems}
        columns={columns}
        searchPlaceholder="Cari produk..."
        query={table.query}
        onQueryChange={table.onQueryChange}
        page={table.page}
        totalPages={table.totalPages}
        totalCount={table.totalCount}
        onPageChange={table.onPageChange}
        hasMore={table.hasMore}
        onLoadMore={table.onLoadMore}
        loading={table.loading}
        actions={(item) => (
          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      />

      <ProductDialog open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
