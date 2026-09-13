export type EmergencySource = {
  name: string
  url: string
  accessed: string
}

export type EmergencyHotline = {
  agency: string
  telephone: string
  alternateTelephone?: string
  category: string
}

export type MunicipalContact = {
  office: string
  address: string
  telephone: string
  emails: string[]
}

export type EmergencyDirectory = {
  municipality: string
  province: string
  sources: EmergencySource[]
  hotlines: EmergencyHotline[]
  municipalContact: MunicipalContact
}
