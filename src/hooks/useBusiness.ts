import { useCallback, useEffect, useState } from "react"
import { getBusiness } from "../lib/businessApi"
import { IssueApiError } from "../lib/issuesApi"
import type { Business } from "../types/businesses"
import { useDirectoryDisabledHandler } from "./useBusinessDirectory"

type Settled = { key: string; business: Business | null; notFound: boolean; failed: boolean }

type UseBusinessResult = {
    business: Business | null
    loading: boolean
    /** 404: unknown, pending or rejected listing */
    notFound: boolean
    failed: boolean
    reload: () => void
}

/** One approved listing (GET /businesses/{slug}). */
export function useBusiness(slug: string): UseBusinessResult {
    const handleDisabled = useDirectoryDisabledHandler()
    const [requestId, setRequestId] = useState(0)
    const [settled, setSettled] = useState<Settled | null>(null)

    const key = JSON.stringify([slug, requestId])
    const current = settled?.key === key ? settled : null

    useEffect(() => {
        const controller = new AbortController()

        getBusiness(slug, controller.signal)
            .then((business) => setSettled({ key, business, notFound: false, failed: false }))
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return
                if (handleDisabled(error)) return
                const notFound = error instanceof IssueApiError && error.kind === "not-found"
                setSettled({ key, business: null, notFound, failed: !notFound })
            })

        return () => controller.abort()
    }, [key, slug, handleDisabled])

    const reload = useCallback(() => setRequestId((id) => id + 1), [])

    return {
        business: current?.business ?? null,
        loading: current === null,
        notFound: current?.notFound ?? false,
        failed: current?.failed ?? false,
        reload,
    }
}
