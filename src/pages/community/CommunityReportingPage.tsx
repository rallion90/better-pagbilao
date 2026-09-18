import {
    ArrowRight,
    Check,
    CheckCheck,
    Clock,
    Copy,
    Hammer,
    Info,
    MapPin,
    MapPinned,
    PenLine,
    Search,
    Siren,
    ThumbsUp,
    X,
} from "lucide-react"
import { lazy, Suspense, useMemo, useState } from "react"
import { Link } from "react-router"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import ReportForm from "../../components/community/ReportForm"
import type { ReportFormValues } from "../../components/community/ReportForm"
import type { MapFocus } from "../../components/community/ReportMap"
import { useSeo } from "../../hooks/useSeo"
import { communityReportingCopy } from "../../i18n/communityReporting"
import type { CommunityReportingCopy } from "../../i18n/communityReporting"
import { useLanguage } from "../../i18n/useLanguage"
import {
    CATEGORY_IDS,
    CATEGORY_META,
    SAMPLE_REPORTS,
    STATUS_IDS,
    STATUS_META,
    createReference,
    loadUserReports,
    loadVotes,
    saveUserReports,
    saveVotes,
} from "../../lib/communityReports"
import type { CategoryId, CommunityReport, LatLng, ReportStatus } from "../../lib/communityReports"

// Feature flag: true shows the community reporting page, false shows the "Coming soon" screen.
const COMMUNITY_REPORTING_ENABLED: boolean = false

const PAGE_PATH = "/community/report"
const PAGE_SIZE = 6

const ReportMap = lazy(() => import("../../components/community/ReportMap"))

const STEP_ICONS = [MapPin, PenLine, Clock]

