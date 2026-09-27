import { createContext } from "react"
import type { BusinessCategory } from "../types/businesses"

// "unavailable" = the switch endpoint itself failed; treated exactly like "off" so nothing directory-related is exposed.
export type BusinessDirectoryState = "loading" | "enabled" | "disabled" | "unavailable"

/** App-wide, from BusinessDirectoryProvider. Lets the header and other pages show directory links only while it's on. */
export type BusinessDirectoryStatusValue = {
    state: BusinessDirectoryState
    /** true only once the API has confirmed the directory is on */
    enabled: boolean
    /** message from a 403, when the directory was switched off mid-session */
    message: string | null
    refresh: () => void
    markDisabled: (message?: string) => void
}

/** Inside the /community/businesses pages, from BusinessDirectoryLayout. */
export type BusinessDirectoryContextValue = BusinessDirectoryStatusValue & {
    /** From /business-categories, in display order */
    categories: BusinessCategory[]
    /** From /barangays, spelled exactly as the submit endpoint expects */
    barangays: string[]
    optionsLoading: boolean
    optionsFailed: boolean
    reloadOptions: () => void
    /** The API's label for a category slug, or "" until the categories have loaded */
    categoryName: (slug: string) => string
}

export const BusinessDirectoryStatusContext = createContext<BusinessDirectoryStatusValue | null>(null)
export const BusinessDirectoryContext = createContext<BusinessDirectoryContextValue | null>(null)
