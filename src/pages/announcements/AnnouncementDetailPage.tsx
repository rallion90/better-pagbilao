import { ArrowLeft, CalendarDays, CircleAlert, ExternalLink, LoaderCircle, MapPin, Pin, SearchX } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import AnnouncementImage from "../../components/announcements/AnnouncementImage"
import TypeBadge from "../../components/announcements/TypeBadge"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import { useSeo } from "../../hooks/useSeo"
import { announcementsCopy } from "../../i18n/announcementsPage"
import { useLanguage } from "../../i18n/useLanguage"
import { AnnouncementApiError, getAnnouncement } from "../../lib/announcementsApi"
import { TYPE_STYLE, formatEventRange, formatManila, safeUrl, toParagraphs } from "../../lib/announcementFormat"
import type { AnnouncementDetail } from "../../types/announcements"

type Settled = { key: string; announcement: AnnouncementDetail | null; error: AnnouncementApiError | null }

const AnnouncementDetailPage = () => {
    const { lang, t } = useLanguage()
    const copy = announcementsCopy[lang]
    const { slug = "" } = useParams()
    const [attempt, setAttempt] = useState(0)
    const [settled, setSettled] = useState<Settled | null>(null)

    // Loading is derived: a result is pending until one for this exact slug has arrived.
    const key = `${slug}#${attempt}`
    const current = settled?.key === key ? settled : null
    const announcement = current?.announcement ?? null
    const notFound = current?.error?.kind === "not-found"
    const failed = current?.error && !notFound

    useEffect(() => {
        const controller = new AbortController()

        getAnnouncement(slug, controller.signal)
            .then((result) => setSettled({ key, announcement: result, error: null }))
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return
                setSettled({ key, announcement: null, error: error instanceof AnnouncementApiError ? error : new AnnouncementApiError("server", "Unexpected error") })
            })

        return () => controller.abort()
    }, [slug, key])

    useSeo({
        title: `${announcement?.title ?? copy.breadcrumb} | Better Pagbilao`,
        description: announcement?.summary || "An announcement from the municipal government of Pagbilao, Quezon.",
        path: `/announcements/${slug}`,
        noindex: !announcement,
    })

    const back = (
        <Link to="/announcements" className="inline-flex items-center gap-2 text-sm font-black text-bayan-blue hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden /> {copy.detail.back}
        </Link>
    )

    let content
    if (!current) {
        content = (
            <p role="status" className="inline-flex items-center gap-3 text-sm font-bold text-slate-500">
                <LoaderCircle className="h-5 w-5 animate-spin text-bayan-blue" aria-hidden /> {copy.detail.loading}
            </p>
        )
    } else if (notFound) {
        content = (
            <div className="grid place-items-center rounded-lg border border-slate-200 bg-white px-6 py-14 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-500">
                    <SearchX className="h-7 w-7" aria-hidden />
                </span>
                <h1 className="mt-4 text-2xl font-black">{copy.detail.notFoundTitle}</h1>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{copy.detail.notFoundBody}</p>
                <Link to="/announcements" className="mt-6 rounded-md bg-bayan-blue px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700">
                    {copy.detail.back}
                </Link>
            </div>
        )
    } else if (failed || !announcement) {
        content = (
            <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-bayan-red/40 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                <CircleAlert className="h-5 w-5 shrink-0" aria-hidden />
                <p className="min-w-0 flex-1 basis-56">{copy.errors.generic}</p>
                <button type="button" onClick={() => setAttempt((count) => count + 1)} className="rounded-md bg-white px-3 py-2 text-xs font-black ring-1 ring-bayan-red/30 hover:bg-red-100">
                    {copy.errors.retry}
                </button>
            </div>
        )
    } else {
        const style = TYPE_STYLE[announcement.type] ?? TYPE_STYLE.general
        const eventRange = announcement.event ? formatEventRange(announcement.event.startsAt, announcement.event.endsAt, lang, copy.event.to) : ""
        const imageUrl = safeUrl(announcement.imageUrl)
        const linkHref = safeUrl(announcement.link?.url)
        const internalLink = linkHref?.startsWith("/")
        const paragraphs = toParagraphs(announcement.body)
        const expires = formatManila(announcement.expiresAt, lang)

        content = (
            <article className={`overflow-hidden rounded-lg border border-l-4 border-slate-200 bg-white shadow-soft ${style.accent}`}>
                {imageUrl && <AnnouncementImage key={imageUrl} src={imageUrl} alt={announcement.title} failedLabel={copy.detail.imageFailed} className="aspect-video max-h-96 w-full" />}

                <div className="p-5 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                        <TypeBadge type={announcement.type} label={announcement.typeLabel} />
                        {announcement.isPinned && (
                            <span className="inline-flex items-center gap-1 text-xs font-black text-slate-500">
                                <Pin className="h-3.5 w-3.5" aria-hidden /> {copy.list.pinned}
                            </span>
                        )}
                    </div>

                    <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{announcement.title}</h1>

                    <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold text-slate-500">
                        {announcement.office && (
                            <div className="flex gap-1.5">
                                <dt>{copy.detail.office}:</dt>
                                <dd className="font-bold text-slate-700">{announcement.office}</dd>
                            </div>
                        )}
                        <div className="flex gap-1.5">
                            <dt>{copy.detail.published}:</dt>
                            <dd className="font-bold text-slate-700">
                                <time dateTime={announcement.publishedAt}>{formatManila(announcement.publishedAt, lang)}</time>
                            </dd>
                        </div>
                        {expires && (
                            <div className="flex gap-1.5">
                                <dt>{copy.detail.expires}:</dt>
                                <dd className="font-bold text-slate-700">
                                    <time dateTime={announcement.expiresAt ?? undefined}>{expires}</time>
                                </dd>
                            </div>
                        )}
                    </dl>

                    {announcement.event && (eventRange || announcement.event.location) && (
                        <div className="mt-6 grid gap-2 rounded-lg bg-blue-50 p-4 text-bayan-blue">
                            <p className="text-xs font-black uppercase tracking-[0.14em]">{copy.detail.eventHeading}</p>
                            {eventRange && (
                                <p className="flex items-start gap-2 text-lg font-black leading-6">
                                    <CalendarDays className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                                    <span>
                                        <span className="sr-only">{copy.event.when}: </span>
                                        {eventRange}
                                    </span>
                                </p>
                            )}
                            {announcement.event.location && (
                                <p className="flex items-start gap-2 text-base font-bold leading-6">
                                    <MapPin className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                                    <span>
                                        <span className="sr-only">{copy.event.where}: </span>
                                        {announcement.event.location}
                                    </span>
                                </p>
                            )}
                        </div>
                    )}

                    {announcement.summary && <p className="mt-6 text-lg font-semibold leading-8 text-slate-700">{announcement.summary}</p>}

                    {/* The body is plain text. Each paragraph is rendered as text, never as HTML. */}
                    {paragraphs.length > 0 && (
                        <div className="mt-5 grid max-w-3xl gap-4 text-base leading-8 text-slate-700">
                            {paragraphs.map((paragraph, index) => (
                                <p key={index} className="whitespace-pre-line">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    )}

                    {announcement.link && linkHref && (
                        <div className="mt-8">
                            {internalLink ? (
                                <Link to={linkHref} className="inline-flex items-center gap-2 rounded-md bg-bayan-blue px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700">
                                    {announcement.link.label || linkHref}
                                </Link>
                            ) : (
                                <a
                                    href={linkHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-md bg-bayan-blue px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                                >
                                    {announcement.link.label || linkHref}
                                    <ExternalLink className="h-4 w-4" aria-hidden />
                                    <span className="sr-only">({copy.detail.openLink})</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </article>
        )
    }

    return (
        <>
            <section className="bg-bayan-ink py-6 text-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb
                        items={[
                            { label: t.services.breadcrumbHome, to: "/" },
                            { label: copy.breadcrumb, to: "/announcements" },
                            { label: announcement?.title ?? copy.breadcrumb },
                        ]}
                    />
                </div>
            </section>
            <section className="bg-bayan-mist py-10 sm:py-14">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-5">{back}</div>
                    <div aria-live="polite">{content}</div>
                    {announcement && <div className="mt-6">{back}</div>}
                </div>
            </section>
        </>
    )
}

export default AnnouncementDetailPage
