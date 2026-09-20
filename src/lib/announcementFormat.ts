import { CalendarDays, Megaphone, ScrollText, Siren, TriangleAlert } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { AnnouncementType } from "../types/announcements"

// Badge colours by type: emergency red, advisory orange, event blue, public notice grey, general amber.
// Every type also has an icon and the API's own label, so colour is never the only signal.
export const TYPE_STYLE: Record<AnnouncementType, { badge: string; accent: string; icon: LucideIcon }> = {
    emergency: { badge: "bg-red-50 text-bayan-red ring-red-200", accent: "border-l-bayan-red", icon: Siren },
    advisory: { badge: "bg-orange-50 text-orange-700 ring-orange-200", accent: "border-l-orange-500", icon: TriangleAlert },
    event: { badge: "bg-blue-50 text-bayan-blue ring-blue-200", accent: "border-l-bayan-blue", icon: CalendarDays },
    public_notice: { badge: "bg-slate-100 text-slate-600 ring-slate-200", accent: "border-l-slate-400", icon: ScrollText },
    general: { badge: "bg-amber-50 text-amber-700 ring-amber-200", accent: "border-l-bayan-gold", icon: Megaphone },
}

const TIME_ZONE = "Asia/Manila"

function locale(lang: string) {
    return lang === "tl" ? "fil-PH" : "en-PH"
}

/** Philippine time, e.g. "Sep 20, 2026, 6:25 PM". Returns "" for a missing or invalid date. */
export function formatManila(iso: string | null | undefined, lang: string) {
    if (!iso) return ""
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ""
    return date.toLocaleString(locale(lang), { timeZone: TIME_ZONE, dateStyle: "medium", timeStyle: "short" })
}

function formatDay(iso: string, lang: string) {
    return new Date(iso).toLocaleDateString(locale(lang), { timeZone: TIME_ZONE, dateStyle: "medium" })
}

function formatClock(iso: string, lang: string) {
    return new Date(iso).toLocaleTimeString(locale(lang), { timeZone: TIME_ZONE, timeStyle: "short" })
}

/** "Sep 26, 2026, 8:00 AM to 5:00 PM" when it ends the same day, otherwise both full dates. */
export function formatEventRange(startsAt: string | null, endsAt: string | null, lang: string, joiner: string) {
    if (!startsAt) return formatManila(endsAt, lang)
    const start = formatManila(startsAt, lang)
    if (!endsAt || !start) return start
    const end = new Date(endsAt).getTime() > new Date(startsAt).getTime() ? endsAt : null
    if (!end) return start
    return formatDay(startsAt, lang) === formatDay(end, lang) ? `${start} ${joiner} ${formatClock(end, lang)}` : `${start} ${joiner} ${formatManila(end, lang)}`
}

/** Only lets through URLs with a safe scheme, so an API value can never become a javascript: link. Relative paths are allowed. */
export function safeUrl(url: string | null | undefined, protocols: string[] = ["http:", "https:"]) {
    if (!url) return null
    try {
        const parsed = new URL(url, window.location.origin)
        return protocols.includes(parsed.protocol) ? url : null
    } catch {
        return null
    }
}

/** The body is plain text: paragraphs are separated by blank lines. Render each as text, never as HTML. */
export function toParagraphs(body: string) {
    return body
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
}
