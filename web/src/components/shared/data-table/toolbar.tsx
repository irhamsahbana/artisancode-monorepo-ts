import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { FilterOption } from "./types";

interface Props {
  searchPlaceholder: string;
  showSearch: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  filters?: FilterOption[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}

export function DataTableToolbar({
  searchPlaceholder,
  showSearch,
  query,
  onQueryChange,
  filters,
  activeFilters,
  onFilterChange,
}: Props) {
  if (!showSearch && !filters?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {showSearch && (
        <Input
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="h-9 w-64"
        />
      )}
      {filters?.map((f) => (
        <Select
          key={f.key}
          value={activeFilters[f.key] ?? "all"}
          onValueChange={(v) => onFilterChange(f.key, v)}
        >
          <SelectTrigger className="h-9 w-44">
            <SelectValue placeholder={f.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua {f.label}</SelectItem>
            {f.options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
