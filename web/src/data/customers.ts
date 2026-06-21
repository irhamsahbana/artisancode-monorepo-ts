export interface Customer {
  id: string
  name: string
  type: 'individual' | 'business'
  categoryId: string
  segmentationId: string
  areaId: string
  status: 'prospect' | 'active' | 'inactive'
  potential: 'high' | 'medium' | 'low'
  hasContractHistory: boolean
  lastRevenue?: number
  lastContractYear?: number
  primaryContactId?: string
  // personal
  gender?: 'Male' | 'Female'
  address?: string
  birthPlace?: string
  dateOfBirth?: string
  religion?: string
  education?: string
  email?: string
  // family
  spouseName?: string
  spouseOccupation?: string
  childrenNames?: string
  childrenOccupation?: string
  // traits
  character?: string
  hobby?: string
  // company
  companyName?: string
  position?: string
  companyAddress?: string
  whatsapp?: string
  notes?: string
  createdAt: string
}

export const customers: Customer[] = [
  {
    id: 'c1',
    name: 'PT Maju Bersama',
    type: 'business',
    categoryId: 'ct2',
    segmentationId: 'seg2',
    areaId: 'area1',
    status: 'active',
    potential: 'high',
    hasContractHistory: true,
    lastRevenue: 50000000,
    lastContractYear: 2024,
    primaryContactId: 'con1',
    whatsapp: '628111234567',
    notes: 'Klien lama, loyal.',
    createdAt: '2023-01-15',
  },
  {
    id: 'c2',
    name: 'CV Teknologi Nusantara',
    type: 'business',
    categoryId: 'ct2',
    segmentationId: 'seg1',
    areaId: 'area3',
    status: 'active',
    potential: 'medium',
    hasContractHistory: true,
    lastRevenue: 18000000,
    lastContractYear: 2023,
    primaryContactId: 'con3',
    whatsapp: '628221234567',
    createdAt: '2022-06-20',
  },
  {
    id: 'c3',
    name: 'Budi Santoso',
    type: 'individual',
    categoryId: 'ct1',
    segmentationId: 'seg5',
    areaId: 'area2',
    status: 'prospect',
    potential: 'low',
    hasContractHistory: false,
    whatsapp: '628331234567',
    createdAt: '2024-03-10',
  },
  {
    id: 'c4',
    name: 'PT Aneka Solusi Digital',
    type: 'business',
    categoryId: 'ct2',
    segmentationId: 'seg3',
    areaId: 'area1',
    status: 'prospect',
    potential: 'high',
    hasContractHistory: false,
    primaryContactId: 'con4',
    whatsapp: '628441234567',
    createdAt: '2024-05-01',
  },
  {
    id: 'c5',
    name: 'Dinas Pendidikan Kota Bandung',
    type: 'business',
    categoryId: 'ct3',
    segmentationId: 'seg2',
    areaId: 'area3',
    status: 'inactive',
    potential: 'medium',
    hasContractHistory: true,
    lastRevenue: 75000000,
    lastContractYear: 2022,
    primaryContactId: 'con5',
    createdAt: '2021-09-01',
  },
  {
    id: 'c6',
    name: 'Startup Inovasi Indonesia',
    type: 'business',
    categoryId: 'ct2',
    segmentationId: 'seg4',
    areaId: 'area5',
    status: 'active',
    potential: 'high',
    hasContractHistory: true,
    lastRevenue: 30000000,
    lastContractYear: 2024,
    primaryContactId: 'con6',
    whatsapp: '628661234567',
    createdAt: '2023-07-12',
  },
  {
    id: 'c7',
    name: 'Siti Rahayu',
    type: 'individual',
    categoryId: 'ct1',
    segmentationId: 'seg5',
    areaId: 'area4',
    status: 'active',
    potential: 'low',
    hasContractHistory: false,
    whatsapp: '628771234567',
    createdAt: '2024-01-20',
  },
  {
    id: 'c8',
    name: 'Yayasan Peduli Bangsa',
    type: 'business',
    categoryId: 'ct4',
    segmentationId: 'seg1',
    areaId: 'area1',
    status: 'prospect',
    potential: 'medium',
    hasContractHistory: false,
    primaryContactId: 'con8',
    createdAt: '2024-04-05',
  },
  {
    id: 'c9',
    name: 'PT Mega Konstruksi',
    type: 'business',
    categoryId: 'ct2',
    segmentationId: 'seg3',
    areaId: 'area4',
    status: 'active',
    potential: 'high',
    hasContractHistory: true,
    lastRevenue: 120000000,
    lastContractYear: 2024,
    primaryContactId: 'con9',
    whatsapp: '628991234567',
    createdAt: '2020-11-30',
  },
  {
    id: 'c10',
    name: 'Ahmad Fauzi',
    type: 'individual',
    categoryId: 'ct1',
    segmentationId: 'seg5',
    areaId: 'area2',
    status: 'inactive',
    potential: 'low',
    hasContractHistory: true,
    lastRevenue: 5000000,
    lastContractYear: 2021,
    createdAt: '2021-03-14',
  },
]
