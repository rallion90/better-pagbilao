import {
    BookOpenCheck,
    BriefcaseBusiness,
    ChevronDown,
    ClipboardCheck,
    FileDown,
    FolderDown,
    HeartPulse,
    Landmark,
    MapPinned,
    Palmtree,
    Route,
    Search,
    ShieldAlert,
    Siren,
    Sprout,
    UsersRound,
    Wheat,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"

type NavMenu = {
    id: string
    label: string
    description: string
    items: {
        label: string
        href: string
        description: string
        Icon: LucideIcon
        color: string
    }[]
}

const navMenus: NavMenu[] = [
    {
        id: "services",
        label: "Services",
        description: "Resident, business, health, safety, and livelihood pathways.",
        items: [
            { label: "Business and Permits", href: "#services", description: "Permits, renewals, zoning, and clearances.", Icon: BriefcaseBusiness, color: "text-bayan-blue bg-blue-50" },
            { label: "Health Services", href: "#services", description: "MHO support, wellness, and local referrals.", Icon: HeartPulse, color: "text-bayan-red bg-red-50" },
            { label: "Disaster and Safety", href: "#hotlines", description: "Rescue, police, fire, and emergency contacts.", Icon: ShieldAlert, color: "text-bayan-green bg-emerald-50" },
            { label: "Agriculture and Livelihood", href: "#services", description: "Support for farmers, fisherfolk, and enterprises.", Icon: Wheat, color: "text-amber-700 bg-amber-50" },
            { label: "Social Welfare", href: "#services", description: "Assistance for families, seniors, PWDs, and youth.", Icon: UsersRound, color: "text-bayan-blue bg-blue-50" },
            { label: "Tourism and Culture", href: "#tourism", description: "Destinations, festivals, and visitor pathways.", Icon: Palmtree, color: "text-bayan-green bg-emerald-50" },
        ],
    },
    {
        id: "explore",
        label: "Explore",
        description: "Maps, place identity, tourism, and town history.",
        items: [
            { label: "Barangay Map", href: "#barangays", description: "View all 27 barangays with local profile details.", Icon: MapPinned, color: "text-bayan-blue bg-blue-50" },
            { label: "History of Pagbilao", href: "#history", description: "Read the papag and bilao origin story.", Icon: Sprout, color: "text-bayan-green bg-emerald-50" },
            { label: "Gateway Location", href: "#tourism", description: "Bay, highway, and upland community context.", Icon: Route, color: "text-bayan-gold bg-amber-50" },
        ],
    },
    {
        id: "transparency",
        label: "Transparency",
        description: "Public records, forms, accountability, and civic access.",
        items: [
            { label: "Public Documents", href: "#transparency", description: "Ordinances, executive orders, and references.", Icon: FileDown, color: "text-bayan-green bg-emerald-50" },
            { label: "Procurement", href: "#transparency", description: "Bids, notices, and accountability entries.", Icon: ClipboardCheck, color: "text-bayan-blue bg-blue-50" },
            { label: "Citizen's Charter", href: "#transparency", description: "Service standards and resident-facing guidance.", Icon: BookOpenCheck, color: "text-bayan-red bg-red-50" },
            { label: "Forms", href: "#transparency", description: "Permits, clearances, and downloadable files.", Icon: FolderDown, color: "text-amber-700 bg-amber-50" },
        ],
    },
]

const BottomHeader = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null)

    return (
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <a href="#home" className="flex min-w-0 items-center gap-4" aria-label="Better Pagbilao home">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white p-1.5 shadow-soft ring-1 ring-slate-200 sm:h-20 sm:w-20">
                    <img src="logo.png" alt="Bayan ng Pagbilao official seal" className="h-full w-full object-contain" />
                </span>
                <span className="min-w-0">
                    <span className="block truncate text-xl font-extrabold tracking-tight sm:text-2xl">Pagbilao, Quezon</span>
                    <span className="block truncate text-sm font-medium text-slate-500" data-i18n="tagline">Bayan services, made easier</span>
                </span>
            </a>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation" onMouseLeave={() => setOpenMenu(null)}>
                {navMenus.map((menu) => {
                    const isOpen = openMenu === menu.id

                    return (
                        <div key={menu.id} className="relative" onMouseEnter={() => setOpenMenu(menu.id)}>
                            <button
                                type="button"
                                className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition ${isOpen ? "bg-slate-100 text-bayan-ink" : "text-slate-700 hover:bg-slate-100"}`}
                                aria-expanded={isOpen}
                                aria-haspopup="true"
                                onClick={() => setOpenMenu(isOpen ? null : menu.id)}
                                onFocus={() => setOpenMenu(menu.id)}
                            >
                                {menu.label}
                                <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isOpen ? (
                                <div className="absolute left-1/2 top-full z-50 w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 pt-3">
                                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft ring-1 ring-slate-900/5">
                                        <div className="border-b border-slate-200 bg-bayan-mist px-5 py-4">
                                            <p className="text-xs font-black uppercase tracking-[0.16em] text-bayan-blue">{menu.label}</p>
                                            <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{menu.description}</p>
                                        </div>
                                        <div className="grid gap-1 p-2 sm:grid-cols-2">
                                            {menu.items.map(({ label, href, description, Icon, color }) => (
                                                <a
                                                    key={label}
                                                    href={href}
                                                    onClick={() => setOpenMenu(null)}
                                                    className="grid grid-cols-[auto_1fr] gap-3 rounded-md p-3 text-left transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                                                >
                                                    <span className={`grid h-10 w-10 place-items-center rounded-md ${color}`}>
                                                        <Icon className="h-5 w-5" />
                                                    </span>
                                                    <span>
                                                        <span className="block text-sm font-black text-bayan-ink">{label}</span>
                                                        <span className="mt-0.5 block text-xs font-semibold leading-5 text-slate-500">{description}</span>
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )
                })}

                <a className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#hotlines" data-i18n="navHotlines">
                    <Siren className="h-4 w-4 text-bayan-red" />
                    Hotlines
                </a>
                <a className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#history">
                    <Landmark className="h-4 w-4 text-bayan-green" />
                    History
                </a>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
                <div className="hidden rounded-md border border-slate-200 bg-slate-50 p-1 sm:inline-flex" aria-label="Language switcher">
                    <button
                        type="button"
                        data-language="en"
                        className="rounded bg-bayan-blue px-2.5 py-1.5 text-xs font-black text-white shadow-sm transition sm:px-3"
                    >
                        English
                    </button>
                    <button
                        type="button"
                        data-language="tl"
                        className="rounded px-2.5 py-1.5 text-xs font-black text-slate-600 transition hover:text-bayan-ink sm:px-3"
                    >
                        Tagalog
                    </button>
                </div>
                <button
                    type="button"
                    id="header-search-button"
                    className="inline-flex items-center gap-2 rounded-md bg-bayan-blue px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:px-4"
                >
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline" data-i18n="headerSearch">Search</span>
                </button>
            </div>
        </div>
    )
}

export default BottomHeader
