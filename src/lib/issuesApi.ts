import { PG_API_BASE } from "./pgApi"
import type {
    Issue,
    IssueCategory,
    IssueErrorKind,
    IssueList,
    IssueListParams,
    IssuePhoto,
    IssueSubmission,
    IssueSubmitted,
} from "../types/issues"

export class IssueApiError extends Error {
    kind: IssueErrorKind
    status: number
    fieldErrors: Record<string, string[]>

    constructor(kind: IssueErrorKind, message: string, status = 0, fieldErrors: Record<string, string[]> = {}) {
        super(message)
        this.name = "IssueApiError"
        this.kind = kind
        this.status = status
        this.fieldErrors = fieldErrors
    }
}

type Envelope<T> = { ok?: boolean; name?: string; data: T; error?: string; message?: string; errors?: Record<string, string[]> }

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    let response: Response
    try {
        response = await fetch(`${PG_API_BASE}${path}`, {
            ...init,
            headers: { Accept: "application/json", ...init.headers },
        })
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") throw error
        throw new IssueApiError("network", "Could not reach the server.")
    }

    let body: Envelope<T> | null = null
    try {
        body = (await response.json()) as Envelope<T>
    } catch {
        // non-JSON body (proxy error page etc.), handled by the status checks below
    }

    if (response.ok && body?.ok !== false && body && "data" in body) return body.data

    const message = body?.error ?? body?.message ?? ""
    switch (response.status) {
        case 403:
            throw new IssueApiError("disabled", message || "Issue reporting is currently turned off.", 403)
        case 404:
            throw new IssueApiError("not-found", message, 404)
        case 422:
            throw new IssueApiError("validation", message, 422, body?.errors ?? {})
        case 429:
            throw new IssueApiError("rate-limited", message, 429)
        default:
            throw new IssueApiError("server", message, response.status)
    }
}

/** GET /issue-reporting. Always answers, even while reporting is off. Any failure means "treat as unavailable". */
export async function getIssueReportingStatus(signal?: AbortSignal): Promise<boolean> {
    const data = await request<{ enabled: boolean }>("/issue-reporting", { signal })
    return data.enabled === true
}

/** GET /issue-categories */
export async function getIssueCategories(signal?: AbortSignal): Promise<IssueCategory[]> {
    const data = await request<{ categories: IssueCategory[] }>("/issue-categories", { signal })
    return data.categories
}

/** GET /barangays. Returns the barangay names exactly as the API spells them. */
export async function getBarangayNames(signal?: AbortSignal): Promise<string[]> {
    const data = await request<{ barangays: { name: string }[] }>("/barangays", { signal })
    return data.barangays.map((barangay) => barangay.name)
}

/** POST /issues. Uses multipart/form-data only when photos are attached, JSON otherwise. */
export async function submitIssue(input: IssueSubmission): Promise<IssueSubmitted> {
    const { photos = [], ...fields } = input
    // "website" is the honeypot: it is always sent empty.
    const payload: Record<string, string | number> = { website: "" }
    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && value !== "") payload[key] = value
    }

    if (photos.length === 0) {
        return request<IssueSubmitted>("/issues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
    }

    const form = new FormData()
    for (const [key, value] of Object.entries(payload)) form.append(key, String(value))
    for (const photo of photos) form.append("photos[]", photo)
    return request<IssueSubmitted>("/issues", { method: "POST", body: form })
}

/** GET /issues/{trackingCode}. Case-insensitive. Rejects with kind "not-found" for an unknown code. */
export async function getIssue(trackingCode: string, signal?: AbortSignal): Promise<Issue> {
    const data = await request<{ issue: Issue }>(`/issues/${encodeURIComponent(trackingCode.trim())}`, { signal })
    return data.issue
}

/** GET /issues. Only accepted reports (under_review, in_progress, resolved) are ever returned. */
export async function listIssues(params: IssueListParams = {}, signal?: AbortSignal): Promise<IssueList> {
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") query.set(key, String(value))
    }
    const suffix = query.size > 0 ? `?${query}` : ""
    return request<IssueList>(`/issues${suffix}`, { signal })
}

export function photoUrl(photo: IssuePhoto): string | null {
    if (typeof photo === "string") return photo
    return photo.url ?? photo.path ?? photo.thumbnailUrl ?? null
}
