import { Plus, Eye, Pencil, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

import { DataTable } from '@/components/shared/data-table'
import type { Column, FilterOption } from '@/components/shared/data-table'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { customers as initialCustomers, type Customer } from '@/data/customers'
import { masterData } from '@/data/master'

const statusLabel: Record<Customer['status'], string> = {
  active: 'Aktif',
  prospect: 'Prospek',
  inactive: 'Tidak Aktif',
}

const statusVariant: Record<Customer['status'], 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  prospect: 'secondary',
  inactive: 'outline',
}

const potentialLabel: Record<Customer['potential'], string> = {
  high: 'Tinggi',
  medium: 'Sedang',
  low: 'Rendah',
}

const columns: Column<Customer>[] = [
  {
    key: 'name',
    label: 'Nama',
    render: (c) => <span className="font-medium">{c.name}</span>,
  },
  {
    key: 'type',
    label: 'Jenis',
    render: (c) => c.type === 'business' ? 'Badan Usaha' : 'Perorangan',
  },
  {
    key: 'area',
    label: 'Area',
    render: (c) => masterData.areas.find((a) => a.id === c.areaId)?.name ?? '-',
  },
  {
    key: 'status',
    label: 'Status',
    render: (c) => <Badge variant={statusVariant[c.status]}>{statusLabel[c.status]}</Badge>,
  },
  {
    key: 'potential',
    label: 'Potensi',
    render: (c) => potentialLabel[c.potential],
  },
]

const filters: FilterOption[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { label: 'Aktif', value: 'active' },
      { label: 'Prospek', value: 'prospect' },
      { label: 'Tidak Aktif', value: 'inactive' },
    ],
  },
  {
    key: 'potential',
    label: 'Potensi',
    options: [
      { label: 'Tinggi', value: 'high' },
      { label: 'Sedang', value: 'medium' },
      { label: 'Rendah', value: 'low' },
    ],
  },
  {
    key: 'areaId',
    label: 'Area',
    options: masterData.areas.map((a) => ({ label: a.name, value: a.id })),
  },
]

function parseExcelToCustomers(file: File): Promise<Customer[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: 'array' })
        const sheetName = wb.SheetNames[0]
        const sheet = sheetName ? wb.Sheets[sheetName] : undefined
        if (!sheet) return resolve([])
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)
        const str = (v: unknown) => (v ? String(v).trim() : undefined)
        const mapped: Customer[] = rows.map((row) => ({
          id: crypto.randomUUID(),
          name: String(row['Nama Pelanggan'] ?? '').trim(),
          type: row['Nama Perusahaan'] ? 'business' : 'individual',
          categoryId: '',
          segmentationId: '',
          areaId: '',
          status: 'prospect',
          potential: 'medium',
          hasContractHistory: !!row['Tahun berkontrak'],
          lastRevenue: row['Omset Kontrak Terakhir'] ? Number(row['Omset Kontrak Terakhir']) : undefined,
          lastContractYear: row['Tahun berkontrak'] ? Number(row['Tahun berkontrak']) : undefined,
          gender: String(row['Jenis Kelamin'] ?? '').toLowerCase().includes('perempuan') ? 'Female' : row['Jenis Kelamin'] ? 'Male' : undefined,
          address: str(row['Alamat Lengkap (KTP/Domisili):']),
          birthPlace: str(row['Tempat/Tanggal Lahir']),
          religion: str(row['Agama']),
          education: str(row['Pendidikan Terakhir']),
          email: str(row['Alamat Email Pribadi']),
          spouseName: str(row['Nama Suami/Istri']),
          spouseOccupation: str(row['Pekerjaan Suami/Istri']),
          childrenNames: str(row['Nama Anak Kandung']),
          childrenOccupation: str(row['Pekerjaan Anak']),
          character: str(row['Karakter Pelanggan']),
          hobby: str(row['Hobby']),
          companyName: str(row['Nama Perusahaan']),
          position: str(row['Jabatan']),
          companyAddress: str(row['Alamat Lengkap Perusahaan']),
          whatsapp: row['Nomor Telepon/WhatsApp '] ? String(row['Nomor Telepon/WhatsApp ']).replace(/\D/g, '') : undefined,
          notes: str(row['Catatan Khusus/Notes']),
          createdAt: new Date().toISOString().slice(0, 10),
        }))
        resolve(mapped.filter((c) => c.name))
      } catch {
        reject(new Error('Gagal membaca file Excel'))
      }
    }
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.readAsArrayBuffer(file)
  })
}

export function CustomerList() {
  const navigate = useNavigate()
  const [data, setData] = useState<Customer[]>(initialCustomers)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await parseExcelToCustomers(file)
      setData((prev) => [...prev, ...imported])
      toast.success(`${imported.length} pelanggan berhasil diimpor.`)
    } catch {
      toast.error('Gagal mengimpor file Excel.')
    }
    e.target.value = ''
  }

  return (
    <div>
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
      <PageHeader
        title="Pelanggan"
        description="Kelola data pelanggan Anda."
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-1 h-4 w-4" />
              Import Excel
            </Button>
            <Button size="sm" onClick={() => navigate('/customers/new')}>
              <Plus className="mr-1 h-4 w-4" />
              Tambah
            </Button>
          </div>
        }
      />
      <DataTable
        data={data}
        columns={columns}
        searchPlaceholder="Cari nama pelanggan..."
        searchFn={(c, q) => c.name.toLowerCase().includes(q.toLowerCase())}
        filters={filters}
        filterFn={(c, f) =>
          Object.entries(f).every(
            ([key, val]) => c[key as keyof Customer] === val,
          )
        }
        actions={(c) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/customers/${c.id}`)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate(`/customers/${c.id}/edit`)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      />
    </div>
  )
}
