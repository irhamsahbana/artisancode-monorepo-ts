export interface BusinessProfile {
  name: string
  businessType?: string
  phone?: string
  countryCode?: string
  email?: string
  address?: string
  iconFilename?: string | null
}

export type UpdateBusinessProfileReq = Partial<BusinessProfile>

export interface BusinessBranding {
  name: string
}
