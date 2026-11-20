import {
    BookOpenCheck,
    BriefcaseBusiness,
    ClipboardCheck,
    ContactRound,
    FileDown,
    FolderDown,
    HeartPulse,
    MapPinned,
    Palmtree,
    Route,
    Scale,
    ShieldAlert,
    Sprout,
    UsersRound,
    Wheat,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { SECTION_ACCENTS } from "./sectionAccents"

export type NavMenuMeta = {
    id: "services" | "government" | "explore" | "transparency"
    items: {
        href: string
        Icon: LucideIcon
    }[]
}

// In display order. Labels and descriptions live in the translations (t.nav.menus), matched to these items by index.
const NAV_MENUS: NavMenuMeta[] = [
    {
        id: "government",
        items: [
            { href: "/government/legislative-council", Icon: Scale },
            { href: "/government/local-officials-directory", Icon: ContactRound },
        ],
    },
    {
        id: "services",
        items: [
            { href: "/services/business-and-permits", Icon: BriefcaseBusiness },
            { href: "/services/health-services", Icon: HeartPulse },
            { href: "/services/disaster-and-safety", Icon: ShieldAlert },
            { href: "/services/agriculture-and-livelihood", Icon: Wheat },
            { href: "/services/social-welfare", Icon: UsersRound },
        ],
    },
    {
        id: "transparency",
        items: [
            { href: "/transparency/ordinances-and-executive-orders", Icon: FileDown },
            { href: "/transparency/procurement", Icon: ClipboardCheck },
            { href: "/transparency/citizens-charter", Icon: BookOpenCheck },
            { href: "/transparency/permits-and-clearances", Icon: FolderDown },
        ],
    },
    {
        id: "explore",
        items: [
            { href: "/explore/barangays", Icon: MapPinned },
            { href: "/explore/history", Icon: Sprout },
            { href: "/explore/gateway-location", Icon: Route },
            { href: "/explore/tourist-destinations", Icon: Palmtree },
        ],
    },
]

/** Menus with each item's icon tile in its section's accent. */
export const navMenuMeta = NAV_MENUS.map((menu) => ({
    ...menu,
    items: menu.items.map((item, index) => ({
        ...item,
        color: index % 2 === 0 ? SECTION_ACCENTS[menu.id].tile : SECTION_ACCENTS[menu.id].tileAlt,
    })),
}))
