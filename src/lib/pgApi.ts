export const pgApiEndpoints = {
  catalog: "/api/index.json",
  core: {
    siteData: "/api/core/site-data.json",
    governance: "/api/core/governance.json",
    publicOffices: "/api/core/public-offices.json",
    emergencyDirectory: "/api/core/emergency-directory.json",
    formsAndDocuments: "/api/core/forms-and-documents.json",
  },
  geography: {
    barangays: "/api/geography/barangays.json",
    psgcBarangays: "/api/geography/psgc-barangays.json",
    nearbyPlaces: "/api/geography/nearby-places.json",
  },
  demographics: {
    demographics2020: "/api/demographics/demographics-2020.json",
    populationHistory: "/api/demographics/population-history.json",
  },
  tourism: {
    tourism: "/api/tourism/tourism.json",
    tourismEvents: "/api/tourism/tourism-events.json",
    touristDestinations: "/api/tourism/tourist-destinations.json",
  },
} as const

export type PgApiEndpoint = string

export async function fetchPgApi<T>(endpoint: PgApiEndpoint): Promise<T> {
  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`)
  }

  return response.json() as Promise<T>
}
