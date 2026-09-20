import { ArrowRight, LoaderCircle, MapPin, Phone, Search, UserRound, X } from "lucide-react"
import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import { useBarangays } from "../../hooks/useBarangays"
import { useIssueReporting } from "../../hooks/useIssueReporting"
import { useSeo } from "../../hooks/useSeo"
import { barangayMapCopy } from "../../i18n/barangayMap"
import type { BarangayMapCopy } from "../../i18n/barangayMap"
import { useLanguage } from "../../i18n/useLanguage"
import { METRICS, SHADES, areaKm2, classIndex, density, formatNumber, metricValue, quantileBreaks } from "../../lib/barangayMetrics"
import type { BarangayMetric } from "../../lib/barangayMetrics"
import { listIssues } from "../../lib/issuesApi"
import type { BarangayProfile } from "../../types/barangays"

const PAGE_PATH = "/explore/barangays"

const BarangayMap = lazy(() => import("../../components/explore/BarangayMap"))

type Sort = "name" | "population"

// "Añato" should be found by typing "anato".
const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

type ReportCount = { name: string; total: number | null }

const BarangayMapPage = () => {
    const { lang, t } = useLanguage()
    const copy = barangayMapCopy[lang]
    const { data, loading, error, reload } = useBarangays()
    const { enabled: reportingOpen } = useIssueReporting()

    const [metric, setMetric] = useState<BarangayMetric>("population")
    const [selectedCode, setSelectedCode] = useState<string | null>(null)
    const [query, setQuery] = useState("")
    const [sort, setSort] = useState<Sort>("name")
    const [reportCount, setReportCount] = useState<ReportCount | null>(null)

    useSeo({
        title: `${copy.breadcrumb} | Better Pagbilao`,
        description:
            "Interactive map of all 27 barangays in Pagbilao, Quezon, shaded by population, density or land area, with captain, contact number, facilities and community reports.",
        path: PAGE_PATH,
    })

    const barangays = useMemo(() => data?.barangays ?? [], [data])
    const selected = barangays.find((barangay) => barangay.psgc.tenDigitCode === selectedCode) ?? null

    const breaks = useMemo(() => quantileBreaks(barangays.map((barangay) => metricValue(barangay, metric))), [barangays, metric])

    const unit = metric === "population" ? copy.map.unitPeople : metric === "density" ? copy.map.unitDensity : copy.map.unitArea
    const valueText = (barangay: BarangayProfile) => `${formatNumber(metricValue(barangay, metric), lang)} ${unit}`

    const fills = useMemo(
        () => Object.fromEntries(barangays.map((barangay) => [barangay.psgc.tenDigitCode, SHADES[classIndex(metricValue(barangay, metric), breaks)]])),
        [barangays, metric, breaks]
    )
    const labels = Object.fromEntries(barangays.map((barangay) => [barangay.psgc.tenDigitCode, `${barangay.name} · ${valueText(barangay)}`]))

    const totals = useMemo(
        () => ({
            population: barangays.reduce((sum, barangay) => sum + barangay.psa.population2024, 0),
            area: barangays.reduce((sum, barangay) => sum + areaKm2(barangay), 0),
        }),
        [barangays]
    )

    const shown = useMemo(() => {
        const needle = fold(query.trim())
        return barangays
            .filter((barangay) => !needle || fold(barangay.name).includes(needle) || fold(barangay.alternateName ?? "").includes(needle))
            .sort((a, b) => (sort === "population" ? b.psa.population2024 - a.psa.population2024 : a.name.localeCompare(b.name, "fil")))
    }, [barangays, query, sort])

    // Public report count for the selected barangay. Only asked while reporting is on, like every other reporting call.
    const selectedName = selected?.name
    useEffect(() => {
        if (!reportingOpen || !selectedName) return
        const controller = new AbortController()

        listIssues({ barangay: selectedName, perPage: 1 }, controller.signal)
            .then((result) => setReportCount({ name: selectedName, total: result.pagination.total }))
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === "AbortError") return
                setReportCount({ name: selectedName, total: null })
            })

        return () => controller.abort()
    }, [reportingOpen, selectedName])

    const smallest = Math.min(...barangays.map((barangay) => metricValue(barangay, metric)))
    const legend = breaks.map((upper, index) => {
        const lower = index === 0 ? smallest : breaks[index - 1]
        return { shade: SHADES[index], text: `${formatNumber(lower, lang)} – ${formatNumber(upper, lang)}` }
    })

    return (
        <>
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb items={[{ label: t.services.breadcrumbHome, to: "/" }, { label: copy.breadcrumb }]} />
                    <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.eyebrow}</p>
                    <h1 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl lg:text-5xl lg:leading-[1.1]">{copy.heading}</h1>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-white/76">{copy.intro}</p>
                    {barangays.length > 0 && (
                        <dl className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                            {[
                                { label: copy.stats.barangays, value: String(barangays.length) },
                                { label: copy.stats.population, value: formatNumber(totals.population, lang) },
                                { label: copy.stats.area, value: `${formatNumber(totals.area, lang, 1)} km²` },
                            ].map((stat) => (
                                <div key={stat.label} className="rounded-lg bg-white/8 px-4 py-3 ring-1 ring-white/12">
                                    <dd className="text-2xl font-black sm:text-3xl">{stat.value}</dd>
                                    <dt className="mt-0.5 text-xs font-bold uppercase tracking-[0.12em] text-white/60">{stat.label}</dt>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </section>

            <section className="bg-bayan-mist py-12 sm:py-14">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <p role="status" className="inline-flex items-center gap-3 text-sm font-bold text-slate-500">
                            <LoaderCircle className="h-5 w-5 animate-spin text-bayan-blue" /> {copy.map.loading}
                        </p>
                    ) : error || barangays.length === 0 ? (
                        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-bayan-red/40 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            <p className="min-w-0 flex-1 basis-56">{copy.error.message}</p>
                            <button type="button" onClick={reload} className="rounded-md bg-white px-3 py-2 text-xs font-black ring-1 ring-bayan-red/30 hover:bg-red-100">
                                {copy.error.retry}
                            </button>
                        </div>
                    ) : (
                        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
                            {/* Map */}
                            <div className="lg:sticky lg:top-36">
                                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                                        <p className="text-sm font-black">{copy.map.heading}</p>
                                        <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1" role="group" aria-label={copy.map.metricLabel}>
                                            {METRICS.map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    aria-pressed={metric === option}
                                                    onClick={() => setMetric(option)}
                                                    className={`rounded px-3 py-1.5 text-xs font-black transition ${
                                                        metric === option ? "bg-bayan-blue text-white shadow-sm" : "text-slate-600 hover:text-bayan-ink"
                                                    }`}
                                                >
                                                    {copy.metrics[option]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="isolate h-96 bg-slate-100 sm:h-125 lg:h-140">
                                        <Suspense fallback={<div className="grid h-full place-items-center text-sm font-semibold text-slate-500">{copy.map.loading}</div>}>
                                            <BarangayMap fills={fills} labels={labels} selectedCode={selectedCode} onSelect={setSelectedCode} />
                                        </Suspense>
                                    </div>
                                    <div className="border-t border-slate-200 px-4 py-3">
                                        <p className="text-xs font-semibold text-slate-500">{copy.map.hint}</p>
                                        <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1" aria-label={`${copy.map.legend}: ${unit}`}>
                                            {legend.map((item) => (
                                                <li key={item.shade} className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                                    <span className="h-3 w-5 rounded-sm ring-1 ring-slate-300" style={{ background: item.shade }} />
                                                    {item.text}
                                                </li>
                                            ))}
                                            <li className="text-xs font-semibold text-slate-400">({unit})</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Detail + list */}
                            <div className="grid gap-6">
                                <DetailCard
                                    barangay={selected}
                                    copy={copy}
                                    lang={lang}
                                    onClose={() => setSelectedCode(null)}
                                    reporting={reportingOpen ? (reportCount && reportCount.name === selected?.name ? reportCount : "loading") : null}
                                />

                                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h2 className="text-lg font-black">{copy.list.heading}</h2>
                                        <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1">
                                            {(["name", "population"] as const).map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    aria-pressed={sort === option}
                                                    onClick={() => setSort(option)}
                                                    className={`rounded px-2.5 py-1 text-xs font-black transition ${
                                                        sort === option ? "bg-bayan-ink text-white" : "text-slate-600 hover:text-bayan-ink"
                                                    }`}
                                                >
                                                    {option === "name" ? copy.list.sortName : copy.list.sortPopulation}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative mt-4">
                                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="search"
                                            value={query}
                                            placeholder={copy.list.search}
                                            aria-label={copy.list.search}
                                            onChange={(event) => setQuery(event.target.value)}
                                            className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 focus:border-bayan-blue focus:outline-none focus:ring-2 focus:ring-bayan-blue/25"
                                        />
                                    </div>
                                    {shown.length === 0 ? (
                                        <p className="mt-4 rounded-md bg-bayan-mist p-4 text-center text-sm font-semibold text-slate-500">{copy.list.empty}</p>
                                    ) : (
                                        <ul className="mt-3 max-h-96 overflow-y-auto pr-1">
                                            {shown.map((barangay) => {
                                                const code = barangay.psgc.tenDigitCode
                                                const active = code === selectedCode
                                                return (
                                                    <li key={code}>
                                                        <button
                                                            type="button"
                                                            aria-pressed={active}
                                                            onClick={() => setSelectedCode(code)}
                                                            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${
                                                                active ? "bg-blue-50 ring-1 ring-bayan-blue/40" : "hover:bg-slate-50"
                                                            }`}
                                                        >
                                                            <span className="h-3 w-3 shrink-0 rounded-sm ring-1 ring-slate-300" style={{ background: fills[code] }} />
                                                            <span className="min-w-0 flex-1 truncate font-black">{barangay.name}</span>
                                                            <span className="shrink-0 text-xs font-bold text-slate-500">{formatNumber(barangay.psa.population2024, lang)}</span>
                                                        </button>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-10 max-w-3xl text-xs leading-6 text-slate-500">
                        <p className="font-black uppercase tracking-[0.12em]">{copy.sources.heading}</p>
                        <p className="mt-1">{copy.sources.body}</p>
                        <p className="mt-1">{copy.sources.boundaries}</p>
                    </div>
                </div>
            </section>
        </>
    )
}

type DetailCardProps = {
    barangay: BarangayProfile | null
    copy: BarangayMapCopy
    lang: string
    onClose: () => void
    /** null = reporting is off, "loading" = waiting for the count */
    reporting: ReportCount | "loading" | null
}

const DetailCard = ({ barangay, copy, lang, onClose, reporting }: DetailCardProps) => {
    const d = copy.detail

    if (!barangay) {
        return (
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm font-semibold text-slate-500">
                <MapPin className="h-5 w-5 shrink-0 text-bayan-blue" /> {d.prompt}
            </div>
        )
    }

    const captain = barangay.punongBarangay ?? barangay.barangayCaptain
    const facts: { label: string; value: string }[] = [
        { label: d.population, value: formatNumber(barangay.psa.population2024, lang) },
        { label: d.area, value: `${formatNumber(barangay.landAreaHectares, lang)} ha` },
        { label: d.density, value: `${formatNumber(density(barangay), lang)} /km²` },
        { label: d.classification, value: barangay.psa.urbanRural === "Urban" ? d.urban : d.rural },
    ]
    const landmarks = barangay.landmarksFacilities ?? []

    return (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6" aria-live="polite">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-2xl font-black leading-7">{barangay.name}</h2>
                    {barangay.alternateName && <p className="text-xs font-bold text-slate-500">({barangay.alternateName})</p>}
                </div>
                <button type="button" onClick={onClose} aria-label={d.close} className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                </button>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3">
                {facts.map((fact) => (
                    <div key={fact.label} className="rounded-md bg-bayan-mist px-3 py-2.5">
                        <dt className="text-xs font-bold text-slate-500">{fact.label}</dt>
                        <dd className="mt-0.5 text-base font-black">{fact.value}</dd>
                    </div>
                ))}
            </dl>

            <ul className="mt-5 grid gap-2 text-sm font-semibold">
                <li className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 shrink-0 text-bayan-blue" />
                    <span className="text-slate-500">{d.captain}:</span> {captain ?? <span className="text-slate-400">{d.notAvailable}</span>}
                </li>
                <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-bayan-blue" />
                    <span className="text-slate-500">{d.contact}:</span>
                    {barangay.contactNumber ? (
                        <a href={`tel:${barangay.contactNumber.replace(/[^\d+]/g, "")}`} className="text-bayan-blue hover:underline">
                            {barangay.contactNumber}
                        </a>
                    ) : (
                        <span className="text-slate-400">{d.notAvailable}</span>
                    )}
                </li>
            </ul>

            <div className="mt-5 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{d.landmarks}</h3>
                {landmarks.length === 0 ? (
                    <p className="mt-2 text-sm font-semibold text-slate-400">{d.noLandmarks}</p>
                ) : (
                    <ul className="mt-2 grid gap-1.5 text-sm font-semibold text-slate-700">
                        {landmarks.map((landmark) => (
                            <li key={landmark} className="flex gap-2">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bayan-blue" /> {landmark}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {reporting && (
                <div className="mt-5 border-t border-slate-100 pt-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{d.reports}</h3>
                    {reporting === "loading" ? (
                        <p className="mt-2 text-sm font-semibold text-slate-400">…</p>
                    ) : (
                        <>
                            <p className="mt-2 text-sm font-semibold text-slate-700">
                                {reporting.total ? (
                                    <>
                                        <span className="text-lg font-black">{reporting.total}</span> {d.reportsCount}
                                    </>
                                ) : (
                                    d.reportsNone
                                )}
                            </p>
                            {reporting.total ? (
                                <Link
                                    to={{ pathname: "/community/report", search: `?barangay=${encodeURIComponent(barangay.name)}`, hash: "#reports" }}
                                    className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-bayan-blue hover:gap-2"
                                >
                                    {d.reportsLink} <ArrowRight className="h-4 w-4 transition-all" />
                                </Link>
                            ) : null}
                        </>
                    )}
                </div>
            )}
        </article>
    )
}

export default BarangayMapPage
