export interface Contact {
  id: string
  customerId: string
  name: string
  position?: string
  whatsapp?: string
  email?: string
  notes?: string
  isPrimary: boolean
}

export const contacts: Contact[] = [
  { id: 'con1', customerId: 'c1', name: 'Hendra Wijaya', position: 'Direktur', whatsapp: '628111234567', email: 'hendra@majubersama.co.id', isPrimary: true },
  { id: 'con2', customerId: 'c1', name: 'Dewi Kusuma', position: 'Manager Keuangan', whatsapp: '628112222222', email: 'dewi@majubersama.co.id', isPrimary: false },
  { id: 'con3', customerId: 'c2', name: 'Andi Saputra', position: 'CEO', whatsapp: '628221234567', email: 'andi@teknologinusantara.id', isPrimary: true },
  { id: 'con4', customerId: 'c4', name: 'Rini Susanti', position: 'HRD Manager', whatsapp: '628441234567', email: 'rini@anekacorp.com', isPrimary: true },
  { id: 'con5', customerId: 'c5', name: 'Bapak Suroto', position: 'Kepala Dinas', isPrimary: true },
  { id: 'con6', customerId: 'c6', name: 'Kevin Pratama', position: 'Co-Founder', whatsapp: '628661234567', email: 'kevin@innovasi.id', isPrimary: true },
  { id: 'con8', customerId: 'c8', name: 'Ibu Hartini', position: 'Sekretaris', isPrimary: true },
  { id: 'con9', customerId: 'c9', name: 'Ir. Bambang S.', position: 'Direktur Utama', whatsapp: '628991234567', email: 'bambang@megakons.co.id', isPrimary: true },
]
