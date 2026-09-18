import type { CategoryId, ReportStatus } from "../lib/communityReports"
import type { Language } from "./translations"

export interface CommunityReportingCopy {
    breadcrumb: string
    eyebrow: string
    heading: string
    intro: string
    ctaReport: string
    ctaBrowse: string
    comingSoon: {
        badge: string
        heading: string
        body: string
        backHome: string
        hotlines: string
    }
    steps: { title: string; body: string }[]
    stats: { total: string; open: string; resolved: string }
    previewNotice: string
    emergency: { title: string; body: string; cta: string }
    form: {
        heading: string
        subheading: string
        categoryLabel: string
        titleLabel: string
        titlePlaceholder: string
        descriptionLabel: string
        descriptionPlaceholder: string
        barangayLabel: string
        barangayPlaceholder: string
        locationLabel: string
        locationHint: string
        locationSet: string
        useMyLocation: string
        locating: string
        locationDenied: string
        clearPin: string
        photoLabel: string
        photoHint: string
        photoTooLarge: string
        removePhoto: string
        contactHeading: string
        nameLabel: string
        contactLabel: string
        optional: string
        privacy: string
        submit: string
        errors: { category: string; title: string; description: string; barangay: string; location: string; outside: string }
    }
    success: { heading: string; body: string; referenceLabel: string; copy: string; copied: string; another: string }
    browse: {
        heading: string
        intro: string
        searchPlaceholder: string
        allCategories: string
        allStatuses: string
        empty: string
        meToo: string
        meTooDone: string
        viewOnMap: string
        showMore: string
        sample: string
        reportedOn: string
        yours: string
    }
    map: { legend: string; pickHint: string; selected: string; close: string }
    track: {
        heading: string
        body: string
        placeholder: string
        button: string
        notFound: string
        timeline: { received: string; inProgress: string; resolved: string }
    }
    statuses: Record<ReportStatus, string>
    categories: Record<CategoryId, string>
}

const en: CommunityReportingCopy = {
    breadcrumb: "Community Reporting",
    eyebrow: "Community Reporting",
    heading: "See a problem in Pagbilao? Pin it and report it.",
    intro: "Broken streetlights, potholes, uncollected garbage, clogged drains. Drop a pin, describe what you see, and follow the report until it is resolved.",
    ctaReport: "Report a problem",
    ctaBrowse: "Browse reports",
    comingSoon: {
        badge: "Coming soon",
        heading: "Community reporting is on the way",
        body: "We are building a simple way for residents to pin local problems on a map. Check back soon.",
        backHome: "Back to home",
        hotlines: "View hotlines",
    },
    steps: [
        { title: "Pin it", body: "Tap the map to mark exactly where the problem is." },
        { title: "Describe it", body: "Choose a category, add a short description and an optional photo." },
        { title: "Track it", body: "Use your reference number to see when it is received, worked on, and resolved." },
    ],
    stats: { total: "Reports", open: "Open", resolved: "Resolved" },
    previewNotice:
        "Preview mode: the reports shown are samples, and anything you submit is saved only in this browser. It is not yet sent to the municipal government.",
    emergency: {
        title: "Is this an emergency?",
        body: "Fire, crime in progress, flooding, or anyone in danger: do not use this form. Call the emergency hotlines right away.",
        cta: "Open emergency hotlines",
    },
    form: {
        heading: "Report a problem",
        subheading: "It takes about a minute. Fields marked * are required.",
        categoryLabel: "What kind of problem is it? *",
        titleLabel: "Short summary *",
        titlePlaceholder: "e.g. Deep pothole in front of the school",
        descriptionLabel: "Details *",
        descriptionPlaceholder: "What is happening, since when, and who is affected?",
        barangayLabel: "Barangay *",
        barangayPlaceholder: "Select barangay",
        locationLabel: "Location *",
        locationHint: "Click or tap the map to drop a pin.",
        locationSet: "Pin placed. Drag the map and click again to move it.",
        useMyLocation: "Use my location",
        locating: "Finding you…",
        locationDenied: "We could not get your location. Please tap the map instead.",
        clearPin: "Clear pin",
        photoLabel: "Photo",
        photoHint: "Optional. JPG or PNG up to 5 MB. Photos are not uploaded in preview mode.",
        photoTooLarge: "That photo is larger than 5 MB.",
        removePhoto: "Remove photo",
        contactHeading: "Contact details",
        nameLabel: "Your name",
        contactLabel: "Mobile number or email",
        optional: "Optional",
        privacy: "So the office can ask follow-up questions. Contact details are never shown publicly.",
        submit: "Submit report",
        errors: {
            category: "Choose a category.",
            title: "Add a short summary (at least 5 characters).",
            description: "Add a few details (at least 15 characters).",
            barangay: "Select the barangay.",
            location: "Drop a pin on the map.",
            outside: "That pin is outside Pagbilao. Please move it.",
        },
    },
    success: {
        heading: "Report received",
        body: "Thank you for helping keep Pagbilao in good shape. Keep your reference number to track this report.",
        referenceLabel: "Reference number",
        copy: "Copy",
        copied: "Copied",
        another: "Report another problem",
    },
    browse: {
        heading: "Recent reports",
        intro: "See what neighbors have reported. If it is already here, add a “Me too” instead of filing a duplicate.",
        searchPlaceholder: "Search by keyword or barangay",
        allCategories: "All",
        allStatuses: "Any status",
        empty: "No reports match these filters.",
        meToo: "Me too",
        meTooDone: "You said me too",
        viewOnMap: "View on map",
        showMore: "Show more reports",
        sample: "Sample",
        reportedOn: "Reported",
        yours: "Your report",
    },
    map: {
        legend: "Status",
        pickHint: "Click or tap anywhere on the map to place your pin.",
        selected: "Selected report",
        close: "Close",
    },
    track: {
        heading: "Track a report",
        body: "Enter the reference number you received when you submitted your report.",
        placeholder: "e.g. PG-2026-7K3F",
        button: "Track",
        notFound: "We could not find that reference number in this browser. Check for typos and try again.",
        timeline: { received: "Received", inProgress: "In progress", resolved: "Resolved" },
    },
    statuses: { received: "Received", "in-progress": "In progress", resolved: "Resolved" },
    categories: {
        road: "Roads & sidewalks",
        streetlight: "Streetlights",
        garbage: "Garbage & waste",
        drainage: "Drainage & flooding",
        water: "Water supply",
        safety: "Public safety hazard",
        trees: "Trees & vegetation",
        other: "Something else",
    },
}

