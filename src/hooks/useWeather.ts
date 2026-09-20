import { useEffect, useRef, useState } from "react"
import { fetchWeather, WEATHER_REFRESH_MS } from "../lib/weather"
import type { Weather } from "../lib/weather"

type UseWeatherResult = {
    weather: Weather | null
    /** the last refresh failed; `weather` may still hold the previous reading */
    failed: boolean
}

/** Current conditions in Pagbilao, refreshed every 15 minutes (the data's own update interval) and when the tab comes back. */
export function useWeather(): UseWeatherResult {
    const [weather, setWeather] = useState<Weather | null>(null)
    const [failed, setFailed] = useState(false)
    const lastFetch = useRef(0)

    useEffect(() => {
        let controller: AbortController | null = null

        const load = () => {
            controller?.abort()
            const current = new AbortController()
            controller = current
            lastFetch.current = Date.now()

            fetchWeather(current.signal)
                .then((result) => {
                    setWeather(result)
                    setFailed(false)
                })
                .catch((error: unknown) => {
                    if (error instanceof DOMException && error.name === "AbortError") return
                    setFailed(true)
                })
        }

        const onVisible = () => {
            if (document.visibilityState === "visible" && Date.now() - lastFetch.current > 5 * 60 * 1000) load()
        }

        load()
        const timer = window.setInterval(load, WEATHER_REFRESH_MS)
        document.addEventListener("visibilitychange", onVisible)

        return () => {
            controller?.abort()
            window.clearInterval(timer)
            document.removeEventListener("visibilitychange", onVisible)
        }
    }, [])

    return { weather, failed }
}
