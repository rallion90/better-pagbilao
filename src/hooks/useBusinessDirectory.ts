import { useCallback, useContext } from "react"
import { IssueApiError } from "../lib/issuesApi"
import { BusinessDirectoryContext } from "./businessDirectoryContext"

export function useBusinessDirectory() {
    const context = useContext(BusinessDirectoryContext)
    if (!context) {
        throw new Error("useBusinessDirectory must be used within a BusinessDirectoryLayout")
    }
    return context
}

/** Returns a handler that swaps the page to the "paused" screen when a directory call answers 403. Returns true if it did. */
export function useDirectoryDisabledHandler() {
    const { markDisabled } = useBusinessDirectory()
    return useCallback(
        (error: unknown) => {
            if (error instanceof IssueApiError && error.kind === "disabled") {
                markDisabled(error.message)
                return true
            }
            return false
        },
        [markDisabled]
    )
}
