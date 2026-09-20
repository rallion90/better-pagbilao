import type { Language } from "./translations"

export interface CommunityReportingCopy {
    breadcrumb: string
    eyebrow: string
    heading: string
    intro: string
    ctaReport: string
    ctaBrowse: string
    ctaTrack: string
    checking: string
    unavailable: {
        badge: string
        heading: string
        body: string
        errorHeading: string
        errorBody: string
        retry: string
        backHome: string
        hotlines: string
        track: string
    }
    steps: { title: string; body: string }[]
    stats: { total: string; open: string; resolved: string }
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
        locationTextLabel: string
        locationTextPlaceholder: string
        photoLabel: string
        photoHint: string
        photoTooLarge: string
        photoBadType: string
        photoTooMany: string
        removePhoto: string
        contactHeading: string
        nameLabel: string
        emailLabel: string
        phoneLabel: string
        optional: string
        privacy: string
        submit: string
        submitting: string
        optionsFailed: string
        retry: string
        errors: { category: string; title: string; description: string; barangay: string; outside: string; email: string }
        submitErrors: { rateLimited: string; network: string; server: string; fixFields: string }
    }
    success: { heading: string; body: string; referenceLabel: string; copy: string; copied: string; track: string; another: string }
    browse: {
        heading: string
        intro: string
        searchPlaceholder: string
        allCategories: string
        allStatuses: string
        allBarangays: string
        empty: string
        loading: string
        loadFailed: string
        retry: string
        viewOnMap: string
        showMore: string
        reportedOn: string
        assignedTo: string
    }
    map: { legend: string; pickHint: string; selected: string; close: string }
    track: {
        breadcrumb: string
        eyebrow: string
        heading: string
        body: string
        placeholder: string
        button: string
        looking: string
        notFound: string
        rateLimited: string
        failed: string
        retry: string
        submittedOn: string
        resolvedOn: string
        assignedOffice: string
        unassigned: string
        locationLabel: string
        updatesHeading: string
        noUpdates: string
        photosHeading: string
        rejectedNote: string
        reportAnother: string
        callout: { heading: string; body: string }
    }
}

const en: CommunityReportingCopy = {
    breadcrumb: "Community Reporting",
    eyebrow: "Community Reporting",
    heading: "See a problem in Pagbilao? Pin it and report it.",
    intro: "Broken streetlights, potholes, uncollected garbage, clogged drains. Drop a pin, describe what you see, and follow the report until it is resolved.",
    ctaReport: "Report a problem",
    ctaBrowse: "Browse reports",
    ctaTrack: "Track my report",
    checking: "Checking whether reporting is open…",
    unavailable: {
        badge: "Reporting paused",
        heading: "Community reporting is not accepting new reports right now",
        body: "New reports are currently switched off. If you already sent a report, you can still track it with your tracking code. For urgent problems, please call the hotlines.",
        errorHeading: "Community reporting is unavailable right now",
        errorBody: "We could not confirm that reporting is open. You can still track an existing report, and for urgent problems please call the hotlines.",
        retry: "Check again",
        backHome: "Back to home",
        hotlines: "View hotlines",
        track: "Track my report",
    },
    steps: [
        { title: "Pin it", body: "Tap the map to mark exactly where the problem is." },
        { title: "Describe it", body: "Choose a category, add a short description and optional photos." },
        { title: "Track it", body: "Use your tracking code to see when it is received, worked on, and resolved." },
    ],
    stats: { total: "Public reports", open: "Open", resolved: "Resolved" },
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
        locationLabel: "Location on the map",
        locationHint: "Recommended. Click or tap the map to drop a pin.",
        locationSet: "Pin placed. Click the map again to move it.",
        useMyLocation: "Use my location",
        locating: "Finding you…",
        locationDenied: "We could not get your location. Please tap the map instead.",
        clearPin: "Clear pin",
        locationTextLabel: "Street or landmark",
        locationTextPlaceholder: "e.g. Beside the barangay hall",
        photoLabel: "Photos",
        photoHint: "Optional. Up to 3 photos (JPG, PNG or WebP), 5 MB each.",
        photoTooLarge: "Each photo must be 5 MB or smaller.",
        photoBadType: "Only JPG, PNG or WebP photos are accepted.",
        photoTooMany: "You can attach up to 3 photos.",
        removePhoto: "Remove photo",
        contactHeading: "Contact details",
        nameLabel: "Your name",
        emailLabel: "Email",
        phoneLabel: "Mobile number",
        optional: "Optional",
        privacy: "So the office can ask follow-up questions. Contact details are never shown publicly.",
        submit: "Submit report",
        submitting: "Sending…",
        optionsFailed: "We could not load the categories and barangays. Check your connection and try again.",
        retry: "Try again",
        errors: {
            category: "Choose a category.",
            title: "Add a short summary.",
            description: "Add a few details (at least 10 characters).",
            barangay: "Select the barangay.",
            outside: "That pin is outside Pagbilao. Please move it.",
            email: "Enter a valid email address.",
        },
        submitErrors: {
            rateLimited: "Please try again later.",
            network: "We could not send your report. Check your connection and try again. What you typed is still here.",
            server: "Something went wrong on our side. Please try again in a moment. What you typed is still here.",
            fixFields: "Please fix the highlighted fields.",
        },
    },
    success: {
        heading: "Report received",
        body: "Thank you for helping keep Pagbilao in good shape. Keep your tracking code to follow this report.",
        referenceLabel: "Tracking code",
        copy: "Copy",
        copied: "Copied",
        track: "Track this report",
        another: "Report another problem",
    },
    browse: {
        heading: "Reports from the community",
        intro: "Reports the municipal office has accepted appear here. Check if your concern is already listed before filing a new one.",
        searchPlaceholder: "Search by keyword",
        allCategories: "All",
        allStatuses: "Any status",
        allBarangays: "All barangays",
        empty: "No reports match these filters.",
        loading: "Loading reports…",
        loadFailed: "We could not load the reports. Please try again.",
        retry: "Try again",
        viewOnMap: "View on map",
        showMore: "Show more reports",
        reportedOn: "Reported",
        assignedTo: "Handled by",
    },
    map: {
        legend: "Status",
        pickHint: "Click or tap anywhere on the map to place your pin.",
        selected: "Selected report",
        close: "Close",
    },
    track: {
        breadcrumb: "Track my report",
        eyebrow: "Community Reporting",
        heading: "Track my report",
        body: "Enter the tracking code you received when you sent your report. It starts with PGB-.",
        placeholder: "e.g. PGB-ABCD1234",
        button: "Track",
        looking: "Looking up your report…",
        notFound: "We could not find a report with that tracking code. Check for typos and try again.",
        rateLimited: "Please try again later.",
        failed: "We could not look up your report right now. Check your connection and try again.",
        retry: "Try again",
        submittedOn: "Sent",
        resolvedOn: "Resolved",
        assignedOffice: "Assigned office",
        unassigned: "Not assigned yet",
        locationLabel: "Location",
        updatesHeading: "Updates",
        noUpdates: "No updates yet. The office will post here as your report moves along.",
        photosHeading: "Photos",
        rejectedNote: "The office was not able to act on this report.",
        reportAnother: "Report a problem",
        callout: { heading: "No tracking code?", body: "The code is shown right after you submit a report. It looks like PGB-XXXXXXXX." },
    },
}

