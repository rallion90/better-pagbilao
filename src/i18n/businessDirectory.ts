import type { BusinessCategoryId } from "../types/businesses"
import type { Language } from "./translations"

export interface BusinessDirectoryCopy {
    breadcrumbCommunity: string
    /** Gallery caption by category — "Menu photos" for food, "Product photos" for retail, and so on. Derived from the category the owner already picked, so nothing extra to type. */
    galleryLabel: Record<BusinessCategoryId, string>
    checking: string
    unavailable: {
        badge: string
        heading: string
        body: string
        errorHeading: string
        errorBody: string
        retry: string
        backHome: string
        permits: string
    }
    detail: {
        backToDirectory: string
        aboutHeading: string
        contactHeading: string
        mapHeading: string
        galleryEmpty: string
        photoAlt: (name: string, index: number) => string
        logoAlt: (name: string) => string
        call: string
        online: string
        hoursLabel: string
        addressLabel: string
        barangayLabel: string
        productsLabel: string
        approxNote: string
        hiddenNote: string
        loading: string
        loadFailed: string
        retry: string
        notFoundHeading: string
        notFoundBody: string
        ctaHeading: string
        ctaBody: string
        ctaButton: string
    }
    directory: {
        breadcrumb: string
        eyebrow: string
        heading: string
        intro: string
        ctaAdd: string
        ctaBrowse: string
        steps: { title: string; body: string }[]
        listHeading: string
        listIntro: string
        searchPlaceholder: string
        allBarangays: string
        allCategories: string
        resultCount: (from: number, to: number, total: number) => string
        loading: string
        emptyFiltered: string
        emptyAll: string
        clearFilters: string
        loadFailed: string
        retry: string
        pagination: { label: string; previous: string; next: string; page: (page: number, lastPage: number) => string }
        hoursLabel: string
        call: string
        online: string
        viewDetails: string
        cta: { heading: string; body: string; button: string; permitsLink: string }
        map: {
            viewOnMap: string
            selected: string
            close: string
            legendExact: string
            legendApprox: string
            approxNote: string
            hiddenNote: string
            loading: string
        }
    }
    form: {
        breadcrumb: string
        eyebrow: string
        heading: string
        intro: string
        sections: {
            about: string
            location: string
            contact: string
            details: string
            photos: string
            consent: string
        }
        fields: {
            businessName: string
            businessNamePlaceholder: string
            category: string
            categoryPlaceholder: string
            description: string
            descriptionPlaceholder: string
            productsServices: string
            productsServicesPlaceholder: string
            barangay: string
            barangayPlaceholder: string
            address: string
            addressPlaceholder: string
            serviceArea: string
            homeBased: string
            deliversTo: string
            ownerName: string
            ownerNamePlaceholder: string
            showOwner: string
            phone: string
            phonePlaceholder: string
            email: string
            emailPlaceholder: string
            online: string
            onlinePlaceholder: string
            hours: string
            hoursPlaceholder: string
            employees: string
            employeesPlaceholder: string
            /** Labels for EMPLOYEE_OPTIONS, same order. The API values themselves are never translated. */
            employeesOptions: string[]
            yearStarted: string
            yearStartedPlaceholder: string
            photoLogo: string
            photoHint: string
            chooseFile: string
            optional: string
            required: string
            galleryLabel: string
            galleryHint: string
            addPhoto: string
            removePhoto: string
            galleryCount: (count: number, max: number) => string
        }
        map: {
            heading: string
            intro: string
            pickHint: string
            useMyLocation: string
            locating: string
            locationDenied: string
            locationSet: string
            outside: string
            clearPin: string
            loading: string
            precisionLabel: string
            precision: { exact: { title: string; body: string }; approximate: { title: string; body: string }; hidden: { title: string; body: string } }
        }
        consent: { publish: string; privacy: string; accurate: string }
        submit: string
        submitting: string
        optionsFailed: string
        retry: string
        errors: {
            businessName: string
            category: string
            description: string
            barangay: string
            address: string
            ownerName: string
            phone: string
            email: string
            yearStarted: (maxYear: number) => string
            location: string
            consent: string
            tooLong: (max: number) => string
            photoBadType: string
            photoTooLarge: string
            photoTooMany: (max: number) => string
        }
        submitErrors: { fixFields: string; rateLimited: string; network: string; server: string }
        success: { heading: string; body: string; another: string; backToDirectory: string }
        sidebar: {
            afterHeading: string
            after: string[]
            publishHeading: string
            publish: string[]
            notHeading: string
            notBody: string
            helpHeading: string
            helpBody: string
            helpLink: string
        }
        backToDirectory: string
    }
}

