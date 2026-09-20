import { ChevronLeft, ChevronRight, LoaderCircle, Megaphone, Pin, Search, TriangleAlert, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router"
import AnnouncementCard from "../../components/announcements/AnnouncementCard"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import { useAnnouncementList } from "../../hooks/useAnnouncementList"
import { useSeo } from "../../hooks/useSeo"
import { announcementsCopy } from "../../i18n/announcementsPage"
import { useLanguage } from "../../i18n/useLanguage"
import { ANNOUNCEMENT_TYPES } from "../../types/announcements"
import type { AnnouncementType } from "../../types/announcements"

const PER_PAGE = 12
const SEARCH_DEBOUNCE_MS = 300

/** Page numbers around the current one, with the first and last always reachable. */
function pageWindow(page: number, lastPage: number): (number | "gap")[] {
    const wanted = new Set([1, lastPage, page - 1, page, page + 1])
    const numbers = [...wanted].filter((n) => n >= 1 && n <= lastPage).sort((a, b) => a - b)
    const result: (number | "gap")[] = []
    numbers.forEach((n, index) => {
        if (index > 0 && n - numbers[index - 1] > 1) result.push("gap")
        result.push(n)
    })
    return result
}

const AnnouncementsPage = () => {
    const { lang, t } = useLanguage()
    const copy = announcementsCopy[lang]
    const [searchParams, setSearchParams] = useSearchParams()

    const rawType = searchParams.get("type") ?? ""
    const type: AnnouncementType | "" = ANNOUNCEMENT_TYPES.includes(rawType as AnnouncementType) ? (rawType as AnnouncementType) : ""
    const q = searchParams.get("q") ?? ""
    const pinned = searchParams.get("pinned") === "1"
    const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1)

    const [qInput, setQInput] = useState(q)
    const [invalidNotice, setInvalidNotice] = useState(false)

    useSeo({
        title: `${copy.breadcrumb} | Better Pagbilao`,
        description: "Emergency alerts, advisories, events and public notices from the municipal government of Pagbilao, Quezon.",
        path: "/announcements",
    })

    const patch = useCallback(
        (changes: Record<string, string | null>) => {
            setSearchParams(
                (current) => {
                    const next = new URLSearchParams(current)
                    for (const [key, value] of Object.entries(changes)) {
                        if (value === null || value === "") next.delete(key)
                        else next.set(key, value)
                    }
                    return next
                },
                { replace: true }
            )
        },
        [setSearchParams]
    )

    // Typing updates the box straight away; the search itself goes out 300 ms after the last keystroke.
    useEffect(() => {
        if (qInput.trim() === q.trim()) return
        const timer = window.setTimeout(() => patch({ q: qInput.trim(), page: null }), SEARCH_DEBOUNCE_MS)
        return () => window.clearTimeout(timer)
    }, [qInput, q, patch])

    const resetFilters = useCallback(() => {
        setQInput("")
        setSearchParams({}, { replace: true })
    }, [setSearchParams])

    // 422 from the API: the filters were not valid, so clear them and say so.
    const handleInvalid = useCallback(() => {
        resetFilters()
        setInvalidNotice(true)
    }, [resetFilters])

    const params = useMemo(() => ({ type, q, pinned, page, perPage: PER_PAGE }), [type, q, pinned, page])
    const { list, loading, error, reload } = useAnnouncementList(params, { onInvalid: handleInvalid })

    const items = list?.announcements ?? []
    const types = list?.types ?? []
    const totalAll = types.reduce((sum, item) => sum + item.count, 0)
    const pagination = list?.pagination
    const filtersActive = Boolean(type || q.trim() || pinned)

    const goToPage = (next: number) => {
        patch({ page: next > 1 ? String(next) : null })
        document.getElementById("announcement-results")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    const chipClass = (active: boolean, disabled = false) =>
        `inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-black transition ${
            active ? "bg-bayan-ink text-white" : disabled ? "cursor-not-allowed bg-slate-50 text-slate-300 ring-1 ring-slate-100" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
        }`

    return (
        <>
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb items={[{ label: t.services.breadcrumbHome, to: "/" }, { label: copy.breadcrumb }]} />
                    <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.eyebrow}</p>
                    <h1 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl lg:text-5xl lg:leading-[1.1]">{copy.heading}</h1>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-white/76">{copy.intro}</p>
                </div>
            </section>

            <section className="bg-bayan-mist py-10 sm:py-12">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="relative w-full lg:max-w-md">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                            <input
                                type="search"
                                value={qInput}
                                onChange={(event) => setQInput(event.target.value)}
                                placeholder={copy.filters.searchPlaceholder}
                                aria-label={copy.filters.searchLabel}
                                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 focus:border-bayan-blue focus:outline-none focus:ring-2 focus:ring-bayan-blue/25"
                            />
                        </div>
                        <button type="button" aria-pressed={pinned} onClick={() => patch({ pinned: pinned ? null : "1", page: null })} className={chipClass(pinned)}>
                            <Pin className="h-3.5 w-3.5" aria-hidden /> {copy.filters.pinnedOnly}
                        </button>
                        {filtersActive && (
                            <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 text-xs font-black text-bayan-blue hover:underline">
                                <X className="h-3.5 w-3.5" aria-hidden /> {copy.filters.clear}
                            </button>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={copy.filters.typeLabel}>
                        <button type="button" aria-pressed={type === ""} onClick={() => patch({ type: null, page: null })} className={chipClass(type === "")}>
                            {copy.filters.all}
                            {list && <span className="tabular-nums opacity-70">{totalAll}</span>}
                        </button>
                        {types.map((item) => {
                            const active = type === item.value
                            const disabled = item.count === 0 && !active
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    aria-pressed={active}
                                    disabled={disabled}
                                    title={disabled ? copy.filters.noneInType : undefined}
                                    onClick={() => patch({ type: item.value, page: null })}
                                    className={chipClass(active, disabled)}
                                >
                                    {item.label}
                                    <span className="tabular-nums opacity-70">{item.count}</span>
                                </button>
                            )
                        })}
                    </div>

                    {invalidNotice && (
                        <p role="status" className="mt-5 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                            <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden /> {copy.errors.invalidFilter}
                        </p>
                    )}

                    {/* Results */}
                    <div id="announcement-results" className="mt-8 scroll-mt-36" aria-live="polite">
                        {error && error.kind !== "validation" && (
                            <div role="alert" className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-bayan-red/40 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                                <p className="min-w-0 flex-1 basis-56">{copy.errors.generic}</p>
                                <button type="button" onClick={reload} className="rounded-md bg-white px-3 py-2 text-xs font-black ring-1 ring-bayan-red/30 hover:bg-red-100">
                                    {copy.errors.retry}
                                </button>
                            </div>
                        )}

                        {!list && loading ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label={copy.list.loading}>
                                {[0, 1, 2].map((index) => (
                                    <div key={index} className="h-64 animate-pulse rounded-lg bg-white" />
                                ))}
                            </div>
                        ) : list && items.length === 0 && !error ? (
                            <div className="grid place-items-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                                <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-50 text-amber-700">
                                    <Megaphone className="h-6 w-6" aria-hidden />
                                </span>
                                <p className="mt-4 text-lg font-black">{filtersActive ? copy.list.emptyFiltered : copy.list.empty}</p>
                                {filtersActive && (
                                    <button type="button" onClick={resetFilters} className="mt-3 text-sm font-black text-bayan-blue hover:underline">
                                        {copy.filters.clear}
                                    </button>
                                )}
                            </div>
                        ) : (
                            items.length > 0 && (
                                <>
                                    <p className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500">
                                        {pagination && copy.list.total.replace("{n}", String(pagination.total))}
                                        {loading && (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden /> {copy.list.refreshing}
                                            </span>
                                        )}
                                    </p>
                                    <div className={`grid gap-4 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
                                        {items.map((item) => (
                                            <AnnouncementCard key={item.slug} item={item} />
                                        ))}
                                    </div>
                                </>
                            )
                        )}

                        {pagination && pagination.lastPage > 1 && (
                            <nav aria-label={copy.pagination.label} className="mt-8 flex flex-wrap items-center justify-center gap-2">
                                <button
                                    type="button"
                                    disabled={pagination.page <= 1}
                                    onClick={() => goToPage(pagination.page - 1)}
                                    className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-2 text-sm font-black text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft className="h-4 w-4" aria-hidden /> {copy.pagination.previous}
                                </button>
                                <span className="sr-only sm:hidden">{copy.pagination.page.replace("{page}", String(pagination.page)).replace("{total}", String(pagination.lastPage))}</span>
                                <div className="hidden items-center gap-1 sm:flex">
                                    {pageWindow(pagination.page, pagination.lastPage).map((entry, index) =>
                                        entry === "gap" ? (
                                            <span key={`gap-${index}`} className="px-1 text-slate-400" aria-hidden>
                                                …
                                            </span>
                                        ) : (
                                            <button
                                                key={entry}
                                                type="button"
                                                aria-current={entry === pagination.page ? "page" : undefined}
                                                onClick={() => goToPage(entry)}
                                                className={`h-9 min-w-9 rounded-md px-2 text-sm font-black ${entry === pagination.page ? "bg-bayan-ink text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"}`}
                                            >
                                                {entry}
                                            </button>
                                        )
                                    )}
                                </div>
                                <span className="text-xs font-bold text-slate-500 sm:hidden" aria-hidden>
                                    {copy.pagination.page.replace("{page}", String(pagination.page)).replace("{total}", String(pagination.lastPage))}
                                </span>
                                <button
                                    type="button"
                                    disabled={pagination.page >= pagination.lastPage}
                                    onClick={() => goToPage(pagination.page + 1)}
                                    className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-2 text-sm font-black text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {copy.pagination.next} <ChevronRight className="h-4 w-4" aria-hidden />
                                </button>
                            </nav>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default AnnouncementsPage
