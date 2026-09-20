import { useCallback, useEffect, useState } from "react"
import { getBarangayNames, getIssueCategories } from "../lib/issuesApi"
import type { IssueCategory } from "../types/issues"

type FormOptions = {
    categories: IssueCategory[]
    barangays: string[]
    loading: boolean
    failed: boolean
    reload: () => void
}

/** Category cards and the barangay dropdown for the report form. Only mount this while reporting is enabled. */
export function useIssueFormOptions(): FormOptions {
    const [categories, setCategories] = useState<IssueCategory[]>([])
    const [barangays, setBarangays] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)
    const [requestId, setRequestId] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        Promise.all([getIssueCategories(controller.signal), getBarangayNames(controller.signal)])
            .then(([nextCategories, nextBarangays]) => {
                setCategories(nextCategories)
                setBarangays(nextBarangays)
                setFailed(false)
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return
                setFailed(true)
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            })

        return () => controller.abort()
    }, [requestId])

    const reload = useCallback(() => {
        setLoading(true)
        setRequestId((id) => id + 1)
    }, [])

    return { categories, barangays, loading, failed, reload }
}
