import { useContext } from "react"
import { IssueReportingContext } from "./issueReportingContext"

export function useIssueReporting() {
    const context = useContext(IssueReportingContext)
    if (!context) {
        throw new Error("useIssueReporting must be used within an IssueReportingProvider")
    }
    return context
}
