import { useEffect, useState } from "react"
import { fetchPgApi, pgApiEndpoints } from "../lib/pgApi"
import type { EmergencyDirectory } from "../types/emergencyDirectory"

type UseEmergencyDirectoryResult = {
  data: EmergencyDirectory | null
  loading: boolean
  error: string | null
}

export function useEmergencyDirectory(): UseEmergencyDirectoryResult {
  const [data, setData] = useState<EmergencyDirectory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await fetchPgApi<EmergencyDirectory>(pgApiEndpoints.core.emergencyDirectory)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load emergency directory")
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
