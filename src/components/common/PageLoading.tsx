import { useLanguage } from "../../i18n/useLanguage"
import { MascotPair } from "./Mascots"

const bar = "rounded-md bg-slate-200 motion-safe:animate-pulse"

/**
 * Fallback while a lazy route loads: a skeleton shaped like a page (navy banner + cards) with the
 * mascots, and a min-height so the footer doesn't jump up and down between routes.
 */
const PageLoading = () => {
    const { t } = useLanguage()
    return (
        <div role="status" aria-live="polite" className="min-h-[80vh] bg-bayan-mist">
            <span className="sr-only">{t.mascots.loading}</span>

            <div aria-hidden className="bg-bayan-ink py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="h-3 w-40 rounded-md bg-white/10 motion-safe:animate-pulse" />
                    <div className="mt-7 h-3 w-32 rounded-md bg-white/15 motion-safe:animate-pulse" />
                    <div className="mt-4 h-9 w-3/4 max-w-xl rounded-md bg-white/15 motion-safe:animate-pulse" />
                    <div className="mt-5 h-3 w-full max-w-2xl rounded-md bg-white/10 motion-safe:animate-pulse" />
                    <div className="mt-3 h-3 w-2/3 max-w-xl rounded-md bg-white/10 motion-safe:animate-pulse" />
                </div>
            </div>

            <div aria-hidden className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <MascotPair size="sm" bob />
                    <p className="text-sm font-bold text-slate-500">{t.mascots.loading}</p>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2].map((card) => (
                        <div key={card} className="rounded-lg border border-slate-200 bg-white p-5">
                            <div className={`h-11 w-11 ${bar}`} />
                            <div className={`mt-4 h-4 w-2/3 ${bar}`} />
                            <div className={`mt-3 h-3 w-full ${bar}`} />
                            <div className={`mt-2 h-3 w-5/6 ${bar}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PageLoading
