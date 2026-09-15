import { useEffect, useState } from "react"
import { fetchPgApi, pgApiEndpoints } from "../lib/pgApi"
import type { FormsAndDocumentsData } from "../types/formsAndDocuments"

type UseFormsAndDocumentsResult = {
  data: FormsAndDocumentsData | null
  loading: boolean
  error: string | null
}

export function useFormsAndDocuments(): UseFormsAndDocumentsResult {
  const [data, setData] = useState<FormsAndDocumentsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await fetchPgApi<FormsAndDocumentsData>(pgApiEndpoints.core.formsAndDocuments)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load forms and documents")
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
