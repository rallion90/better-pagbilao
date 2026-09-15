export type ServiceSource = {
  name: string
  url: string
  accessed: string
  note?: string
}

export type OfficeCoordinates = {
  latitude: number
  longitude: number
}

export type HealthServiceOffice = {
  name: string
  facility?: string
  head: string
  address: string
  telephone: string
}

export type TypicalHealthServiceEntry = {
  category: string
  targetGroup?: string
  typicalCoverage: string[]
  typicalRequirements?: string[]
  typicalFee: string
}

export type HealthServiceCategory = {
  id: "health-services"
  label: string
  municipality: string
  province: string
  dataConfidence: string
  confirmed: {
    office: HealthServiceOffice
    sources: ServiceSource[]
  }
  typicalServices: {
    note: string
    categories: TypicalHealthServiceEntry[]
  }
  howToAvail: {
    generalSteps: string[]
    commonRequirements: string[]
    hoursNote: string
  }
  verificationGuide: {
    recommendation: string
    howToConfirm: string[]
  }
}

export type DisasterOffice = {
  name: string
  head: string
  address: string
  telephone: string
  coordinates: OfficeCoordinates
}

export type EmergencyHotline = {
  agency: string
  telephone: string
  alternateTelephone?: string
  category: string
}

export type TypicalDisasterServiceEntry = {
  category: string
  office: string
  typicalCoverage: string[]
  typicalRequirements?: string[]
  typicalFee: string
}

export type DisasterServiceCategory = {
  id: "disaster-and-safety"
  label: string
  municipality: string
  province: string
  dataConfidence: string
  confirmed: {
    offices: DisasterOffice[]
    emergencyHotlines: EmergencyHotline[]
    sources: ServiceSource[]
  }
  typicalServices: {
    note: string
    categories: TypicalDisasterServiceEntry[]
  }
  howToAvail: {
    emergencySteps: string[]
    nonEmergencySteps: string[]
    hoursNote: string
  }
  verificationGuide: {
    recommendation: string
    howToConfirm: string[]
  }
}

export type AgricultureOffice = {
  name: string
  head: string
  address: string
  telephone: string | null
  coordinates: OfficeCoordinates
}

export type AgriculturalProfile = {
  note: string
  agriculturalLandHectares: number
  agriculturalLandPercentOfTotalLand: number
  coconutCropAreaHectares: number
  irrigatedLowlandRiceHectares: number
  otherCropsHectares: number
  fishpondsAndBreakwatersHectares: number
  specialAgriculturalAndFisheriesDevelopmentZoneHectares: number
  mainIndustries: string[]
}

export type TypicalAgricultureServiceEntry = {
  category: string
  office: string
  typicalCoverage: string[]
  typicalRequirements?: string[]
  typicalFee: string
}

export type AgricultureServiceCategory = {
  id: "agriculture-and-livelihood"
  label: string
  municipality: string
  province: string
  dataConfidence: string
  confirmed: {
    offices: AgricultureOffice[]
    agriculturalProfile: AgriculturalProfile
    sources: ServiceSource[]
  }
  typicalServices: {
    note: string
    categories: TypicalAgricultureServiceEntry[]
  }
  howToAvail: {
    generalSteps: string[]
    commonRequirements: string[]
    hoursNote: string
  }
  verificationGuide: {
    recommendation: string
    howToConfirm: string[]
  }
}

export type SocialWelfareOffice = {
  name: string
  head: string
  address: string
  telephone: string
  mandate: string
}

export type SocialWelfareFacility = {
  name: string
  legalBasis?: string
  description: string
}

export type SocialWelfareGeneralInquiry = {
  telephone: string
  email: string
  note: string
}

export type TypicalSocialWelfareEntry = {
  category: string
  typicalCoverage: string[]
  typicalRequirements?: string[]
  typicalFee: string
}

export type SocialWelfareCategory = {
  id: "social-welfare"
  label: string
  municipality: string
  province: string
  dataConfidence: string
  confirmed: {
    office: SocialWelfareOffice
    facilities: SocialWelfareFacility[]
    generalInquiry: SocialWelfareGeneralInquiry
    sources: ServiceSource[]
  }
  typicalServices: {
    note: string
    categories: TypicalSocialWelfareEntry[]
  }
  howToAvail: {
    generalSteps: string[]
    commonRequirements: string[]
    hoursNote: string
  }
  verificationGuide: {
    recommendation: string
    howToConfirm: string[]
  }
}

export type BusinessOffice = {
  name: string
  head: string
  address: string
  telephone: string
}

export type BusinessOneStopShop = {
  name: string
  description: string
  note: string
}

export type DownloadableFormItem = {
  title: string
  type: string
  url: string
}

export type DownloadableFormSection = {
  section: string
  note?: string
  items: DownloadableFormItem[]
}

export type TypicalBusinessServiceEntry = {
  category: string
  office: string
  typicalCoverage: string[]
  typicalRequirements?: string[]
  typicalFee: string
}

export type BusinessAndPermitsCategory = {
  id: "business-and-permits"
  label: string
  municipality: string
  province: string
  dataConfidence: string
  confirmed: {
    offices: BusinessOffice[]
    businessOneStopShop: BusinessOneStopShop
    downloadableForms: DownloadableFormSection[]
    sources: ServiceSource[]
  }
  typicalServices: {
    note: string
    categories: TypicalBusinessServiceEntry[]
  }
  howToAvail: {
    generalSteps: string[]
    commonRequirements: string[]
    hoursNote: string
  }
  verificationGuide: {
    recommendation: string
    howToConfirm: string[]
  }
}

export type ServiceCategory =
  | HealthServiceCategory
  | DisasterServiceCategory
  | AgricultureServiceCategory
  | SocialWelfareCategory
  | BusinessAndPermitsCategory

export type ServicesData = {
  categories: ServiceCategory[]
}
