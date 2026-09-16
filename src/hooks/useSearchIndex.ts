import { useCallback, useState } from "react"
import { loadSearchIndex, type SearchItem } from "../lib/searchIndex"

type UseSearchIndexResult = {
  items: SearchItem[]
  loading: boolean
  error: string | null
  ensureLoaded: () => void
}

export function useSearchIndex(): UseSearchIndexResult {
  const [items, setItems] = useState<SearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requested, setRequested] = useState(false)

  const ensureLoaded = useCallback(() => {
    if (requested) return
    setRequested(true)
    setLoading(true)

    loadSearchIndex()
      .then((result) => setItems(result))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load search index"))
      .finally(() => setLoading(false))
  }, [requested])

  return { items, loading, error, ensureLoaded }
}
