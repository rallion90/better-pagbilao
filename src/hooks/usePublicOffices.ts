import { useEffect, useState } from "react"
import { fetchPgApi, pgApiEndpoints } from "../lib/pgApi"
import type { PublicOfficesData } from "../types/publicOffices"

type UsePublicOfficesResult = {
  data: PublicOfficesData | null
  loading: boolean
  error: string | null
}

export function usePublicOffices(): UsePublicOfficesResult {
  const [data, setData] = useState<PublicOfficesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await fetchPgApi<PublicOfficesData>(pgApiEndpoints.core.publicOffices)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load public offices data")
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