const en: BusinessDirectoryCopy = {
    breadcrumbCommunity: "Community",
    galleryLabel: {
        food: "Menu photos",
        retail: "Product photos",
        agri: "Farm & catch photos",
        services: "Work photos",
        health: "Photos",
        transport: "Vehicle photos",
        construction: "Product photos",
        beauty: "Work photos",
        education: "Photos",
        stay: "Room photos",
        online: "Product photos",
        other: "Photos",
    },
    checking: "Loading the business directory…",
    unavailable: {
        badge: "Temporarily unavailable",
        heading: "The business directory is paused",
        body: "The directory is turned off for now while volunteers do some upkeep. Please check back soon.",
        errorHeading: "We couldn't load the business directory",
        errorBody: "The server didn't answer. Check your connection and try again.",
        retry: "Try again",
        backHome: "Back to home",
        permits: "Business permits",
    },
    detail: {
        backToDirectory: "Back to the directory",
        aboutHeading: "About",
        contactHeading: "Contact",
        mapHeading: "Location",
        galleryEmpty: "This owner hasn't uploaded any photos yet.",
        photoAlt: (name, index) => `${name}, photo ${index}`,
        logoAlt: (name) => `${name} logo`,
        call: "Call",
        online: "Visit online page",
        hoursLabel: "Hours",
        addressLabel: "Address",
        barangayLabel: "Barangay",
        productsLabel: "Products and services",
        approxNote: "The owner chose to show only the general area. The circle is roughly where the business is, not the exact spot.",
        hiddenNote: "The owner chose not to show this business on the map. Use the address above to find it.",
        loading: "Loading business…",
        loadFailed: "We couldn't load this business. Check your connection and try again.",
        retry: "Try again",
        notFoundHeading: "We couldn't find that business",
        notFoundBody: "It may have been removed, may still be waiting for review, or the link is incorrect.",
        ctaHeading: "Have a business like this?",
        ctaBody: "Listing takes about five minutes and costs nothing.",
        ctaButton: "List your business",
    },
    directory: {
        breadcrumb: "Local Businesses",
        eyebrow: "Community Directory",
        heading: "Shop local. Find Pagbilao businesses.",
        intro:
            "A community-built list of stores, food places, farms, services, and online sellers in Pagbilao, Quezon. Added by owners, residents, and anyone who knows a local business, so neighbors and visitors know where to go.",
        ctaAdd: "List your business",
        ctaBrowse: "Browse businesses",
        steps: [
            { title: "Anyone can add", body: "Own a business or know one you like? Anyone can send in a free listing for a Pagbilao business, big or small." },
            { title: "We review", body: "A volunteer checks the details before the listing goes public." },
            { title: "Neighbors find you", body: "Residents and visitors search by barangay or category to find what they need." },
        ],
        listHeading: "Businesses in Pagbilao",
        listIntro: "Search by name, or narrow the list by barangay and category.",
        searchPlaceholder: "Search by business name or product",
        allBarangays: "All barangays",
        allCategories: "All",
        resultCount: (from, to, total) => (total === 1 ? "Showing 1 business" : `Showing ${from}–${to} of ${total} businesses`),
        loading: "Loading businesses…",
        emptyFiltered: "No businesses match your filters.",
        emptyAll: "No businesses are listed yet. Be the first to add yours!",
        clearFilters: "Clear filters",
        loadFailed: "We couldn't load the businesses. Check your connection and try again.",
        retry: "Try again",
        pagination: { label: "Pages", previous: "Previous", next: "Next", page: (page, lastPage) => `Page ${page} of ${lastPage}` },
        hoursLabel: "Hours",
        call: "Call",
        online: "Online",
        viewDetails: "View details",
        cta: {
            heading: "Is your business missing?",
            body: "Listing takes about five minutes and costs nothing. Sari-sari stores, home-based sellers, farmers, and fisherfolk are all welcome.",
            button: "List your business",
            permitsLink: "Need a business permit? See how to apply",
        },
        map: {
            viewOnMap: "View on map",
            selected: "Selected business",
            close: "Close",
            legendExact: "Exact location",
            legendApprox: "Approximate area",
            approxNote: "The owner chose to show only the general area, so the exact spot is not on the map.",
            hiddenNote: "The owner chose not to show this business on the map.",
            loading: "Loading map…",
        },
    },
    form: {
        breadcrumb: "Add a Business",
        eyebrow: "Community Directory",
        heading: "Add a business in Pagbilao",
        intro:
            "Own a business, or know a favorite local spot? Tell us about it so neighbors and visitors can find it. It's free, and it can be as small as a sari-sari store or a weekend food seller.",
        sections: {
            about: "About your business",
            location: "Where to find you",
            contact: "How to reach you",
            details: "A few more details",
            photos: "Photos",
            consent: "Before you submit",
        },
        fields: {
            businessName: "Business name",
            businessNamePlaceholder: "e.g. Tindahan ni Aling Nena",
            category: "Category",
            categoryPlaceholder: "Choose a category",
            description: "Short description",
            descriptionPlaceholder: "What do you sell or offer? What makes it special?",
            productsServices: "Main products or services",
            productsServicesPlaceholder: "e.g. Load, bottled water, LPG",
            barangay: "Barangay",
            barangayPlaceholder: "Choose a barangay",
            address: "Street, purok, or landmark",
            addressPlaceholder: "e.g. Beside the barangay hall",
            serviceArea: "Service area",
            homeBased: "My business is home-based or online (no walk-in store)",
            deliversTo: "I deliver or serve customers in other barangays",
            ownerName: "Owner's name",
            ownerNamePlaceholder: "Full name",
            showOwner: "Show my name on the public listing",
            phone: "Mobile or landline",
            phonePlaceholder: "09XX XXX XXXX",
            email: "Email",
            emailPlaceholder: "you@example.com",
            online: "Facebook page or website",
            onlinePlaceholder: "facebook.com/your-page",
            hours: "Opening hours",
            hoursPlaceholder: "e.g. 8:00 AM – 6:00 PM, Mon–Sat",
            employees: "Number of workers",
            employeesPlaceholder: "Choose one",
            employeesOptions: ["Just me", "2–5", "6–10", "11–50", "More than 50"],
            yearStarted: "Year started",
            yearStartedPlaceholder: "e.g. 2019",
            photoLogo: "Logo or signboard",
            photoHint: "JPG, PNG, or WebP, up to 5 MB each.",
            chooseFile: "Choose file",
            optional: "Optional",
            required: "Required",
            galleryLabel: "Photos of your menu, products, or store",
            galleryHint: "A few clear photos say more than a typed description. You can add up to 8.",
            addPhoto: "Add photo",
            removePhoto: "Remove photo",
            galleryCount: (count, max) => `${count} of ${max} photos`,
        },
        map: {
            heading: "Pin your business on the map",
            intro: "Tap the map exactly where your business is. Stand at the entrance and use your phone's location for the most accurate pin.",
            pickHint: "Tap the map to drop a pin. Tap again to move it.",
            useMyLocation: "Use my current location",
            locating: "Finding you…",
            locationDenied: "We couldn't get your location. Tap the map to place the pin yourself.",
            locationSet: "Pin placed. Zoom in and tap again if it needs adjusting.",
            outside: "This pin is outside Pagbilao. Please move it inside the municipality.",
            clearPin: "Remove pin",
            loading: "Loading map…",
            precisionLabel: "How should the map show your location?",
            precision: {
                exact: { title: "Exact spot", body: "Best for stores and shops that customers visit." },
                approximate: { title: "General area only", body: "Shows a circle of about 300 m. Good for home-based businesses." },
                hidden: { title: "Don't show on the map", body: "You'll still be in the list, with your barangay." },
            },
        },
        consent: {
            publish: "I agree that the business details above (except the private contact info I mark) may be shown on the public directory.",
            privacy: "I understand my personal information is handled under the Data Privacy Act of 2012 and used only for this directory.",
            accurate: "The details I entered are accurate to the best of my knowledge.",
        },
        submit: "Submit for review",
        submitting: "Sending…",
        optionsFailed: "We couldn't load the category and barangay lists. Check your connection and try again.",
        retry: "Try again",
        errors: {
            businessName: "Enter your business name.",
            category: "Choose a category.",
            description: "Add a short description of your business.",
            barangay: "Choose a barangay.",
            address: "Enter a street, purok, or landmark.",
            ownerName: "Enter the owner's name.",
            phone: "Enter a phone number customers can call.",
            email: "Enter a valid email address, or leave it blank.",
            yearStarted: (maxYear) => `Enter a year between 1900 and ${maxYear}.`,
            location: "This pin is outside Pagbilao. Move it inside the municipality or remove it.",
            consent: "Please tick this box to submit.",
            tooLong: (max) => `Keep this to ${max} characters or fewer.`,
            photoBadType: "Only JPG, PNG, or WebP images can be uploaded.",
            photoTooLarge: "This photo is larger than 5 MB.",
            photoTooMany: (max) => `You can add up to ${max} photos.`,
        },
        submitErrors: {
            fixFields: "Please check the highlighted fields.",
            rateLimited: "Too many listings have been sent from your connection. Please try again later.",
            network: "We couldn't reach the server. Check your connection and try again. Your answers are still here.",
            server: "Something went wrong on our side. Please try again in a few minutes.",
        },
        success: {
            heading: "Thank you! Your listing was sent.",
            body: "A volunteer will review your listing, usually within a few days.",
            another: "List another business",
            backToDirectory: "Back to the directory",
        },
        sidebar: {
            afterHeading: "What happens next",
            after: [
                "A volunteer reviews your listing, usually within a few days.",
                "We may message you if something needs fixing.",
                "Once approved, your business appears in the directory.",
            ],
            publishHeading: "What will be public",
            publish: ["Business name, category, and description", "Barangay and address or landmark", "Hours, and the phone or page you choose to share"],
            notHeading: "What stays private",
            notBody: "Your email and, if you choose, your name. We never sell or share your details.",
            helpHeading: "Need a business permit?",
            helpBody: "This directory is not a permit. To operate legally, register with the Municipal Business Permits and Licensing Office.",
            helpLink: "How to get a business permit",
        },
        backToDirectory: "Back to the directory",
    },
}

