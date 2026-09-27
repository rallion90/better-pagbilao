import { ArrowLeft, ArrowRight, Clock, FilePlus2, Globe, LoaderCircle, MapPin, PhoneCall, Search, Store } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import { useBusinessDirectory } from "../../hooks/useBusinessDirectory"
import { useBusinessList } from "../../hooks/useBusinessList"
import { useSeo } from "../../hooks/useSeo"
import { businessDirectoryCopy } from "../../i18n/businessDirectory"
import type { BusinessDirectoryCopy } from "../../i18n/businessDirectory"
import { useLanguage } from "../../i18n/useLanguage"
import { onlineHref, telHref } from "../../lib/businessApi"
import { businessCategoryMeta } from "../../lib/businessCategories"
import type { Business } from "../../types/businesses"

const SITE_URL = "https://betterpagbilao.org"
const PAGE_PATH = "/community/businesses"
const ADD_PATH = "/community/businesses/add"
const STEP_ICONS = [FilePlus2, Search, Store]
const SEARCH_DEBOUNCE_MS = 300

type FilterKey = "q" | "category" | "barangay" | "page"

type BusinessCardProps = {
    business: Business
    categoryName: string
    page: BusinessDirectoryCopy["directory"]
}

const BusinessCard = ({ business, categoryName, page }: BusinessCardProps) => {
    const { Icon, color } = businessCategoryMeta(business.category)
    return (
        <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
            {business.logoUrl ? (
                <img src={business.logoUrl} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-md object-cover ring-1 ring-slate-200" />
            ) : (
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${color}`}>
                    <Icon className="h-5 w-5" />
                </span>
            )}
            <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{categoryName}</p>
            <h3 className="mt-1 text-base font-black leading-6">
                <Link to={`${PAGE_PATH}/${business.id}`} className="hover:text-bayan-blue hover:underline">
                    {business.name}
                </Link>
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{business.description}</p>

            <ul className="mt-4 space-y-1.5 text-xs font-bold text-slate-500">
                <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                        {business.barangay} · {business.address}
                    </span>
                </li>
                {business.hours && (
                    <li className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{business.hours}</span>
                    </li>
                )}
            </ul>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold text-bayan-blue">
                {business.online && (
                    <a href={onlineHref(business.online)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                        <Globe className="h-4 w-4" /> {page.online}
                    </a>
                )}
                <a href={telHref(business.phone)} className="inline-flex items-center gap-1 hover:underline">
                    <PhoneCall className="h-4 w-4" /> {page.call}
                </a>
            </div>

            <div className="mt-auto border-t border-slate-100 pt-4">
                <Link to={`${PAGE_PATH}/${business.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-bayan-ink hover:gap-2 hover:text-bayan-blue">
                    {page.viewDetails} <ArrowRight className="h-4 w-4 transition-all" />
                </Link>
            </div>
        </article>
    )
}

const BusinessDirectoryPage = () => {
    const { lang, t } = useLanguage()
    const copy = businessDirectoryCopy[lang]
    const page = copy.directory
    const { categories, barangays, optionsLoading, categoryName } = useBusinessDirectory()

    // Search, filters and page live in the query string so results are shareable and survive a refresh.
    const [searchParams, setSearchParams] = useSearchParams()
    const urlQuery = searchParams.get("q") ?? ""
    const category = searchParams.get("category") ?? ""
    const barangay = searchParams.get("barangay") ?? ""
    const currentPage = Math.max(1, Number.parseInt(searchParams.get("page") ?? "", 10) || 1)
    const hasFilters = Boolean(urlQuery || category || barangay)

    const list = useBusinessList({ q: urlQuery, category, barangay, page: currentPage })
    const { businesses, pagination } = list

    /** Any filter change resets to page 1. */
    const updateParams = useCallback(
        (patch: Partial<Record<FilterKey, string>>, replace = false) => {
            setSearchParams(
                (current) => {
                    const next = new URLSearchParams(current)
                    if (!("page" in patch)) next.delete("page")
                    for (const [key, value] of Object.entries(patch)) {
                        if (value) next.set(key, value)
                        else next.delete(key)
                    }
                    return next
                },
                { replace, preventScrollReset: true }
            )
        },
        [setSearchParams]
    )

    // The search box is debounced into the URL. Back/forward (the URL changing on its own) resets the box.
    const [query, setQuery] = useState(urlQuery)
    const [syncedQuery, setSyncedQuery] = useState(urlQuery)
    if (urlQuery !== syncedQuery) {
        setSyncedQuery(urlQuery)
        setQuery(urlQuery)
    }
    useEffect(() => {
        const trimmed = query.trim()
        if (trimmed === urlQuery) return
        const timer = window.setTimeout(() => {
            setSyncedQuery(trimmed)
            updateParams({ q: trimmed }, true)
        }, SEARCH_DEBOUNCE_MS)
        return () => window.clearTimeout(timer)
    }, [query, urlQuery, updateParams])

    // A shared link can point past the last page once listings are removed; fall back to the last real page.
    useEffect(() => {
        if (!list.loading && pagination && pagination.total > 0 && currentPage > pagination.lastPage) {
            updateParams({ page: pagination.lastPage > 1 ? String(pagination.lastPage) : "" }, true)
        }
    }, [list.loading, pagination, currentPage, updateParams])

    useSeo({
        title: `${page.breadcrumb} | Better Pagbilao`,
        description:
            "Community directory of local businesses in Pagbilao, Quezon: stores, food, farms, services, and online sellers listed by their owners.",
        path: PAGE_PATH,
        jsonLd:
            businesses.length > 0
                ? {
                      "@context": "https://schema.org",
                      "@type": "ItemList",
                      itemListElement: businesses.map((business, index) => ({
                          "@type": "ListItem",
                          position: (pagination ? (pagination.page - 1) * pagination.perPage : 0) + index + 1,
                          url: `${SITE_URL}${PAGE_PATH}/${business.id}`,
                          name: business.name,
                      })),
                  }
                : undefined,
    })

    const goToPage = (next: number) => {
        updateParams({ page: next > 1 ? String(next) : "" })
        document.getElementById("businesses")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    const clearFilters = () => {
        setQuery("")
        setSyncedQuery("")
        setSearchParams({}, { preventScrollReset: true })
    }

    const firstShown = pagination ? (pagination.page - 1) * pagination.perPage + 1 : 0
    const lastShown = firstShown + businesses.length - 1

    const selectClass =
        "rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold focus:border-bayan-blue focus:outline-none focus:ring-2 focus:ring-bayan-blue/25 lg:w-48"

    return (
        <>
            {/* Hero */}
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb items={[{ label: t.services.breadcrumbHome, to: "/" }, { label: copy.breadcrumbCommunity }, { label: page.breadcrumb }]} />
                    <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{page.eyebrow}</p>
                            <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-normal sm:text-4xl lg:text-5xl lg:leading-[1.1]">{page.heading}</h1>
                            <p className="mt-4 max-w-2xl text-base leading-8 text-white/76">{page.intro}</p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    to={ADD_PATH}
                                    className="inline-flex items-center gap-2 rounded-md bg-bayan-gold px-5 py-3 text-sm font-black text-bayan-ink transition hover:bg-amber-400"
                                >
                                    <FilePlus2 className="h-4 w-4" /> {page.ctaAdd}
                                </Link>
                                <a
                                    href="#businesses"
                                    className="inline-flex items-center gap-2 rounded-md bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/16"
                                >
                                    {page.ctaBrowse} <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        <ol className="grid gap-3">
                            {page.steps.map((step, index) => {
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

            {/* Directory */}
            <section id="businesses" className="scroll-mt-32 bg-white py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-black sm:text-3xl">{page.listHeading}</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{page.listIntro}</p>
                    </div>

                    <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="relative w-full lg:max-w-sm">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={query}
                                placeholder={page.searchPlaceholder}
                                aria-label={page.searchPlaceholder}
                                onChange={(event) => setQuery(event.target.value)}
                                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 focus:border-bayan-blue focus:outline-none focus:ring-2 focus:ring-bayan-blue/25"
                            />
                        </div>
                        <select
                            aria-label={page.allBarangays}
                            value={barangay}
                            disabled={optionsLoading}
                            onChange={(event) => updateParams({ barangay: event.target.value })}
                            className={selectClass}
                        >
                            <option value="">{page.allBarangays}</option>
                            {barangays.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {optionsLoading
                            ? Array.from({ length: 8 }, (_, index) => <span key={index} className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />)
                            : [{ slug: "", name: page.allCategories }, ...categories].map(({ slug, name }) => {
                                  const active = category === slug
                                  return (
                                      <button
                                          key={slug || "all"}
                                          type="button"
                                          aria-pressed={active}
                                          onClick={() => updateParams({ category: slug })}
                                          className={`rounded-full px-3.5 py-1.5 text-xs font-black transition ${
                                              active ? "bg-bayan-ink text-white" : "bg-bayan-mist text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                                          }`}
                                      >
                                          {name}
                                      </button>
                                  )
                              })}
                    </div>

                    <div aria-live="polite">
                        {list.loading && businesses.length === 0 ? (
                            <p className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                                <LoaderCircle className="h-4 w-4 animate-spin text-bayan-blue" /> {page.loading}
                            </p>
                        ) : list.failed ? (
                            <div className="mt-8 flex flex-wrap items-center gap-3 rounded-lg border border-bayan-red/40 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                                <p className="min-w-0 flex-1 basis-56">{page.loadFailed}</p>
                                <button type="button" onClick={list.reload} className="rounded-md bg-white px-3 py-2 text-xs font-black ring-1 ring-bayan-red/30 hover:bg-red-100">
                                    {page.retry}
                                </button>
                            </div>
                        ) : businesses.length === 0 ? (
                            <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-bayan-mist p-8 text-center">
                                <p className="text-sm font-semibold text-slate-500">{hasFilters ? page.emptyFiltered : page.emptyAll}</p>
                                {hasFilters ? (
                                    <button type="button" onClick={clearFilters} className="mt-4 text-sm font-black text-bayan-blue underline underline-offset-2">
                                        {page.clearFilters}
                                    </button>
                                ) : (
                                    <Link
                                        to={ADD_PATH}
                                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-bayan-blue px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                                    >
                                        <FilePlus2 className="h-4 w-4" /> {page.ctaAdd}
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                <p className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                                    {pagination && page.resultCount(firstShown, lastShown, pagination.total)}
                                    {list.loading && <LoaderCircle className="h-3.5 w-3.5 animate-spin text-bayan-blue" aria-label={page.loading} />}
                                </p>

                                <div className={`mt-4 grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${list.loading ? "opacity-60" : ""}`}>
                                    {businesses.map((business) => (
                                        <BusinessCard key={business.id} business={business} categoryName={categoryName(business.category)} page={page} />
                                    ))}
                                </div>

                                {pagination && pagination.lastPage > 1 && (
                                    <nav aria-label={page.pagination.label} className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => goToPage(pagination.page - 1)}
                                            disabled={pagination.page <= 1 || list.loading}
                                            className="inline-flex items-center gap-2 rounded-md bg-bayan-mist px-4 py-2.5 text-sm font-black text-bayan-blue ring-1 ring-slate-200 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ArrowLeft className="h-4 w-4" /> {page.pagination.previous}
                                        </button>
                                        <p className="text-sm font-bold text-slate-600" aria-current="page">
                                            {page.pagination.page(pagination.page, pagination.lastPage)}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => goToPage(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.lastPage || list.loading}
                                            className="inline-flex items-center gap-2 rounded-md bg-bayan-mist px-4 py-2.5 text-sm font-black text-bayan-blue ring-1 ring-slate-200 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {page.pagination.next} <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </nav>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Call to action */}
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto grid max-w-[1600px] gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:px-8">
                    <div>
                        <h2 className="text-2xl font-black sm:text-3xl">{page.cta.heading}</h2>
                        <p className="mt-3 max-w-xl text-base leading-8 text-white/76">{page.cta.body}</p>
                    </div>
                    <div className="flex flex-col items-start gap-4 lg:items-end">
                        <Link
                            to={ADD_PATH}
                            className="inline-flex items-center gap-2 rounded-md bg-bayan-gold px-5 py-3 text-sm font-black text-bayan-ink transition hover:bg-amber-400"
                        >
                            <FilePlus2 className="h-4 w-4" /> {page.cta.button}
                        </Link>
                        <Link to="/services/business-and-permits" className="inline-flex items-center gap-1 text-sm font-bold text-white/76 hover:gap-2 hover:text-white">
                            {page.cta.permitsLink} <ArrowRight className="h-4 w-4 transition-all" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default BusinessDirectoryPage
