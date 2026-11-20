import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { Bilao, Papag } from "../chat/ChatMascots"
import { CHAT_OPENED_EVENT, OPEN_CHAT_EVENT } from "../chat/ChatFloat"
import { DISCLOSURE_DISMISSED_EVENT, DISCLOSURE_SEEN_KEY } from "./DataDisclosureModal"

const STORAGE_KEY = "bp_mascot_intro_seen_v1"
const SEEN_DISCLOSURE_ALREADY_DELAY_MS = 1500
const AFTER_DISCLOSURE_DELAY_MS = 800

/**
 * First-visit introduction to Papag & Bilao, as a small non-blocking toast above the chat button
 * (it used to be a second modal stacked after the transparency notice). It never takes focus,
 * does not lock scrolling, closes with Escape, and goes away for good once dismissed or once the chat opens.
 */
const MascotIntroToast = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useLanguage()
    const copy = t.mascotIntro

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

        let timer = 0
        const open = (delay: number) => {
            timer = window.setTimeout(() => setIsOpen(true), delay)
        }
        const handleDisclosureDismissed = () => open(AFTER_DISCLOSURE_DELAY_MS)

        if (hasSeenDisclosure) open(SEEN_DISCLOSURE_ALREADY_DELAY_MS)
        else window.addEventListener(DISCLOSURE_DISMISSED_EVENT, handleDisclosureDismissed)

        return () => {
            window.clearTimeout(timer)
            window.removeEventListener(DISCLOSURE_DISMISSED_EVENT, handleDisclosureDismissed)
        }
    }, [])

    useEffect(() => {
        if (!isOpen) return
        const close = () => {
            setIsOpen(false)
            try {
                window.localStorage.setItem(STORAGE_KEY, "true")
            } catch {
                // storage unavailable: the toast may show again next visit
            }
        }
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") close()
        }
        window.addEventListener("keydown", onKey)
        window.addEventListener(CHAT_OPENED_EVENT, close)
        return () => {
            window.removeEventListener("keydown", onKey)
            window.removeEventListener(CHAT_OPENED_EVENT, close)
        }
    }, [isOpen])

    if (!isOpen) return null

    const dismiss = () => {
        setIsOpen(false)
        try {
            window.localStorage.setItem(STORAGE_KEY, "true")
        } catch {
            // storage unavailable: the toast may show again next visit
        }
    }

    return (
        <section
            aria-labelledby="mascot-intro-title"
            className="fixed bottom-24 right-4 z-60 w-[min(22rem,calc(100vw-2rem))] rounded-xl bg-white p-4 shadow-soft ring-1 ring-slate-900/10 sm:bottom-28 sm:right-6"
        >
            <div className="flex items-start gap-3">
                <span aria-hidden className="flex shrink-0 items-center -space-x-2">
                    <Papag className="h-10 w-10 rounded-full bg-blue-50 ring-2 ring-white" />
                    <Bilao className="h-10 w-10 rounded-full bg-amber-50 ring-2 ring-white" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-bayan-blue">{copy.eyebrow}</p>
                    <h2 id="mascot-intro-title" className="text-base font-black text-bayan-ink">
                        {copy.title}
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={dismiss}
                    aria-label={copy.maybeLater}
                    className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-bayan-ink focus-visible:outline-2 focus-visible:outline-bayan-blue"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{copy.intro}</p>
            <div className="mt-3 flex items-center justify-end gap-3">
                <button type="button" onClick={dismiss} className="text-sm font-bold text-slate-500 transition hover:text-bayan-ink">
                    {copy.maybeLater}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        dismiss()
                        window.dispatchEvent(new Event(OPEN_CHAT_EVENT))
                    }}
                    className="inline-flex items-center rounded-md bg-bayan-blue px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
                >
                    {copy.sayHi}
                </button>
            </div>
        </section>
    )
}

export default MascotIntroToast
