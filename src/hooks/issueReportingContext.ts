import { createContext } from "react"

// "unavailable" = the switch endpoint itself failed; treated exactly like "off" so nothing reporting-related is exposed.
export type IssueReportingState = "loading" | "enabled" | "disabled" | "unavailable"

export type IssueReportingContextValue = {
    state: IssueReportingState
    /** true only once the API has confirmed reporting is on */
    enabled: boolean
    /** message from a 403, when reporting was switched off mid-session */
    message: string | null
    refresh: () => void
    markDisabled: (message?: string) => void
}

export const IssueReportingContext = createContext<IssueReportingContextValue | null>(null)
