export type GovernanceSource = {
  name: string
  url: string
  accessed: string
}

export type MunicipalCouncilMember = {
  name: string
  role: string
}

export type DepartmentHead = {
  name: string
  office: string | null
}

export type FormerMayor = {
  name: string
  terms: string[]
}

export type GovernanceData = {
  source: GovernanceSource
  municipalMayor: {
    name: string
    displayName: string
    term: string
  }
  municipalCouncil: MunicipalCouncilMember[]
  departmentHeadsAndOffices: DepartmentHead[]
  formerMayors: FormerMayor[]
  ordinanceAndExecutiveOrder: {
    status: string
  }
}
