import { Check, Link2, Mail, Share2 } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"
import type { ReactNode } from "react"
import { shareCopy } from "../../i18n/share"
import { useLanguage } from "../../i18n/useLanguage"

const SITE_URL = "https://betterpagbilao.org"
const COPIED_MS = 2000
// Tailwind w-64, plus a margin kept clear of the screen edge
const MENU_WIDTH = 256
const EDGE_GAP = 8

type ShareButtonProps = {
    /** What is being shared, e.g. the business or destination name */
    title: string
    /** Site path of the page. The canonical URL is shared, never the address bar (which may carry filters). */
    path: string
    /** "dark" sits on the navy hero, "light" on white or mist sections */
    tone?: "dark" | "light"
    /** Which edge of the button the menu hangs from. It flips by itself if that side would run off the screen. */
    align?: "left" | "right"
}

type ShareMethod = "native" | "facebook" | "x" | "email" | "copy"

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
)

const XIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

/** Phones and tablets get their own share sheet (Messenger, Viber, SMS...); desktops get the menu. */
function prefersNativeShare(): boolean {
    return typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches
}

function track(method: ShareMethod, path: string) {
    // GA4's recommended "share" event, through the site's existing Tag Manager container.
    const { dataLayer } = window as unknown as { dataLayer?: unknown[] }
    dataLayer?.push({ event: "share", method, item_id: path })
}

const ShareButton = ({ title, path, tone = "dark", align = "left" }: ShareButtonProps) => {
    const { lang } = useLanguage()
    const copy = shareCopy[lang]
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [alignRight, setAlignRight] = useState(align === "right")
    const wrapper = useRef<HTMLDivElement>(null)
    const menuId = useId()

    const url = `${SITE_URL}${path}`
    const message = `${title} ${copy.via}`

    useEffect(() => {
        if (!open) return
        const onPointerDown = (event: PointerEvent) => {
            if (!wrapper.current?.contains(event.target as Node)) setOpen(false)
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false)
        }
        document.addEventListener("pointerdown", onPointerDown)
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("pointerdown", onPointerDown)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [open])

    useEffect(() => {
        if (!copied) return
        const timer = window.setTimeout(() => setCopied(false), COPIED_MS)
        return () => window.clearTimeout(timer)
    }, [copied])

    const onShare = async () => {
        if (!prefersNativeShare()) {
            const rect = wrapper.current?.getBoundingClientRect()
            if (rect) {
                const fitsLeft = rect.left + MENU_WIDTH <= window.innerWidth - EDGE_GAP
                const fitsRight = rect.right - MENU_WIDTH >= EDGE_GAP
                setAlignRight(align === "right" ? fitsRight || !fitsLeft : !fitsLeft && fitsRight)
            }
            setOpen((current) => !current)
            return
        }
        try {
            await navigator.share({ title, text: message, url })
            track("native", path)
        } catch (error) {
            // Closing the share sheet is not an error; anything else falls back to the menu.
            if (!(error instanceof DOMException && error.name === "AbortError")) setOpen(true)
        }
    }

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            track("copy", path)
        } catch {
            // Clipboard blocked (old browser or insecure page): leave the link visible to copy by hand.
        }
    }

    const encodedUrl = encodeURIComponent(url)
    const links: { method: ShareMethod; label: string; href: string; icon: ReactNode; color: string }[] = [
        { method: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: <FacebookIcon />, color: "bg-[#1877f2] text-white" },
        { method: "x", label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodedUrl}`, icon: <XIcon />, color: "bg-black text-white" },
        { method: "email", label: copy.email, href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${message}\n\n${url}`)}`, icon: <Mail className="h-4 w-4" />, color: "bg-slate-100 text-slate-700" },
    ]

    const buttonClass =
        tone === "dark"
            ? "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/16"
            : "bg-white text-bayan-ink ring-1 ring-slate-300 hover:bg-slate-50"
    const rowClass = "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm font-bold text-bayan-ink transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"

    return (
        <div ref={wrapper} className="relative inline-block">
            <button
                type="button"
                onClick={onShare}
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls={menuId}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition ${buttonClass}`}
            >
                <Share2 className="h-4 w-4" /> {copy.share}
            </button>

            {open && (
                <div
                    id={menuId}
                    className={`absolute top-full z-40 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 text-left shadow-soft ring-1 ring-slate-900/5 ${alignRight ? "right-0" : "left-0"}`}
                >
                    <p className="px-2 pb-1 pt-1.5 text-xs font-black uppercase tracking-[0.14em] text-slate-500">{copy.heading}</p>
                    {links.map(({ method, label, href, icon, color }) => (
                        <a
                            key={method}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                                track(method, path)
                                setOpen(false)
                            }}
                            className={rowClass}
                        >
                            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${color}`}>{icon}</span>
                            {label}
                        </a>
                    ))}
                    <button type="button" onClick={onCopy} className={rowClass}>
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${copied ? "bg-emerald-50 text-bayan-green" : "bg-blue-50 text-bayan-blue"}`}>
                            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                        </span>
                        <span aria-live="polite">{copied ? copy.copied : copy.copyLink}</span>
                    </button>
                    <p className="mx-2 mt-1 truncate border-t border-slate-100 pt-2 text-xs font-semibold text-slate-500" title={url}>
                        {url.replace("https://", "")}
                    </p>
                </div>
            )}
        </div>
    )
}

export default ShareButton
