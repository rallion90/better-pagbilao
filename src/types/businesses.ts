export type BusinessCategoryId =
    | "food"
    | "retail"
    | "agri"
    | "services"
    | "health"
    | "transport"
    | "construction"
    | "beauty"
    | "education"
    | "stay"
    | "online"
    | "other"

/** "approximate" coordinates are already offset by the server; "hidden" listings have null coordinates. */
export type PinPrecision = "exact" | "approximate" | "hidden"

export interface BusinessCategory {
    slug: BusinessCategoryId
    name: string
}

// List and detail return the same shape, and every key is always present.
export interface Business {
    /** The slug. Use it in URLs. */
    id: string
    name: string
    category: BusinessCategoryId
    description: string
    productsServices: string | null
    barangay: string
    address: string
    /** Free text, display as-is */
    hours: string | null
    /** Free text: may hold more than one number, or placeholder text ("Not available") when there is none. Use telHref(). */
    phone: string
    /** "facebook.com/..." or a full URL */
    online: string | null
    latitude: number | null
    longitude: number | null
    pinPrecision: PinPrecision
    logoUrl: string | null
    gallery: { url: string }[]
}

export interface BusinessPagination {
    page: number
    perPage: number
    total: number
    lastPage: number
}

export interface BusinessList {
    businesses: Business[]
    pagination: BusinessPagination
}

export interface BusinessListParams {
    q?: string
    category?: string
    barangay?: string
    page?: number
    perPage?: number
}

// Values the API accepts for `employees`. These use an en dash (–), not a hyphen.
export const EMPLOYEE_OPTIONS = ["Just me", "2–5", "6–10", "11–50", "More than 50"] as const
export type EmployeeCount = (typeof EMPLOYEE_OPTIONS)[number]

export interface BusinessSubmission {
    businessName: string
    category: BusinessCategoryId
    productsServices?: string
    description: string
    barangay: string
    address: string
    homeBased?: boolean
    deliversToOtherBarangays?: boolean
    ownerName: string
    showOwnerName?: boolean
    phone: string
    email?: string
    online?: string
    hours?: string
    employees?: EmployeeCount
    yearStarted?: number
    /** Send both or neither */
    latitude?: number
    longitude?: number
    /** Only matters when a pin is sent */
    pinPrecision?: PinPrecision
    consentPublish: boolean
    consentPrivacy: boolean
    consentAccurate: boolean
    logo?: File | null
    gallery?: File[]
}

export interface BusinessSubmitted {
    id: string
    status: "pending"
    message: string
}
