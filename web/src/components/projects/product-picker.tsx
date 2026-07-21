import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateProduct, useProducts } from "@/hooks/use-products";

import type { ProjectProductLine } from "@artisancode/api-types";

interface Props {
  value: ProjectProductLine[];
  onChange: (lines: ProjectProductLine[]) => void;
}

// ponytail: search-and-pick + inline create, scoped to this one form field
// rather than a generic combobox primitive — no other call site needs it yet.
export function ProductPicker({ value, onChange }: Props) {
  const { data } = useProducts();
  const { mutateAsync: createProduct, isPending: creating } =
    useCreateProduct();

  const products = data?.items ?? [];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [newUnit, setNewUnit] = useState("");

  const selectedIds = new Set(value.map((l) => l.productId));
  const matches = products.filter(
    (p) =>
      !selectedIds.has(p.id) &&
      p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const hasExactMatch = products.some(
    (p) => p.name.toLowerCase() === query.trim().toLowerCase(),
  );

  function addLine(productId: string) {
    onChange([...value, { productId, quantity: 1 }]);
    setQuery("");
    setNewUnit("");
    setOpen(false);
  }

  async function handleCreateAndAdd() {
    if (!query.trim() || !newUnit.trim()) return;
    const product = await createProduct({
      name: query.trim(),
      unit: newUnit.trim(),
    });
    addLine(product.id);
  }

  function updateQuantity(productId: string, quantity: number) {
    onChange(
      value.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
    );
  }

  function removeLine(productId: string) {
    onChange(value.filter((l) => l.productId !== productId));
  }

  return (
    <div className="grid gap-1.5">
      <Label>Produk</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-muted-foreground"
          >
            <Plus className="h-4 w-4" />
            Tambah produk
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2">
          <Input
            autoFocus
            placeholder="Cari atau ketik nama produk baru..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mt-2 max-h-48 space-y-0.5 overflow-y-auto">
            {matches.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => addLine(p.id)}
                className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                <span>{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.unit}</span>
              </button>
            ))}
            {matches.length === 0 && !query.trim() && (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                Ketik untuk mencari produk.
              </p>
            )}
          </div>

          {query.trim() && !hasExactMatch && (
            <div className="mt-2 border-t pt-2">
              <p className="px-2 text-xs text-muted-foreground">
                Produk &quot;{query.trim()}&quot; belum ada, buat baru:
              </p>
              <div className="mt-1.5 flex gap-1.5 px-2">
                <Input
                  placeholder="Satuan (m3, sak, unit...)"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="h-8"
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={!newUnit.trim() || creating}
                  onClick={handleCreateAndAdd}
                >
                  Tambah
                </Button>
              </div>
            </div>
          )}
          <div className="mt-2 border-t px-2 py-1.5">
            <Link
              to="/master/products"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              + Kelola katalog produk
            </Link>
          </div>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="mt-3 space-y-3">
          {value.map((line) => {
            const product = products.find((p) => p.id === line.productId);
            return (
              <div
                key={line.productId}
                className="flex items-center gap-2 rounded-md border px-3 py-2"
              >
                <span className="flex-1 truncate text-sm">
                  {product?.name ?? line.productId}
                </span>
                <Input
                  type="number"
                  min={0}
                  value={line.quantity}
                  onChange={(e) =>
                    updateQuantity(line.productId, Number(e.target.value))
                  }
                  className="h-8 w-20"
                />
                <span className="w-10 text-xs text-muted-foreground">
                  {product?.unit}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeLine(line.productId)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
