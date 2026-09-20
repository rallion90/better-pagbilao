import { PG_API_BASE } from "./pgApi"
import type { AnnouncementDetail, AnnouncementList, AnnouncementListParams } from "../types/announcements"

export type AnnouncementErrorKind = "validation" | "not-found" | "rate-limited" | "network" | "server"

export class AnnouncementApiError extends Error {
    kind: AnnouncementErrorKind
    status: number
    fieldErrors: Record<string, string[]>

    constructor(kind: AnnouncementErrorKind, message: string, status = 0, fieldErrors: Record<string, string[]> = {}) {
        super(message)
        this.name = "AnnouncementApiError"
        this.kind = kind
        this.status = status
        this.fieldErrors = fieldErrors
    }
}

type Envelope<T> = { ok?: boolean; data: T; error?: string; message?: string; errors?: Record<string, string[]> }

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
    let response: Response
    try {
        response = await fetch(`${PG_API_BASE}${path}`, { headers: { Accept: "application/json" }, signal })
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") throw error
        throw new AnnouncementApiError("network", "Could not reach the server.")
    }

    let body: Envelope<T> | null = null
    try {
        body = (await response.json()) as Envelope<T>
    } catch {
        // non-JSON body (proxy error page etc.), handled by the status checks below
    }

    if (response.ok && body && body.ok !== false && "data" in body) return body.data

    const message = body?.error ?? body?.message ?? ""
    switch (response.status) {
        case 404:
            throw new AnnouncementApiError("not-found", message, 404)
        case 422:
            throw new AnnouncementApiError("validation", message, 422, body?.errors ?? {})
        case 429:
            throw new AnnouncementApiError("rate-limited", message, 429)
        default:
            throw new AnnouncementApiError("server", message, response.status)
    }
}

/** GET /announcements. Already ordered pinned first, then newest: do not re-sort. */
export function listAnnouncements(params: AnnouncementListParams = {}, signal?: AbortSignal): Promise<AnnouncementList> {
    const query = new URLSearchParams()
    if (params.type) query.set("type", params.type)
    if (params.q?.trim()) query.set("q", params.q.trim())
    if (params.pinned) query.set("pinned", "1")
    if (params.perPage) query.set("perPage", String(params.perPage))
    if (params.page && params.page > 1) query.set("page", String(params.page))
    const suffix = query.size > 0 ? `?${query}` : ""
    return request<AnnouncementList>(`/announcements${suffix}`, signal)
}

/** GET /announcements/{slug}. 404 means missing, still a draft, scheduled, or expired. */
export async function getAnnouncement(slug: string, signal?: AbortSignal): Promise<AnnouncementDetail> {
    const data = await request<{ announcement: AnnouncementDetail }>(`/announcements/${encodeURIComponent(slug)}`, signal)
    return data.announcement
}
