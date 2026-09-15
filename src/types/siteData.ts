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

export type SiteGeography = {
  description: string
  boundaries: {
    northeast: string
    northwest: string
    southeast: string
    southwest: string
  }
  landAreaHectares: number
  barangayCount: number
  ruralBarangayCount: number
  urbanBarangayCount: number
}

export type SiteTopography = {
  highestElevationArea: string
  lowestElevationArea: string
  clusters: string[]
}

export type SiteInfrastructure = {
  transportation: string[]
  majorRoads: string[]
}

export type SiteData = {
  contact: SiteContact
  about: {
    geography: SiteGeography
    topography: SiteTopography
  }
  infrastructure: SiteInfrastructure
}