const tl: CommunityReportingCopy = {
    breadcrumb: "Ulat ng Komunidad",
    eyebrow: "Ulat ng Komunidad",
    heading: "May nakitang problema sa Pagbilao? I-pin at i-report.",
    intro: "Sirang ilaw sa kalsada, lubak, hindi nakolektang basura, barado na kanal. Maglagay ng pin, ilarawan ang nakita, at sundan ang ulat hanggang maresolba.",
    ctaReport: "Mag-ulat ng problema",
    ctaBrowse: "Tingnan ang mga ulat",
    comingSoon: {
        badge: "Malapit na",
        heading: "Paparating na ang Ulat ng Komunidad",
        body: "Gumagawa kami ng simpleng paraan para mai-pin ng mga residente ang mga problema sa mapa. Bumalik po muli.",
        backHome: "Bumalik sa home",
        hotlines: "Tingnan ang mga hotline",
    },
    steps: [
        { title: "I-pin", body: "Pindutin ang mapa para markahan kung nasaan ang problema." },
        { title: "Ilarawan", body: "Pumili ng kategorya, magdagdag ng maikling paglalarawan at opsyonal na larawan." },
        { title: "Subaybayan", body: "Gamitin ang reference number para makita kung natanggap, inaayos, o naresolba na." },
    ],
    stats: { total: "Ulat", open: "Bukas", resolved: "Naresolba" },
    previewNotice:
        "Preview mode: mga sample ang mga ulat na nakikita, at ang isusumite mo ay mase-save lang sa browser na ito. Hindi pa ito napupunta sa pamahalaang bayan.",
    emergency: {
        title: "Emergency ba ito?",
        body: "Sunog, krimen na nagaganap, baha, o sinumang nasa panganib: huwag gamitin ang form na ito. Tumawag agad sa mga emergency hotline.",
        cta: "Buksan ang emergency hotlines",
    },
    form: {
        heading: "Mag-ulat ng problema",
        subheading: "Isang minuto lang ito. Kailangan ang mga field na may *.",
        categoryLabel: "Anong uri ng problema? *",
        titleLabel: "Maikling buod *",
        titlePlaceholder: "hal. Malalim na lubak sa harap ng paaralan",
        descriptionLabel: "Detalye *",
        descriptionPlaceholder: "Ano ang nangyayari, kailan pa, at sino ang apektado?",
        barangayLabel: "Barangay *",
        barangayPlaceholder: "Pumili ng barangay",
        locationLabel: "Lokasyon *",
        locationHint: "Pindutin ang mapa para maglagay ng pin.",
        locationSet: "Nailagay na ang pin. Pindutin muli ang mapa para ilipat.",
        useMyLocation: "Gamitin ang lokasyon ko",
        locating: "Hinahanap ka…",
        locationDenied: "Hindi makuha ang iyong lokasyon. Pindutin na lang ang mapa.",
        clearPin: "Alisin ang pin",
        photoLabel: "Larawan",
        photoHint: "Opsyonal. JPG o PNG hanggang 5 MB. Hindi ina-upload ang mga larawan sa preview mode.",
        photoTooLarge: "Mas malaki sa 5 MB ang larawan.",
        removePhoto: "Alisin ang larawan",
        contactHeading: "Contact details",
        nameLabel: "Pangalan mo",
        contactLabel: "Mobile number o email",
        optional: "Opsyonal",
        privacy: "Para makapagtanong ang tanggapan kung kinakailangan. Hindi kailanman ipapakita sa publiko ang contact details.",
        submit: "Isumite ang ulat",
        errors: {
            category: "Pumili ng kategorya.",
            title: "Maglagay ng maikling buod (hindi bababa sa 5 titik).",
            description: "Maglagay ng ilang detalye (hindi bababa sa 15 titik).",
            barangay: "Piliin ang barangay.",
            location: "Maglagay ng pin sa mapa.",
            outside: "Nasa labas ng Pagbilao ang pin. Pakilipat.",
        },
    },
    success: {
        heading: "Natanggap na ang ulat",
        body: "Salamat sa pagtulong na mapanatiling maayos ang Pagbilao. Itago ang reference number para masubaybayan ang ulat na ito.",
        referenceLabel: "Reference number",
        copy: "Kopyahin",
        copied: "Nakopya",
        another: "Mag-ulat ng ibang problema",
    },
    browse: {
        heading: "Mga kamakailang ulat",
        intro: "Tingnan ang inulat ng mga kapitbahay. Kung nandito na, mag-“Me too” na lang sa halip na mag-ulat ulit.",
        searchPlaceholder: "Maghanap ayon sa salita o barangay",
        allCategories: "Lahat",
        allStatuses: "Anumang status",
        empty: "Walang ulat na tumutugma sa mga filter.",
        meToo: "Me too",
        meTooDone: "Nag-me too ka",
        viewOnMap: "Tingnan sa mapa",
        showMore: "Magpakita pa ng ulat",
        sample: "Sample",
        reportedOn: "Iniulat noong",
        yours: "Iyong ulat",
    },
    map: {
        legend: "Status",
        pickHint: "Pindutin kahit saan sa mapa para ilagay ang pin.",
        selected: "Napiling ulat",
        close: "Isara",
    },
    track: {
        heading: "Subaybayan ang ulat",
        body: "Ilagay ang reference number na natanggap mo nang isumite ang ulat.",
        placeholder: "hal. PG-2026-7K3F",
        button: "Subaybayan",
        notFound: "Hindi namin makita ang reference number na iyan sa browser na ito. Tingnan kung tama ang pagkakasulat.",
        timeline: { received: "Natanggap", inProgress: "Inaayos", resolved: "Naresolba" },
    },
    statuses: { received: "Natanggap", "in-progress": "Inaayos", resolved: "Naresolba" },
    categories: {
        road: "Kalsada at bangketa",
        streetlight: "Ilaw sa kalsada",
        garbage: "Basura",
        drainage: "Kanal at baha",
        water: "Suplay ng tubig",
        safety: "Panganib sa kaligtasan",
        trees: "Puno at halaman",
        other: "Iba pa",
    },
}

export const communityReportingCopy: Record<Language, CommunityReportingCopy> = { en, tl }
