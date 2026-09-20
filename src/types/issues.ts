export type IssueStatus = "new" | "under_review" | "in_progress" | "resolved" | "rejected"

export interface IssueCategory {
    slug: string
    name: string
}

export interface IssueCategoryRef {
    slug: string
    name: string
}

// The API has not been observed returning photos or updates yet, so both are read defensively (see issuesApi.photoUrl).
export type IssuePhoto = string | { url?: string; path?: string; thumbnailUrl?: string }

export interface IssueUpdate {
    status?: IssueStatus | null
    statusLabel?: string | null
    message?: string | null
    note?: string | null
    createdAt?: string | null
    [key: string]: unknown
}

export interface Issue {
    trackingCode: string
    title: string
    description: string
    category: IssueCategoryRef | null
    barangay: string
    locationText: string | null
    latitude: number | null
    longitude: number | null
    status: IssueStatus
    statusLabel: string
    assignedOffice: string | null
    photos: IssuePhoto[]
    submittedAt: string | null
    resolvedAt: string | null
    updates?: IssueUpdate[]
}

export interface IssuePagination {
    page: number
    perPage: number
    total: number
    lastPage: number
}

export interface IssueListSummary {
    total: number
    byStatus: Partial<Record<IssueStatus, number>>
}

export interface IssueList {
    issues: Issue[]
    pagination: IssuePagination
    summary: IssueListSummary
}

export interface IssueListParams {
    status?: IssueStatus | ""
    category?: string
    barangay?: string
    q?: string
    page?: number
    perPage?: number
}

export interface IssueSubmission {
    title: string
    description: string
    category: string
    barangay: string
    latitude?: number
    longitude?: number
    locationText?: string
    reporterName?: string
    reporterEmail?: string
    reporterPhone?: string
    photos?: File[]
}

export interface IssueSubmitted {
    trackingCode: string
    status: IssueStatus
    statusLabel: string
    message: string
}

export type IssueErrorKind = "disabled" | "validation" | "rate-limited" | "not-found" | "network" | "server"
