import { Clock, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudRainWind, CloudSun, Droplets, Moon, Sun, Wind } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNow } from "../../hooks/useNow"
import { useWeather } from "../../hooks/useWeather"
import { liveInfoCopy } from "../../i18n/liveInfo"
import { useLanguage } from "../../i18n/useLanguage"
import type { WeatherCondition } from "../../lib/weather"

const TIME_ZONE = "Asia/Manila"

const ICONS: Record<WeatherCondition, { day: LucideIcon; night: LucideIcon }> = {
    clear: { day: Sun, night: Moon },
    mostlyClear: { day: CloudSun, night: CloudMoon },
    partlyCloudy: { day: CloudSun, night: CloudMoon },
    overcast: { day: Cloud, night: Cloud },
    fog: { day: CloudFog, night: CloudFog },
    drizzle: { day: CloudDrizzle, night: CloudDrizzle },
    lightRain: { day: CloudRain, night: CloudRain },
    rain: { day: CloudRain, night: CloudRain },
    heavyRain: { day: CloudRainWind, night: CloudRainWind },
    showers: { day: CloudRain, night: CloudRain },
    thunderstorm: { day: CloudLightning, night: CloudLightning },
    other: { day: Cloud, night: Cloud },
}

/** Pagbilao time and weather for the home hero. Click for details. */
const LocalConditions = () => {
    const { lang } = useLanguage()
    const copy = liveInfoCopy[lang].conditions
    const now = useNow()
    const { weather } = useWeather()
    const [open, setOpen] = useState(false)
    const root = useRef<HTMLDivElement>(null)

    const formats = useMemo(() => {
        const locale = lang === "tl" ? "fil-PH" : "en-PH"
        return {
            time: new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit", hour12: true }),
            date: new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, weekday: "short", month: "short", day: "numeric" }),
            full: new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        }
    }, [lang])

    useEffect(() => {
        if (!open) return
        const onPointer = (event: MouseEvent) => {
            if (root.current && !root.current.contains(event.target as Node)) setOpen(false)
        }
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false)
        }
        document.addEventListener("mousedown", onPointer)
        document.addEventListener("keydown", onKey)
        return () => {
            document.removeEventListener("mousedown", onPointer)
            document.removeEventListener("keydown", onKey)
        }
    }, [open])

    const Icon = weather ? ICONS[weather.condition][weather.isDay ? "day" : "night"] : null
    const timeText = formats.time.format(now)
    const dateText = formats.date.format(now)
    const summary = weather
        ? `${timeText}, ${dateText}, ${Math.round(weather.temperature)}°C, ${copy.weather[weather.condition]}`
        : `${timeText}, ${dateText}`

    return (
        <div ref={root}>
            <button
                type="button"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-label={`${copy.title}: ${summary}`}
                onClick={() => setOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/10 px-3 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/[0.18] focus-visible:outline-2 focus-visible:outline-bayan-gold"
            >
                <Clock className="h-3.5 w-3.5 text-bayan-gold" />
                <time dateTime={now.toISOString()} className="tabular-nums">
                    {timeText}
                </time>
                <span className="hidden text-white/70 sm:inline">{dateText}</span>
                {weather && Icon && (
                    <>
                        <span aria-hidden className="text-white/30">
                            |
                        </span>
                        <Icon className="h-4 w-4 text-sky-300" />
                        <span className="tabular-nums">{Math.round(weather.temperature)}°C</span>
                    </>
                )}
            </button>

            {open && (
                <div role="dialog" aria-label={copy.title} className="absolute left-1/2 top-full z-30 mt-2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-white p-4 text-left text-bayan-ink shadow-soft ring-1 ring-slate-200">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{copy.title}</p>
                    <p className="mt-1 text-sm font-black">{copy.place}</p>
                    <p className="text-xs font-semibold text-slate-500">
                        {formats.full.format(now)} · {timeText} · {copy.timeNote}
                    </p>

                    {weather && Icon ? (
                        <>
                            <div className="mt-4 flex items-center gap-4">
                                <Icon className="h-11 w-11 text-bayan-blue" />
                                <div>
                                    <p className="text-3xl font-black tabular-nums leading-none">{Math.round(weather.temperature)}°C</p>
                                    <p className="mt-1 text-sm font-bold text-slate-600">{copy.weather[weather.condition]}</p>
                                </div>
                            </div>
                            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                                <div className="rounded-md bg-bayan-mist px-2 py-2">
                                    <dt className="text-[11px] font-bold text-slate-500">{copy.feelsLike}</dt>
                                    <dd className="mt-0.5 text-sm font-black tabular-nums">{Math.round(weather.feelsLike)}°C</dd>
                                </div>
                                <div className="rounded-md bg-bayan-mist px-2 py-2">
                                    <dt className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500">
                                        <Droplets className="h-3 w-3" /> {copy.humidity}
                                    </dt>
                                    <dd className="mt-0.5 text-sm font-black tabular-nums">{Math.round(weather.humidity)}%</dd>
                                </div>
                                <div className="rounded-md bg-bayan-mist px-2 py-2">
                                    <dt className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500">
                                        <Wind className="h-3 w-3" /> {copy.wind}
                                    </dt>
                                    <dd className="mt-0.5 text-sm font-black tabular-nums">{Math.round(weather.windKmh)} km/h</dd>
                                </div>
                            </dl>
                            <p className="mt-3 text-[11px] font-semibold text-slate-400">
                                {copy.updated}{" "}
                                {formats.time.format(new Date(`${weather.observedAt}+08:00`))}
                            </p>
                        </>
                    ) : (
                        <p className="mt-4 rounded-md bg-bayan-mist px-3 py-3 text-sm font-semibold text-slate-500">{copy.unavailable}</p>
                    )}

                    <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[11px] font-bold text-bayan-blue hover:underline">
                        {copy.source}
                    </a>
                </div>
            )}
        </div>
    )
}

export default LocalConditions
