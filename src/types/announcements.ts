export type AnnouncementType = "general" | "emergency" | "advisory" | "event" | "public_notice"

export const ANNOUNCEMENT_TYPES: AnnouncementType[] = ["general", "emergency", "advisory", "event", "public_notice"]

export interface AnnouncementLink {
    url: string
    label: string
}

export interface AnnouncementEvent {
    startsAt: string | null
    endsAt: string | null
    location: string | null
}

// Dates are ISO 8601 with an offset.
export interface Announcement {
    slug: string
    title: string
    type: AnnouncementType
    typeLabel: string
    summary: string
    office: string | null
    imageUrl: string | null
    link: AnnouncementLink | null
    /** only for type "event" */
    event: AnnouncementEvent | null
    isPinned: boolean
    publishedAt: string
    expiresAt: string | null
}

/** The single-announcement endpoint adds the full text. `body` is plain text with blank lines between paragraphs. */
export interface AnnouncementDetail extends Announcement {
    body: string
}

export interface AnnouncementTypeCount {
    value: AnnouncementType
    label: string
    /** counts cover all live announcements, not just the current filter */
    count: number
}

export interface AnnouncementPagination {
    page: number
    perPage: number
    total: number
    lastPage: number
}

export interface AnnouncementList {
    announcements: Announcement[]
    pagination: AnnouncementPagination
    types: AnnouncementTypeCount[]
}

export interface AnnouncementListParams {
    type?: AnnouncementType | ""
    q?: string
    pinned?: boolean
    perPage?: number
    page?: number
}