const tl: CommunityReportingCopy = {
    breadcrumb: "Ulat ng Komunidad",
    eyebrow: "Ulat ng Komunidad",
    heading: "May nakitang problema sa Pagbilao? I-pin at i-report.",
    intro: "Sirang ilaw sa kalsada, lubak, hindi nakolektang basura, barado na kanal. Maglagay ng pin, ilarawan ang nakita, at sundan ang ulat hanggang maresolba.",
    ctaReport: "Mag-ulat ng problema",
    ctaBrowse: "Tingnan ang mga ulat",
    ctaTrack: "Subaybayan ang ulat ko",
    checking: "Sinusuri kung bukas ang pag-uulat…",
    unavailable: {
        badge: "Naka-pause ang pag-uulat",
        heading: "Hindi muna tumatanggap ng bagong ulat ang Ulat ng Komunidad",
        body: "Kasalukuyang naka-off ang pagtanggap ng bagong ulat. Kung nakapag-ulat ka na, masusubaybayan mo pa rin ito gamit ang tracking code. Para sa madalian, tumawag sa mga hotline.",
        errorHeading: "Hindi available ang Ulat ng Komunidad sa ngayon",
        errorBody: "Hindi namin makumpirma kung bukas ang pag-uulat. Masusubaybayan mo pa rin ang naipadalang ulat, at para sa madalian, tumawag sa mga hotline.",
        retry: "Suriin muli",
        backHome: "Bumalik sa home",
        hotlines: "Tingnan ang mga hotline",
        track: "Subaybayan ang ulat ko",
    },
    steps: [
        { title: "I-pin", body: "Pindutin ang mapa para markahan kung nasaan ang problema." },
        { title: "Ilarawan", body: "Pumili ng kategorya, magdagdag ng maikling paglalarawan at opsyonal na mga larawan." },
        { title: "Subaybayan", body: "Gamitin ang tracking code para makita kung natanggap, inaayos, o naresolba na." },
    ],
    stats: { total: "Pampublikong ulat", open: "Bukas", resolved: "Naresolba" },
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
        locationLabel: "Lokasyon sa mapa",
        locationHint: "Inirerekomenda. Pindutin ang mapa para maglagay ng pin.",
        locationSet: "Nailagay na ang pin. Pindutin muli ang mapa para ilipat.",
        useMyLocation: "Gamitin ang lokasyon ko",
        locating: "Hinahanap ka…",
        locationDenied: "Hindi makuha ang iyong lokasyon. Pindutin na lang ang mapa.",
        clearPin: "Alisin ang pin",
        locationTextLabel: "Kalye o palatandaan",
        locationTextPlaceholder: "hal. Katabi ng barangay hall",
        photoLabel: "Mga larawan",
        photoHint: "Opsyonal. Hanggang 3 larawan (JPG, PNG o WebP), 5 MB bawat isa.",
        photoTooLarge: "Dapat 5 MB o mas maliit ang bawat larawan.",
        photoBadType: "JPG, PNG o WebP lang ang tinatanggap.",
        photoTooMany: "Hanggang 3 larawan lang ang puwedeng ilakip.",
        removePhoto: "Alisin ang larawan",
        contactHeading: "Contact details",
        nameLabel: "Pangalan mo",
        emailLabel: "Email",
        phoneLabel: "Mobile number",
        optional: "Opsyonal",
        privacy: "Para makapagtanong ang tanggapan kung kinakailangan. Hindi kailanman ipapakita sa publiko ang contact details.",
        submit: "Isumite ang ulat",
        submitting: "Ipinapadala…",
        optionsFailed: "Hindi namin ma-load ang mga kategorya at barangay. Tingnan ang koneksyon at subukan muli.",
        retry: "Subukan muli",
        errors: {
            category: "Pumili ng kategorya.",
            title: "Maglagay ng maikling buod.",
            description: "Maglagay ng ilang detalye (hindi bababa sa 10 titik).",
            barangay: "Piliin ang barangay.",
            outside: "Nasa labas ng Pagbilao ang pin. Pakilipat.",
            email: "Maglagay ng wastong email address.",
        },
        submitErrors: {
            rateLimited: "Pakisubukan muli mamaya.",
            network: "Hindi naipadala ang ulat. Tingnan ang koneksyon at subukan muli. Nandito pa rin ang isinulat mo.",
            server: "May problema sa aming panig. Subukan muli sa ilang sandali. Nandito pa rin ang isinulat mo.",
            fixFields: "Pakiayos ang mga naka-highlight na field.",
        },
    },
    success: {
        heading: "Natanggap na ang ulat",
        body: "Salamat sa pagtulong na mapanatiling maayos ang Pagbilao. Itago ang tracking code para masubaybayan ang ulat na ito.",
        referenceLabel: "Tracking code",
        copy: "Kopyahin",
        copied: "Nakopya",
        track: "Subaybayan ang ulat na ito",
        another: "Mag-ulat ng ibang problema",
    },
    browse: {
        heading: "Mga ulat mula sa komunidad",
        intro: "Dito lumalabas ang mga ulat na tinanggap ng tanggapan ng munisipyo. Tingnan muna kung nakalista na ang inirereklamo mo bago mag-ulat ulit.",
        searchPlaceholder: "Maghanap ayon sa salita",
        allCategories: "Lahat",
        allStatuses: "Anumang status",
        allBarangays: "Lahat ng barangay",
        empty: "Walang ulat na tumutugma sa mga filter.",
        loading: "Nilo-load ang mga ulat…",
        loadFailed: "Hindi namin ma-load ang mga ulat. Subukan muli.",
        retry: "Subukan muli",
        viewOnMap: "Tingnan sa mapa",
        showMore: "Magpakita pa ng ulat",
        reportedOn: "Iniulat noong",
        assignedTo: "Hawak ng",
    },
    map: {
        legend: "Status",
        pickHint: "Pindutin kahit saan sa mapa para ilagay ang pin.",
        selected: "Napiling ulat",
        close: "Isara",
    },
    track: {
        breadcrumb: "Subaybayan ang ulat ko",
        eyebrow: "Ulat ng Komunidad",
        heading: "Subaybayan ang ulat ko",
        body: "Ilagay ang tracking code na natanggap mo nang ipadala ang ulat. Nagsisimula ito sa PGB-.",
        placeholder: "hal. PGB-ABCD1234",
        button: "Subaybayan",
        looking: "Hinahanap ang ulat mo…",
        notFound: "Walang nakitang ulat na may ganyang tracking code. Tingnan kung tama ang pagkakasulat.",
        rateLimited: "Pakisubukan muli mamaya.",
        failed: "Hindi namin mahanap ang ulat mo ngayon. Tingnan ang koneksyon at subukan muli.",
        retry: "Subukan muli",
        submittedOn: "Ipinadala",
        resolvedOn: "Naresolba",
        assignedOffice: "Nakatalagang tanggapan",
        unassigned: "Wala pang nakatalaga",
        locationLabel: "Lokasyon",
        updatesHeading: "Mga update",
        noUpdates: "Wala pang update. Magpo-post ang tanggapan dito habang umuusad ang ulat mo.",
        photosHeading: "Mga larawan",
        rejectedNote: "Hindi naaksyunan ng tanggapan ang ulat na ito.",
        reportAnother: "Mag-ulat ng problema",
        callout: { heading: "Walang tracking code?", body: "Makikita ang code pagkatapos mong magsumite ng ulat. Ganito ang itsura: PGB-XXXXXXXX." },
    },
}

export const communityReportingCopy: Record<Language, CommunityReportingCopy> = { en, tl }
