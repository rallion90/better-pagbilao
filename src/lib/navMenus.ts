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

export type NavMenuMeta = {
    id: "services" | "government" | "explore" | "transparency"
    items: {
        href: string
        Icon: LucideIcon
        color: string
    }[]
}

// In display order. Labels and descriptions live in the translations (t.nav.menus), matched to these items by index.
export const navMenuMeta: NavMenuMeta[] = [
    {
        id: "government",
        items: [
            { href: "/government/legislative-council", Icon: Scale, color: "text-bayan-blue bg-blue-50" },
            { href: "/government/local-officials-directory", Icon: ContactRound, color: "text-bayan-green bg-emerald-50" },
        ],
    },
    {
        id: "services",
        items: [
            { href: "/services/business-and-permits", Icon: BriefcaseBusiness, color: "text-bayan-blue bg-blue-50" },
            { href: "/services/health-services", Icon: HeartPulse, color: "text-bayan-red bg-red-50" },
            { href: "/services/disaster-and-safety", Icon: ShieldAlert, color: "text-bayan-green bg-emerald-50" },
            { href: "/services/agriculture-and-livelihood", Icon: Wheat, color: "text-amber-700 bg-amber-50" },
            { href: "/services/social-welfare", Icon: UsersRound, color: "text-bayan-blue bg-blue-50" },
        ],
    },
    {
        id: "transparency",
        items: [
            { href: "/transparency/ordinances-and-executive-orders", Icon: FileDown, color: "text-bayan-green bg-emerald-50" },
            { href: "/transparency/procurement", Icon: ClipboardCheck, color: "text-bayan-blue bg-blue-50" },
            { href: "/transparency/citizens-charter", Icon: BookOpenCheck, color: "text-bayan-red bg-red-50" },
            { href: "/transparency/permits-and-clearances", Icon: FolderDown, color: "text-amber-700 bg-amber-50" },
        ],
    },
    {
        id: "explore",
        items: [
            { href: "/explore/barangays", Icon: MapPinned, color: "text-bayan-blue bg-blue-50" },
            { href: "/explore/history", Icon: Sprout, color: "text-bayan-green bg-emerald-50" },
            { href: "/explore/gateway-location", Icon: Route, color: "text-bayan-gold bg-amber-50" },
            { href: "/explore/tourist-destinations", Icon: Palmtree, color: "text-bayan-red bg-red-50" },
        ],
    },
]
