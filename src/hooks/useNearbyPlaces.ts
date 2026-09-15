import { useEffect, useState } from "react"
import { fetchPgApi, pgApiEndpoints } from "../lib/pgApi"
import type { NearbyPlaces } from "../types/nearbyPlaces"

type UseNearbyPlacesResult = {
  data: NearbyPlaces | null
  loading: boolean
  error: string | null
}

export function useNearbyPlaces(): UseNearbyPlacesResult {
  const [data, setData] = useState<NearbyPlaces | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await fetchPgApi<NearbyPlaces>(pgApiEndpoints.geography.nearbyPlaces)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load nearby places data")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
