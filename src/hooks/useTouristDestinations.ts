import { useEffect, useState } from "react"
import { fetchPgApi, pgApiEndpoints } from "../lib/pgApi"
import type { TouristDestinationsData } from "../types/touristDestinations"

type UseTouristDestinationsResult = {
  data: TouristDestinationsData | null
  loading: boolean
  error: string | null
}

export function useTouristDestinations(): UseTouristDestinationsResult {
  const [data, setData] = useState<TouristDestinationsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await fetchPgApi<TouristDestinationsData>(pgApiEndpoints.tourism.touristDestinations)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load tourist destinations data")
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
