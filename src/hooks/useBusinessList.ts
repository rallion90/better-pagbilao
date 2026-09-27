import { useCallback, useEffect, useState } from "react"
import { listBusinesses } from "../lib/businessApi"
import type { Business, BusinessPagination } from "../types/businesses"
import { useDirectoryDisabledHandler } from "./useBusinessDirectory"

export type BusinessFilters = {
    q: string
    category: string
    barangay: string
    page: number
}

export const BUSINESS_PAGE_SIZE = 12

type Settled = { key: string; businesses: Business[]; pagination: BusinessPagination | null; failed: boolean }

type UseBusinessListResult = {
    businesses: Business[]
    pagination: BusinessPagination | null
    loading: boolean
    failed: boolean
    reload: () => void
}

/** Approved listings (GET /businesses) for one page of results. Debounce the search text before passing it in. */
export function useBusinessList(filters: BusinessFilters): UseBusinessListResult {
    const { q, category, barangay, page } = filters
    const handleDisabled = useDirectoryDisabledHandler()
    const [requestId, setRequestId] = useState(0)
    const [settled, setSettled] = useState<Settled | null>(null)

    // Loading is derived: results are pending until a response for exactly this query has arrived.
    const queryKey = JSON.stringify([q, category, barangay, page, requestId])
    const current = settled?.key === queryKey ? settled : null

    useEffect(() => {
        const controller = new AbortController()

        listBusinesses({ q, category, barangay, page, perPage: BUSINESS_PAGE_SIZE }, controller.signal)
            .then((result) => setSettled({ key: queryKey, businesses: result.businesses, pagination: result.pagination, failed: false }))
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return
                if (handleDisabled(error)) return
                setSettled({ key: queryKey, businesses: [], pagination: null, failed: true })
            })

        return () => controller.abort()
    }, [queryKey, q, category, barangay, page, handleDisabled])

    const reload = useCallback(() => setRequestId((id) => id + 1), [])

    return {
        // Keep the previous page on screen (and its pins on the map) while the next one loads.
        businesses: (current ?? settled)?.businesses ?? [],
        pagination: (current ?? settled)?.pagination ?? null,
        loading: current === null,
        failed: current?.failed ?? false,
        reload,
    }
}
