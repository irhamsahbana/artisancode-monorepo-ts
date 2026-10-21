import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCategory, useCategoryOptions } from "@/hooks/use-categories";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

interface Props extends Omit<React.ComponentProps<"button">, "onChange"> {
  group: string;
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

// Searchable select for category master data (area, segmentation, ...).
// Options come from the API page by page: typing searches on the server and
// scrolling to the bottom of the list loads the next page, so it works for
// groups with hundreds of entries.
export function CategorySelect({
  group,
  value,
  onChange,
  placeholder = "Pilih...",
  searchPlaceholder = "Cari...",
  className,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const q = useDebouncedValue(query.trim());

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useCategoryOptions(group, q);
  const { data: selected } = useCategory(value);

  const items = data?.pages.flatMap((p) => p.items) ?? [];
  const label = items.find((i) => i.id === value)?.name ?? selected?.name;

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    if (nearBottom && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
          {...props}
        >
          <span className={cn("truncate", !label && "text-muted-foreground")}>
            {label ?? placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-2"
      >
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          autoComplete="off"
        />
        <div className="mt-2 max-h-60 overflow-y-auto" onScroll={handleScroll}>
          {isLoading ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              Memuat...
            </p>
          ) : items.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              Tidak ditemukan.
            </p>
          ) : (
            items.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => {
                  onChange(i.id);
                  setOpen(false);
                  setQuery("");
                }}
                className={cn(
                  "flex w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent",
                  i.id === value && "bg-accent font-medium",
                )}
              >
                {i.name}
              </button>
            ))
          )}
          {isFetchingNextPage && (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              Memuat...
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
