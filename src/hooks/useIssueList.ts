import { useCallback, useEffect, useState } from "react"
import { listIssues } from "../lib/issuesApi"
import type { Issue, IssueListSummary, IssuePagination, IssueStatus } from "../types/issues"

export type IssueFilters = {
    q: string
    category: string
    barangay: string
    status: IssueStatus | ""
}

const PER_PAGE = 50
const SEARCH_DEBOUNCE_MS = 300

type Settled = { key: string; issues: Issue[]; pagination: IssuePagination | null; failed: boolean }

type UseIssueListResult = {
    issues: Issue[]
    /** Totals for the whole public list, not affected by the filters */
    summary: IssueListSummary | null
    hasMore: boolean
    loading: boolean
    loadingMore: boolean
    failed: boolean
    loadMore: () => void
    reload: () => void
}

/** Public reports (GET /issues). Filters are applied by the API; the search text is debounced. */
export function useIssueList(filters: IssueFilters): UseIssueListResult {
    const { category, barangay, status } = filters
    const [debouncedQuery, setDebouncedQuery] = useState(filters.q.trim())
    const [requestId, setRequestId] = useState(0)
    const [settled, setSettled] = useState<Settled | null>(null)
    const [summary, setSummary] = useState<IssueListSummary | null>(null)
    const [loadingMore, setLoadingMore] = useState(false)

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedQuery(filters.q.trim()), SEARCH_DEBOUNCE_MS)
        return () => window.clearTimeout(timer)
    }, [filters.q])

    // Loading is derived: results are pending until a response for exactly this query has arrived.
    const queryKey = JSON.stringify([debouncedQuery, category, barangay, status, requestId])
    const current = settled?.key === queryKey ? settled : null

    useEffect(() => {
        const controller = new AbortController()

        listIssues({ q: debouncedQuery, category, barangay, status, perPage: PER_PAGE, page: 1 }, controller.signal)
            .then((result) => {
                setSettled({ key: queryKey, issues: result.issues, pagination: result.pagination, failed: false })
                if (!debouncedQuery && !category && !barangay && !status) setSummary(result.summary)
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return
                setSettled({ key: queryKey, issues: [], pagination: null, failed: true })
            })

        return () => controller.abort()
    }, [queryKey, debouncedQuery, category, barangay, status])

    const pagination = current?.pagination ?? null
    const hasMore = pagination !== null && pagination.page < pagination.lastPage

    const loadMore = useCallback(() => {
        if (!current || !pagination || pagination.page >= pagination.lastPage || loadingMore) return
        setLoadingMore(true)

        listIssues({ q: debouncedQuery, category, barangay, status, perPage: PER_PAGE, page: pagination.page + 1 })
            .then((result) => {
                setSettled((now) =>
                    now && now.key === current.key
                        ? {
                              ...now,
                              issues: [...now.issues, ...result.issues.filter((issue) => !now.issues.some((known) => known.trackingCode === issue.trackingCode))],
                              pagination: result.pagination,
                          }
                        : now
                )
            })
            .catch(() => {
                // the next "show more" press tries again
            })
            .finally(() => setLoadingMore(false))
    }, [current, pagination, loadingMore, debouncedQuery, category, barangay, status])

    const reload = useCallback(() => setRequestId((id) => id + 1), [])

    return {
        // Keep the previous pins on the map while a new filter is loading.
        issues: (current ?? settled)?.issues ?? [],
        summary,
        hasMore,
        loading: current === null,
        loadingMore,
        failed: current?.failed ?? false,
        loadMore,
        reload,
    }
}
