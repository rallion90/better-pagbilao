// Tourist destination guide: turns the GET /tourist-destinations response into what the tourism pages show.
// Fees, opening hours, boat access and commute details mostly still need local confirmation, so the API
// leaves them empty and the pages show "confirm before you go" notes instead of guesses.

import type { TouristDestination, TouristDestinationsData } from "../types/touristDestinations"
import { TOURIST_DESTINATIONS_SNAPSHOT } from "./touristDestinationsSnapshot"

export type DestinationImage = {
    src: string
    alt: string
    credit: string
    creditUrl?: string
}

export type TouristSpot = {
    /** URL slug: /explore/tourist-destinations/{slug} */
    slug: string
    name: string
    /** First category is the main one: it picks the icon. */
    categories: string[]
    /** Barangay or area, when known */
    area: string | null
    /** True for places near Pagbilao that are not inside the municipality */
    nearby: boolean
    description: string
    activities: string[]
    bestFor: string[]
    /** Only set for events */
    dateLabel?: string
    /** Confirmed routes, when there are any */
    routes: { from: string; directions: string }[]
    gettingThereNotes: string[]
    /** Confirmed amounts, e.g. "Entrance fee: ₱50" */
    fees: string[]
    feesNote: string | null
    visitorTips: string[]
    /** Search text for the Google Maps link */
    mapQuery: string
    image: DestinationImage | null
}

export type TouristGuide = {
    spots: TouristSpot[]
    sources: { name: string; url: string }[]
}

export const DESTINATIONS_PATH = "/explore/tourist-destinations"

/** Who to ask before a trip: the LGU tourism office. */
export const TOURISM_OFFICE = {
    name: "Pagbilao Tourism, LGU Pagbilao",
    address: "Pagbilao Municipal Hall, Rizal St., Brgy. Sta. Catalina, Pagbilao, Quezon",
    telephone: "(042) 797-0937",
    email: "discover.pagbilaotourism@gmail.com",
}

/** Filter chips on the listing page, in display order. Only the ones some destination uses are shown. */
export const DESTINATION_FILTERS = ["Beach", "Island", "Nature", "Waterfall", "Heritage", "Culture", "Festival", "Viewpoint"]

const TOURISM_SITE = "https://tourism.pagbilao.gov.ph/"

const FEE_LABELS: Record<string, string> = {
    entranceFee: "Entrance fee",
    boatFee: "Boat fee",
    parkingFee: "Parking fee",
    guideFee: "Guide fee",
}

// The API marks out-of-town places with a "-nearby" id suffix; the page URL leaves it off.
const NEARBY_SUFFIX = /-nearby$/

function toTouristSpot(destination: TouristDestination): TouristSpot {
    const slug = destination.id.replace(NEARBY_SUFFIX, "")
    const { fromPagbilaoTownProper, fromLucenaGrandTerminal, notes = [] } = destination.howToGetThere ?? {}
    const { notes: feesNote, ...amounts } = destination.fees ?? {}

    return {
        slug,
        name: destination.name,
        categories: destination.category,
        area: destination.barangay,
        nearby: NEARBY_SUFFIX.test(destination.id) || (destination.verificationStatus ?? "").startsWith("nearby"),
        description: destination.description,
        activities: destination.activities ?? [],
        bestFor: destination.bestFor ?? [],
        dateLabel: destination.dateLabel,
        routes: [
            ...(fromPagbilaoTownProper ? [{ from: "From Pagbilao town proper", directions: fromPagbilaoTownProper }] : []),
            ...(fromLucenaGrandTerminal ? [{ from: "From Lucena Grand Terminal", directions: fromLucenaGrandTerminal }] : []),
        ],
        gettingThereNotes: notes,
        fees: Object.entries(amounts)
            .filter(([, amount]) => amount !== null && amount !== undefined && amount !== "")
            .map(([key, amount]) => `${FEE_LABELS[key] ?? key}: ${amount}`),
        feesNote: typeof feesNote === "string" && feesNote ? feesNote : null,
        visitorTips: destination.visitorTips ?? [],
        mapQuery: destination.mapQuery ?? `${destination.name}, Pagbilao, Quezon`,
        image: destination.image
            ? { src: destination.image, alt: `${destination.name}, Pagbilao, Quezon`, credit: "Photo: Pagbilao Tourism", creditUrl: TOURISM_SITE }
            : null,
    }
}

export function toTouristGuide(data: TouristDestinationsData): TouristGuide {
    return { spots: data.destinations.map(toTouristSpot), sources: data.sources ?? [] }
}

/** Shown until the API answers, and kept if it fails. */
export const FALLBACK_GUIDE = toTouristGuide(TOURIST_DESTINATIONS_SNAPSHOT)

export function findTouristSpot(spots: TouristSpot[], slug: string): TouristSpot | undefined {
    return spots.find((spot) => spot.slug === slug)
}

/** Other destinations sharing a category with `spot`, closest matches first. */
export function relatedTouristSpots(spots: TouristSpot[], spot: TouristSpot, limit = 3): TouristSpot[] {
    return spots
        .filter((other) => other.slug !== spot.slug)
        .map((other) => ({ other, shared: other.categories.filter((category) => spot.categories.includes(category)).length }))
        .filter(({ shared }) => shared > 0)
        .sort((a, b) => b.shared - a.shared)
        .slice(0, limit)
        .map(({ other }) => other)
}

export function mapsHref(spot: TouristSpot): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.mapQuery)}`
}
