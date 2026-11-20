import { useMemo } from "react"
import { Link } from "react-router"
import { MapPin } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { liveInfoCopy } from "../../i18n/liveInfo"
import { useNow } from "../../hooks/useNow"
import { useWeather } from "../../hooks/useWeather"
import { useAnnouncementList } from "../../hooks/useAnnouncementList"
import { WEATHER_ICONS } from "../../lib/weatherIcons"
import type { Weather } from "../../lib/weather"
import HeroSearch from "./HeroSearch"

const TIME_ZONE = "Asia/Manila"

const PHOTO = {
    src: "/hero/pagbilao-church.jpg",
    srcSet: "/hero/pagbilao-church-1280.jpg 1280w, /hero/pagbilao-church.jpg 1920w",
    width: 1920,
    height: 1111,
    creditUrl: "https://commons.wikimedia.org/wiki/File:Saint_Catherine_of_Alexandria.jpg",
}

const CHIPS = [
    { key: "businessPermit", to: "/services/business-and-permits" },
    { key: "civilRegistry", to: "/hotlines" },
    { key: "emergencyHotlines", to: "/hotlines" },
    { key: "wowPagbilao", to: "/explore/tourist-destinations" },
] as const

// Same query as the emergency banner, so "Advisories" reflects real, live emergency announcements.
const ADVISORY_PARAMS = { type: "emergency", perPage: 3 } as const
const ADVISORY_REFRESH_MS = 5 * 60 * 1000

const glassTag = "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md"

function usePhtFormats(lang: string) {
    return useMemo(() => {
        const locale = lang === "tl" ? "fil-PH" : "en-PH"
        return {
            time: new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit", hour12: true }),
            date: new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, weekday: "short", month: "short", day: "numeric" }),
        }
    }, [lang])
}

/** "Today in Pagbilao" glass card. Rows without a real data source are not rendered. */
const TodayCard = ({ weather, advisoryCount }: { weather: Weather | null; advisoryCount: number | null }) => {
    const { t, lang } = useLanguage()
    const copy = t.hero.today
    const conditionNames = liveInfoCopy[lang].conditions.weather

    if (!weather && advisoryCount === null) return null
    const Icon = weather ? WEATHER_ICONS[weather.condition][weather.isDay ? "day" : "night"] : null

    return (
        <aside
            aria-label={copy.title}
            className="absolute right-4 top-8 z-10 hidden w-[220px] rounded-xl bg-bayan-ink/70 p-4 text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/15 backdrop-blur-md sm:right-6 md:block lg:right-8 lg:top-10"
        >
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-bayan-gold">{copy.title}</p>

            {weather && Icon && (
                <>
                    <div className="mt-3 flex items-center gap-3">
                        <Icon className="h-9 w-9 shrink-0 text-sky-300" aria-hidden />
                        <p className="text-3xl font-extrabold tabular-nums leading-none">{Math.round(weather.temperature)}°C</p>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-200">
                        {conditionNames[weather.condition]}
                        <span className="text-slate-400"> · </span>
                        {copy.feelsLike} {Math.round(weather.feelsLike)}°
                    </p>
                </>
            )}

            {advisoryCount !== null && (
                <dl className="mt-3 border-t border-white/15 pt-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                        <dt className="font-semibold text-slate-300">{copy.advisories}</dt>
                        <dd className="font-bold">
                            {advisoryCount === 0 ? (
                                <span className="text-emerald-300">{copy.advisoriesNone}</span>
                            ) : (
                                <Link to="/announcements" className="text-red-300 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-bayan-gold">
                                    {advisoryCount} {copy.advisoriesActive}
                                </Link>
                            )}
                        </dd>
                    </div>
                </dl>
            )}

            {weather && (
                <a
                    href="https://open-meteo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-[11px] font-semibold text-slate-400 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-bayan-gold"
                >
                    {copy.weatherSource}
                </a>
            )}
        </aside>
    )
}

