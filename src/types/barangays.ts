export interface BarangayProfile {
    name: string
    alternateName?: string
    type: string
    punongBarangay: string | null
    barangayCaptain: string | null
    contactNumber: string | null
    landAreaHectares: number
    population?: { count: number; year: number } | null
    households?: { count: number; year: number } | null
    landmarksFacilities?: string[]
    psgc: { tenDigitCode: string; correspondenceCode: string }
    psa: { urbanRural: "Urban" | "Rural"; population2024: number; populationSource: string }
}

export interface BarangaysData {
    source?: { name: string; url: string; accessed: string }
    sources?: { name: string; url: string; accessed: string }[]
    barangays: BarangayProfile[]
}
