import {
    BookOpenCheck,
    BriefcaseBusiness,
    ChevronDown,
    ClipboardCheck,
    FileDown,
    FolderDown,
    HeartPulse,
    MapPinned,
    Palmtree,
    Route,
    Search,
    ShieldAlert,
    Sprout,
    UsersRound,
    Wheat,
    Building2,
    Scale,
    ContactRound
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "../../i18n/useLanguage"

type NavMenuMeta = {
    id: string
    items: {
        href: string
        Icon: LucideIcon
        color: string
    }[]
}

const navMenuMeta: NavMenuMeta[] = [
    {
        id: "services",
        items: [
            { href: "#services", Icon: BriefcaseBusiness, color: "text-bayan-blue bg-blue-50" },
            { href: "#services", Icon: HeartPulse, color: "text-bayan-red bg-red-50" },
            { href: "#hotlines", Icon: ShieldAlert, color: "text-bayan-green bg-emerald-50" },
            { href: "#services", Icon: Wheat, color: "text-amber-700 bg-amber-50" },
            { href: "#services", Icon: UsersRound, color: "text-bayan-blue bg-blue-50" },
            { href: "#tourism", Icon: Palmtree, color: "text-bayan-green bg-emerald-50" },
        ],
    },
    {
        id: "government",
        items: [
            { href: "#services", Icon: Building2, color: "text-bayan-blue bg-blue-50" },
            { href: "#services", Icon: Scale, color: "text-bayan-red bg-red-50" },
            { href: "#hotlines", Icon: ContactRound, color: "text-bayan-green bg-emerald-50" },
        ],
    },
    {
        id: "explore",
        items: [
            { href: "#barangays", Icon: MapPinned, color: "text-bayan-blue bg-blue-50" },
            { href: "#history", Icon: Sprout, color: "text-bayan-green bg-emerald-50" },
            { href: "#tourism", Icon: Route, color: "text-bayan-gold bg-amber-50" },
        ],
    },
    {
        id: "transparency",
        items: [
            { href: "#transparency", Icon: FileDown, color: "text-bayan-green bg-emerald-50" },
            { href: "#transparency", Icon: ClipboardCheck, color: "text-bayan-blue bg-blue-50" },
            { href: "#transparency", Icon: BookOpenCheck, color: "text-bayan-red bg-red-50" },
            { href: "#transparency", Icon: FolderDown, color: "text-amber-700 bg-amber-50" },
        ],
    },
]

const BottomHeader = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const { lang, setLang, t } = useLanguage()

    const navMenus = navMenuMeta.map((menu) => {
        const text = t.nav.menus[menu.id as keyof typeof t.nav.menus]
        return {
            ...menu,
            label: text.label,
            description: text.description,
            items: menu.items.map((item, index) => ({
                ...item,
                label: text.items[index].label,
                description: text.items[index].description,
            })),
        }
    })

    return (
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
            <a href="#home" className="flex min-w-0 items-center gap-4" aria-label="Better Pagbilao home">
                <span className="flex h-20 shrink-0 items-center py-1 sm:h-24">
                    <img src="/betterpagbilao_logo.svg" alt="Better Pagbilao" className="h-full w-auto object-contain drop-shadow-sm" />
                </span>
            </a>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation" onMouseLeave={() => setOpenMenu(null)}>
                <a className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#home">
                    {t.nav.home}
                </a>
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

                <a className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#hotlines">
                    {t.nav.hotlines}
                </a>
                <a className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#history">
                    {t.nav.history}
                </a>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
                <div className="hidden rounded-md border border-slate-200 bg-slate-50 p-1 sm:inline-flex" aria-label="Language switcher">
                    <button
                        type="button"
                        aria-pressed={lang === "en"}
                        onClick={() => setLang("en")}
                        className={`rounded px-2.5 py-1.5 text-xs font-black transition sm:px-3 ${lang === "en" ? "bg-bayan-blue text-white shadow-sm" : "text-slate-600 hover:text-bayan-ink"}`}
                    >
                        English
                    </button>
                    <button
                        type="button"
                        aria-pressed={lang === "tl"}
                        onClick={() => setLang("tl")}
                        className={`rounded px-2.5 py-1.5 text-xs font-black transition sm:px-3 ${lang === "tl" ? "bg-bayan-blue text-white shadow-sm" : "text-slate-600 hover:text-bayan-ink"}`}
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
                    <span className="hidden sm:inline">{t.nav.search}</span>
                </button>
            </div>
        </div>
    )
}

export default BottomHeader
