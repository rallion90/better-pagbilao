export type Language = "en" | "tl"

interface NavItem {
    label: string
    description: string
}

interface NavMenu {
    label: string
    description: string
    items: NavItem[]
}

interface StatCard {
    label: string
    value: string
    caption: string
}

interface ServiceCard {
    title: string
    description: string
    linkText: string
}

interface TextCard {
    title: string
    description: string
}

interface TransparencyCard {
    category: string
    title: string
}

interface HotlineCard {
    label: string
}

interface TimelineItem {
    eyebrow: string
    title: string
    description: string
}

interface HistoryStat {
    value: string
    label: string
}

interface DisclosurePoint {
    title: string
    body: string
}

export interface Translations {
    common: {
        quickContacts: string
    }
    nav: {
        home: string
        hotlines: string
        history: string
        search: string
        menus: {
            services: NavMenu
            government: NavMenu
            explore: NavMenu
            transparency: NavMenu
        }
    }
    hero: {
        locationBadge: string
        title: string
        description: string
        searchPlaceholder: string
        findService: string
        chips: {
            businessPermit: string
            civilRegistry: string
            emergencyHotlines: string
            wowPagbilao: string
        }
    }
    stats: {
        municipalClass: StatCard
        population: StatCard
        barangays: StatCard
        landArea: StatCard
    }
    home: {
        services: {
            eyebrow: string
            heading: string
            description: string
            formsLink: string
            cards: ServiceCard[]
        }
        identity: {
            eyebrow: string
            heading: string
            paragraph: string
            cards: TextCard[]
        }
        transparency: {
            eyebrow: string
            heading: string
            paragraph: string
            cards: TransparencyCard[]
        }
        tourism: {
            eyebrow: string
            heading: string
            paragraph: string
            destinations: TextCard
            feedback: TextCard
        }
        hotlines: {
            eyebrow: string
            heading: string
            note: string
            cards: HotlineCard[]
        }
        history: {
            eyebrow: string
            heading: string
            paragraph1: string
            paragraph2: string
            stats: HistoryStat[]
            timeline: TimelineItem[]
            notes: string[]
        }
    }
    footer: {
        tagline: string
        quickLinksHeading: string
        quickLinks: string[]
        resourcesHeading: string
        resources: string[]
        costLabel: string
        contribute: string
        copyright: string
        version: string
    }
    chat: {
        title: string
        ready: string
        starterMessage: string
        quickPrompts: string[]
        inputPlaceholder: string
        openLabel: string
        minimizeLabel: string
        checkingReply: string
        fallbackReply: string
        messageLabel: string
        sendLabel: string
        closeLabel: string
    }
    disclosure: {
        eyebrow: string
        title: string
        intro: string
        points: DisclosurePoint[]
        footNote: string
        letUsKnow: string
        footNoteEnd: string
        closeButton: string
    }
}

