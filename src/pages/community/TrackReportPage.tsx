import { CircleAlert, LoaderCircle, MapPin, Search } from "lucide-react"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import IssueStatusBadge from "../../components/community/IssueStatusBadge"
import { useIssueReporting } from "../../hooks/useIssueReporting"
import { useSeo } from "../../hooks/useSeo"
import { communityReportingCopy } from "../../i18n/communityReporting"
import { useLanguage } from "../../i18n/useLanguage"
import { STATUS_FLOW, categoryMeta, formatIssueDate, statusMeta } from "../../lib/communityReports"
import { IssueApiError, getIssue, photoUrl } from "../../lib/issuesApi"
import type { Issue, IssueErrorKind, IssueUpdate } from "../../types/issues"

type Settled = { key: string } & ({ issue: Issue } | { kind: IssueErrorKind })

const PAGE_PATH = "/community/track"

function newestFirst(updates: IssueUpdate[]) {
    return [...updates].sort((a, b) => Date.parse(b.createdAt ?? "") - Date.parse(a.createdAt ?? "") || 0)
}

const TrackReportPage = () => {
    const { lang, t } = useLanguage()
    const copy = communityReportingCopy[lang]
    const track = copy.track
    const { code = "" } = useParams()
    const navigate = useNavigate()
    const { enabled: reportingOpen } = useIssueReporting()

    const [input, setInput] = useState(code)
    const [attempt, setAttempt] = useState(0)
    const [settled, setSettled] = useState<Settled | null>(null)

    // Loading is derived: a lookup is pending until a result for this exact code and attempt has arrived.
    const lookupKey = `${code}#${attempt}`
    const current = settled?.key === lookupKey ? settled : null

    useSeo({
        title: `${track.heading} | Better Pagbilao`,
        description: "Track the progress of a community report you sent to the Municipality of Pagbilao using your tracking code.",
        path: PAGE_PATH,
        noindex: true,
    })

    useEffect(() => {
        if (!code) return

        const controller = new AbortController()

        getIssue(code, controller.signal)
            .then((issue) => setSettled({ key: lookupKey, issue }))
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return
                setSettled({ key: lookupKey, kind: error instanceof IssueApiError ? error.kind : "server" })
            })

        return () => controller.abort()
    }, [code, lookupKey])

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        const next = input.trim().toUpperCase()
        if (!next) return
        // Same code again: the URL would not change, so run the lookup again by hand.
        if (next === code.toUpperCase()) setAttempt((count) => count + 1)
        else navigate(`${PAGE_PATH}/${encodeURIComponent(next)}`)
    }

    const idle = !code
    const loading = !idle && current === null

    return (
        <>
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb
                        items={[
                            { label: t.services.breadcrumbHome, to: "/" },
                            ...(reportingOpen ? [{ label: copy.breadcrumb, to: "/community/report" }] : []),
                            { label: track.breadcrumb },
                        ]}
                    />
                    <div className="mt-8 max-w-2xl">
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{track.eyebrow}</p>
                        <h1 className="mt-3 text-3xl font-black sm:text-4xl">{track.heading}</h1>
                        <p className="mt-4 text-base leading-8 text-white/76">{track.body}</p>
                        <form onSubmit={handleSubmit} className="mt-6 flex max-w-md gap-2">
                            <label htmlFor="track-code" className="sr-only">
                                {copy.success.referenceLabel}
                            </label>
                            <input
                                id="track-code"
                                type="text"
                                value={input}
                                autoComplete="off"
                                autoCapitalize="characters"
                                spellCheck={false}
                                placeholder={track.placeholder}
                                onChange={(event) => setInput(event.target.value)}
                                className="min-w-0 flex-1 rounded-md border border-white/20 bg-white/8 px-3.5 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-white placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-white/40 focus:border-bayan-gold focus:outline-none focus:ring-2 focus:ring-bayan-gold/30"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-md bg-bayan-gold px-5 py-2.5 text-sm font-black text-bayan-ink transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-70"
                            >
                                <Search className="h-4 w-4" /> {track.button}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="bg-bayan-mist py-12 sm:py-14">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8" aria-live="polite">
                    {idle && (
                        <div className="rounded-lg border border-slate-200 bg-white p-6">
                            <p className="text-base font-black">{track.callout.heading}</p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{track.callout.body}</p>
                        </div>
                    )}

                    {loading && (
                        <p className="inline-flex items-center gap-3 text-sm font-bold text-slate-500">
                            <LoaderCircle className="h-5 w-5 animate-spin text-bayan-blue" /> {track.looking}
                        </p>
                    )}

                    {current && "kind" in current && (
                        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-bayan-red/40 bg-red-50 p-4 text-sm font-semibold leading-6 text-bayan-red">
                            <CircleAlert className="h-5 w-5 shrink-0" />
                            <p className="min-w-0 flex-1 basis-56">
                                {current.kind === "not-found" ? track.notFound : current.kind === "rate-limited" ? track.rateLimited : track.failed}
                            </p>
                            {current.kind !== "not-found" && current.kind !== "rate-limited" && (
                                <button
                                    type="button"
                                    onClick={() => setAttempt((count) => count + 1)}
                                    className="rounded-md bg-white px-3 py-2 text-xs font-black ring-1 ring-bayan-red/30 hover:bg-red-100"
                                >
                                    {track.retry}
                                </button>
                            )}
                        </div>
                    )}

                    {current && "issue" in current && <IssueDetails issue={current.issue} lang={lang} />}

                    {reportingOpen && (
                        <p className="mt-8">
                            <Link to="/community/report" className="text-sm font-black text-bayan-blue hover:underline">
                                {track.reportAnother}
                            </Link>
                        </p>
                    )}
                </div>
            </section>
        </>
    )
}

