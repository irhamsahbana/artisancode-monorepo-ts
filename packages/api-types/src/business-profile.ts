export interface BusinessProfile {
  name: string
  businessType?: string
  phone?: string
  email?: string
  address?: string
}

export type UpdateBusinessProfileReq = Partial<BusinessProfile>