const tl: BusinessDirectoryCopy = {
    breadcrumbCommunity: "Komunidad",
    galleryLabel: {
        food: "Larawan ng Menu",
        retail: "Larawan ng Produkto",
        agri: "Larawan ng Ani o Huli",
        services: "Larawan ng Trabaho",
        health: "Mga Larawan",
        transport: "Larawan ng Sasakyan",
        construction: "Larawan ng Produkto",
        beauty: "Larawan ng Trabaho",
        education: "Mga Larawan",
        stay: "Larawan ng Kuwarto",
        online: "Larawan ng Produkto",
        other: "Mga Larawan",
    },
    checking: "Nilo-load ang direktoryo ng negosyo…",
    unavailable: {
        badge: "Pansamantalang hindi available",
        heading: "Naka-pause ang direktoryo ng negosyo",
        body: "Pansamantalang naka-off ang direktoryo habang may inaayos ang mga volunteer. Pakibalikan ito maya-maya.",
        errorHeading: "Hindi namin ma-load ang direktoryo ng negosyo",
        errorBody: "Hindi sumagot ang server. Tingnan ang koneksyon mo at subukan ulit.",
        retry: "Subukan ulit",
        backHome: "Bumalik sa home",
        permits: "Business permit",
    },
    detail: {
        backToDirectory: "Bumalik sa direktoryo",
        aboutHeading: "Tungkol dito",
        contactHeading: "Kontak",
        mapHeading: "Lokasyon",
        galleryEmpty: "Wala pang larawang na-upload ang may-ari.",
        photoAlt: (name, index) => `${name}, larawan ${index}`,
        logoAlt: (name) => `Logo ng ${name}`,
        call: "Tawagan",
        online: "Bisitahin ang online page",
        hoursLabel: "Oras",
        addressLabel: "Address",
        barangayLabel: "Barangay",
        productsLabel: "Produkto at serbisyo",
        approxNote: "Piniling ipakita ng may-ari ang pangkalahatang lugar lamang. Tinatayang puwesto ang bilog, hindi ang eksaktong lokasyon.",
        hiddenNote: "Piniling huwag ipakita ng may-ari ang negosyo sa mapa. Gamitin ang address sa itaas para mahanap ito.",
        loading: "Nilo-load ang negosyo…",
        loadFailed: "Hindi namin ma-load ang negosyong ito. Tingnan ang koneksyon mo at subukan ulit.",
        retry: "Subukan ulit",
        notFoundHeading: "Hindi namin mahanap ang negosyong iyon",
        notFoundBody: "Maaaring natanggal na ito, hinihintay pang masuri, o mali ang link.",
        ctaHeading: "May negosyo ka rin ba tulad nito?",
        ctaBody: "Limang minuto lang ang pag-lista at libre ito.",
        ctaButton: "I-lista ang negosyo mo",
    },
    directory: {
        breadcrumb: "Mga Negosyo sa Bayan",
        eyebrow: "Direktoryo ng Komunidad",
        heading: "Bumili sa lokal. Hanapin ang mga negosyo sa Pagbilao.",
        intro:
            "Listahang binuo ng komunidad ng mga tindahan, kainan, sakahan, serbisyo, at online seller sa Pagbilao, Quezon. Idinadagdag ng mga may-ari, residente, at sinumang may alam na lokal na negosyo, para alam ng kapitbahay at bisita kung saan pupunta.",
        ctaAdd: "I-lista ang negosyo mo",
        ctaBrowse: "Tingnan ang mga negosyo",
        steps: [
            { title: "Kahit sino puwedeng magdagdag", body: "May-ari ka man o may alam kang negosyong gusto mo, kahit sino ay puwedeng magpasa ng libreng listing para sa negosyo sa Pagbilao, malaki man o maliit." },
            { title: "Sisiyasatin namin", body: "Titingnan muna ng isang volunteer ang detalye bago ilabas ang listing." },
            { title: "Makikita ka ng kapitbahay", body: "Maghahanap ang mga residente at bisita ayon sa barangay o kategorya." },
        ],
        listHeading: "Mga negosyo sa Pagbilao",
        listIntro: "Maghanap ayon sa pangalan, o paliitin ang listahan ayon sa barangay at kategorya.",
        searchPlaceholder: "Hanapin ayon sa pangalan ng negosyo o produkto",
        allBarangays: "Lahat ng barangay",
        allCategories: "Lahat",
        resultCount: (from, to, total) => (total === 1 ? "Nagpapakita ng 1 negosyo" : `Nagpapakita ng ${from}–${to} sa ${total} negosyo`),
        loading: "Nilo-load ang mga negosyo…",
        emptyFiltered: "Walang negosyong tugma sa mga filter mo.",
        emptyAll: "Wala pang nakalistang negosyo. Ikaw na ang mauna!",
        clearFilters: "Alisin ang mga filter",
        loadFailed: "Hindi namin ma-load ang mga negosyo. Tingnan ang koneksyon mo at subukan ulit.",
        retry: "Subukan ulit",
        pagination: { label: "Mga pahina", previous: "Nakaraan", next: "Susunod", page: (page, lastPage) => `Pahina ${page} sa ${lastPage}` },
        hoursLabel: "Oras",
        call: "Tawagan",
        online: "Online",
        viewDetails: "Tingnan ang detalye",
        cta: {
            heading: "Wala pa ba ang negosyo mo?",
            body: "Limang minuto lang ang pag-lista at libre ito. Welcome ang sari-sari store, home-based na nagtitinda, magsasaka, at mangingisda.",
            button: "I-lista ang negosyo mo",
            permitsLink: "Kailangan ng business permit? Alamin kung paano mag-apply",
        },
        map: {
            viewOnMap: "Tingnan sa mapa",
            selected: "Napiling negosyo",
            close: "Isara",
            legendExact: "Eksaktong lokasyon",
            legendApprox: "Tinatayang lugar",
            approxNote: "Piniling ipakita ng may-ari ang pangkalahatang lugar lamang, kaya wala sa mapa ang eksaktong puwesto.",
            hiddenNote: "Piniling huwag ipakita ng may-ari ang negosyo sa mapa.",
            loading: "Nilo-load ang mapa…",
        },
    },
    form: {
        breadcrumb: "Magdagdag ng Negosyo",
        eyebrow: "Direktoryo ng Komunidad",
        heading: "Magdagdag ng negosyo sa Pagbilao",
        intro:
            "May negosyo ka ba, o may alam kang paboritong puwesto? Ikuwento sa amin para mahanap ito ng kapitbahay at bisita. Libre ito, at puwede kahit maliit na sari-sari store o tindahan tuwing weekend.",
        sections: {
            about: "Tungkol sa negosyo",
            location: "Saan ka mahahanap",
            contact: "Paano ka makokontak",
            details: "Iba pang detalye",
            photos: "Mga larawan",
            consent: "Bago magpasa",
        },
        fields: {
            businessName: "Pangalan ng negosyo",
            businessNamePlaceholder: "hal. Tindahan ni Aling Nena",
            category: "Kategorya",
            categoryPlaceholder: "Pumili ng kategorya",
            description: "Maikling paglalarawan",
            descriptionPlaceholder: "Ano ang ibinebenta o inaalok mo? Ano ang espesyal dito?",
            productsServices: "Pangunahing produkto o serbisyo",
            productsServicesPlaceholder: "hal. Load, bottled water, LPG",
            barangay: "Barangay",
            barangayPlaceholder: "Pumili ng barangay",
            address: "Kalye, purok, o palatandaan",
            addressPlaceholder: "hal. Katabi ng barangay hall",
            serviceArea: "Sakop ng serbisyo",
            homeBased: "Home-based o online ang negosyo ko (walang tindahang pinupuntahan)",
            deliversTo: "Nagde-deliver o naglilingkod ako sa ibang barangay",
            ownerName: "Pangalan ng may-ari",
            ownerNamePlaceholder: "Buong pangalan",
            showOwner: "Ipakita ang pangalan ko sa public listing",
            phone: "Mobile o landline",
            phonePlaceholder: "09XX XXX XXXX",
            email: "Email",
            emailPlaceholder: "ikaw@example.com",
            online: "Facebook page o website",
            onlinePlaceholder: "facebook.com/iyong-page",
            hours: "Oras ng bukas",
            hoursPlaceholder: "hal. 8:00 AM – 6:00 PM, Lun–Sab",
            employees: "Bilang ng manggagawa",
            employeesPlaceholder: "Pumili",
            employeesOptions: ["Ako lang", "2–5", "6–10", "11–50", "Higit sa 50"],
            yearStarted: "Taon ng simula",
            yearStartedPlaceholder: "hal. 2019",
            photoLogo: "Logo o signboard",
            photoHint: "JPG, PNG, o WebP, hanggang 5 MB bawat isa.",
            chooseFile: "Pumili ng file",
            optional: "Opsyonal",
            required: "Kailangan",
            galleryLabel: "Larawan ng menu, produkto, o tindahan",
            galleryHint: "Mas malinaw ang ilang magandang larawan kaysa sa paglalarawang tinatype. Hanggang 8 larawan ang puwede.",
            addPhoto: "Magdagdag ng larawan",
            removePhoto: "Alisin ang larawan",
            galleryCount: (count, max) => `${count} sa ${max} larawan`,
        },
        map: {
            heading: "I-pin ang negosyo mo sa mapa",
            intro: "I-tap ang mapa sa mismong kinaroroonan ng negosyo. Tumayo sa pasukan at gamitin ang location ng telepono para pinakatumpak ang pin.",
            pickHint: "I-tap ang mapa para maglagay ng pin. I-tap ulit para ilipat.",
            useMyLocation: "Gamitin ang kasalukuyan kong lokasyon",
            locating: "Hinahanap ka…",
            locationDenied: "Hindi namin makuha ang lokasyon mo. I-tap ang mapa para ikaw mismo ang maglagay ng pin.",
            locationSet: "Nailagay na ang pin. Mag-zoom in at i-tap ulit kung kailangang ayusin.",
            outside: "Nasa labas ng Pagbilao ang pin na ito. Pakilipat sa loob ng bayan.",
            clearPin: "Alisin ang pin",
            loading: "Nilo-load ang mapa…",
            precisionLabel: "Paano ipapakita sa mapa ang lokasyon mo?",
            precision: {
                exact: { title: "Eksaktong puwesto", body: "Pinakamainam para sa tindahang pinupuntahan ng mga customer." },
                approximate: { title: "Pangkalahatang lugar lang", body: "Magpapakita ng bilog na mga 300 m. Angkop sa home-based na negosyo." },
                hidden: { title: "Huwag ipakita sa mapa", body: "Nasa listahan ka pa rin, kasama ang barangay mo." },
            },
        },
        consent: {
            publish: "Pumapayag akong ipakita sa public na direktoryo ang detalye ng negosyo sa itaas (maliban sa private na contact info na minarkahan ko).",
            privacy: "Nauunawaan kong ang aking personal na impormasyon ay pinangangasiwaan alinsunod sa Data Privacy Act of 2012 at gagamitin lamang para sa direktoryong ito.",
            accurate: "Sa abot ng aking kaalaman, tama ang mga detalyeng inilagay ko.",
        },
        submit: "Ipasa para masuri",
        submitting: "Ipinapadala…",
        optionsFailed: "Hindi namin ma-load ang listahan ng kategorya at barangay. Tingnan ang koneksyon mo at subukan ulit.",
        retry: "Subukan ulit",
        errors: {
            businessName: "Ilagay ang pangalan ng negosyo.",
            category: "Pumili ng kategorya.",
            description: "Magdagdag ng maikling paglalarawan ng negosyo.",
            barangay: "Pumili ng barangay.",
            address: "Ilagay ang kalye, purok, o palatandaan.",
            ownerName: "Ilagay ang pangalan ng may-ari.",
            phone: "Ilagay ang numerong puwedeng tawagan ng customer.",
            email: "Maglagay ng tamang email address, o iwanang blangko.",
            yearStarted: (maxYear) => `Maglagay ng taon mula 1900 hanggang ${maxYear}.`,
            location: "Nasa labas ng Pagbilao ang pin na ito. Ilipat ito sa loob ng bayan o alisin.",
            consent: "Pakilagyan ng tsek ang kahong ito para makapagpasa.",
            tooLong: (max) => `Hanggang ${max} character lang.`,
            photoBadType: "JPG, PNG, o WebP na larawan lang ang puwedeng i-upload.",
            photoTooLarge: "Lampas sa 5 MB ang larawang ito.",
            photoTooMany: (max) => `Hanggang ${max} larawan lang ang puwede.`,
        },
        submitErrors: {
            fixFields: "Pakitingnan ang mga field na may marka.",
            rateLimited: "Masyadong maraming listing na ang naipadala mula sa koneksyon mo. Pakisubukan ulit mamaya.",
            network: "Hindi namin maabot ang server. Tingnan ang koneksyon mo at subukan ulit. Nandito pa rin ang mga sagot mo.",
            server: "May nagkaproblema sa aming panig. Pakisubukan ulit pagkalipas ng ilang minuto.",
        },
        success: {
            heading: "Salamat! Naipadala na ang listing mo.",
            body: "Susuriin ng isang volunteer ang listing mo, karaniwang sa loob ng ilang araw.",
            another: "Mag-lista ng isa pang negosyo",
            backToDirectory: "Bumalik sa direktoryo",
        },
        sidebar: {
            afterHeading: "Ano ang susunod",
            after: [
                "Susuriin ng isang volunteer ang listing mo, karaniwang sa loob ng ilang araw.",
                "Maaaring magmensahe kami kung may kailangang ayusin.",
                "Kapag naaprubahan, lalabas na ang negosyo mo sa direktoryo.",
            ],
            publishHeading: "Ano ang ipapakita sa publiko",
            publish: ["Pangalan, kategorya, at paglalarawan ng negosyo", "Barangay at address o palatandaan", "Oras, at ang telepono o page na piniling ibahagi"],
            notHeading: "Ano ang mananatiling pribado",
            notBody: "Ang email mo at, kung pipiliin mo, ang pangalan mo. Hindi namin ibinebenta o ibinabahagi ang detalye mo.",
            helpHeading: "Kailangan ng business permit?",
            helpBody: "Hindi permit ang direktoryong ito. Para legal na makapag-negosyo, magparehistro sa Municipal Business Permits and Licensing Office.",
            helpLink: "Paano kumuha ng business permit",
        },
        backToDirectory: "Bumalik sa direktoryo",
    },
}

export const businessDirectoryCopy: Record<Language, BusinessDirectoryCopy> = { en, tl }
