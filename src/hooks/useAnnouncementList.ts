import { useCallback, useEffect, useRef, useState } from "react"
import { AnnouncementApiError, listAnnouncements } from "../lib/announcementsApi"
import type { AnnouncementList, AnnouncementListParams } from "../types/announcements"

type Settled = { key: string; error: AnnouncementApiError | null }

type UseAnnouncementListResult = {
    /** The newest successful result. Kept on screen while a new query loads or when a refresh fails. */
    list: AnnouncementList | null
    /** true until the current query has answered (success or failure) */
    loading: boolean
    error: AnnouncementApiError | null
    reload: () => void
}

type Options = {
    /** refresh on this interval without flashing a loading state */
    refreshMs?: number
    /** called when the API rejects the filters (422), so the caller can reset them */
    onInvalid?: () => void
}

/** GET /announcements for the given filters. */
export function useAnnouncementList(params: AnnouncementListParams, { refreshMs, onInvalid }: Options = {}): UseAnnouncementListResult {
    const key = JSON.stringify(params)
    const [settled, setSettled] = useState<Settled | null>(null)
    const [list, setList] = useState<AnnouncementList | null>(null)
    const [attempt, setAttempt] = useState(0)
    const onInvalidRef = useRef(onInvalid)

    useEffect(() => {
        onInvalidRef.current = onInvalid
    }, [onInvalid])

    useEffect(() => {
        const controller = new AbortController()

        listAnnouncements(JSON.parse(key) as AnnouncementListParams, controller.signal)
            .then((result) => {
                setList(result)
                setSettled({ key, error: null })
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return
                const failure = error instanceof AnnouncementApiError ? error : new AnnouncementApiError("server", "Unexpected error")
                setSettled({ key, error: failure })
                if (failure.kind === "validation") onInvalidRef.current?.()
            })

        return () => controller.abort()
    }, [key, attempt])

    useEffect(() => {
        if (!refreshMs) return
        const timer = window.setInterval(() => setAttempt((count) => count + 1), refreshMs)
        return () => window.clearInterval(timer)
    }, [refreshMs])

    const reload = useCallback(() => setAttempt((count) => count + 1), [])
    const current = settled?.key === key ? settled : null

    return { list, loading: current === null, error: current?.error ?? null, reload }
}
