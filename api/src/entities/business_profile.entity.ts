export interface BusinessProfile {
  id: string
  name: string
  businessType: string | null
  phone: string | null
  countryCode: string
  email: string | null
  address: string | null
  whatsappDeviceId: string | null
  iconFilename: string | null
}

export interface UpdateBusinessProfileReq {
  name?: string
  businessType?: string
  phone?: string
  countryCode?: string
  email?: string
  address?: string
  whatsappDeviceId?: string | null
  iconFilename?: string | null
}

export interface BusinessBranding {
  name: string
}
