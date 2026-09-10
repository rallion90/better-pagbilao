import { Search } from "lucide-react"

const BottomHeader = () => {
    return (
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <a href="#home" className="flex items-center gap-4" aria-label="Better Pagbilao home">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white p-1.5 shadow-soft ring-1 ring-slate-200 sm:h-20 sm:w-20">
                    <img src="logo.png" alt="Bayan ng Pagbilao official seal" className="h-full w-full object-contain" />
                </span>
                <span>
                    <span className="block text-xl font-extrabold tracking-tight sm:text-2xl">Pagbilao, Quezon</span>
                    <span className="block text-sm font-medium text-slate-500" data-i18n="tagline">Bayan services, made easier</span>
                </span>
            </a>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
                <a className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#services" data-i18n="navServices">Services</a>
                <a className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#barangays">Barangays</a>
                <a className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#transparency" data-i18n="navTransparency">Transparency</a>
                <a className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#tourism" data-i18n="navTourism">Tourism</a>
                <a className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#hotlines" data-i18n="navHotlines">Hotlines</a>
            </nav>

            <div className="flex items-center gap-2">
                <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1" aria-label="Language switcher">
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
