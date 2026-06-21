export interface BusinessProfile {
  id: string
  name: string
  businessType: string | null
  phone: string | null
  email: string | null
  address: string | null
}

export interface UpdateBusinessProfileReq {
  company_id: string
  name?: string
  businessType?: string
  phone?: string
  email?: string
  address?: string
}
