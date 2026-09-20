import { Siren, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import { useAnnouncementList } from "../../hooks/useAnnouncementList"
import { announcementsCopy } from "../../i18n/announcementsPage"
import { useLanguage } from "../../i18n/useLanguage"

const DISMISSED_KEY = "bp_dismissed_emergency_alerts"
const REFRESH_MS = 5 * 60 * 1000
const PARAMS = { type: "emergency", perPage: 3 } as const

function readDismissed(): string[] {
    try {
        const parsed: unknown = JSON.parse(window.sessionStorage.getItem(DISMISSED_KEY) ?? "[]")
        return Array.isArray(parsed) ? parsed.filter((slug): slug is string => typeof slug === "string") : []
    } catch {
        return []
    }
}

/** Red alert strip above the header while an emergency announcement is live. Renders nothing when there is none. */
const EmergencyBanner = () => {
    const { lang } = useLanguage()
    const copy = announcementsCopy[lang].banner
    const { list } = useAnnouncementList(PARAMS, { refreshMs: REFRESH_MS })
    const [dismissed, setDismissed] = useState<string[]>(readDismissed)

    const alerts = (list?.announcements ?? []).filter((item) => !dismissed.includes(item.slug))
    if (alerts.length === 0) return null

    const [first, ...rest] = alerts

    const dismiss = () => {
        const next = [...new Set([...dismissed, ...alerts.map((item) => item.slug)])]
        setDismissed(next)
        try {
            window.sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(next))
        } catch {
            // storage unavailable: the alert stays hidden until the page reloads
        }
    }

    return (
        <section role="alert" aria-label={copy.region} className="bg-bayan-red text-white">
            <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm font-bold sm:px-6 lg:px-8">
                <Siren className="h-4 w-4 shrink-0" aria-hidden />
                <span className="shrink-0 rounded bg-white/20 px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.12em]">{copy.label}</span>
                <p className="min-w-0 flex-1 basis-48 line-clamp-2 leading-5 sm:line-clamp-none">
                    <Link to={`/announcements/${encodeURIComponent(first.slug)}`} className="hover:underline">
                        {first.title}
                    </Link>
                </p>

                <div className="ml-auto flex shrink-0 items-center gap-1">
                    {rest.length > 0 && (
                        <Link to="/announcements?type=emergency" className="rounded px-2 py-1 text-xs font-black hover:bg-black/10">
                            {copy.more.replace("{n}", String(rest.length))}
                        </Link>
                    )}
                    <Link to={`/announcements/${encodeURIComponent(first.slug)}`} className="rounded px-2 py-1 text-xs font-black underline underline-offset-2 hover:bg-black/10">
                        {copy.details}
                    </Link>
                    <button type="button" onClick={dismiss} aria-label={copy.dismiss} className="grid h-7 w-7 place-items-center rounded hover:bg-black/10">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default EmergencyBanner