const en: Translations = {
    common: {
        quickContacts: "Quick Contacts",
    },
    nav: {
        home: "Home",
        hotlines: "Hotlines",
        history: "History",
        search: "Search",
        menus: {
            services: {
                label: "Services",
                description: "Resident, business, health, safety, and livelihood pathways.",
                items: [
                    { label: "Business and Permits", description: "Permits, renewals, zoning, and clearances." },
                    { label: "Health Services", description: "MHO support, wellness, and local referrals." },
                    { label: "Disaster and Safety", description: "Rescue, police, fire, and emergency contacts." },
                    { label: "Agriculture and Livelihood", description: "Support for farmers, fisherfolk, and enterprises." },
                    { label: "Social Welfare", description: "Assistance for families, seniors, PWDs, and youth." },
                    { label: "Tourism and Culture", description: "Destinations, festivals, and visitor pathways." },
                ],
            },
            government: {
                label: "Government",
                description: "Lists all elected officials of the City Government of Pagbilao, Quezon.",
                items: [
                    { label: "Department & Officials", description: "Permits, renewals, zoning, and clearances." },
                    { label: "Legislative (City Council)", description: "MHO support, wellness, and local referrals." },
                    { label: "Local Officials Directory", description: "Rescue, police, fire, and emergency contacts." },
                ],
            },
            explore: {
                label: "Explore",
                description: "Maps, place identity, tourism, and town history.",
                items: [
                    { label: "Barangay Map", description: "View all 27 barangays with local profile details." },
                    { label: "History of Pagbilao", description: "Read the papag and bilao origin story." },
                    { label: "Gateway Location", description: "Bay, highway, and upland community context." },
                ],
            },
            transparency: {
                label: "Transparency",
                description: "Public records, forms, accountability, and civic access.",
                items: [
                    { label: "Public Documents", description: "Ordinances, executive orders, and references." },
                    { label: "Procurement", description: "Bids, notices, and accountability entries." },
                    { label: "Citizen's Charter", description: "Service standards and resident-facing guidance." },
                    { label: "Forms", description: "Permits, clearances, and downloadable files." },
                ],
            },
        },
    },
    hero: {
        locationBadge: "Municipality of Pagbilao, Quezon",
        title: "Pagbilao at a Glance",
        description:
            "A community-powered local portal concept for finding services, forms, hotlines, tourism information, and public documents in one clear place.",
        searchPlaceholder: "Search permits, health, tourism, hotlines...",
        findService: "Find Service",
        chips: {
            businessPermit: "Business Permit",
            civilRegistry: "Civil Registry",
            emergencyHotlines: "Emergency Hotlines",
            wowPagbilao: "WOW Pagbilao",
        },
    },
    stats: {
        municipalClass: { label: "Municipal Class", value: "1st Class", caption: "Official town class" },
        population: { label: "Population", value: "82,132", caption: "2024 population count" },
        barangays: { label: "Barangays", value: "27", caption: "6 urban, 21 rural" },
        landArea: { label: "Land Area", value: "17,760 hectares", caption: "Total town land area" },
    },
    home: {
        services: {
            eyebrow: "Government Services",
            heading: "Start with the office you need.",
            description: "Quick paths for common resident, business, health, safety, and livelihood concerns in Pagbilao.",
            formsLink: "Downloadable Forms",
            cards: [
                {
                    title: "Business and Permits",
                    description: "Business permit applications, renewals, zoning, locational clearance, and building permit forms.",
                    linkText: "View requirements",
                },
                {
                    title: "Health Services",
                    description: "Municipal Health Office support, community wellness, vaccination programs, and local health referrals.",
                    linkText: "Call health office",
                },
                {
                    title: "Disaster and Safety",
                    description: "MDRRMO rescue, emergency reporting, police, fire, and public safety coordination.",
                    linkText: "Open hotlines",
                },
                {
                    title: "Agriculture and Livelihood",
                    description: "Support for coconut, rice, poultry, fisherfolk, livelihood programs, and local enterprise growth.",
                    linkText: "Find office",
                },
                {
                    title: "Social Welfare",
                    description: "Assistance pathways for families, seniors, persons with disabilities, youth, and vulnerable residents.",
                    linkText: "Ask for help",
                },
                {
                    title: "Tourism and Culture",
                    description: "Destinations, tourism directory, festivals, heritage, visitor feedback, and WOW Pagbilao experiences.",
                    linkText: "Explore Pagbilao",
                },
            ],
        },
        identity: {
            eyebrow: "Bayan ng Mananalo",
            heading: "From papag and bilao to a more connected town.",
            paragraph:
                "Local tradition traces the name Pagbilao to papag and bilao, everyday objects that became part of the town's identity. This portal concept keeps that spirit practical: simple tools for daily civic life.",
            cards: [
                { title: "Gateway Location", description: "A strategic link near Lucena, Bondoc Peninsula, and the Bicol route." },
                { title: "Bay Communities", description: "Coastal barangays, islands, resorts, and natural destinations." },
                { title: "HEARTS Lens", description: "Health, education, assistance, resilience, tourism, and service." },
            ],
        },
        transparency: {
            eyebrow: "Transparency",
            heading: "Public documents should be easy to find.",
            paragraph:
                "A modern Pagbilao portal can put ordinances, executive orders, procurement notices, budgets, and citizen-facing forms where residents can actually use them.",
            cards: [
                { category: "Documents", title: "Ordinances and EOs" },
                { category: "Accountability", title: "Procurement" },
                { category: "Resident Help", title: "Citizen's Charter" },
                { category: "Forms", title: "Permits and Clearances" },
            ],
        },
        tourism: {
            eyebrow: "WOW Pagbilao",
            heading: "Tourism that feels local, useful, and alive.",
            paragraph:
                "Pagbilao's tourism identity covers bodies of water, land formations, protected areas, cultural built heritage, institutions, and festivities. A better portal can connect residents and visitors to destinations, directories, registration, and feedback.",
            destinations: { title: "Destinations", description: "Beaches, falls, protected areas, and cultural stops." },
            feedback: { title: "Feedback", description: "Tourism registration and visitor survey pathways." },
        },
        hotlines: {
            eyebrow: "Emergency Hotlines",
            heading: "Keep these numbers close.",
            note: "For urgent emergencies, contact the relevant local office directly. Numbers shown here are from Pagbilao local portal references.",
            cards: [
                { label: "MDRRMO Rescue" },
                { label: "Philippine National Police" },
                { label: "Bureau of Fire Protection" },
                { label: "Municipal Health Office" },
            ],
        },
        history: {
            eyebrow: "History of Pagbilao",
            heading: "From papag and bilao to a gateway town by the bay.",
            paragraph1:
                "Local tradition traces Pagbilao's early settlement to Pablo and Rita in the early 17th century. The town's name is described as coming from papag, a bamboo bed, and bilao, a winnowing basket: ordinary objects that became part of a shared civic identity.",
            paragraph2:
                "Today, Pagbilao sits eight kilometers from Lucena City and serves as one of Quezon's gateways to the south, linking poblacion barangays, bay communities, highway settlements, and forested uplands.",
            stats: [
                { value: "1700s", label: "Early Roots" },
                { value: "27", label: "Barangays" },
                { value: "8 km", label: "From Lucena" },
            ],
            timeline: [
                {
                    eyebrow: "Early Settlement",
                    title: "Pablo and Rita",
                    description:
                        "The local origin story remembers Pablo and Rita as early settlers who brought rice seedlings and provisions to the area that became Pagbilao.",
                },
                {
                    eyebrow: "Name Origin",
                    title: "Papag plus bilao",
                    description:
                        "Tradition connects the town name to two familiar household objects: the papag and the bilao, turning daily life into a lasting place-name.",
                },
                {
                    eyebrow: "Gateway Identity",
                    title: "Bay, highway, and uplands",
                    description:
                        "Pagbilao's story is shaped by movement: coastal barangays along Pagbilao Bay, communities near Maharlika Highway, and upland areas toward Quezon's protected landscapes.",
                },
            ],
            notes: [
                "Poblacion, bay, highway, and forest barangay clusters",
                "Public history sourced from official local portal notes",
            ],
        },
    },
    footer: {
        tagline:
            "Empowering the people of Pagbilao with transparent access to the services, programs, and public funds of LGU Pagbilao.",
        quickLinksHeading: "Quick Links",
        quickLinks: ["Pagbilao Quiz", "Sitemap", "Citizen's Charter", "Terms of Use", "Privacy Policy", "Accessibility", "FAQ"],
        resourcesHeading: "Resources",
        resources: [
            "Open Data Philippines",
            "Freedom of Information",
            "Official LGU Pagbilao Portal",
            "Sangguniang Bayan",
            "LGU Pagbilao Facebook",
            "BLGF Portal",
            "CMCI DTI Portal",
        ],
        costLabel: "Cost to the People of Pagbilao =",
        contribute: "Contribute code with us",
        copyright: "© 2026 BetterPagbilao.org  MIT | CC BY 4.0  All public information sourced from official government portals. Created By Rallion Laynes",
        version: "Ver. 1.1.9",
    },
    chat: {
        title: "Pagbilao Assist",
        ready: "Ready to help",
        starterMessage: "Mabuhay! Ask me about services, hotlines, tourism, forms, or local offices in Pagbilao.",
        quickPrompts: ["Business permit", "Emergency hotlines", "Tourism spots", "Citizen's Charter"],
        inputPlaceholder: "Ask about services...",
        openLabel: "Ask Pagbilao Assist",
        minimizeLabel: "Minimize",
        checkingReply: "Checking the right pathway...",
        fallbackReply: "Sorry, I couldn't answer that yet. Please try again or use the quick links for direct office contacts.",
        messageLabel: "Message Pagbilao Assist",
        sendLabel: "Send message",
        closeLabel: "Close chat",
    },
    disclosure: {
        eyebrow: "Transparency Notice",
        title: "Where this data comes from",
        intro:
            "Better Pagbilao is an independent, volunteer-built civic project, in the same open spirit as BetterGov.ph. It is not an official government office. So you know exactly what you're looking at, here's how the information on this site is gathered:",
        points: [
            {
                title: "Open Data APIs",
                body: "Where available, figures and documents are pulled directly from official sources like data.gov.ph and LGU-published open datasets.",
            },
            {
                title: "Agentic Web Research",
                body: "Where no official API exists, an AI-assisted agent searches and reads publicly available pages through search engines, then summarizes what it finds.",
            },
            {
                title: "Legal and Above Board",
                body: "We only touch publicly accessible pages, respect each site's terms of service, and follow the Data Privacy Act and Freedom of Information principles. No private or personal data is scraped.",
            },
        ],
        footNote: "Spot something inaccurate or outdated?",
        letUsKnow: "Let us know",
        footNoteEnd: "and we'll fix it.",
        closeButton: "Got it, thanks",
    },
}

