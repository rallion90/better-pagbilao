import type { ReactNode } from "react"
import { Bilao, Papag } from "../chat/ChatMascots"

const PAIR_SIZES = { sm: "h-10 w-10", md: "h-16 w-16", lg: "h-24 w-24" }

/** Papag and Bilao side by side. Decorative: the text around it carries the meaning. Bobbing is skipped under reduced motion. */
export const MascotPair = ({ size = "md", bob = false, className = "" }: { size?: keyof typeof PAIR_SIZES; bob?: boolean; className?: string }) => {
    const sizeClass = PAIR_SIZES[size]
    const bobClass = bob ? "animate-mascot-bob" : ""
    return (
        <div aria-hidden className={`flex items-end justify-center gap-1 ${className}`}>
            <Papag className={`${sizeClass} ${bobClass}`} />
            <Bilao className={`${sizeClass} ${bobClass}`} style={bob ? { animationDelay: "0.3s" } : undefined} />
        </div>
    )
}

/** A small "tip" callout for forms, signed by Bilao. */
export const MascotTip = ({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) => (
    <aside className={`flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-4 ${className}`}>
        <Bilao className="h-11 w-11 shrink-0" />
        <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-800">{label}</p>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-700">{children}</p>
        </div>
    </aside>
)
