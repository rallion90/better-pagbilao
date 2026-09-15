import { useEffect, useState } from "react"
import { fetchPgApi, pgApiEndpoints } from "../lib/pgApi"
import type { ServicesData } from "../types/services"

type UseServicesResult = {
  data: ServicesData | null
  loading: boolean
  error: string | null
}

export function useServices(): UseServicesResult {
  const [data, setData] = useState<ServicesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await fetchPgApi<ServicesData>(pgApiEndpoints.core.services)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load services data")
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
