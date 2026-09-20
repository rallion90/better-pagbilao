import {
    Ban,
    Building2,
    Construction,
    Lightbulb,
    MessageSquareWarning,
    ShieldAlert,
    Trash2,
    TreePine,
    Waves,
    Zap,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { IssueStatus } from "../types/issues"

export type LatLng = [number, number]

export const PAGBILAO_CENTER: LatLng = [13.9714, 121.6869]

// Loose bounding box around the municipality (includes Pagbilao Grande Island) used to reject pins dropped far away.
const PAGBILAO_BOUNDS = { south: 13.85, north: 14.08, west: 121.58, east: 121.82 }

export function isWithinPagbilao([lat, lng]: LatLng) {
    return lat >= PAGBILAO_BOUNDS.south && lat <= PAGBILAO_BOUNDS.north && lng >= PAGBILAO_BOUNDS.west && lng <= PAGBILAO_BOUNDS.east
}

const FALLBACK_CATEGORY = { Icon: MessageSquareWarning, color: "text-slate-600 bg-slate-100" }

// Category names come from the API; only the icon and tint are decided here, keyed by the category slug.
const CATEGORY_META: Record<string, { Icon: LucideIcon; color: string }> = {
    "road-and-sidewalk": { Icon: Construction, color: "text-amber-700 bg-amber-50" },
    "street-lighting": { Icon: Lightbulb, color: "text-bayan-blue bg-blue-50" },
    "drainage-and-flooding": { Icon: Waves, color: "text-bayan-blue bg-blue-50" },
    "garbage-and-sanitation": { Icon: Trash2, color: "text-bayan-green bg-emerald-50" },
    "water-and-power": { Icon: Zap, color: "text-amber-700 bg-amber-50" },
    "public-safety": { Icon: ShieldAlert, color: "text-bayan-red bg-red-50" },
    "public-facilities": { Icon: Building2, color: "text-bayan-blue bg-blue-50" },
    "illegal-structures": { Icon: Ban, color: "text-bayan-red bg-red-50" },
    environment: { Icon: TreePine, color: "text-bayan-green bg-emerald-50" },
    other: FALLBACK_CATEGORY,
}

export function categoryMeta(slug: string | undefined) {
    return (slug && CATEGORY_META[slug]) || FALLBACK_CATEGORY
}

// `label` is only a fallback for controls that render before any report is loaded (filters, map legend).
// Anything showing an actual report uses the statusLabel the API sent with it.
export const STATUS_META: Record<IssueStatus, { pin: string; badge: string; label: string }> = {
    new: { pin: "#667085", badge: "bg-slate-100 text-slate-600 ring-slate-200", label: "Sent" },
    under_review: { pin: "#155eef", badge: "bg-blue-50 text-bayan-blue ring-blue-200", label: "Received" },
    in_progress: { pin: "#fdb022", badge: "bg-amber-50 text-amber-700 ring-amber-200", label: "In progress" },
    resolved: { pin: "#12805c", badge: "bg-emerald-50 text-bayan-green ring-emerald-200", label: "Resolved" },
    rejected: { pin: "#d92d20", badge: "bg-red-50 text-bayan-red ring-red-200", label: "Rejected" },
}

// The public list only ever contains these three.
export const PUBLIC_STATUSES: IssueStatus[] = ["under_review", "in_progress", "resolved"]

// Progress order shown on the tracking page. "rejected" sits outside the flow.
export const STATUS_FLOW: IssueStatus[] = ["new", "under_review", "in_progress", "resolved"]

export function statusMeta(status: string) {
    return STATUS_META[status as IssueStatus] ?? STATUS_META.new
}

export const MAX_PHOTOS = 3
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function formatIssueDate(iso: string | null | undefined, lang: string) {
    if (!iso) return ""
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ""
    return date.toLocaleDateString(lang === "tl" ? "fil-PH" : "en-PH", { month: "short", day: "numeric", year: "numeric" })
}
