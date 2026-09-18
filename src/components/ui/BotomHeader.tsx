import {
    BookOpenCheck,
    BriefcaseBusiness,
    ChevronDown,
    ClipboardCheck,
    FileDown,
    FolderDown,
    HeartPulse,
    MapPinned,
    Menu,
    Route,
    ShieldAlert,
    Sprout,
    UsersRound,
    Wheat,
    Scale,
    ContactRound,
    X
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { useState } from "react"
import { Link } from "react-router"
import { useLanguage } from "../../i18n/useLanguage"

type MenuLinkProps = {
    href: string
    className: string
    onClick?: () => void
    children: ReactNode
}

const MenuLink = ({ href, className, onClick, children }: MenuLinkProps) => {
    if (href.startsWith("/")) {
        return (
            <Link to={href} className={className} onClick={onClick}>
                {children}
            </Link>
        )
    }

    return (
        <a href={href} className={className} onClick={onClick}>
            {children}
        </a>
    )
}

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
            { href: "/services/business-and-permits", Icon: BriefcaseBusiness, color: "text-bayan-blue bg-blue-50" },
            { href: "/services/health-services", Icon: HeartPulse, color: "text-bayan-red bg-red-50" },
            { href: "/services/disaster-and-safety", Icon: ShieldAlert, color: "text-bayan-green bg-emerald-50" },
            { href: "/services/agriculture-and-livelihood", Icon: Wheat, color: "text-amber-700 bg-amber-50" },
            { href: "/services/social-welfare", Icon: UsersRound, color: "text-bayan-blue bg-blue-50" },
        ],
    },
    {
        id: "government",
        items: [
            { href: "/government/legislative-council", Icon: Scale, color: "text-bayan-blue bg-blue-50" },
            { href: "/government/local-officials-directory", Icon: ContactRound, color: "text-bayan-green bg-emerald-50" },
        ],
    },
    {
        id: "explore",
        items: [
            { href: "#barangays", Icon: MapPinned, color: "text-bayan-blue bg-blue-50" },
            { href: "#history", Icon: Sprout, color: "text-bayan-green bg-emerald-50" },
            { href: "/explore/gateway-location", Icon: Route, color: "text-bayan-gold bg-amber-50" },
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
]

const BottomHeader = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
    const { lang, setLang, t } = useLanguage()

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
        setOpenMobileSection(null)
    }

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
        <>
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-2 sm:gap-4 sm:px-6 2xl:px-8">
            <a href="/" className="flex min-w-0 shrink-0 items-center gap-4" aria-label="Better Pagbilao home">
                <span className="flex h-11 shrink-0 items-center py-1 sm:h-14 xl:h-16">
                    <img src="/betterpagbilao_logo.svg" alt="Better Pagbilao" className="h-full w-auto object-contain drop-shadow-sm" />
                </span>
            </a>

            <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation" onMouseLeave={() => setOpenMenu(null)}>
                <a className="inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="/">
                    {t.nav.home}
                </a>
                {navMenus.map((menu) => {
                    const isOpen = openMenu === menu.id

                    return (
                        <div key={menu.id} className="relative" onMouseEnter={() => setOpenMenu(menu.id)}>
                            <button
                                type="button"
                                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-semibold transition ${isOpen ? "bg-slate-100 text-bayan-ink" : "text-slate-700 hover:bg-slate-100"}`}
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
                                                <MenuLink
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
                                                </MenuLink>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )
                })}

                <MenuLink className="inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="/hotlines">
                    {t.nav.hotlines}
                </MenuLink>
                <a className="inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#history">
                    {t.nav.history}
                </a>
            </nav>

            <div className="flex shrink-0 items-center gap-1.5 xl:gap-2">
                <div className="hidden rounded-md border border-slate-200 bg-slate-50 p-1 xl:inline-flex" aria-label="Language switcher">
                    <button
                        type="button"
                        aria-pressed={lang === "en"}
                        onClick={() => setLang("en")}
                        className={`rounded px-2.5 py-1.5 text-xs font-black transition ${lang === "en" ? "bg-bayan-blue text-white shadow-sm" : "text-slate-600 hover:text-bayan-ink"}`}
                    >
                        English
                    </button>
                    <button
                        type="button"
                        aria-pressed={lang === "tl"}
                        onClick={() => setLang("tl")}
                        className={`rounded px-2.5 py-1.5 text-xs font-black transition ${lang === "tl" ? "bg-bayan-blue text-white shadow-sm" : "text-slate-600 hover:text-bayan-ink"}`}
                    >
                        Tagalog
                    </button>
                </div>
                <MenuLink
                    href="/community/report"
                    className="inline-flex items-center gap-2 rounded-md bg-bayan-blue px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 xl:px-4"
                >
                    <MapPinned className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.nav.report}</span>
                </MenuLink>

                <button
                    type="button"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-slate-700 transition hover:bg-slate-100 xl:hidden"
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileMenuOpen}
                    onClick={() => {
                        setIsMobileMenuOpen((currentValue) => !currentValue)
                        setOpenMobileSection(null)
                    }}
                >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>
        </div>

        {isMobileMenuOpen ? (
            <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 py-4 sm:px-6 xl:hidden">
                <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
                    <a
                        href="#home"
                        onClick={closeMobileMenu}
                        className="rounded-md px-3 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-100"
                    >
                        {t.nav.home}
                    </a>

                    {navMenus.map((menu) => {
                        const isSectionOpen = openMobileSection === menu.id

                        return (
                            <div key={menu.id} className="border-t border-slate-100 first:border-t-0">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-black text-slate-700 hover:bg-slate-100"
                                    aria-expanded={isSectionOpen}
                                    onClick={() => setOpenMobileSection(isSectionOpen ? null : menu.id)}
                                >
                                    {menu.label}
                                    <ChevronDown className={`h-4 w-4 shrink-0 transition ${isSectionOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isSectionOpen ? (
                                    <div className="grid gap-1 py-1 pl-2">
                                        {menu.items.map(({ label, href, description, Icon, color }) => (
                                            <MenuLink
                                                key={label}
                                                href={href}
                                                onClick={closeMobileMenu}
                                                className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-md p-2.5 text-left transition hover:bg-slate-50"
                                            >
                                                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${color}`}>
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block text-sm font-bold text-bayan-ink">{label}</span>
                                                    <span className="block truncate text-xs font-semibold text-slate-500">{description}</span>
                                                </span>
                                            </MenuLink>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        )
                    })}

                    <MenuLink
                        href="/hotlines"
                        onClick={closeMobileMenu}
                        className="border-t border-slate-100 px-3 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-100"
                    >
                        {t.nav.hotlines}
                    </MenuLink>
                    <a
                        href="#history"
                        onClick={closeMobileMenu}
                        className="px-3 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-100"
                    >
                        {t.nav.history}
                    </a>
                </nav>

                <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-4">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Language</span>
                    <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1">
                        <button
                            type="button"
                            aria-pressed={lang === "en"}
                            onClick={() => setLang("en")}
                            className={`rounded px-3 py-1.5 text-xs font-black transition ${lang === "en" ? "bg-bayan-blue text-white shadow-sm" : "text-slate-600 hover:text-bayan-ink"}`}
                        >
                            English
                        </button>
                        <button
                            type="button"
                            aria-pressed={lang === "tl"}
                            onClick={() => setLang("tl")}
                            className={`rounded px-3 py-1.5 text-xs font-black transition ${lang === "tl" ? "bg-bayan-blue text-white shadow-sm" : "text-slate-600 hover:text-bayan-ink"}`}
                        >
                            Tagalog
                        </button>
                    </div>
                </div>
            </div>
        ) : null}
        </>
    )
}

export default BottomHeader
