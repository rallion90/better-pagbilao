import { ArrowRight, CalendarDays, MapPin, Pin } from "lucide-react"
import { Link } from "react-router"
import { announcementsCopy } from "../../i18n/announcementsPage"
import { useLanguage } from "../../i18n/useLanguage"
import { TYPE_STYLE, formatEventRange, formatManila, safeUrl } from "../../lib/announcementFormat"
import type { Announcement } from "../../types/announcements"
import AnnouncementImage from "./AnnouncementImage"
import TypeBadge from "./TypeBadge"

const AnnouncementCard = ({ item }: { item: Announcement }) => {
    const { lang } = useLanguage()
    const copy = announcementsCopy[lang]
    const style = TYPE_STYLE[item.type] ?? TYPE_STYLE.general
    const eventRange = item.event ? formatEventRange(item.event.startsAt, item.event.endsAt, lang, copy.event.to) : ""
    const href = `/announcements/${encodeURIComponent(item.slug)}`
    const imageUrl = safeUrl(item.imageUrl)

    return (
        <article className={`flex flex-col overflow-hidden rounded-lg border border-l-4 border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-soft ${style.accent}`}>
            {imageUrl && <AnnouncementImage key={imageUrl} src={imageUrl} alt={item.title} failedLabel={copy.detail.imageFailed} className="aspect-video w-full" />}

            <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                    <TypeBadge type={item.type} label={item.typeLabel} />
                    {item.isPinned && (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-slate-500">
                            <Pin className="h-3.5 w-3.5" aria-hidden /> {copy.list.pinned}
                        </span>
                    )}
                </div>

                <h3 className="mt-3 text-lg font-black leading-6">
                    <Link to={href} className="hover:text-bayan-blue hover:underline">
                        {item.title}
                    </Link>
                </h3>

                {item.event && (eventRange || item.event.location) && (
                    <div className="mt-3 grid gap-1.5 rounded-md bg-blue-50 px-3 py-2.5 text-sm font-bold text-bayan-blue">
                        {eventRange && (
                            <p className="flex items-start gap-2">
                                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                                <span>
                                    <span className="sr-only">{copy.event.when}: </span>
                                    {eventRange}
                                </span>
                            </p>
                        )}
                        {item.event.location && (
                            <p className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                                <span>
                                    <span className="sr-only">{copy.event.where}: </span>
                                    {item.event.location}
                                </span>
                            </p>
                        )}
                    </div>
                )}

                {item.summary && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.summary}</p>}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-5">
                    <p className="min-w-0 text-xs font-bold text-slate-500">
                        {item.office && <span className="block truncate">{item.office}</span>}
                        <span className="block">
                            {copy.list.posted} {formatManila(item.publishedAt, lang)}
                        </span>
                    </p>
                    <Link to={href} className="inline-flex items-center gap-1 text-sm font-bold text-bayan-blue hover:gap-2">
                        {copy.list.readMore} <ArrowRight className="h-4 w-4 transition-all" aria-hidden />
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default AnnouncementCard
