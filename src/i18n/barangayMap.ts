import type { Language } from "./translations"

export interface BarangayMapCopy {
    breadcrumb: string
    eyebrow: string
    heading: string
    intro: string
    stats: { barangays: string; population: string; area: string }
    map: { heading: string; metricLabel: string; legend: string; hint: string; loading: string; unitPeople: string; unitDensity: string; unitArea: string }
    metrics: { population: string; density: string; area: string }
    list: { heading: string; search: string; empty: string; sortName: string; sortPopulation: string }
    detail: {
        prompt: string
        close: string
        captain: string
        contact: string
        population: string
        area: string
        density: string
        classification: string
        urban: string
        rural: string
        households2010: string
        population2010: string
        landmarks: string
        noLandmarks: string
        notAvailable: string
        reports: string
        reportsCount: string
        reportsNone: string
        reportsLink: string
    }
    error: { message: string; retry: string }
    sources: { heading: string; body: string; boundaries: string }
}

const en: BarangayMapCopy = {
    breadcrumb: "Barangay Map",
    eyebrow: "Explore Pagbilao",
    heading: "Barangay map of Pagbilao",
    intro: "All 27 barangays in one map. Shade the map by population, density or land area, then pick a barangay to see its captain, contact number, facilities and community reports.",
    stats: { barangays: "Barangays", population: "Population (2024)", area: "Land area" },
    map: {
        heading: "Shade the map by",
        metricLabel: "Map shading",
        legend: "Legend",
        hint: "Click a barangay on the map, or choose one from the list.",
        loading: "Loading map…",
        unitPeople: "people",
        unitDensity: "people per km²",
        unitArea: "hectares",
    },
    metrics: { population: "Population", density: "Density", area: "Land area" },
    list: { heading: "All barangays", search: "Search barangay", empty: "No barangay matches your search.", sortName: "A–Z", sortPopulation: "Most people" },
    detail: {
        prompt: "Select a barangay to see its profile.",
        close: "Close profile",
        captain: "Punong Barangay",
        contact: "Contact number",
        population: "Population (2024)",
        area: "Land area",
        density: "Density",
        classification: "PSA classification",
        urban: "Urban",
        rural: "Rural",
        households2010: "Households",
        population2010: "Population",
        landmarks: "Facilities and landmarks",
        noLandmarks: "No facilities listed for this barangay yet.",
        notAvailable: "Not available",
        reports: "Community reports",
        reportsCount: "public reports in this barangay",
        reportsNone: "No public reports in this barangay yet.",
        reportsLink: "See reports for this barangay",
    },
    error: { message: "We could not load the barangay data. Check your connection and try again.", retry: "Try again" },
    sources: {
        heading: "About this data",
        body: "Population is from the 2024 Census of Population (PSA). Captain, contact numbers, facilities and older 2010 figures come from the municipal government website. Some entries are incomplete and are shown as not available.",
        boundaries: "Barangay boundaries © OpenStreetMap contributors (ODbL), matched to PSGC codes. They are approximate and not an official survey.",
    },
}

const tl: BarangayMapCopy = {
    breadcrumb: "Mapa ng Barangay",
    eyebrow: "Tuklasin ang Pagbilao",
    heading: "Mapa ng mga barangay ng Pagbilao",
    intro: "Lahat ng 27 barangay sa iisang mapa. Kulayan ang mapa ayon sa populasyon, dami ng tao kada km² o laki ng lupa, at pumili ng barangay para makita ang kapitan, contact number, pasilidad at mga ulat ng komunidad.",
    stats: { barangays: "Barangay", population: "Populasyon (2024)", area: "Lawak ng lupa" },
    map: {
        heading: "Kulayan ang mapa ayon sa",
        metricLabel: "Kulay ng mapa",
        legend: "Legend",
        hint: "Pindutin ang barangay sa mapa, o pumili sa listahan.",
        loading: "Nilo-load ang mapa…",
        unitPeople: "katao",
        unitDensity: "katao kada km²",
        unitArea: "ektarya",
    },
    metrics: { population: "Populasyon", density: "Dami ng tao/km²", area: "Lawak ng lupa" },
    list: { heading: "Lahat ng barangay", search: "Maghanap ng barangay", empty: "Walang barangay na tumutugma sa paghahanap.", sortName: "A–Z", sortPopulation: "Pinakamarami" },
    detail: {
        prompt: "Pumili ng barangay para makita ang profile nito.",
        close: "Isara ang profile",
        captain: "Punong Barangay",
        contact: "Contact number",
        population: "Populasyon (2024)",
        area: "Lawak ng lupa",
        density: "Dami ng tao/km²",
        classification: "Klasipikasyon ng PSA",
        urban: "Urban",
        rural: "Rural",
        households2010: "Sambahayan",
        population2010: "Populasyon",
        landmarks: "Mga pasilidad at palatandaan",
        noLandmarks: "Wala pang nakalistang pasilidad para sa barangay na ito.",
        notAvailable: "Hindi available",
        reports: "Mga ulat ng komunidad",
        reportsCount: "pampublikong ulat sa barangay na ito",
        reportsNone: "Wala pang pampublikong ulat sa barangay na ito.",
        reportsLink: "Tingnan ang mga ulat sa barangay na ito",
    },
    error: { message: "Hindi namin ma-load ang datos ng barangay. Tingnan ang koneksyon at subukan muli.", retry: "Subukan muli" },
    sources: {
        heading: "Tungkol sa datos na ito",
        body: "Mula sa 2024 Census of Population (PSA) ang populasyon. Mula sa website ng pamahalaang bayan ang kapitan, contact number, pasilidad at mas lumang datos ng 2010. May mga hindi kumpleto at ipinapakitang hindi available.",
        boundaries: "Hangganan ng barangay © OpenStreetMap contributors (ODbL), itinugma sa PSGC code. Tinatayang hangganan lamang ito at hindi opisyal na survey.",
    },
}

export const barangayMapCopy: Record<Language, BarangayMapCopy> = { en, tl }
