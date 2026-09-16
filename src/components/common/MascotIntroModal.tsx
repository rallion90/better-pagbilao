import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { Bilao, Papag } from "../chat/ChatMascots"
import { OPEN_CHAT_EVENT } from "../chat/ChatFloat"
import { DISCLOSURE_DISMISSED_EVENT, DISCLOSURE_SEEN_KEY } from "./DataDisclosureModal"

const STORAGE_KEY = "bp_mascot_intro_seen_v1"
const SEEN_DISCLOSURE_ALREADY_DELAY_MS = 900
const AFTER_DISCLOSURE_DELAY_MS = 500

const MascotIntroModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useLanguage()
    const copy = t.mascotIntro

    const markSeen = () => {
        try {
            window.localStorage.setItem(STORAGE_KEY, "true")
        } catch {
            // ignore storage errors, no impact on close behavior
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        markSeen()
    }

    const handleSayHi = () => {
        setIsOpen(false)
        markSeen()
        window.dispatchEvent(new Event(OPEN_CHAT_EVENT))
    }

    useEffect(() => {
        let hasSeenIntro: boolean
        let hasSeenDisclosure: boolean
        try {
            hasSeenIntro = window.localStorage.getItem(STORAGE_KEY) === "true"
            hasSeenDisclosure = window.localStorage.getItem(DISCLOSURE_SEEN_KEY) === "true"
        } catch {
            hasSeenIntro = false
            hasSeenDisclosure = false
        }

        if (hasSeenIntro) return

        if (hasSeenDisclosure) {
            const timer = window.setTimeout(() => setIsOpen(true), SEEN_DISCLOSURE_ALREADY_DELAY_MS)
            return () => window.clearTimeout(timer)
        }

        const handleDisclosureDismissed = () => {
            window.setTimeout(() => setIsOpen(true), AFTER_DISCLOSURE_DELAY_MS)
        }
        window.addEventListener(DISCLOSURE_DISMISSED_EVENT, handleDisclosureDismissed)
        return () => window.removeEventListener(DISCLOSURE_DISMISSED_EVENT, handleDisclosureDismissed)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-bayan-ink/70 p-4 py-8 backdrop-blur-sm sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mascot-intro-title"
            onClick={handleClose}
        >
            <div
                className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-soft ring-1 ring-slate-900/10"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flag-ribbon h-1.5 w-full shrink-0" />

                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-bayan-mist px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="flex shrink-0 items-center -space-x-2.5">
                            <Papag className="h-11 w-11 animate-mascot-bob rounded-full bg-blue-50 ring-2 ring-white" style={{ animationDelay: "0s" }} />
                            <Bilao className="h-11 w-11 animate-mascot-bob rounded-full bg-amber-50 ring-2 ring-white" style={{ animationDelay: "0.3s" }} />
                        </span>
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-bayan-blue">{copy.eyebrow}</p>
                            <h2 id="mascot-intro-title" className="text-lg font-black text-bayan-ink">{copy.title}</h2>
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

                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                    <p className="text-sm leading-6 text-slate-600">{copy.intro}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="group rounded-lg border border-slate-200 p-4 transition hover:border-bayan-blue hover:shadow-sm">
                            <Papag className="h-16 w-16 transition-transform duration-300 group-hover:-translate-y-1" />
                            <h3 className="mt-3 text-sm font-black text-bayan-ink">{copy.papagName}</h3>
                            <p className="mt-1 text-xs leading-5 text-slate-500">{copy.papagBlurb}</p>
                        </div>
                        <div className="group rounded-lg border border-slate-200 p-4 transition hover:border-bayan-gold hover:shadow-sm">
                            <Bilao className="h-16 w-16 transition-transform duration-300 group-hover:-translate-y-1" />
                            <h3 className="mt-3 text-sm font-black text-bayan-ink">{copy.bilaoName}</h3>
                            <p className="mt-1 text-xs leading-5 text-slate-500">{copy.bilaoBlurb}</p>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-sm font-bold text-slate-500 transition hover:text-bayan-ink"
                    >
                        {copy.maybeLater}
                    </button>
                    <button
                        type="button"
                        onClick={handleSayHi}
                        className="inline-flex items-center justify-center rounded-md bg-bayan-blue px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
                    >
                        {copy.sayHi}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MascotIntroModal
