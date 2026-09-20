import { useCallback, useEffect, useState } from "react"
import { fetchPgApi, pgApiEndpoints } from "../lib/pgApi"
import type { BarangaysData } from "../types/barangays"

type UseBarangaysResult = {
  data: BarangaysData | null
  loading: boolean
  error: string | null
  reload: () => void
}

export function useBarangays(): UseBarangaysResult {
  const [data, setData] = useState<BarangaysData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [requestId, setRequestId] = useState(0)
  const [settledId, setSettledId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchPgApi<BarangaysData>(pgApiEndpoints.geography.barangays)
      .then((result) => {
        if (cancelled) return
        setData(result)
        setError(null)
        setSettledId(requestId)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load barangay data")
        setSettledId(requestId)
      })

    return () => {
      cancelled = true
    }
  }, [requestId])

  const reload = useCallback(() => setRequestId((id) => id + 1), [])

  return { data, loading: settledId !== requestId, error, reload }
}
