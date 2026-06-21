import { Plus, Pencil } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { DataTable } from '@/components/shared/data-table'
import type { Column } from '@/components/shared/data-table'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { MasterItem } from '@/data/master'


interface Props { title: string; items: MasterItem[] }

export function MasterPage({ title, items: initial }: Props) {
  const [items, setItems] = useState(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<MasterItem | null>(null)
  const [name, setName] = useState('')

  function openAdd() {
    setEditing(null)
    setName('')
    setOpen(true)
  }

  function openEdit(item: MasterItem) {
    setEditing(item)
    setName(item.name)
    setOpen(true)
  }

  function handleSave() {
    if (!name.trim()) return
    if (editing) {
      setItems((prev) => prev.map((i) => (i.id === editing.id ? { ...i, name: name.trim() } : i)))
      toast.success('Berhasil diperbarui.')
    } else {
      const newItem: MasterItem = { id: `new-${Date.now()}`, name: name.trim(), isActive: true }
      setItems((prev) => [...prev, newItem])
      toast.success('Berhasil ditambahkan.')
    }
    setOpen(false)
  }

  function toggleActive(item: MasterItem) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i)))
    toast.success(item.isActive ? 'Dinonaktifkan.' : 'Diaktifkan.')
  }

  const columns: Column<MasterItem>[] = [
    { key: 'name', label: 'Nama', render: (i) => <span className="font-medium">{i.name}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (i) => (
        <Badge
          variant={i.isActive ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => toggleActive(i)}
        >
          {i.isActive ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title={title}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        }
      />
      <DataTable
        data={items}
        columns={columns}
        searchPlaceholder={`Cari ${title.toLowerCase()}...`}
        searchFn={(i, q) => i.name.toLowerCase().includes(q.toLowerCase())}
        actions={(item) => (
          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title}` : `Tambah ${title}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-1.5 py-2">
            <Label>Nama</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Nama ${title.toLowerCase()}`}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>{editing ? 'Simpan' : 'Tambah'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
