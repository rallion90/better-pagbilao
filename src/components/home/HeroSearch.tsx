import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import type { KeyboardEvent } from "react"
import { useNavigate } from "react-router"
import { ArrowRight, Loader2, Search } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useSearchIndex } from "../../hooks/useSearchIndex"
import { searchItems, type SearchItem } from "../../lib/searchIndex"

const HeroSearch = () => {
    const { t } = useLanguage()
    const navigate = useNavigate()
    const { items, loading, ensureLoaded } = useSearchIndex()

    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)

    const results = useMemo(() => searchItems(items, query), [items, query])

    const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
        setActiveIndex(-1)
        setIsOpen(true)
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const goToResult = (result: SearchItem) => {
        if (result.external) {
            window.open(result.path, "_blank", "noopener,noreferrer")
        } else {
            navigate(result.path)
        }
        setIsOpen(false)
        setQuery("")
        setActiveIndex(-1)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (results.length === 0) return

        if (event.key === "ArrowDown") {
            event.preventDefault()
            setActiveIndex((prev) => (prev + 1) % results.length)
        } else if (event.key === "ArrowUp") {
            event.preventDefault()
            setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1))
        } else if (event.key === "Enter") {
            event.preventDefault()
            goToResult(results[activeIndex >= 0 ? activeIndex : 0])
        } else if (event.key === "Escape") {
            setIsOpen(false)
        }
    }

    return (
        <div ref={containerRef} className="relative mt-8 w-full max-w-2xl">
            <div className="rounded-lg bg-white p-2 shadow-soft">
                <label htmlFor="search" className="sr-only">
                    Search local services
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex min-w-0 flex-1 items-center gap-3 px-3 text-slate-500">
                        <Search className="h-5 w-5 shrink-0" />
                        <input
                            id="search"
                            type="search"
                            autoComplete="off"
                            placeholder={t.hero.searchPlaceholder}
                            value={query}
                            onFocus={() => {
                                ensureLoaded()
                                setIsOpen(true)
                            }}
                            onChange={handleQueryChange}
                            onKeyDown={handleKeyDown}
                            className="w-full border-0 bg-transparent py-3 text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => results[0] && goToResult(results[activeIndex >= 0 ? activeIndex : 0])}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-bayan-red px-5 py-3 text-sm font-black text-white hover:bg-red-700"
                    >
                        <ArrowRight className="h-4 w-4" />
                        <span>{t.hero.findService}</span>
                    </button>
                </div>
            </div>

            {isOpen && query.trim() !== "" && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-96 overflow-y-auto rounded-lg bg-white p-2 text-left shadow-soft ring-1 ring-black/5">
                    {loading && (
                        <div className="flex items-center gap-2 px-3 py-3 text-sm font-semibold text-slate-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t.hero.searchLoading}
                        </div>
                    )}

                    {!loading && results.length === 0 && (
                        <p className="px-3 py-3 text-sm font-semibold text-slate-500">{t.hero.searchNoResults}</p>
                    )}

                    {!loading &&
                        results.map((result, index) => (
                            <button
                                key={result.id}
                                type="button"
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => goToResult(result)}
                                className={[
                                    "flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2.5 text-left transition",
                                    index === activeIndex ? "bg-bayan-mist" : "hover:bg-bayan-mist",
                                ].join(" ")}
                            >
                                <span className="flex w-full items-center justify-between gap-2">
                                    <span className="text-sm font-bold text-slate-800">{result.title}</span>
                                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-500">
                                        {result.category}
                                    </span>
                                </span>
                                {result.subtitle && <span className="text-xs font-medium text-slate-500">{result.subtitle}</span>}
                            </button>
                        ))}
                </div>
            )}
        </div>
    )
}

export default HeroSearch