const PhotoCredit = ({ className }: { className: string }) => {
    const { t } = useLanguage()
    return (
        <a
            href={PHOTO.creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-lg bg-bayan-ink/70 px-3 py-1.5 text-[11px] font-medium leading-snug text-slate-200 ring-1 ring-white/10 backdrop-blur-sm hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-bayan-gold ${className}`}
        >
            <span className="block font-semibold text-white">{t.hero.photoCreditTitle}</span>
            <span className="block">{t.hero.photoCreditLine}</span>
        </a>
    )
}

const HomeHero = () => {
    const { t, lang } = useLanguage()
    const now = useNow()
    const formats = usePhtFormats(lang)
    const { weather } = useWeather()
    const advisories = useAnnouncementList(ADVISORY_PARAMS, { refreshMs: ADVISORY_REFRESH_MS })
    const advisoryCount = advisories.list && !advisories.error ? advisories.list.announcements.length : null

    return (
        <section className="relative isolate overflow-hidden bg-bayan-ink">
            {/* Photo: full bleed on mobile, right ~64% on desktop */}
            <img
                src={PHOTO.src}
                srcSet={PHOTO.srcSet}
                sizes="(min-width: 768px) 64vw, 100vw"
                width={PHOTO.width}
                height={PHOTO.height}
                alt={t.hero.photoAlt}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-[20%_30%] md:left-[36%] md:w-[64%] md:object-[0%_30%] xl:left-[26%] xl:w-[74%]"
            />
            {/* Mobile overlay */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(23,32,51,0.45)_0%,rgba(23,32,51,0.8)_45%,rgba(23,32,51,0.95)_100%)] md:hidden"
            />
            {/* Desktop: solid navy under the copy, then a quick fade on a slant so the photo stays clear */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 hidden bg-[linear-gradient(102deg,#172033_0%,#172033_38%,rgba(23,32,51,0.75)_45%,rgba(23,32,51,0.25)_56%,rgba(23,32,51,0)_70%)] md:block xl:bg-[linear-gradient(102deg,#172033_0%,#172033_30%,rgba(23,32,51,0.88)_38%,rgba(23,32,51,0.45)_49%,rgba(23,32,51,0)_64%)]"
            />
            <div
                aria-hidden
                className="absolute inset-0 -z-10 hidden bg-[linear-gradient(180deg,rgba(23,32,51,0.5)_0%,rgba(23,32,51,0)_28%,rgba(23,32,51,0)_62%,rgba(23,32,51,0.65)_100%)] md:block"
            />

            <div className="relative mx-auto max-w-[1600px] px-4 pb-28 pt-10 sm:px-6 md:pb-[120px] md:pt-14 lg:px-8">
                <TodayCard weather={weather} advisoryCount={advisoryCount} />

                <div className="flex min-h-0 max-w-2xl flex-col items-start text-white md:min-h-[460px] md:max-w-[min(42rem,calc(100%-252px))] xl:max-w-[36rem] md:justify-center">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={glassTag}>
                            <MapPin className="h-4 w-4 text-bayan-gold" aria-hidden />
                            {t.hero.locationBadge}
                        </span>
                        <span className={glassTag}>
                            <span aria-hidden className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            </span>
                            <span>{t.hero.live}</span>
                            <span aria-hidden className="text-white/40">·</span>
                            <time dateTime={now.toISOString()} className="font-bold tabular-nums text-bayan-gold">
                                {formats.time.format(now)}
                            </time>
                            <span className="text-slate-200">{formats.date.format(now)}</span>
                            {weather && (
                                <>
                                    <span aria-hidden className="text-white/40">·</span>
                                    <span className="tabular-nums">{Math.round(weather.temperature)}°C</span>
                                </>
                            )}
                        </span>
                    </div>

                    <p className="mt-6 text-sm font-bold text-bayan-gold md:text-base">{t.hero.greeting}</p>

                    <h1 className="mt-2 text-[40px] font-extrabold leading-[1.03] tracking-[-0.02em] md:text-[60px]">{t.hero.title}</h1>

                    <p className="mt-4 max-w-xl text-[17px] leading-7 text-slate-300">{t.hero.description}</p>

                    <HeroSearch />

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-sm font-semibold text-slate-300">{t.hero.popularLabel}</span>
                        {CHIPS.map((chip) => (
                            <Link
                                key={chip.key}
                                to={chip.to}
                                className="rounded-full bg-slate-950/45 px-3 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bayan-gold"
                            >
                                {t.hero.chips[chip.key]}
                            </Link>
                        ))}
                    </div>

                    <PhotoCredit className="mt-6 inline-block md:hidden" />
                </div>
            </div>

            <PhotoCredit className="absolute bottom-[88px] right-4 hidden text-right sm:right-6 md:block lg:right-8" />
        </section>
    )
}

export default HomeHero
