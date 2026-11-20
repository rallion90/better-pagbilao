import { useLanguage } from "../../i18n/useLanguage"
import { MascotPair } from "./Mascots"

/** Fallback while a lazy route loads. Holds the page height so the footer doesn't jump up. */
const PageLoading = () => {
    const { t } = useLanguage()
    return (
        <div role="status" aria-live="polite" className="grid min-h-[70vh] place-items-center bg-bayan-mist px-4">
            <div className="text-center">
                <MascotPair size="md" bob />
                <p className="mt-4 text-sm font-bold text-slate-500">{t.mascots.loading}</p>
            </div>
        </div>
    )
}

export default PageLoading
