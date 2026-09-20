import {
    ArrowRight,
    Check,
    CheckCheck,
    Clock,
    Copy,
    Hammer,
    LoaderCircle,
    MapPin,
    MapPinned,
    PenLine,
    Search,
    Siren,
    X,
} from "lucide-react"
import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import IssueStatusBadge from "../../components/community/IssueStatusBadge"
import ReportForm from "../../components/community/ReportForm"
import type { MapFocus } from "../../components/community/ReportMap"
import { useIssueFormOptions } from "../../hooks/useIssueFormOptions"
import { useIssueList } from "../../hooks/useIssueList"
import type { IssueFilters } from "../../hooks/useIssueList"
import { useIssueReporting } from "../../hooks/useIssueReporting"
import { useSeo } from "../../hooks/useSeo"
import { communityReportingCopy } from "../../i18n/communityReporting"
import type { CommunityReportingCopy } from "../../i18n/communityReporting"
import { useLanguage } from "../../i18n/useLanguage"
import { PUBLIC_STATUSES, STATUS_META, categoryMeta, formatIssueDate } from "../../lib/communityReports"
import type { LatLng } from "../../lib/communityReports"
import { IssueApiError, submitIssue } from "../../lib/issuesApi"
import type { Issue, IssueStatus, IssueSubmission, IssueSubmitted } from "../../types/issues"

const PAGE_PATH = "/community/report"
const PAGE_SIZE = 6

const ReportMap = lazy(() => import("../../components/community/ReportMap"))

const STEP_ICONS = [MapPin, PenLine, Clock]

