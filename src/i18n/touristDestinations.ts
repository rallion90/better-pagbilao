import type { Language } from "./translations"

// Page labels only. The destination entries themselves come from the API and are in English.
export interface TouristDestinationsCopy {
    breadcrumb: string
    eyebrow: string
    heading: string
    intro: string
    allFilter: string
    filterLabel: string
    count: (shown: number) => string
    viewDetails: string
    nearbyBadge: string
    noPhoto: string
    verifyHeading: string
    verifyBody: string
    sourcesLabel: string
    detail: {
        back: string
        locationLabel: string
        whenLabel: string
        activitiesHeading: string
        bestForHeading: string
        gettingThereHeading: string
        feesHeading: string
        tipsHeading: string
        openMap: string
        officeHeading: string
        officeBody: string
        relatedHeading: string
        loading: string
        notFoundHeading: string
        notFoundBody: string
        nearbyNote: string
    }
}

export const touristDestinationsCopy: Record<Language, TouristDestinationsCopy> = {
    en: {
        breadcrumb: "Tourist Destinations",
        eyebrow: "WOW Pagbilao",
        heading: "Tourist destinations in Pagbilao, Quezon",
        intro: "Islands, beaches, waterfalls, and heritage sites in and around Pagbilao. Each page lists what to do, what to bring, and what to confirm before you go.",
        allFilter: "All",
        filterLabel: "Filter by type",
        count: (shown) => `${shown} ${shown === 1 ? "destination" : "destinations"}`,
        viewDetails: "View details",
        nearbyBadge: "Near Pagbilao",
        noPhoto: "Photo coming soon",
        verifyHeading: "Confirm before you go",
        verifyBody:
            "Fees, opening hours, boat access, and commute details change and have not all been verified locally. Check with the Pagbilao Tourism Office before your trip.",
        sourcesLabel: "Sources",
        detail: {
            back: "All tourist destinations",
            locationLabel: "Location",
            whenLabel: "When",
            activitiesHeading: "Things to do",
            bestForHeading: "Best for",
            gettingThereHeading: "Getting there",
            feesHeading: "Fees",
            tipsHeading: "Visitor tips",
            openMap: "Open in Google Maps",
            officeHeading: "Ask the tourism office",
            officeBody: "For current access, fees, and schedules, contact:",
            relatedHeading: "More places to visit",
            loading: "Loading destination…",
            notFoundHeading: "We couldn't find that destination",
            notFoundBody: "The link may be incorrect or the page may have moved.",
            nearbyNote: "This destination is near Pagbilao, not inside the municipality.",
        },
    },
    tl: {
        breadcrumb: "Mga Destinasyong Panturista",
        eyebrow: "WOW Pagbilao",
        heading: "Mga destinasyong panturista sa Pagbilao, Quezon",
        intro: "Mga isla, dalampasigan, talon, at pamanang pook sa Pagbilao at karatig-lugar. Nakalista sa bawat pahina kung ano ang puwedeng gawin, dalhin, at tiyakin bago pumunta.",
        allFilter: "Lahat",
        filterLabel: "Salain ayon sa uri",
        count: (shown) => `${shown} destinasyon`,
        viewDetails: "Tingnan ang detalye",
        nearbyBadge: "Malapit sa Pagbilao",
        noPhoto: "Wala pang larawan",
        verifyHeading: "Tiyakin bago pumunta",
        verifyBody:
            "Nagbabago ang bayarin, oras ng bukas, sakayan ng bangka, at detalye ng biyahe, at hindi pa lahat ay nakumpirma sa lokal. Magtanong muna sa Pagbilao Tourism Office bago bumiyahe.",
        sourcesLabel: "Mga pinagkunan",
        detail: {
            back: "Lahat ng destinasyong panturista",
            locationLabel: "Lokasyon",
            whenLabel: "Kailan",
            activitiesHeading: "Mga puwedeng gawin",
            bestForHeading: "Bagay para sa",
            gettingThereHeading: "Paano pumunta",
            feesHeading: "Bayarin",
            tipsHeading: "Mga paalala sa bisita",
            openMap: "Buksan sa Google Maps",
            officeHeading: "Magtanong sa tourism office",
            officeBody: "Para sa kasalukuyang daan, bayarin, at iskedyul, makipag-ugnayan sa:",
            relatedHeading: "Iba pang puwedeng puntahan",
            loading: "Nilo-load ang destinasyon…",
            notFoundHeading: "Hindi namin mahanap ang destinasyong iyon",
            notFoundBody: "Maaaring mali ang link o nailipat na ang pahina.",
            nearbyNote: "Malapit sa Pagbilao ang destinasyong ito, hindi sa loob ng munisipalidad.",
        },
    },
}
