export interface MasterItem { id: string; name: string; isActive: boolean }
export interface MasterData {
  customerTypes: MasterItem[]
  segmentations: MasterItem[]
  areas: MasterItem[]
  relationStatuses: MasterItem[]
}

export const masterData: MasterData = {
  customerTypes: [
    { id: 'ct1', name: 'Perorangan', isActive: true },
    { id: 'ct2', name: 'Badan Usaha', isActive: true },
    { id: 'ct3', name: 'Instansi Pemerintah', isActive: true },
    { id: 'ct4', name: 'Yayasan', isActive: false },
  ],
  segmentations: [
    { id: 'seg1', name: 'UMKM', isActive: true },
    { id: 'seg2', name: 'Korporat', isActive: true },
    { id: 'seg3', name: 'Enterprise', isActive: true },
    { id: 'seg4', name: 'Startup', isActive: true },
    { id: 'seg5', name: 'Freelancer', isActive: false },
  ],
  areas: [
    { id: 'area1', name: 'Jakarta Selatan', isActive: true },
    { id: 'area2', name: 'Jakarta Barat', isActive: true },
    { id: 'area3', name: 'Bandung', isActive: true },
    { id: 'area4', name: 'Surabaya', isActive: true },
    { id: 'area5', name: 'Yogyakarta', isActive: true },
    { id: 'area6', name: 'Medan', isActive: false },
  ],
  relationStatuses: [
    { id: 'rs1', name: 'Prospek', isActive: true },
    { id: 'rs2', name: 'Aktif', isActive: true },
    { id: 'rs3', name: 'Tidak Aktif', isActive: true },
    { id: 'rs4', name: 'Blacklist', isActive: false },
  ],
}
