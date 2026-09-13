export type SiteContactHotline = {
  name: string
  telephone: string
}

export type SiteContact = {
  office: string
  address: string
  telephone: string
  emails: string[]
  hotlines: SiteContactHotline[]
}

export type SiteData = {
  contact: SiteContact
}
