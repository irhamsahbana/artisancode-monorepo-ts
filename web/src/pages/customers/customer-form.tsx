import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { customers, type Customer } from '@/data/customers'
import { masterData } from '@/data/master'

interface FormState {
  name: string
  type: Customer['type']
  categoryId: string
  segmentationId: string
  areaId: string
  status: Customer['status']
  potential: Customer['potential']
  gender: string
  address: string
  birthPlace: string
  dateOfBirth: string
  religion: string
  education: string
  email: string
  spouseName: string
  spouseOccupation: string
  childrenNames: string
  childrenOccupation: string
  character: string
  hobby: string
  companyName: string
  position: string
  companyAddress: string
  whatsapp: string
  notes: string
}

const empty: FormState = {
  name: '',
  type: 'business',
  categoryId: '',
  segmentationId: '',
  areaId: '',
  status: 'prospect',
  potential: 'medium',
  gender: '',
  address: '',
  birthPlace: '',
  dateOfBirth: '',
  religion: '',
  education: '',
  email: '',
  spouseName: '',
  spouseOccupation: '',
  childrenNames: '',
  childrenOccupation: '',
  character: '',
  hobby: '',
  companyName: '',
  position: '',
  companyAddress: '',
  whatsapp: '',
  notes: '',
}

export function CustomerForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = id ? customers.find((c) => c.id === id) : undefined
  const isEdit = !!existing

  const [form, setForm] = useState<FormState>(
    existing
      ? {
          name: existing.name,
          type: existing.type,
          categoryId: existing.categoryId,
          segmentationId: existing.segmentationId,
          areaId: existing.areaId,
          status: existing.status,
          potential: existing.potential,
          gender: existing.gender ?? '',
          address: existing.address ?? '',
          birthPlace: existing.birthPlace ?? '',
          dateOfBirth: existing.dateOfBirth ?? '',
          religion: existing.religion ?? '',
          education: existing.education ?? '',
          email: existing.email ?? '',
          spouseName: existing.spouseName ?? '',
          spouseOccupation: existing.spouseOccupation ?? '',
          childrenNames: existing.childrenNames ?? '',
          childrenOccupation: existing.childrenOccupation ?? '',
          character: existing.character ?? '',
          hobby: existing.hobby ?? '',
          companyName: existing.companyName ?? '',
          position: existing.position ?? '',
          companyAddress: existing.companyAddress ?? '',
          whatsapp: existing.whatsapp ?? '',
          notes: existing.notes ?? '',
        }
      : empty,
  )

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // ponytail: mock only — no API call, just show toast and navigate
    toast.success(isEdit ? 'Pelanggan berhasil diperbarui.' : 'Pelanggan berhasil ditambahkan.')
    navigate(isEdit ? `/customers/${id}` : '/customers')
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">{isEdit ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Nama *">
                <Input
                  required
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Nama pelanggan"
                />
              </Field>
            </div>

            <Field label="Jenis *">
              <Select value={form.type} onValueChange={(v) => set('type', v as Customer['type'])}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Badan Usaha</SelectItem>
                  <SelectItem value="individual">Perorangan</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Kategori *">
              <Select value={form.categoryId} onValueChange={(v) => set('categoryId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>
                  {masterData.customerTypes.filter((t) => t.isActive).map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Segmentasi">
              <Select value={form.segmentationId} onValueChange={(v) => set('segmentationId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Pilih segmentasi" /></SelectTrigger>
                <SelectContent>
                  {masterData.segmentations.filter((s) => s.isActive).map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Area *">
              <Select value={form.areaId} onValueChange={(v) => set('areaId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Pilih area" /></SelectTrigger>
                <SelectContent>
                  {masterData.areas.filter((a) => a.isActive).map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Status *">
              <Select value={form.status} onValueChange={(v) => set('status', v as Customer['status'])}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospek</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Potensi">
              <Select value={form.potential} onValueChange={(v) => set('potential', v as Customer['potential'])}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="WhatsApp">
                <Input
                  value={form.whatsapp}
                  onChange={(e) => set('whatsapp', e.target.value)}
                  placeholder="628xxxxxxxxxx"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="email@contoh.com"
                />
              </Field>
            </div>

            <div className="sm:col-span-2"><Separator /><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">Info Pribadi</p></div>

            <Field label="Jenis Kelamin">
              <Select value={form.gender} onValueChange={(v) => set('gender', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Pilih jenis kelamin" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Laki-laki</SelectItem>
                  <SelectItem value="Female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Tempat Lahir">
              <Input value={form.birthPlace} onChange={(e) => set('birthPlace', e.target.value)} placeholder="Makassar" />
            </Field>

            <Field label="Tanggal Lahir">
              <Input type="date" value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
            </Field>

            <Field label="Agama">
              <Input value={form.religion} onChange={(e) => set('religion', e.target.value)} placeholder="Islam" />
            </Field>

            <Field label="Pendidikan Terakhir">
              <Input value={form.education} onChange={(e) => set('education', e.target.value)} placeholder="Sarjana S-1" />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Alamat">
                <textarea
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Alamat lengkap sesuai KTP/domisili"
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </Field>
            </div>

            <div className="sm:col-span-2"><Separator /><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">Karakter & Hobi</p></div>

            <Field label="Karakter Pelanggan">
              <Input value={form.character} onChange={(e) => set('character', e.target.value)} placeholder="Suka nego, dll." />
            </Field>

            <Field label="Hobi">
              <Input value={form.hobby} onChange={(e) => set('hobby', e.target.value)} placeholder="Olahraga, golf, dll." />
            </Field>

            <div className="sm:col-span-2"><Separator /><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">Info Keluarga</p></div>

            <Field label="Nama Suami/Istri">
              <Input value={form.spouseName} onChange={(e) => set('spouseName', e.target.value)} />
            </Field>

            <Field label="Pekerjaan Suami/Istri">
              <Input value={form.spouseOccupation} onChange={(e) => set('spouseOccupation', e.target.value)} />
            </Field>

            <Field label="Nama Anak Kandung">
              <Input value={form.childrenNames} onChange={(e) => set('childrenNames', e.target.value)} />
            </Field>

            <Field label="Pekerjaan Anak">
              <Input value={form.childrenOccupation} onChange={(e) => set('childrenOccupation', e.target.value)} />
            </Field>

            <div className="sm:col-span-2"><Separator /><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">Info Perusahaan</p></div>

            <Field label="Nama Perusahaan">
              <Input value={form.companyName} onChange={(e) => set('companyName', e.target.value)} />
            </Field>

            <Field label="Jabatan">
              <Input value={form.position} onChange={(e) => set('position', e.target.value)} />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Alamat Perusahaan">
                <textarea
                  value={form.companyAddress}
                  onChange={(e) => set('companyAddress', e.target.value)}
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </Field>
            </div>

            <div className="sm:col-span-2"><Separator /></div>

            <div className="sm:col-span-2">
              <Field label="Catatan">
                <textarea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Catatan tambahan..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </Field>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Batal
              </Button>
              <Button type="submit">{isEdit ? 'Simpan Perubahan' : 'Tambah Pelanggan'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
