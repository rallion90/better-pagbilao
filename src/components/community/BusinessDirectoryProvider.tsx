import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { BusinessDirectoryStatusContext } from "../../hooks/businessDirectoryContext"
import type { BusinessDirectoryState, BusinessDirectoryStatusValue } from "../../hooks/businessDirectoryContext"
import { getBusinessDirectoryStatus } from "../../lib/businessApi"

/** Checks GET /business-directory-status once on app load, like IssueReportingProvider does for reporting. */
export const BusinessDirectoryProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<BusinessDirectoryState>("loading")
    const [message, setMessage] = useState<string | null>(null)
    const [requestId, setRequestId] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        getBusinessDirectoryStatus(controller.signal)
            .then((enabled) => {
                setMessage(null)
                setState(enabled ? "enabled" : "disabled")
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return
                setState("unavailable")
            })

        return () => controller.abort()
    }, [requestId])

    const refresh = useCallback(() => setRequestId((id) => id + 1), [])
    const markDisabled = useCallback((next?: string) => {
        setMessage(next ?? null)
        setState("disabled")
    }, [])

    const value = useMemo<BusinessDirectoryStatusValue>(
        () => ({ state, enabled: state === "enabled", message, refresh, markDisabled }),
        [state, message, refresh, markDisabled]
    )

    return <BusinessDirectoryStatusContext.Provider value={value}>{children}</BusinessDirectoryStatusContext.Provider>
}
