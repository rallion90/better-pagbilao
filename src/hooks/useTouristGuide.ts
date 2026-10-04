import { useEffect, useState } from "react"
import { FALLBACK_GUIDE, toTouristGuide } from "../data/touristDestinations"
import type { TouristGuide } from "../data/touristDestinations"
import { fetchPgApi, pgApiEndpoints } from "../lib/pgApi"
import type { TouristDestinationsData } from "../types/touristDestinations"

// One request per visit, shared by the listing page, every destination page and site search.
let cached: TouristGuide | null = null
let inflight: Promise<TouristGuide> | null = null

/** Destinations from GET /tourist-destinations. Rejects when the API fails or returns no destinations. */
export function loadTouristGuide(): Promise<TouristGuide> {
    inflight ??= fetchPgApi<TouristDestinationsData>(pgApiEndpoints.tourism.touristDestinations)
        .then((data) => {
            if (!data.destinations?.length) throw new Error("No tourist destinations returned")
            cached = toTouristGuide(data)
            return cached
        })
        .catch((error: unknown) => {
            inflight = null
            throw error
        })
    return inflight
}

type UseTouristGuideResult = TouristGuide & {
    /** False while the API is still being asked: a destination missing from the snapshot may still turn up. */
    settled: boolean
}

/** The tourist guide: the bundled snapshot straight away, replaced by the live API data once it arrives. */
export function useTouristGuide(): UseTouristGuideResult {
    const [guide, setGuide] = useState<TouristGuide>(cached ?? FALLBACK_GUIDE)
    const [settled, setSettled] = useState(cached !== null)

    useEffect(() => {
        if (cached) return
        let cancelled = false

        loadTouristGuide()
            .then((live) => {
                if (!cancelled) setGuide(live)
            })
            .catch(() => {
                // API down: keep showing the snapshot.
            })
            .finally(() => {
                if (!cancelled) setSettled(true)
            })

        return () => {
            cancelled = true
        }
    }, [])

    return { ...guide, settled }
}