const IssueDetails = ({ issue, lang }: { issue: Issue; lang: string }) => {
    const { track } = communityReportingCopy[lang === "tl" ? "tl" : "en"]
    const { Icon, color } = categoryMeta(issue.category?.slug)
    const rejected = issue.status === "rejected"
    const stepIndex = STATUS_FLOW.indexOf(issue.status)
    const photos = (issue.photos ?? []).map(photoUrl).filter((url): url is string => Boolean(url))
    const updates = newestFirst(issue.updates ?? [])

    return (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${color}`}>
                        <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                        <p className="font-mono text-xs font-black tracking-wider text-slate-500">{issue.trackingCode}</p>
                        <h2 className="mt-1 text-xl font-black leading-6">{issue.title}</h2>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                            {[issue.category?.name, issue.barangay].filter(Boolean).join(" · ")}
                        </p>
                    </div>
                </div>
                <IssueStatusBadge status={issue.status} label={issue.statusLabel} />
            </div>

            {rejected ? (
                <p className="mt-6 rounded-lg border border-bayan-red/30 bg-red-50 px-4 py-3 text-sm font-semibold text-bayan-red">{track.rejectedNote}</p>
            ) : (
                <div className="mt-6">
                    <div className="flex gap-1.5" role="img" aria-label={issue.statusLabel}>
                        {STATUS_FLOW.map((step, index) => (
                            <span key={step} className="h-2 flex-1 rounded-full" style={{ background: index <= stepIndex ? statusMeta(issue.status).pin : "#e2e8f0" }} />
                        ))}
                    </div>
                    <p className="mt-2 text-sm font-black">{issue.statusLabel}</p>
                </div>
            )}

            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-700">{issue.description}</p>

            <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-slate-100 pt-6 text-sm sm:grid-cols-2">
                <div>
                    <dt className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{track.submittedOn}</dt>
                    <dd className="mt-1 font-bold">{formatIssueDate(issue.submittedAt, lang) || "—"}</dd>
                </div>
                {issue.resolvedAt && (
                    <div>
                        <dt className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{track.resolvedOn}</dt>
                        <dd className="mt-1 font-bold">{formatIssueDate(issue.resolvedAt, lang)}</dd>
                    </div>
                )}
                <div>
                    <dt className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{track.assignedOffice}</dt>
                    <dd className="mt-1 font-bold">{issue.assignedOffice || track.unassigned}</dd>
                </div>
                {issue.locationText && (
                    <div>
                        <dt className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{track.locationLabel}</dt>
                        <dd className="mt-1 inline-flex items-center gap-1 font-bold">
                            <MapPin className="h-3.5 w-3.5 shrink-0" /> {issue.locationText}
                        </dd>
                    </div>
                )}
            </dl>

            {photos.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{track.photosHeading}</h3>
                    <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {photos.map((url) => (
                            <li key={url}>
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    <img src={url} alt="" loading="lazy" className="aspect-4/3 w-full rounded-md border border-slate-200 object-cover" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-6 border-t border-slate-100 pt-6">
                <h3 className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{track.updatesHeading}</h3>
                {updates.length === 0 ? (
                    <p className="mt-3 text-sm font-semibold text-slate-500">{track.noUpdates}</p>
                ) : (
                    <ol className="mt-4 grid gap-4">
                        {updates.map((update, index) => (
                            <li key={`${update.createdAt ?? "update"}-${index}`} className="rounded-lg bg-bayan-mist p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    {update.status && update.statusLabel ? <IssueStatusBadge status={update.status} label={update.statusLabel} /> : <span />}
                                    <span className="text-xs font-bold text-slate-500">{formatIssueDate(update.createdAt, lang)}</span>
                                </div>
                                {(update.message || update.note) && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{update.message || update.note}</p>}
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </article>
    )
}

export default TrackReportPage
