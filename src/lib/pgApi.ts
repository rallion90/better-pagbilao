export const PG_API_BASE = "https://api-v2.betterpagbilao.org/api"

export const pgApiEndpoints = {
  core: {
    siteData: `${PG_API_BASE}/site-data`,
    governance: `${PG_API_BASE}/governance`,
    publicOffices: `${PG_API_BASE}/public-offices`,
    emergencyDirectory: `${PG_API_BASE}/emergency-directory`,
    formsAndDocuments: `${PG_API_BASE}/forms-and-documents`,
    services: `${PG_API_BASE}/services`,
  },
  geography: {
    barangays: `${PG_API_BASE}/barangays`,
    psgcBarangays: `${PG_API_BASE}/psgc-barangays`,
    nearbyPlaces: `${PG_API_BASE}/nearby-places`,
  },
  demographics: {
    demographics2020: `${PG_API_BASE}/demographics-2020`,
    populationHistory: `${PG_API_BASE}/population-history`,
  },
  tourism: {
    tourism: `${PG_API_BASE}/tourism`,
    tourismEvents: `${PG_API_BASE}/tourism-events`,
    touristDestinations: `${PG_API_BASE}/tourist-destinations`,
  },
} as const

export type PgApiEndpoint = string

type PgApiEnvelope<T> = {
  ok: boolean
  name: string
  data: T
  error?: string
}

export async function fetchPgApi<T>(endpoint: PgApiEndpoint): Promise<T> {
  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`)
  }

  const envelope = (await response.json()) as PgApiEnvelope<T>

  if (!envelope.ok) {
    throw new Error(envelope.error || `API reported failure for ${endpoint}`)
  }

  return envelope.data
}