const ComingSoon = () => {
    const { lang, t } = useLanguage()
    const copy = communityReportingCopy[lang]

    useSeo({
        title: `${copy.breadcrumb} | Better Pagbilao`,
        description: "Community reporting for Pagbilao is coming soon.",
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
                        {copy.comingSoon.badge}
                    </p>
                    <h1 className="mt-5 text-3xl font-black sm:text-4xl">{copy.comingSoon.heading}</h1>
                    <p className="mt-4 text-base leading-8 text-white/76">{copy.comingSoon.body}</p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Link to="/" className="rounded-md bg-bayan-blue px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700">
                            {copy.comingSoon.backHome}
                        </Link>
                        <Link
                            to="/hotlines"
                            className="rounded-md bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/16"
                        >
                            {copy.comingSoon.hotlines}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

function formatDate(iso: string, lang: string) {
    return new Date(iso).toLocaleDateString(lang === "tl" ? "fil-PH" : "en-PH", { month: "short", day: "numeric", year: "numeric" })
}

const StatusBadge = ({ status, copy }: { status: ReportStatus; copy: CommunityReportingCopy }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1 ${STATUS_META[status].badge}`}>{copy.statuses[status]}</span>
)

type ReportCardProps = {
    report: CommunityReport
    copy: CommunityReportingCopy
    lang: string
    voted: boolean
    selected: boolean
    onVote: (id: string) => void
    onView: (report: CommunityReport) => void
}

const ReportCard = ({ report, copy, lang, voted, selected, onVote, onView }: ReportCardProps) => {
    const { Icon, color } = CATEGORY_META[report.category]
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
                <div className="flex flex-wrap items-center justify-end gap-1.5">
                    {report.sample ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">{copy.browse.sample}</span>
                    ) : (
                        <span className="rounded-full bg-bayan-ink px-2.5 py-1 text-xs font-black text-white">{copy.browse.yours}</span>
                    )}
                    <StatusBadge status={report.status} copy={copy} />
                </div>
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{copy.categories[report.category]}</p>
            <h3 className="mt-1 text-base font-black leading-6">{report.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{report.description}</p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-500">
                <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {report.barangay}
                </span>
                <span>
                    {copy.browse.reportedOn} {formatDate(report.createdAt, lang)}
                </span>
            </p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5">
                <button
                    type="button"
                    aria-pressed={voted}
                    onClick={() => onVote(report.id)}
                    className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-black transition ${
                        voted ? "bg-bayan-blue text-white" : "bg-bayan-mist text-slate-700 hover:bg-blue-50 hover:text-bayan-blue"
                    }`}
                >
                    <ThumbsUp className="h-4 w-4" />
                    {voted ? copy.browse.meTooDone : copy.browse.meToo}
                    <span className={`rounded-full px-1.5 text-xs ${voted ? "bg-white/25" : "bg-white"}`}>{report.upvotes + (voted ? 1 : 0)}</span>
                </button>
                <button
                    type="button"
                    onClick={() => onView(report)}
                    className="inline-flex items-center gap-1 text-sm font-bold text-bayan-blue hover:gap-2"
                >
                    {copy.browse.viewOnMap} <ArrowRight className="h-4 w-4 transition-all" />
                </button>
            </div>
        </article>
    )
}

const CommunityReportingContent = () => {
    const { lang, t } = useLanguage()
    const copy = communityReportingCopy[lang]

    const [userReports, setUserReports] = useState<CommunityReport[]>(loadUserReports)
    const [votes, setVotes] = useState<string[]>(loadVotes)
    const [draft, setDraft] = useState<LatLng | null>(null)
    const [focus, setFocus] = useState<MapFocus | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [locating, setLocating] = useState(false)
    const [locateFailed, setLocateFailed] = useState(false)
    const [submitted, setSubmitted] = useState<CommunityReport | null>(null)
    const [formKey, setFormKey] = useState(0)
    const [copied, setCopied] = useState(false)

    const [query, setQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<CategoryId | "all">("all")
    const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all")
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    const [trackInput, setTrackInput] = useState("")
    const [trackResult, setTrackResult] = useState<CommunityReport | null | undefined>(undefined)

    useSeo({
        title: `${copy.breadcrumb} | Better Pagbilao`,
        description:
            "Report potholes, broken streetlights, garbage, flooding, and other local problems in Pagbilao, Quezon. Pin the location on the map and track progress.",
        path: PAGE_PATH,
    })

    const allReports = useMemo(
        () => [...userReports, ...SAMPLE_REPORTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        [userReports]
    )

    const stats = useMemo(
        () => ({
            total: allReports.length,
            open: allReports.filter((report) => report.status !== "resolved").length,
            resolved: allReports.filter((report) => report.status === "resolved").length,
        }),
        [allReports]
    )

    const filteredReports = useMemo(() => {
        const needle = query.trim().toLowerCase()
        return allReports.filter((report) => {
            if (categoryFilter !== "all" && report.category !== categoryFilter) return false
            if (statusFilter !== "all" && report.status !== statusFilter) return false
            if (!needle) return true
            return [report.title, report.description, report.barangay, copy.categories[report.category]].some((text) => text.toLowerCase().includes(needle))
        })
    }, [allReports, categoryFilter, statusFilter, query, copy])

    const selectedReport = allReports.find((report) => report.id === selectedId) ?? null

    const scrollToMap = () => document.getElementById("report-map")?.scrollIntoView({ behavior: "smooth", block: "center" })

    const focusOn = (position: LatLng) => setFocus({ position, key: Date.now() })

    const handlePick = (position: LatLng) => {
        if (submitted) return
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

    const handleSubmit = (values: ReportFormValues) => {
        const report: CommunityReport = {
            id: createReference(),
            ...values,
            status: "received",
            createdAt: new Date().toISOString(),
            upvotes: 0,
        }
        const next = [report, ...userReports]
        setUserReports(next)
        saveUserReports(next)
        setSubmitted(report)
        setDraft(null)
        setSelectedId(report.id)
        focusOn(report.position)
        setCopied(false)
        document.getElementById("report")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    const handleAnother = () => {
        setSubmitted(null)
        setDraft(null)
        setFormKey((key) => key + 1)
    }

    const handleCopy = async () => {
        if (!submitted) return
        try {
            await navigator.clipboard.writeText(submitted.id)
            setCopied(true)
        } catch {
            // clipboard unavailable, the number is still visible to copy by hand
        }
    }

    const handleVote = (id: string) => {
        const next = votes.includes(id) ? votes.filter((voteId) => voteId !== id) : [...votes, id]
        setVotes(next)
        saveVotes(next)
    }

    const handleView = (report: CommunityReport) => {
        setSelectedId(report.id)
        focusOn(report.position)
        scrollToMap()
    }

    const handleTrack = (event: React.FormEvent) => {
        event.preventDefault()
        const reference = trackInput.trim().toUpperCase()
        if (!reference) return
        setTrackResult(allReports.find((report) => report.id.toUpperCase() === reference) ?? null)
    }

    const resetFilters = (patch: () => void) => {
        patch()
        setVisibleCount(PAGE_SIZE)
    }

    const timelineSteps: { status: ReportStatus; label: string }[] = [
        { status: "received", label: copy.track.timeline.received },
        { status: "in-progress", label: copy.track.timeline.inProgress },
        { status: "resolved", label: copy.track.timeline.resolved },
    ]

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
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
                            <Info className="mt-0.5 h-5 w-5 shrink-0" />
                            <p>{copy.previewNotice}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-bayan-red/25 bg-red-50 p-4 text-sm leading-6">
                            <Siren className="h-5 w-5 shrink-0 text-bayan-red" />
                            <p className="min-w-0 flex-1 basis-56 font-semibold text-slate-700">
                                <span className="font-black text-bayan-red">{copy.emergency.title}</span> {copy.emergency.body}
                            </p>
                            <Link to="/hotlines" className="inline-flex items-center gap-1 font-black text-bayan-red hover:gap-2">
                                {copy.emergency.cta} <ArrowRight className="h-4 w-4 transition-all" />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                        <div>
                            {submitted ? (
                                <div className="rounded-lg border border-emerald-200 bg-white p-6 text-center shadow-soft sm:p-8">
                                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-bayan-green">
                                        <CheckCheck className="h-8 w-8" />
                                    </span>
                                    <h2 className="mt-5 text-2xl font-black">{copy.success.heading}</h2>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{copy.success.body}</p>
                                    <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-slate-500">{copy.success.referenceLabel}</p>
                                    <div className="mx-auto mt-2 flex max-w-xs items-center justify-between gap-3 rounded-lg border border-slate-200 bg-bayan-mist py-2 pl-4 pr-2">
                                        <span className="font-mono text-lg font-black tracking-wider">{submitted.id}</span>
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-black text-bayan-blue ring-1 ring-slate-200 transition hover:bg-blue-50"
                                        >
                                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                            {copied ? copy.success.copied : copy.success.copy}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAnother}
                                        className="mt-7 rounded-md bg-bayan-blue px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                                    >
                                        {copy.success.another}
                                    </button>
                                </div>
                            ) : (
                                <ReportForm
                                    key={formKey}
                                    copy={copy}
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
                                    <Suspense
                                        fallback={<div className="grid h-full place-items-center text-sm font-semibold text-slate-500">Loading map…</div>}
                                    >
                                        <ReportMap
                                            reports={allReports}
                                            draft={draft}
                                            selectedId={selectedId}
                                            focus={focus}
                                            onPick={handlePick}
                                            onSelect={setSelectedId}
                                        />
                                    </Suspense>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-slate-200 px-4 py-3">
                                    <p className="text-xs font-semibold text-slate-500">{submitted ? "" : copy.map.pickHint}</p>
                                    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label={copy.map.legend}>
                                        {STATUS_IDS.map((status) => (
                                            <li key={status} className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                                <span className="h-3 w-3 rounded-full ring-2 ring-white" style={{ background: STATUS_META[status].pin, boxShadow: "0 0 0 1px #cbd5e1" }} />
                                                {copy.statuses[status]}
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
                                                    {copy.categories[selectedReport.category]} · {selectedReport.barangay}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <StatusBadge status={selectedReport.status} copy={copy} />
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedId(null)}
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
                                value={query}
                                placeholder={copy.browse.searchPlaceholder}
                                aria-label={copy.browse.searchPlaceholder}
                                onChange={(event) => resetFilters(() => setQuery(event.target.value))}
                                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 focus:border-bayan-blue focus:outline-none focus:ring-2 focus:ring-bayan-blue/25"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            aria-label={copy.map.legend}
                            onChange={(event) => resetFilters(() => setStatusFilter(event.target.value as ReportStatus | "all"))}
                            className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold focus:border-bayan-blue focus:outline-none focus:ring-2 focus:ring-bayan-blue/25 lg:w-48"
                        >
                            <option value="all">{copy.browse.allStatuses}</option>
                            {STATUS_IDS.map((status) => (
                                <option key={status} value={status}>
                                    {copy.statuses[status]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {(["all", ...CATEGORY_IDS] as const).map((id) => {
                            const active = categoryFilter === id
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => resetFilters(() => setCategoryFilter(id))}
                                    className={`rounded-full px-3.5 py-1.5 text-xs font-black transition ${
                                        active ? "bg-bayan-ink text-white" : "bg-bayan-mist text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                    {id === "all" ? copy.browse.allCategories : copy.categories[id]}
                                </button>
                            )
                        })}
                    </div>

                    {filteredReports.length === 0 ? (
                        <p className="mt-8 rounded-lg border border-dashed border-slate-300 bg-bayan-mist p-8 text-center text-sm font-semibold text-slate-500">
                            {copy.browse.empty}
                        </p>
                    ) : (
                        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredReports.slice(0, visibleCount).map((report) => (
                                <ReportCard
                                    key={report.id}
                                    report={report}
                                    copy={copy}
                                    lang={lang}
                                    voted={votes.includes(report.id)}
                                    selected={report.id === selectedId}
                                    onVote={handleVote}
                                    onView={handleView}
                                />
                            ))}
                        </div>
                    )}

                    {filteredReports.length > visibleCount && (
                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                                className="rounded-md bg-bayan-mist px-5 py-3 text-sm font-black text-bayan-blue ring-1 ring-slate-200 transition hover:bg-blue-50"
                            >
                                {copy.browse.showMore}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Track */}
            <section id="track" className="scroll-mt-32 bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
                        <div>
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
                                    onChange={(event) => {
                                        setTrackInput(event.target.value)
                                        setTrackResult(undefined)
                                    }}
                                    className="min-w-0 flex-1 rounded-md border border-white/20 bg-white/8 px-3.5 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-white placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-white/40 focus:border-bayan-gold focus:outline-none focus:ring-2 focus:ring-bayan-gold/30"
                                />
                                <button
                                    type="submit"
                                    className="rounded-md bg-bayan-gold px-5 py-2.5 text-sm font-black text-bayan-ink transition hover:bg-amber-400"
                                >
                                    {copy.track.button}
                                </button>
                            </form>
                        </div>

                        <div aria-live="polite">
                            {trackResult === null && (
                                <p className="rounded-lg border border-bayan-red/40 bg-bayan-red/15 p-4 text-sm font-semibold leading-6 text-red-100">
                                    {copy.track.notFound}
                                </p>
                            )}
                            {trackResult && (
                                <div className="rounded-lg bg-white p-5 text-bayan-ink shadow-soft sm:p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-mono text-xs font-black tracking-wider text-slate-500">{trackResult.id}</p>
                                            <h3 className="mt-1 text-lg font-black leading-6">{trackResult.title}</h3>
                                            <p className="mt-1 text-xs font-bold text-slate-500">
                                                {copy.categories[trackResult.category]} · {trackResult.barangay} · {formatDate(trackResult.createdAt, lang)}
                                            </p>
                                        </div>
                                        <StatusBadge status={trackResult.status} copy={copy} />
                                    </div>
                                    <ol className="mt-6 grid grid-cols-3 gap-2">
                                        {timelineSteps.map((step, index) => {
                                            const reached = index <= STATUS_IDS.indexOf(trackResult.status)
                                            return (
                                                <li key={step.status} className="text-center">
                                                    <div className="flex items-center">
                                                        <span className={`h-1 flex-1 ${index === 0 ? "bg-transparent" : reached ? "bg-bayan-green" : "bg-slate-200"}`} />
                                                        <span
                                                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                                                                reached ? "bg-bayan-green text-white" : "bg-slate-200 text-slate-400"
                                                            }`}
                                                        >
                                                            {reached ? <Check className="h-4 w-4" /> : <span className="text-xs font-black">{index + 1}</span>}
                                                        </span>
                                                        <span className={`h-1 flex-1 ${index === timelineSteps.length - 1 ? "bg-transparent" : reached && index < STATUS_IDS.indexOf(trackResult.status) ? "bg-bayan-green" : "bg-slate-200"}`} />
                                                    </div>
                                                    <p className={`mt-2 text-xs font-black ${reached ? "text-bayan-ink" : "text-slate-400"}`}>{step.label}</p>
                                                </li>
                                            )
                                        })}
                                    </ol>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

const CommunityReportingPage = () => (COMMUNITY_REPORTING_ENABLED ? <CommunityReportingContent /> : <ComingSoon />)

export default CommunityReportingPage