const Unavailable = ({ copy }: { copy: CommunityReportingCopy }) => {
    const { t } = useLanguage()
    const { state, message, refresh } = useIssueReporting()
    const failed = state === "unavailable"

    useSeo({
        title: `${copy.breadcrumb} | Better Pagbilao`,
        description: "Community reporting for Pagbilao is currently paused.",
        path: PAGE_PATH,
        noindex: true,
    })

    return (
        <section className="bg-bayan-ink py-20 text-white sm:py-28">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                <PageBreadcrumb items={[{ label: t.services.breadcrumbHome, to: "/" }, { label: copy.breadcrumb }]} />
                <div className="mx-auto mt-10 max-w-2xl text-center">
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white/10 text-bayan-gold ring-1 ring-white/15">
                        <Hammer className="h-9 w-9" />
                    </span>
                    <p className="mt-6 inline-flex rounded-full bg-bayan-gold px-3.5 py-1 text-xs font-black uppercase tracking-[0.16em] text-bayan-ink">
                        {copy.unavailable.badge}
                    </p>
                    <h1 className="mt-5 text-3xl font-black sm:text-4xl">{failed ? copy.unavailable.errorHeading : copy.unavailable.heading}</h1>
                    {message && <p className="mt-4 text-base font-bold text-bayan-gold">{message}</p>}
                    <p className="mt-4 text-base leading-8 text-white/76">{failed ? copy.unavailable.errorBody : copy.unavailable.body}</p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Link to="/community/track" className="rounded-md bg-bayan-gold px-5 py-3 text-sm font-black text-bayan-ink transition hover:bg-amber-400">
                            {copy.unavailable.track}
                        </Link>
                        {failed && (
                            <button
                                type="button"
                                onClick={refresh}
                                className="rounded-md bg-bayan-blue px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                            >
                                {copy.unavailable.retry}
                            </button>
                        )}
                        <Link to="/" className="rounded-md bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/16">
                            {copy.unavailable.backHome}
                        </Link>
                        <Link to="/hotlines" className="rounded-md bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/16">
                            {copy.unavailable.hotlines}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

const Checking = ({ copy }: { copy: CommunityReportingCopy }) => (
    <section className="grid min-h-[60vh] place-items-center bg-bayan-mist px-4">
        <p role="status" className="inline-flex items-center gap-3 text-sm font-bold text-slate-500">
            <LoaderCircle className="h-5 w-5 animate-spin text-bayan-blue" /> {copy.checking}
        </p>
    </section>
)

type ReportCardProps = {
    report: Issue
    copy: CommunityReportingCopy
    lang: string
    selected: boolean
    onView: (report: Issue) => void
}

const ReportCard = ({ report, copy, lang, selected, onView }: ReportCardProps) => {
    const { Icon, color } = categoryMeta(report.category?.slug)
    const mappable = report.latitude !== null && report.longitude !== null
    return (
        <article
            className={`flex flex-col rounded-lg border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft ${
                selected ? "border-bayan-blue ring-2 ring-bayan-blue/25" : "border-slate-200"
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${color}`}>
                    <Icon className="h-5 w-5" />
                </span>
                <IssueStatusBadge status={report.status} label={report.statusLabel} />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{report.category?.name}</p>
            <h3 className="mt-1 text-base font-black leading-6">{report.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{report.description}</p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-500">
                <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {report.barangay}
                </span>
                <span>
                    {copy.browse.reportedOn} {formatIssueDate(report.submittedAt, lang)}
                </span>
            </p>
            {report.assignedOffice && (
                <p className="mt-1 text-xs font-bold text-slate-500">
                    {copy.browse.assignedTo} {report.assignedOffice}
                </p>
            )}
            {mappable && (
                <div className="mt-auto flex justify-end pt-5">
                    <button type="button" onClick={() => onView(report)} className="inline-flex items-center gap-1 text-sm font-bold text-bayan-blue hover:gap-2">
                        {copy.browse.viewOnMap} <ArrowRight className="h-4 w-4 transition-all" />
                    </button>
                </div>
            )}
        </article>
    )
}

const CommunityReportingContent = () => {
    const { lang, t } = useLanguage()
    const copy = communityReportingCopy[lang]
    const { markDisabled } = useIssueReporting()
    const navigate = useNavigate()
    const options = useIssueFormOptions()

    const [draft, setDraft] = useState<LatLng | null>(null)
    const [focus, setFocus] = useState<MapFocus | null>(null)
    const [selectedCode, setSelectedCode] = useState<string | null>(null)
    const [locating, setLocating] = useState(false)
    const [locateFailed, setLocateFailed] = useState(false)
    const [submitted, setSubmitted] = useState<IssueSubmitted | null>(null)
    const [formKey, setFormKey] = useState(0)
    const [copied, setCopied] = useState(false)

    const [filters, setFilters] = useState<IssueFilters>({ q: "", category: "", barangay: "", status: "" })
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
    const list = useIssueList(filters)

    const [trackInput, setTrackInput] = useState("")

    useSeo({
        title: `${copy.breadcrumb} | Better Pagbilao`,
        description:
            "Report potholes, broken streetlights, garbage, flooding, and other local problems in Pagbilao, Quezon. Pin the location on the map and track progress.",
        path: PAGE_PATH,
    })

    const stats = {
        total: list.summary?.total ?? 0,
        open: (list.summary?.byStatus.under_review ?? 0) + (list.summary?.byStatus.in_progress ?? 0),
        resolved: list.summary?.byStatus.resolved ?? 0,
    }

    const selectedReport = list.issues.find((report) => report.trackingCode === selectedCode) ?? null

    const updateFilters = (patch: Partial<IssueFilters>) => {
        setFilters((current) => ({ ...current, ...patch }))
        setVisibleCount(PAGE_SIZE)
    }

    const scrollToMap = () => document.getElementById("report-map")?.scrollIntoView({ behavior: "smooth", block: "center" })

    const focusOn = (position: LatLng) => setFocus({ position, key: Date.now() })

    const handlePick = (position: LatLng) => {
        setDraft(position)
        setLocateFailed(false)
    }

    const handleUseMyLocation = () => {
        if (!("geolocation" in navigator)) {
            setLocateFailed(true)
            return
        }
        setLocating(true)
        setLocateFailed(false)
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const position: LatLng = [coords.latitude, coords.longitude]
                setDraft(position)
                focusOn(position)
                setLocating(false)
            },
            () => {
                setLocateFailed(true)
                setLocating(false)
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    const handleSubmit = async (submission: IssueSubmission) => {
        try {
            const result = await submitIssue(submission)
            setSubmitted(result)
            setDraft(null)
            setCopied(false)
            document.getElementById("report")?.scrollIntoView({ behavior: "smooth", block: "start" })
        } catch (error) {
            // 403: reporting was switched off while the form was open. The page swaps to the "paused" screen with the API's message.
            if (error instanceof IssueApiError && error.kind === "disabled") markDisabled(error.message)
            throw error
        }
    }

    const handleAnother = () => {
        setSubmitted(null)
        setDraft(null)
        setFormKey((key) => key + 1)
    }

    const handleCopy = async () => {
        if (!submitted) return
        try {
            await navigator.clipboard.writeText(submitted.trackingCode)
            setCopied(true)
        } catch {
            // clipboard unavailable, the code is still visible to copy by hand
        }
    }

    const handleView = (report: Issue) => {
        if (report.latitude === null || report.longitude === null) return
        setSelectedCode(report.trackingCode)
        focusOn([report.latitude, report.longitude])
        scrollToMap()
    }

    const handleShowMore = () => {
        const next = visibleCount + PAGE_SIZE
        setVisibleCount(next)
        if (list.hasMore && list.issues.length < next) list.loadMore()
    }

    const handleTrack = (event: React.FormEvent) => {
        event.preventDefault()
        const code = trackInput.trim().toUpperCase()
        navigate(code ? `/community/track/${encodeURIComponent(code)}` : "/community/track")
    }

    const showMoreVisible = list.issues.length > visibleCount || list.hasMore
    const selectClass =
        "rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold focus:border-bayan-blue focus:outline-none focus:ring-2 focus:ring-bayan-blue/25 lg:w-48"

    return (
        <>
            {/* Hero */}
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb items={[{ label: t.services.breadcrumbHome, to: "/" }, { label: copy.breadcrumb }]} />
                    <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.eyebrow}</p>
                            <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-normal sm:text-4xl lg:text-5xl lg:leading-[1.1]">{copy.heading}</h1>
                            <p className="mt-4 max-w-2xl text-base leading-8 text-white/76">{copy.intro}</p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <a
                                    href="#report"
                                    className="inline-flex items-center gap-2 rounded-md bg-bayan-gold px-5 py-3 text-sm font-black text-bayan-ink transition hover:bg-amber-400"
                                >
                                    <MapPinned className="h-4 w-4" /> {copy.ctaReport}
                                </a>
                                <a
                                    href="#reports"
                                    className="inline-flex items-center gap-2 rounded-md bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/16"
                                >
                                    {copy.ctaBrowse} <ArrowRight className="h-4 w-4" />
                                </a>
                                <Link
                                    to="/community/track"
                                    className="inline-flex items-center gap-2 rounded-md bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/16"
                                >
                                    <Search className="h-4 w-4" /> {copy.ctaTrack}
                                </Link>
                            </div>
                            <dl className="mt-9 grid max-w-md grid-cols-3 gap-3">
                                {[
                                    { label: copy.stats.total, value: stats.total, tone: "text-white" },
                                    { label: copy.stats.open, value: stats.open, tone: "text-bayan-gold" },
                                    { label: copy.stats.resolved, value: stats.resolved, tone: "text-emerald-300" },
                                ].map((stat) => (
                                    <div key={stat.label} className="rounded-lg bg-white/8 px-4 py-3 ring-1 ring-white/12">
                                        <dd className={`text-3xl font-black ${stat.tone}`}>{stat.value}</dd>
                                        <dt className="mt-0.5 text-xs font-bold uppercase tracking-[0.12em] text-white/60">{stat.label}</dt>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <ol className="grid gap-3">
                            {copy.steps.map((step, index) => {
                                const StepIcon = STEP_ICONS[index]
                                return (
                                    <li key={step.title} className="flex items-start gap-4 rounded-lg bg-white/8 p-5 ring-1 ring-white/12">
                                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-bayan-blue text-white">
                                            <StepIcon className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-base font-black">
                                                <span className="mr-2 text-bayan-gold">{index + 1}.</span>
                                                {step.title}
                                            </p>
                                            <p className="mt-1 text-sm leading-6 text-white/76">{step.body}</p>
                                        </div>
                                    </li>
                                )
                            })}
                        </ol>
                    </div>
                </div>
            </section>

            {/* Report form + map */}
            <section id="report" className="scroll-mt-32 bg-bayan-mist py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-bayan-red/25 bg-red-50 p-4 text-sm leading-6">
                        <Siren className="h-5 w-5 shrink-0 text-bayan-red" />
                        <p className="min-w-0 flex-1 basis-56 font-semibold text-slate-700">
                            <span className="font-black text-bayan-red">{copy.emergency.title}</span> {copy.emergency.body}
                        </p>
                        <Link to="/hotlines" className="inline-flex items-center gap-1 font-black text-bayan-red hover:gap-2">
                            {copy.emergency.cta} <ArrowRight className="h-4 w-4 transition-all" />
                        </Link>
                    </div>

                    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                        <div>
                            {submitted ? (
                                <div className="rounded-lg border border-emerald-200 bg-white p-6 text-center shadow-soft sm:p-8">
                                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-bayan-green">
                                        <CheckCheck className="h-8 w-8" />
                                    </span>
                                    <h2 className="mt-5 text-2xl font-black">{copy.success.heading}</h2>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{submitted.message || copy.success.body}</p>
                                    <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-slate-500">{copy.success.referenceLabel}</p>
                                    <div className="mx-auto mt-2 flex max-w-md items-center justify-between gap-3 rounded-lg border-2 border-bayan-blue/30 bg-bayan-mist py-3 pl-5 pr-3">
                                        <span className="select-all font-mono text-2xl font-black tracking-wider sm:text-3xl">{submitted.trackingCode}</span>
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-black text-bayan-blue ring-1 ring-slate-200 transition hover:bg-blue-50"
                                        >
                                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                            {copied ? copy.success.copied : copy.success.copy}
                                        </button>
                                    </div>
                                    <p className="mt-3">
                                        <IssueStatusBadge status={submitted.status} label={submitted.statusLabel} />
                                    </p>
                                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                                        <Link
                                            to={`/community/track/${encodeURIComponent(submitted.trackingCode)}`}
                                            className="rounded-md bg-bayan-blue px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                                        >
                                            {copy.success.track}
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleAnother}
                                            className="rounded-md bg-bayan-mist px-5 py-3 text-sm font-black text-bayan-blue ring-1 ring-slate-200 transition hover:bg-blue-50"
                                        >
                                            {copy.success.another}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <ReportForm
                                    key={formKey}
                                    copy={copy}
                                    categories={options.categories}
                                    barangays={options.barangays}
                                    optionsLoading={options.loading}
                                    optionsFailed={options.failed}
                                    onReloadOptions={options.reload}
                                    position={draft}
                                    locating={locating}
                                    locateFailed={locateFailed}
                                    onUseMyLocation={handleUseMyLocation}
                                    onClearPin={() => setDraft(null)}
                                    onSubmit={handleSubmit}
                                />
                            )}
                        </div>

                        <div className="order-first lg:order-0 lg:sticky lg:top-36">
                            <div id="report-map" className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
                                <div className="isolate h-90 bg-slate-100 sm:h-115 lg:h-135">
                                    <Suspense fallback={<div className="grid h-full place-items-center text-sm font-semibold text-slate-500">Loading map…</div>}>
                                        <ReportMap
                                            reports={list.issues}
                                            draft={draft}
                                            selectedCode={selectedCode}
                                            focus={focus}
                                            pickEnabled={!submitted}
                                            onPick={handlePick}
                                            onSelect={setSelectedCode}
                                        />
                                    </Suspense>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-slate-200 px-4 py-3">
                                    <p className="text-xs font-semibold text-slate-500">{submitted ? "" : copy.map.pickHint}</p>
                                    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label={copy.map.legend}>
                                        {PUBLIC_STATUSES.map((status) => (
                                            <li key={status} className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                                <span className="h-3 w-3 rounded-full ring-2 ring-white" style={{ background: STATUS_META[status].pin, boxShadow: "0 0 0 1px #cbd5e1" }} />
                                                {STATUS_META[status].label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {selectedReport && (
                                    <div className="border-t border-slate-200 bg-bayan-mist px-4 py-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{copy.map.selected}</p>
                                                <p className="mt-1 text-sm font-black leading-5">{selectedReport.title}</p>
                                                <p className="mt-1 text-xs font-bold text-slate-500">
                                                    {selectedReport.category?.name} · {selectedReport.barangay}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <IssueStatusBadge status={selectedReport.status} label={selectedReport.statusLabel} />
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedCode(null)}
                                                    aria-label={copy.map.close}
                                                    className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Browse */}
            <section id="reports" className="scroll-mt-32 bg-white py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-black sm:text-3xl">{copy.browse.heading}</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{copy.browse.intro}</p>
                    </div>

                    <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="relative w-full lg:max-w-sm">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={filters.q}
                                placeholder={copy.browse.searchPlaceholder}
                                aria-label={copy.browse.searchPlaceholder}
                                onChange={(event) => updateFilters({ q: event.target.value })}
                                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 focus:border-bayan-blue focus:outline-none focus:ring-2 focus:ring-bayan-blue/25"
                            />
                        </div>
                        <select
                            value={filters.status}
                            aria-label={copy.map.legend}
                            onChange={(event) => updateFilters({ status: event.target.value as IssueStatus | "" })}
                            className={selectClass}
                        >
                            <option value="">{copy.browse.allStatuses}</option>
                            {PUBLIC_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {STATUS_META[status].label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filters.barangay}
                            aria-label={copy.form.barangayLabel}
                            onChange={(event) => updateFilters({ barangay: event.target.value })}
                            className={selectClass}
                        >
                            <option value="">{copy.browse.allBarangays}</option>
                            {options.barangays.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {options.categories.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {[{ slug: "", name: copy.browse.allCategories }, ...options.categories].map(({ slug, name }) => {
                                const active = filters.category === slug
                                return (
                                    <button
                                        key={slug || "all"}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => updateFilters({ category: slug })}
                                        className={`rounded-full px-3.5 py-1.5 text-xs font-black transition ${
                                            active ? "bg-bayan-ink text-white" : "bg-bayan-mist text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                                        }`}
                                    >
                                        {name}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    <div aria-live="polite">
                        {list.loading ? (
                            <p className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                                <LoaderCircle className="h-4 w-4 animate-spin text-bayan-blue" /> {copy.browse.loading}
                            </p>
                        ) : list.failed ? (
                            <div className="mt-8 flex flex-wrap items-center gap-3 rounded-lg border border-bayan-red/40 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                                <p className="min-w-0 flex-1 basis-56">{copy.browse.loadFailed}</p>
                                <button type="button" onClick={list.reload} className="rounded-md bg-white px-3 py-2 text-xs font-black ring-1 ring-bayan-red/30 hover:bg-red-100">
                                    {copy.browse.retry}
                                </button>
                            </div>
                        ) : list.issues.length === 0 ? (
                            <p className="mt-8 rounded-lg border border-dashed border-slate-300 bg-bayan-mist p-8 text-center text-sm font-semibold text-slate-500">
                                {copy.browse.empty}
                            </p>
                        ) : (
                            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {list.issues.slice(0, visibleCount).map((report) => (
                                    <ReportCard
                                        key={report.trackingCode}
                                        report={report}
                                        copy={copy}
                                        lang={lang}
                                        selected={report.trackingCode === selectedCode}
                                        onView={handleView}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {!list.loading && !list.failed && showMoreVisible && (
                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                onClick={handleShowMore}
                                disabled={list.loadingMore}
                                className="inline-flex items-center gap-2 rounded-md bg-bayan-mist px-5 py-3 text-sm font-black text-bayan-blue ring-1 ring-slate-200 transition hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70"
                            >
                                {list.loadingMore && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {copy.browse.showMore}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Track shortcut */}
            <section id="track" className="scroll-mt-32 bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.track.heading}</p>
                    <p className="mt-3 max-w-md text-base leading-8 text-white/76">{copy.track.body}</p>
                    <form onSubmit={handleTrack} className="mt-6 flex max-w-md gap-2">
                        <label htmlFor="track-reference" className="sr-only">
                            {copy.success.referenceLabel}
                        </label>
                        <input
                            id="track-reference"
                            type="text"
                            value={trackInput}
                            placeholder={copy.track.placeholder}
                            onChange={(event) => setTrackInput(event.target.value)}
                            className="min-w-0 flex-1 rounded-md border border-white/20 bg-white/8 px-3.5 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-white placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-white/40 focus:border-bayan-gold focus:outline-none focus:ring-2 focus:ring-bayan-gold/30"
                        />
                        <button type="submit" className="rounded-md bg-bayan-gold px-5 py-2.5 text-sm font-black text-bayan-ink transition hover:bg-amber-400">
                            {copy.track.button}
                        </button>
                    </form>
                </div>
            </section>
        </>
    )
}

const CommunityReportingPage = () => {
    const { lang } = useLanguage()
    const copy = communityReportingCopy[lang]
    const { state, refresh } = useIssueReporting()

    // The provider already checks once on app load. If the app was already past that when this page opened, check again
    // so a switch flipped by an admin in the meantime is picked up.
    const stateOnMount = useRef(state)
    useEffect(() => {
        if (stateOnMount.current !== "loading") refresh()
    }, [refresh])

    if (state === "loading") return <Checking copy={copy} />
    if (state !== "enabled") return <Unavailable copy={copy} />
    return <CommunityReportingContent />
}

export default CommunityReportingPage
