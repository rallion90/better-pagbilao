import { createContext } from "react"
import type { BusinessCategory } from "../types/businesses"

// "unavailable" = the switch endpoint itself failed; treated exactly like "off" so nothing directory-related is exposed.
export type BusinessDirectoryState = "loading" | "enabled" | "disabled" | "unavailable"

export type BusinessDirectoryContextValue = {
    state: BusinessDirectoryState
    /** message from a 403, when the directory was switched off mid-session */
    message: string | null
    refresh: () => void
    markDisabled: (message?: string) => void
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

export const BusinessDirectoryContext = createContext<BusinessDirectoryContextValue | null>(null)
