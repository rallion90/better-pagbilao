import { useEffect, useState } from "react"
import { Bot, Database, Info, ShieldCheck, X } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"

const STORAGE_KEY = "bp_data_disclosure_seen_v1"
const OPEN_DELAY_MS = 1200

const POINT_ICONS = [Database, Bot, ShieldCheck]
const POINT_COLORS = ["bg-blue-50 text-bayan-blue", "bg-cyan-50 text-cyan-600", "bg-emerald-50 text-bayan-green"]

const DataDisclosureModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useLanguage()

    const handleClose = () => {
        setIsOpen(false)
        try {
            window.localStorage.setItem(STORAGE_KEY, "true")
        } catch {
            // ignore storage errors, no impact on close behavior
        }
    }

    useEffect(() => {
        let hasSeen: boolean
        try {
            hasSeen = window.localStorage.getItem(STORAGE_KEY) === "true"
        } catch {
            hasSeen = false
        }

        if (hasSeen) return

        const timer = window.setTimeout(() => setIsOpen(true), OPEN_DELAY_MS)
        return () => window.clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!isOpen) return

        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") handleClose()
        }
        window.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = originalOverflow
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bayan-ink/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="data-disclosure-title"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-soft ring-1 ring-slate-900/10"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flag-ribbon h-1.5 w-full" />

                <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-bayan-mist px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-bayan-blue text-white shadow-sm">
                            <Info className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-bayan-blue">{t.disclosure.eyebrow}</p>
                            <h2 id="data-disclosure-title" className="text-lg font-black text-bayan-ink">{t.disclosure.title}</h2>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-white hover:text-bayan-ink"
                        aria-label="Close"
                        onClick={handleClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-6 py-6">
                    <p className="text-sm leading-6 text-slate-600">{t.disclosure.intro}</p>

                    <div className="mt-5 space-y-4">
                        {t.disclosure.points.map((point, index) => {
                            const Icon = POINT_ICONS[index]
                            return (
                                <div key={point.title} className="flex gap-3">
                                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${POINT_COLORS[index]}`}>
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <h3 className="text-sm font-black text-bayan-ink">{point.title}</h3>
                                        <p className="mt-0.5 text-sm leading-6 text-slate-600">{point.body}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <p className="mt-5 text-xs font-semibold leading-5 text-slate-500">
                        {t.disclosure.footNote}{" "}
                        <a href="#transparency" onClick={handleClose} className="font-black text-bayan-blue underline underline-offset-2">
                            {t.disclosure.letUsKnow}
                        </a>{" "}
                        {t.disclosure.footNoteEnd}
                    </p>
                </div>

                <div className="flex justify-end border-t border-slate-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex items-center justify-center rounded-md bg-bayan-blue px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
                    >
                        {t.disclosure.closeButton}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DataDisclosureModal
