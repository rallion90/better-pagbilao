import type { Language } from "./translations"

export interface AnnouncementsCopy {
    navLabel: string
    breadcrumb: string
    eyebrow: string
    heading: string
    intro: string
    filters: { searchLabel: string; searchPlaceholder: string; typeLabel: string; all: string; pinnedOnly: string; clear: string; noneInType: string }
    list: {
        loading: string
        empty: string
        emptyFiltered: string
        total: string
        pinned: string
        readMore: string
        posted: string
        expires: string
        by: string
        refreshing: string
    }
    pagination: { label: string; previous: string; next: string; page: string }
    event: { when: string; where: string; to: string }
    detail: {
        back: string
        notFoundTitle: string
        notFoundBody: string
        loading: string
        published: string
        expires: string
        office: string
        eventHeading: string
        openLink: string
        imageFailed: string
    }
    errors: { generic: string; retry: string; invalidFilter: string }
    banner: { label: string; details: string; more: string; dismiss: string; region: string }
    home: { eyebrow: string; heading: string; viewAll: string; emptyHint: string }
}

const en: AnnouncementsCopy = {
    navLabel: "Announcements",
    breadcrumb: "Announcements",
    eyebrow: "Public announcements",
    heading: "What's happening in Pagbilao",
    intro: "Emergency alerts, advisories, events and public notices from the municipal offices. Pinned announcements stay at the top, and the newest come first.",
    filters: {
        searchLabel: "Search announcements",
        searchPlaceholder: "Search by title or keyword",
        typeLabel: "Type",
        all: "All",
        pinnedOnly: "Pinned only",
        clear: "Clear filters",
        noneInType: "None right now",
    },
    list: {
        loading: "Loading announcements…",
        empty: "No announcements right now.",
        emptyFiltered: "No announcements match these filters.",
        total: "{n} announcements",
        pinned: "Pinned",
        readMore: "Read more",
        posted: "Posted",
        expires: "Until",
        by: "From",
        refreshing: "Updating…",
    },
    pagination: { label: "Pages", previous: "Previous", next: "Next", page: "Page {page} of {total}" },
    event: { when: "When", where: "Where", to: "to" },
    detail: {
        back: "Back to announcements",
        notFoundTitle: "We could not find that announcement",
        notFoundBody: "It may have been removed, may not be published yet, or may have expired. Browse the current announcements instead.",
        loading: "Loading the announcement…",
        published: "Posted",
        expires: "Expires",
        office: "From",
        eventHeading: "Event details",
        openLink: "Opens in a new tab",
        imageFailed: "The image could not be loaded.",
    },
    errors: {
        generic: "We could not load the announcements. Check your connection and try again.",
        retry: "Try again",
        invalidFilter: "Those filters were not valid, so we cleared them.",
    },
    banner: { label: "Emergency", details: "Read details", more: "+{n} more", dismiss: "Dismiss emergency alert", region: "Emergency alerts" },
    home: { eyebrow: "Announcements", heading: "Latest announcements", viewAll: "View all announcements", emptyHint: "New emergency alerts, advisories and events will appear here." },
}

const tl: AnnouncementsCopy = {
    navLabel: "Mga anunsyo",
    breadcrumb: "Mga anunsyo",
    eyebrow: "Mga pampublikong anunsyo",
    heading: "Ang nangyayari sa Pagbilao",
    intro: "Mga emergency alert, abiso, kaganapan at pampublikong paalala mula sa mga tanggapan ng munisipyo. Nasa itaas ang mga naka-pin, at una ang pinakabago.",
    filters: {
        searchLabel: "Maghanap ng anunsyo",
        searchPlaceholder: "Maghanap ayon sa pamagat o salita",
        typeLabel: "Uri",
        all: "Lahat",
        pinnedOnly: "Naka-pin lang",
        clear: "Burahin ang mga filter",
        noneInType: "Wala sa ngayon",
    },
    list: {
        loading: "Nilo-load ang mga anunsyo…",
        empty: "Walang anunsyo sa ngayon.",
        emptyFiltered: "Walang anunsyong tumutugma sa mga filter.",
        total: "{n} anunsyo",
        pinned: "Naka-pin",
        readMore: "Basahin pa",
        posted: "Inilathala",
        expires: "Hanggang",
        by: "Mula sa",
        refreshing: "Ina-update…",
    },
    pagination: { label: "Mga pahina", previous: "Nakaraan", next: "Susunod", page: "Pahina {page} ng {total}" },
    event: { when: "Kailan", where: "Saan", to: "hanggang" },
    detail: {
        back: "Bumalik sa mga anunsyo",
        notFoundTitle: "Hindi namin makita ang anunsyong iyon",
        notFoundBody: "Maaaring inalis na ito, hindi pa nailalathala, o nag-expire na. Tingnan na lang ang mga kasalukuyang anunsyo.",
        loading: "Nilo-load ang anunsyo…",
        published: "Inilathala",
        expires: "Mag-e-expire",
        office: "Mula sa",
        eventHeading: "Detalye ng kaganapan",
        openLink: "Magbubukas sa bagong tab",
        imageFailed: "Hindi ma-load ang larawan.",
    },
    errors: {
        generic: "Hindi namin ma-load ang mga anunsyo. Tingnan ang koneksyon at subukan muli.",
        retry: "Subukan muli",
        invalidFilter: "Hindi wasto ang mga filter na iyon kaya binura namin ang mga ito.",
    },
    banner: { label: "Emergency", details: "Basahin ang detalye", more: "+{n} pa", dismiss: "Itago ang emergency alert", region: "Mga emergency alert" },
    home: { eyebrow: "Mga anunsyo", heading: "Mga pinakabagong anunsyo", viewAll: "Tingnan ang lahat ng anunsyo", emptyHint: "Dito lalabas ang mga bagong emergency alert, abiso at kaganapan." },
}

export const announcementsCopy: Record<Language, AnnouncementsCopy> = { en, tl }
