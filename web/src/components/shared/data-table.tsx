import { useState, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { EmptyState } from './empty-state'

import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  label: string
  render: (row: T) => ReactNode
}

export interface FilterOption {
  key: string
  label: string
  options: { label: string; value: string }[]
}

interface Props<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchFn?: (row: T, query: string) => boolean
  filters?: FilterOption[]
  filterFn?: (row: T, filters: Record<string, string>) => boolean
  pageSize?: number
  actions?: (row: T) => ReactNode
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Cari...',
  searchFn,
  filters,
  filterFn,
  pageSize = 10,
  actions,
}: Props<T>) {
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let rows = data
    if (query && searchFn) rows = rows.filter((r) => searchFn(r, query))
    if (Object.keys(activeFilters).length && filterFn)
      rows = rows.filter((r) => filterFn(r, activeFilters))
    return rows
  }, [data, query, activeFilters, searchFn, filterFn])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize)

  function setFilter(key: string, value: string) {
    setPage(1)
    setActiveFilters((prev) => {
      if (value === 'all') {
        return Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
      }
      return { ...prev, [key]: value }
    })
  }

  const allColumns = actions
    ? [...columns, { key: '__actions', label: '', render: actions }]
    : columns

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {searchFn && (
          <Input
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            className="h-9 w-64"
          />
        )}
        {filters?.map((f) => (
          <Select
            key={f.key}
            value={activeFilters[f.key] ?? 'all'}
            onValueChange={(v) => setFilter(f.key, v)}
          >
            <SelectTrigger className="h-9 w-44">
              <SelectValue placeholder={f.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua {f.label}</SelectItem>
              {f.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {allColumns.map((c) => (
                <TableHead key={c.key}>{c.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={allColumns.length}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((row, i) => (
                <TableRow key={i}>
                  {allColumns.map((c) => (
                    <TableCell key={c.key}>{c.render(row)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filtered.length} data</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              ‹
            </Button>
            <span className="px-2">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              ›
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
