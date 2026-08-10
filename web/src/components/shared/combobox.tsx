import { X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  hint?: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: (ComboboxOption & { label?: string })[];
  placeholder?: string;
  loading?: boolean;
  emptyText?: string;
  enforceOptions?: boolean;
}

// ponytail: free-text input + dropdown of server-driven suggestions. The
// caller owns fetching/debouncing (see useDebouncedValue) and passes the
// current `options`; this only renders the combobox UI. Swap in place of
// native <input list> once results come from a paginated/searchable API,
// since a <datalist> can only suggest from what's already loaded.
//
// Uses PopoverAnchor (not PopoverTrigger) for positioning: Trigger forces
// type="button" onto its asChild, which turns a plain <input> into an
// unclickable/untypable button input since Input doesn't set its own type.
export function Combobox({
  value,
  onChange,
  options,
  placeholder,
  loading,
  emptyText = "Tidak ditemukan, bisa diisi manual.",
  enforceOptions,
}: Props) {
  const [open, setOpen] = useState(false);

  const displayValue = options.find((o) => o.value === value)?.label || value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Input
            type="text"
            value={enforceOptions && !open ? displayValue : value}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            onBlur={() => {
              if (enforceOptions && !options.find((o) => o.value === value)) {
                onChange("");
              }
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
            className={value ? "pr-8" : undefined}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
              aria-label="Hapus"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="z-1200 w-[--radix-popper-anchor-width] p-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-48 overflow-y-auto">
          {loading ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              Memuat...
            </p>
          ) : options.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              {emptyText}
            </p>
          ) : (
            options.map((o) => (
              <button
                key={o.value}
                type="button"
                onMouseDown={(e) => {
                  // prevent input blur before click registers
                  e.preventDefault();
                }}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                <span>{o.label || o.value}</span>
                {o.hint && (
                  <span className="text-xs text-muted-foreground">
                    {o.hint}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
