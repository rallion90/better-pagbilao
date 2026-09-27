import { LoaderCircle, Store } from "lucide-react"
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, Outlet } from "react-router"
import PageBreadcrumb from "../common/PageBreadcrumb"
import { BusinessDirectoryContext } from "../../hooks/businessDirectoryContext"
import type { BusinessDirectoryContextValue, BusinessDirectoryState } from "../../hooks/businessDirectoryContext"
import { useBusinessDirectoryStatus } from "../../hooks/useBusinessDirectory"
import { useSeo } from "../../hooks/useSeo"
import { businessDirectoryCopy } from "../../i18n/businessDirectory"
import { useLanguage } from "../../i18n/useLanguage"
import { getBusinessCategories } from "../../lib/businessApi"
import { IssueApiError, getBarangayNames } from "../../lib/issuesApi"
import type { BusinessCategory } from "../../types/businesses"

const DIRECTORY_PATH = "/community/businesses"

const Unavailable = ({ state, message, onRetry }: { state: BusinessDirectoryState; message: string | null; onRetry: () => void }) => {
    const { lang, t } = useLanguage()
    const copy = businessDirectoryCopy[lang]
    const failed = state === "unavailable"

    useSeo({
        title: `${copy.directory.breadcrumb} | Better Pagbilao`,
        description: "The Pagbilao community business directory is temporarily unavailable.",
        path: DIRECTORY_PATH,
        noindex: true,
    })

    return (
        <section className="bg-bayan-ink py-20 text-white sm:py-28">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                <PageBreadcrumb items={[{ label: t.services.breadcrumbHome, to: "/" }, { label: copy.breadcrumbCommunity }, { label: copy.directory.breadcrumb }]} />
                <div className="mx-auto mt-10 max-w-2xl text-center">
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white/10 text-bayan-gold ring-1 ring-white/15">
                        <Store className="h-9 w-9" />
                    </span>
                    <p className="mt-6 inline-flex rounded-full bg-bayan-gold px-3.5 py-1 text-xs font-black uppercase tracking-[0.16em] text-bayan-ink">
                        {copy.unavailable.badge}
                    </p>
                    <h1 className="mt-5 text-3xl font-black sm:text-4xl">{failed ? copy.unavailable.errorHeading : copy.unavailable.heading}</h1>
                    {message && <p className="mt-4 text-base font-bold text-bayan-gold">{message}</p>}
                    <p className="mt-4 text-base leading-8 text-white/76">{failed ? copy.unavailable.errorBody : copy.unavailable.body}</p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        {failed && (
                            <button
                                type="button"
                                onClick={onRetry}
                                className="rounded-md bg-bayan-blue px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                            >
                                {copy.unavailable.retry}
                            </button>
                        )}
                        <Link to="/" className="rounded-md bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/16">
                            {copy.unavailable.backHome}
                        </Link>
                        <Link
                            to="/services/business-and-permits"
                            className="rounded-md bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/16"
                        >
                            {copy.unavailable.permits}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

const Checking = () => {
    const { lang } = useLanguage()
    return (
        <section className="grid min-h-[60vh] place-items-center bg-bayan-mist px-4">
            <p role="status" className="inline-flex items-center gap-3 text-sm font-bold text-slate-500">
                <LoaderCircle className="h-5 w-5 animate-spin text-bayan-blue" /> {businessDirectoryCopy[lang].checking}
            </p>
        </section>
    )
}

/**
 * Layout route for every /community/businesses page. Only renders the pages while BusinessDirectoryProvider says
 * the directory is on. Pages call markDisabled on any 403 so the whole section swaps to the "paused" screen.
 * Also loads the category and barangay lists all three pages share.
 */
const BusinessDirectoryLayout = () => {
    const status = useBusinessDirectoryStatus()
    const { state, message, refresh, markDisabled } = status

    // The provider already checks once on app load. If the app was already past that when the directory opened,
    // check again so a switch flipped by an admin in the meantime is picked up.
    const stateOnMount = useRef(state)
    useEffect(() => {
        if (stateOnMount.current !== "loading") refresh()
    }, [refresh])

    const [categories, setCategories] = useState<BusinessCategory[]>([])
    const [barangays, setBarangays] = useState<string[]>([])
    const [optionsLoading, setOptionsLoading] = useState(true)
    const [optionsFailed, setOptionsFailed] = useState(false)
    const [optionsRequestId, setOptionsRequestId] = useState(0)

    const enabled = state === "enabled"

    useEffect(() => {
        if (!enabled) return
        const controller = new AbortController()

        Promise.all([getBusinessCategories(controller.signal), getBarangayNames(controller.signal)])
            .then(([nextCategories, nextBarangays]) => {
                setCategories(nextCategories)
                setBarangays(nextBarangays)
                setOptionsFailed(false)
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return
                if (error instanceof IssueApiError && error.kind === "disabled") markDisabled(error.message)
                else setOptionsFailed(true)
            })
            .finally(() => {
                if (!controller.signal.aborted) setOptionsLoading(false)
            })

        return () => controller.abort()
    }, [enabled, optionsRequestId, markDisabled])

    const reloadOptions = useCallback(() => {
        setOptionsLoading(true)
        setOptionsRequestId((id) => id + 1)
    }, [])
    const categoryName = useCallback((slug: string) => categories.find((category) => category.slug === slug)?.name ?? "", [categories])

    const value = useMemo<BusinessDirectoryContextValue>(
        () => ({ ...status, categories, barangays, optionsLoading, optionsFailed, reloadOptions, categoryName }),
        [status, categories, barangays, optionsLoading, optionsFailed, reloadOptions, categoryName]
    )

    return (
        <BusinessDirectoryContext.Provider value={value}>
            {state === "loading" ? <Checking /> : state === "enabled" ? (
                <Suspense fallback={<Checking />}>
                    <Outlet />
                </Suspense>
            ) : <Unavailable state={state} message={message} onRetry={refresh} />}
        </BusinessDirectoryContext.Provider>
    )
}

export default BusinessDirectoryLayout
