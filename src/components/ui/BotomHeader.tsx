import { ChevronDown, MapPinned, Menu, PhoneCall, X } from "lucide-react"
import type { ReactNode } from "react"
import { useState } from "react"
import { Link } from "react-router"
import { useBusinessDirectoryStatus } from "../../hooks/useBusinessDirectory"
import { useIssueReporting } from "../../hooks/useIssueReporting"
import { businessDirectoryCopy } from "../../i18n/businessDirectory"
import { useLanguage } from "../../i18n/useLanguage"
import { navMenuMeta } from "../../lib/navMenus"

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

const BottomHeader = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
    const { lang, setLang, t } = useLanguage()
    const { state: reportingState } = useIssueReporting()
    // Directory off, unreachable or still loading: no link to it.
    const { enabled: directoryOpen } = useBusinessDirectoryStatus()
    const directoryLabel = businessDirectoryCopy[lang].directory.breadcrumb

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
        setOpenMobileSection(null)
    }

    const navMenus = navMenuMeta.map((menu) => {
        const text = t.nav.menus[menu.id]
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

    // Labels never wrap; type and spacing tighten below 2xl so the longer Tagalog labels still fit on one line on a laptop.
    const navItemClass = "inline-flex items-center whitespace-nowrap rounded-md px-2 py-2 text-[13px] 2xl:px-2.5 2xl:text-sm"
    const navLinkClass = `${navItemClass} gap-2 font-semibold text-slate-700 hover:bg-slate-100`

    return (
        <>
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-2 sm:gap-4 sm:px-6 2xl:px-8">
            <a href="/" className="flex min-w-0 shrink-0 items-center gap-4" aria-label="Better Pagbilao home">
                <span className="flex h-11 shrink-0 items-center py-1 sm:h-14 xl:h-12 2xl:h-16">
                    <img src="/betterpagbilao_logo.svg" alt="Better Pagbilao" className="h-full w-auto object-contain drop-shadow-sm" />
                </span>
            </a>

            <nav className="hidden items-center xl:flex 2xl:gap-1" aria-label="Main navigation" onMouseLeave={() => setOpenMenu(null)}>
                <MenuLink className={navLinkClass} href="/">
                    {t.nav.home}
                </MenuLink>
                {navMenus.map((menu) => {
                    const isOpen = openMenu === menu.id

                    return (
                        <div key={menu.id} className="relative" onMouseEnter={() => setOpenMenu(menu.id)}>
                            <button
                                type="button"
                                className={`${navItemClass} gap-1 font-semibold transition ${isOpen ? "bg-slate-100 text-bayan-ink" : "text-slate-700 hover:bg-slate-100"}`}
                                aria-expanded={isOpen}
                                aria-haspopup="true"
                                onClick={() => setOpenMenu(isOpen ? null : menu.id)}
                                onFocus={() => setOpenMenu(menu.id)}
                            >
                                {menu.label}
                                <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Closed menus stay in the page, hidden, so crawlers can follow their links. */}
                            <div className={`absolute left-1/2 top-full z-50 w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 pt-3 ${isOpen ? "" : "hidden"}`}>
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
                        </div>
                    )
                })}

                {directoryOpen ? (
                    <MenuLink className={navLinkClass} href="/community/businesses">
                        {directoryLabel}
                    </MenuLink>
                ) : null}

                {/* Emergency numbers sit apart from the page links so they are easy to spot. */}
                <span className="mx-1 h-5 w-px shrink-0 bg-slate-200 2xl:mx-1.5" aria-hidden="true" />
                <MenuLink className={`${navItemClass} gap-1.5 font-bold text-bayan-red hover:bg-red-50`} href="/hotlines">
                    <PhoneCall className="h-4 w-4 shrink-0" />
                    {t.nav.hotlines}
                </MenuLink>
               
            </nav>

            <div className="flex shrink-0 items-center gap-1.5 xl:gap-2">
                <div className="hidden rounded-md border border-slate-200 bg-slate-50 p-1 xl:inline-flex" aria-label="Language switcher">
                    <button
                        type="button"
                        aria-pressed={lang === "en"}
                        onClick={() => setLang("en")}
                        className={`rounded px-2.5 py-1.5 text-xs font-black transition ${lang === "en" ? "bg-bayan-blue text-white shadow-sm" : "text-slate-600 hover:text-bayan-ink"}`}
                    >
                        <span className="2xl:hidden" aria-hidden="true">EN</span>
                        <span className="sr-only 2xl:not-sr-only">English</span>
                    </button>
                    <button
                        type="button"
                        aria-pressed={lang === "tl"}
                        onClick={() => setLang("tl")}
                        className={`rounded px-2.5 py-1.5 text-xs font-black transition ${lang === "tl" ? "bg-bayan-blue text-white shadow-sm" : "text-slate-600 hover:text-bayan-ink"}`}
                    >
                        <span className="2xl:hidden" aria-hidden="true">TL</span>
                        <span className="sr-only 2xl:not-sr-only">Tagalog</span>
                    </button>
                </div>
                {reportingState === "enabled" ? (
                    <MenuLink
                        href="/community/report"
                        className="inline-flex items-center gap-2 rounded-md bg-bayan-blue px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 xl:px-4"
                    >
                        <MapPinned className="h-4 w-4" />
                        <span className="hidden sm:inline xl:hidden 2xl:inline">{t.nav.report}</span>
                    </MenuLink>
                ) : null /* reporting off, unreachable or still loading: no report or track link */}

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
                    <MenuLink
                        href="/"
                        onClick={closeMobileMenu}
                        className="rounded-md px-3 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-100"
                    >
                        {t.nav.home}
                    </MenuLink>

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

                    {directoryOpen ? (
                        <MenuLink
                            href="/community/businesses"
                            onClick={closeMobileMenu}
                            className="border-t border-slate-100 px-3 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-100"
                        >
                            {directoryLabel}
                        </MenuLink>
                    ) : null}
                    <MenuLink
                        href="/hotlines"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 border-t border-slate-100 px-3 py-2.5 text-sm font-black text-bayan-red hover:bg-red-50"
                    >
                        <PhoneCall className="h-4 w-4" />
                        {t.nav.hotlines}
                    </MenuLink>
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
