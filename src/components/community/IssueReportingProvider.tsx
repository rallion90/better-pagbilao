import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { IssueReportingContext } from "../../hooks/issueReportingContext"
import type { IssueReportingContextValue, IssueReportingState } from "../../hooks/issueReportingContext"
import { getIssueReportingStatus } from "../../lib/issuesApi"

export const IssueReportingProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<IssueReportingState>("loading")
    const [message, setMessage] = useState<string | null>(null)
    const [requestId, setRequestId] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        getIssueReportingStatus(controller.signal)
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

    const value = useMemo<IssueReportingContextValue>(
        () => ({ state, enabled: state === "enabled", message, refresh, markDisabled }),
        [state, message, refresh, markDisabled]
    )

    return <IssueReportingContext.Provider value={value}>{children}</IssueReportingContext.Provider>
}
