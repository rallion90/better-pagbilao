export type PublicOfficesSource = {
  name: string
  url: string
  accessed: string
}

export type PublicOffice = {
  office: string
  head: string
  telephone: string | null
  address: string
}

export type PublicOfficesData = {
  municipality: string
  province: string
  sources: PublicOfficesSource[]
  mainOffice: {
    name: string
    address: string
    telephone: string
    emails: string[]
  }
  offices: PublicOffice[]
}