const tl: Translations = {
    common: {
        quickContacts: "Mabilisang Kontak",
    },
    nav: {
        home: "Home",
        hotlines: "Mga Hotline",
        history: "Kasaysayan",
        search: "Maghanap",
        menus: {
            services: {
                label: "Mga Serbisyo",
                description: "Mga daan para sa residente, negosyo, kalusugan, kaligtasan, at kabuhayan.",
                items: [
                    { label: "Negosyo at mga Permit", description: "Mga permit, pagpapanibago, zoning, at clearance." },
                    { label: "Mga Serbisyong Pangkalusugan", description: "Suporta ng MHO, wellness, at lokal na referral." },
                    { label: "Sakuna at Kaligtasan", description: "Rescue, pulis, bumbero, at mga emergency contact." },
                    { label: "Agrikultura at Kabuhayan", description: "Suporta para sa mga magsasaka, mangingisda, at negosyo." },
                    { label: "Kapakanang Panlipunan", description: "Tulong para sa mga pamilya, senior citizen, PWD, at kabataan." },
                    { label: "Turismo at Kultura", description: "Mga destinasyon, pista, at gabay para sa mga bisita." },
                ],
            },
            government: {
                label: "Pamahalaan",
                description: "Listahan ng lahat ng inihalal na opisyal ng Pamahalaang Bayan ng Pagbilao, Quezon.",
                items: [
                    { label: "Mga Departamento at Opisyal", description: "Mga permit, pagpapanibago, zoning, at clearance." },
                    { label: "Lehislatura (Sangguniang Bayan)", description: "Suporta ng MHO, wellness, at lokal na referral." },
                    { label: "Direktoryo ng mga Lokal na Opisyal", description: "Rescue, pulis, bumbero, at mga emergency contact." },
                ],
            },
            explore: {
                label: "Tuklasin",
                description: "Mga mapa, pagkakakilanlan ng lugar, turismo, at kasaysayan ng bayan.",
                items: [
                    { label: "Mapa ng Barangay", description: "Tingnan ang profile ng lahat ng 27 barangay." },
                    { label: "Kasaysayan ng Pagbilao", description: "Basahin ang kwento ng papag at bilao." },
                    { label: "Gateway na Lokasyon", description: "Konteksto ng baybayin, highway, at kabundukan." },
                ],
            },
            transparency: {
                label: "Transparency",
                description: "Pampublikong dokumento, forms, accountability, at access ng mamamayan.",
                items: [
                    { label: "Mga Pampublikong Dokumento", description: "Mga ordinansa, executive order, at reference." },
                    { label: "Procurement", description: "Mga bid, abiso, at accountability entry." },
                    { label: "Citizen's Charter", description: "Pamantayan ng serbisyo at gabay para sa residente." },
                    { label: "Mga Form", description: "Permit, clearance, at mga madodownload na file." },
                ],
            },
        },
    },
    hero: {
        locationBadge: "Bayan ng Pagbilao, Quezon",
        title: "Pagbilao sa Isang Sulyap",
        description:
            "Isang community-powered na konsepto ng lokal na portal para mahanap ang mga serbisyo, forms, hotline, impormasyon sa turismo, at pampublikong dokumento sa iisang lugar.",
        searchPlaceholder: "Maghanap ng permit, kalusugan, turismo, hotline...",
        findService: "Hanapin ang Serbisyo",
        chips: {
            businessPermit: "Business Permit",
            civilRegistry: "Civil Registry",
            emergencyHotlines: "Emergency Hotlines",
            wowPagbilao: "WOW Pagbilao",
        },
    },
    stats: {
        municipalClass: { label: "Klasipikasyon ng Bayan", value: "1st Class", caption: "Opisyal na klase ng bayan" },
        population: { label: "Populasyon", value: "82,132", caption: "Bilang ng populasyon noong 2024" },
        barangays: { label: "Mga Barangay", value: "27", caption: "6 urban, 21 rural" },
        landArea: { label: "Sukat ng Lupa", value: "17,760 ektarya", caption: "Kabuuang sukat ng lupa ng bayan" },
    },
    home: {
        services: {
            eyebrow: "Mga Serbisyo ng Pamahalaan",
            heading: "Magsimula sa opisinang kailangan mo.",
            description: "Mabilisang daan para sa karaniwang alalahanin ng residente, negosyo, kalusugan, kaligtasan, at kabuhayan sa Pagbilao.",
            formsLink: "Mga Madodownload na Form",
            cards: [
                {
                    title: "Negosyo at mga Permit",
                    description: "Aplikasyon ng business permit, pagpapanibago, zoning, locational clearance, at building permit.",
                    linkText: "Tingnan ang requirements",
                },
                {
                    title: "Mga Serbisyong Pangkalusugan",
                    description: "Suporta ng Munisipal na Health Office, community wellness, bakuna, at referral pangkalusugan.",
                    linkText: "Tawagan ang health office",
                },
                {
                    title: "Sakuna at Kaligtasan",
                    description: "MDRRMO rescue, pag-uulat ng emergency, pulis, bumbero, at koordinasyon sa kaligtasan.",
                    linkText: "Buksan ang hotlines",
                },
                {
                    title: "Agrikultura at Kabuhayan",
                    description: "Suporta para sa niyog, palay, manukan, mangingisda, at paglago ng lokal na negosyo.",
                    linkText: "Hanapin ang opisina",
                },
                {
                    title: "Kapakanang Panlipunan",
                    description: "Tulong para sa mga pamilya, senior citizen, taong may kapansanan, kabataan, at mga vulnerable na residente.",
                    linkText: "Humingi ng tulong",
                },
                {
                    title: "Turismo at Kultura",
                    description: "Mga destinasyon, direktoryo ng turismo, pista, pamana, feedback ng bisita, at karanasang WOW Pagbilao.",
                    linkText: "Tuklasin ang Pagbilao",
                },
            ],
        },
        identity: {
            eyebrow: "Bayan ng Mananalo",
            heading: "Mula sa papag at bilao patungo sa mas konektadong bayan.",
            paragraph:
                "Ayon sa lokal na tradisyon, ang pangalang Pagbilao ay nagmula sa papag at bilao, mga karaniwang bagay na naging bahagi ng pagkakakilanlan ng bayan. Pinapanatili ng konseptong ito ng portal ang diwang iyon sa praktikal na paraan: simpleng kasangkapan para sa pang-araw-araw na buhay-sibiko.",
            cards: [
                { title: "Gateway na Lokasyon", description: "Istratehikong koneksyon malapit sa Lucena, Bondoc Peninsula, at ruta ng Bicol." },
                { title: "Mga Komunidad sa Baybayin", description: "Mga baybaying barangay, isla, resort, at natural na destinasyon." },
                { title: "HEARTS Lens", description: "Kalusugan, edukasyon, tulong, katatagan, turismo, at serbisyo." },
            ],
        },
        transparency: {
            eyebrow: "Transparency",
            heading: "Dapat madaling mahanap ang mga pampublikong dokumento.",
            paragraph:
                "Ang makabagong portal ng Pagbilao ay maaaring maglagay ng mga ordinansa, executive order, abiso ng procurement, badyet, at mga form para sa mamamayan kung saan talagang magagamit ito ng mga residente.",
            cards: [
                { category: "Mga Dokumento", title: "Mga Ordinansa at EO" },
                { category: "Accountability", title: "Procurement" },
                { category: "Tulong sa Residente", title: "Citizen's Charter" },
                { category: "Mga Form", title: "Permit at Clearance" },
            ],
        },
        tourism: {
            eyebrow: "WOW Pagbilao",
            heading: "Turismong pakiramdam ay lokal, kapaki-pakinabang, at buhay.",
            paragraph:
                "Saklaw ng identidad pang-turismo ng Pagbilao ang mga katubigan, anyong-lupa, protektadong lugar, kultural na pamana, institusyon, at pagdiriwang. Ang mas magandang portal ay maaaring iugnay ang mga residente at bisita sa mga destinasyon, direktoryo, pagpaparehistro, at feedback.",
            destinations: { title: "Mga Destinasyon", description: "Mga dalampasigan, talon, protektadong lugar, at kultural na himpilan." },
            feedback: { title: "Feedback", description: "Pagpaparehistro sa turismo at survey ng bisita." },
        },
        hotlines: {
            eyebrow: "Mga Emergency Hotline",
            heading: "Panatilihing malapit ang mga numerong ito.",
            note: "Para sa agarang emergency, direktang tawagan ang kaukulang lokal na opisina. Ang mga numerong nakalista dito ay mula sa reference ng lokal na portal ng Pagbilao.",
            cards: [
                { label: "MDRRMO Rescue" },
                { label: "Philippine National Police" },
                { label: "Bureau of Fire Protection" },
                { label: "Munisipal na Health Office" },
            ],
        },
        history: {
            eyebrow: "Kasaysayan ng Pagbilao",
            heading: "Mula sa papag at bilao patungo sa gateway na bayan sa tabing-dagat.",
            paragraph1:
                "Ayon sa lokal na tradisyon, ang unang pananatili sa Pagbilao ay maiuugnay kina Pablo at Rita noong unang bahagi ng ika-17 siglo. Sinasabing ang pangalan ng bayan ay nagmula sa papag, isang kawayang higaan, at bilao, isang panghimay na kaingin: mga ordinaryong bagay na naging bahagi ng magkakabahaging pagkakakilanlang sibiko.",
            paragraph2:
                "Ngayon, ang Pagbilao ay walong kilometro mula sa Lungsod ng Lucena at naglilingkod bilang isa sa mga gateway ng Quezon patungo sa timog, na nag-uugnay sa mga barangay sa poblacion, komunidad sa baybayin, pamayanan sa highway, at gubat na kabundukan.",
            stats: [
                { value: "1700s", label: "Unang Ugat" },
                { value: "27", label: "Mga Barangay" },
                { value: "8 km", label: "Mula sa Lucena" },
            ],
            timeline: [
                {
                    eyebrow: "Unang Pananatili",
                    title: "Sina Pablo at Rita",
                    description:
                        "Iniaalala ng lokal na kwentong-bayan sina Pablo at Rita bilang mga unang naninirahan na nagdala ng punla ng palay at mga probisyon sa lugar na naging Pagbilao.",
                },
                {
                    eyebrow: "Pinagmulan ng Pangalan",
                    title: "Papag kasama ang bilao",
                    description:
                        "Iniuugnay ng tradisyon ang pangalan ng bayan sa dalawang pamilyar na kagamitan sa tahanan: ang papag at ang bilao, na naging bahagi ng pang-araw-araw na buhay hanggang naging pangalan ng lugar.",
                },
                {
                    eyebrow: "Pagkakakilanlan bilang Gateway",
                    title: "Baybayin, highway, at kabundukan",
                    description:
                        "Hinuhubog ang kwento ng Pagbilao ng paggalaw: mga baybaying barangay sa tabi ng Look ng Pagbilao, mga komunidad malapit sa Maharlika Highway, at mga lugar sa kabundukan patungo sa mga protektadong lupain ng Quezon.",
                },
            ],
            notes: [
                "Kumpol ng barangay sa poblacion, baybayin, highway, at gubat",
                "Pampublikong kasaysayan mula sa opisyal na tala ng lokal na portal",
            ],
        },
    },
    footer: {
        tagline:
            "Binibigyang-kapangyarihan ang mamamayan ng Pagbilao sa transparent na access sa mga serbisyo, programa, at pampublikong pondo ng LGU Pagbilao.",
        quickLinksHeading: "Mabilisang Link",
        quickLinks: ["Pagbilao Quiz", "Sitemap", "Citizen's Charter", "Mga Tuntunin sa Paggamit", "Patakaran sa Privacy", "Accessibility", "FAQ"],
        resourcesHeading: "Mga Resource",
        resources: [
            "Open Data Philippines",
            "Freedom of Information",
            "Opisyal na LGU Pagbilao Portal",
            "Sangguniang Bayan",
            "LGU Pagbilao Facebook",
            "BLGF Portal",
            "CMCI DTI Portal",
        ],
        costLabel: "Gastos sa Mamamayan ng Pagbilao =",
        contribute: "Mag-ambag ng code sa amin",
        copyright: "© 2026 BetterPagbilao.org  MIT | CC BY 4.0  Lahat ng pampublikong impormasyon ay mula sa opisyal na mga portal ng pamahalaan. Gawa ni Rallion Laynes",
        version: "Ver. 1.1.9",
    },
    chat: {
        title: "Pagbilao Assist",
        ready: "Handang tumulong",
        starterMessage: "Mabuhay! Itanong mo sa akin ang tungkol sa mga serbisyo, hotline, turismo, forms, o lokal na opisina sa Pagbilao.",
        quickPrompts: ["Business permit", "Emergency hotlines", "Mga tourist spot", "Citizen's Charter"],
        inputPlaceholder: "Magtanong tungkol sa mga serbisyo...",
        openLabel: "Magtanong sa Pagbilao Assist",
        minimizeLabel: "I-minimize",
        checkingReply: "Sinusuri ang tamang daan...",
        fallbackReply: "Paumanhin, hindi pa nasagot iyon. Subukan ulit o gamitin ang quick links para sa direktang contact ng opisina.",
        messageLabel: "Mensahe kay Pagbilao Assist",
        sendLabel: "Ipadala ang mensahe",
        closeLabel: "Isara ang chat",
    },
    disclosure: {
        eyebrow: "Paalala sa Transparency",
        title: "Saan nanggagaling ang datos na ito",
        intro:
            "Ang Better Pagbilao ay isang independiyenteng, volunteer-built na proyektong sibiko, kaparehas ng bukas na diwa ng BetterGov.ph. Hindi ito opisyal na opisina ng pamahalaan. Para malaman mo nang eksakto kung ano ang iyong tinitingnan, narito kung paano kinokolekta ang impormasyon sa site na ito:",
        points: [
            {
                title: "Open Data API",
                body: "Kung available, ang mga figure at dokumento ay direktang kinukuha mula sa opisyal na sources tulad ng data.gov.ph at mga open dataset na inilathala ng LGU.",
            },
            {
                title: "Agentic Web Research",
                body: "Kung walang opisyal na API, isang AI-assisted agent ang naghahanap at bumabasa ng mga pampublikong available na pahina sa pamamagitan ng search engine, pagkatapos ay ibinubuod ang natuklasan.",
            },
            {
                title: "Legal at Nasa Tamang Pamamaraan",
                body: "Dinadaanan lamang namin ang mga pampublikong accessible na pahina, iginagalang ang terms of service ng bawat site, at sinusunod ang Data Privacy Act at mga prinsipyo ng Freedom of Information. Walang pribado o personal na datos ang kino-scrape.",
            },
        ],
        footNote: "May napansin kang mali o outdated?",
        letUsKnow: "Ipaalam sa amin",
        footNoteEnd: "at aayusin namin ito.",
        closeButton: "Nakuha ko, salamat",
    },
}

export const translations: Record<Language, Translations> = { en, tl }
