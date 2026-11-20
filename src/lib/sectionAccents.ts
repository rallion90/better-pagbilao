import { useLocation } from "react-router"

/**
 * One accent per site section, used only for page-banner eyebrows, icon tiles and small
 * highlights. Red is not a section accent: it is reserved for emergency and hotline UI
 * (and error states).
 *
 * Every class pair below passes WCAG AA for its use (see the token notes in index.css):
 * `onDark` is text on bayan-ink, `text` is text on white/mist, `tile` is an icon tile.
 */
export type SiteSection = "government" | "services" | "transparency" | "explore" | "community"

export type SectionAccent = {
    /** eyebrow / highlight text on the navy banner */
    onDark: string
    /** eyebrow, link or icon color on white or mist */
    text: string
    /** icon tile background + icon color */
    tile: string
    /** a second tile tone, for alternating rows (same as `tile` unless the section has two accents) */
    tileAlt: string
    /** solid fill for small bars and dots */
    bar: string
}

export const SECTION_ACCENTS: Record<SiteSection, SectionAccent> = {
    government: {
        onDark: "text-blue-200",
        text: "text-bayan-ink",
        tile: "bg-bayan-ink text-blue-200",
        tileAlt: "bg-blue-50 text-bayan-blue",
        bar: "bg-bayan-ink",
    },
    services: {
        onDark: "text-emerald-300",
        text: "text-bayan-green",
        tile: "bg-emerald-50 text-bayan-green",
        tileAlt: "bg-emerald-50 text-bayan-green",
        bar: "bg-bayan-green",
    },
    transparency: {
        onDark: "text-sky-300",
        text: "text-bayan-blue",
        tile: "bg-blue-50 text-bayan-blue",
        tileAlt: "bg-blue-50 text-bayan-blue",
        bar: "bg-bayan-blue",
    },
    explore: {
        onDark: "text-bayan-bamboo",
        text: "text-bayan-sea-deep",
        tile: "bg-bayan-sea-light text-bayan-sea-deep",
        tileAlt: "bg-bayan-bamboo-light text-bayan-bamboo-deep",
        bar: "bg-bayan-sea",
    },
    community: {
        onDark: "text-bayan-gold",
        text: "text-amber-700",
        tile: "bg-amber-50 text-amber-700",
        tileAlt: "bg-amber-50 text-amber-700",
        bar: "bg-bayan-gold",
    },
}

/** Pages outside the five sections (home, announcements, hotlines) keep the original gold. */
export const DEFAULT_ACCENT: SectionAccent = SECTION_ACCENTS.community

const SECTION_PREFIXES: [string, SiteSection][] = [
    ["/government", "government"],
    ["/services", "services"],
    ["/transparency", "transparency"],
    ["/explore", "explore"],
    ["/community", "community"],
]

export function sectionForPath(pathname: string): SiteSection | null {
    const match = SECTION_PREFIXES.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    return match ? match[1] : null
}

export function accentForPath(pathname: string): SectionAccent {
    const section = sectionForPath(pathname)
    return section ? SECTION_ACCENTS[section] : DEFAULT_ACCENT
}

/** The accent of the section the current route belongs to. */
export function useSectionAccent(): SectionAccent {
    return accentForPath(useLocation().pathname)
}
