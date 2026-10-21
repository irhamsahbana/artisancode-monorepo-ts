import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  // Width hint (e.g. "w-40"). Any column with one switches the table to a fixed
  // layout so column widths stop shifting with each page's content.
  className?: string;
}

export interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}
