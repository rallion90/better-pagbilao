import type { LatLng } from "./communityReports"
import { request } from "./issuesApi"
import type { Business, BusinessCategory, BusinessList, BusinessListParams, BusinessSubmission, BusinessSubmitted } from "../types/businesses"

// Errors are IssueApiError, same as the issue-reporting calls. Every call below except the status check
// rejects with kind "disabled" (403) while the directory is switched off.

/** GET /business-directory-status. Always answers, even while the directory is off. */
export async function getBusinessDirectoryStatus(signal?: AbortSignal): Promise<boolean> {
    const data = await request<{ enabled: boolean }>("/business-directory-status", { signal })
    return data.enabled === true
}

/** GET /business-categories. Already in display order. */
export async function getBusinessCategories(signal?: AbortSignal): Promise<BusinessCategory[]> {
    const data = await request<{ categories: BusinessCategory[] }>("/business-categories", { signal })
    return data.categories
}

/** GET /businesses. Approved listings only, sorted by name. */
export async function listBusinesses(params: BusinessListParams = {}, signal?: AbortSignal): Promise<BusinessList> {
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") query.set(key, String(value))
    }
    const suffix = query.size > 0 ? `?${query}` : ""
    return request<BusinessList>(`/businesses${suffix}`, { signal })
}

/** GET /businesses/{slug}. Rejects with kind "not-found" for an unknown, pending or rejected listing. */
export async function getBusiness(slug: string, signal?: AbortSignal): Promise<Business> {
    const data = await request<{ business: Business }>(`/businesses/${encodeURIComponent(slug)}`, { signal })
    return data.business
}

/** POST /businesses. Uses multipart/form-data only when a logo or gallery photo is attached, JSON otherwise. */
export async function submitBusiness(input: BusinessSubmission): Promise<BusinessSubmitted> {
    const { logo = null, gallery = [], ...fields } = input
    // "website" is the honeypot: it is always sent empty.
    const payload: Record<string, string | number | boolean> = { website: "" }
    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && value !== "") payload[key] = value
    }

    if (!logo && gallery.length === 0) {
        return request<BusinessSubmitted>("/businesses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
    }

    const form = new FormData()
    for (const [key, value] of Object.entries(payload)) {
        form.append(key, typeof value === "boolean" ? (value ? "1" : "0") : String(value))
    }
    if (logo) form.append("logo", logo)
    for (const photo of gallery) form.append("gallery[]", photo)
    return request<BusinessSubmitted>("/businesses", { method: "POST", body: form })
}

/** `online` may be "facebook.com/..." or a full URL. */
export function onlineHref(online: string): string {
    const trimmed = online.trim()
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/+/, "")}`
}

// Shortest thing worth dialing: a local landline number without its area code.
const MIN_PHONE_DIGITS = 7

/**
 * `tel:` link for a listing, or null when `phone` holds nothing dialable: listings without a number come
 * back as placeholder text ("Not available"), and the field may also be blank or missing.
 */
export function telHref(phone: string | null | undefined): string | null {
    // `phone` may hold several numbers ("0912 345 6789 / 042 123 4567"); dial the first real one.
    for (const part of (phone ?? "").split(/[/,;]| or /i)) {
        const number = part.replace(/[^0-9+]/g, "")
        if (number.replace(/\D/g, "").length >= MIN_PHONE_DIGITS) return `tel:${number}`
    }
    return null
}

/** Map position for a listing, or null when the owner hid it from the map. */
export function businessPosition(business: Business): LatLng | null {
    if (business.pinPrecision === "hidden" || business.latitude === null || business.longitude === null) return null
    return [business.latitude, business.longitude]
}
