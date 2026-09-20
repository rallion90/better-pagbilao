import type { Language } from "./translations"

export interface HistoryPageCopy {
    breadcrumb: string
    eyebrow: string
    heading: string
    intro: string
    facts: { value: string; label: string }[]
    onThisPage: string
    homeCta: string
    sections: { beginnings: string; timeline: string; church: string; war: string; growth: string; mayors: string; traditions: string; contribute: string; sources: string }
    howToRead: {
        heading: string
        record: { label: string; body: string }
        tradition: { label: string; body: string }
        context: { label: string; body: string }
    }
    beginnings: {
        heading: string
        intro: string
        cards: { label: string; title: string; body: string }[]
        closing: string
    }
    timeline: { heading: string; intro: string; all: string; sourcesLabel: string; noResults: string }
    church: {
        heading: string
        intro: string
        markerHeading: string
        markerNote: string
        translationLabel: string
        translation: string
    }
    war: { heading: string; paragraphs: string[]; facts: { value: string; label: string }[] }
    growth: {
        heading: string
        intro: string
        chartTitle: string
        chartLabel: string
        showTable: string
        showChart: string
        yearColumn: string
        populationColumn: string
        readout: string
        note: string
    }
    mayors: { heading: string; intro: string; loading: string; error: string; retry: string; note: string; present: string }
    traditions: { heading: string; intro: string; cards: { when: string; title: string; body: string }[] }
    contribute: { heading: string; intro: string; wantedHeading: string; wanted: string[]; privacy: string; facebook: string; github: string }
    sources: {
        heading: string
        intro: string
        disagreeHeading: string
        disagree: string[]
        gapsHeading: string
        gaps: string
        disclaimer: string
    }
}

const en: HistoryPageCopy = {
    breadcrumb: "History of Pagbilao",
    eyebrow: "History of Pagbilao",
    heading: "From a refuge by the bay to a gateway town.",
    intro: "Three centuries of parish records, a folk tale about a bamboo bed and a winnowing basket, a crossroads in the first days of the war, and a town that grew thirteen-fold. Every entry is tagged by how well it is documented, and every source is listed.",
    facts: [
        { value: "1730", label: "Founding date, 29 August" },
        { value: "1688", label: "First parish, at Binahaan" },
        { value: "27", label: "Barangays today" },
        { value: "82,132", label: "Residents, 2024" },
    ],
    onThisPage: "On this page",
    homeCta: "Read the full history of Pagbilao",
    sections: {
        beginnings: "Beginnings",
        timeline: "Timeline",
        church: "The church",
        war: "1941",
        growth: "Growth",
        mayors: "Mayors",
        traditions: "Traditions",
        contribute: "Add to the record",
        sources: "Sources",
    },
    howToRead: {
        heading: "How to read this page",
        record: { label: "Record", body: "Backed by a document, a marker or an official source." },
        tradition: { label: "Tradition", body: "How the town remembers itself. Loved, but not proven by documents." },
        context: { label: "Context", body: "Happened in the province or region. Pagbilao's own part is not yet documented." },
    },
    beginnings: {
        heading: "Three ways to read the beginning",
        intro: "Pagbilao's origin is told in three layers that do not line up neatly. We keep them apart so each can be read for what it is.",
        cards: [
            {
                label: "Tradition",
                title: "The story the town tells",
                body: "Pablo and Rita settle the poblacion in the early 1600s. In 1725, friars, a bamboo bed and a winnowing basket give the town its name. This is how Pagbilao remembers itself, and how the annual festival retells it.",
            },
            {
                label: "Documents",
                title: "What the records say",
                body: "Franciscans land at Binahaan in 1685, found a parish there in 1688, and in 1730 move it to today's poblacion. The National Historical Institute's marker records these dates, and the town counts its anniversary from 29 August 1730.",
            },
            {
                label: "Refuge",
                title: "The older shoreline",
                body: "Around 1604 to 1605, survivors of a Moro raid on Kalilayan took refuge near the Palsabangon River, where missionaries built a bamboo church. Pagbilao's shore was already a place of refuge and mission about 120 years before the naming story.",
            },
        ],
        closing: "These layers do not have to contradict each other: a folk story about a name can belong to a place that is much older. What we cannot say is that 1725 was the first Spanish presence, and nothing found links Pablo and Rita to the Kalilayan refugees.",
    },
    timeline: {
        heading: "Timeline",
        intro: "From the first recorded refuge to the latest census. Filter by era, and follow the small numbers to the sources at the bottom.",
        all: "All eras",
        sourcesLabel: "Sources",
        noResults: "No entries in this era.",
    },
    church: {
        heading: "The church through five centuries",
        intro: "The parish of Saint Catherine of Alexandria is the thread that ties Pagbilao's records together. It was founded in a bamboo hut, moved once, built in stone, bombed, and rebuilt.",
        markerHeading: "What the marker says",
        markerNote: "National Historical Institute marker \"Simbahan ng Pagbilao\", installed 4 July 1986 (Level II). The marker is in Filipino only.",
        translationLabel: "Our English translation",
        translation:
            "The Franciscan parish was founded at Binahaan in 1688, with Fr. Cristobal Mortanchez as minister. The church was moved to the present site of the town, with Saint Catherine of Alexandria as patroness, in 1730, and Fr. Francisco Xavier de Toledo became parish priest. The stone church was built under Fr. Victorino Peralija in 1845, and finished with its convent and tower in 1877 under Fr. Eugenio Gomez. It was destroyed during the liberation in 1945 and rebuilt under Fr. Vicente Urlanda in 1954.",
    },
    war: {
        heading: "December 1941: the crossroads",
        paragraphs: [
            "Pagbilao sits where Route 1 from Atimonan meets the road to Tayabas and Lucena. When the Japanese landed at Lamon Bay on 24 December 1941, that made the town the door to Lucena and the road to Manila: an important junction about fifteen miles (24 km) inland from Atimonan.",
            "Japanese reconnaissance troops crossed the mountains to Malicboy, where the Philippine 52nd Infantry was still digging in. On Christmas Day the regiment, under Col. Virgil Cordero, was ordered to hold the Pagbilao-Tayabas road, but Japanese forces had already crossed the Palsabangon River. By that evening they held Pagbilao, and the regiment withdrew through Lucena toward Sariaya and Tiaong.",
            "This account comes from the US Army's official history of the campaign. How Pagbilao lived through the three years of occupation that followed is still unwritten.",
        ],
        facts: [
            { value: "24 Dec", label: "Japanese land at Lamon Bay" },
            { value: "25 Dec", label: "Pagbilao held by evening" },
            { value: "1945", label: "Church destroyed in the liberation" },
        ],
    },
    growth: {
        heading: "How the town grew",
        intro: "Census counts from 1903 to 2024.",
        chartTitle: "Population of Pagbilao, 1903 to 2024",
        chartLabel: "Line chart of Pagbilao's population by census year, rising from 6,085 in 1903 to 82,132 in 2024.",
        showTable: "View as table",
        showChart: "View as chart",
        yearColumn: "Census year",
        populationColumn: "Population",
        readout: "From 6,085 in 1903 to 82,132 in 2024: about 13.5 times as many people.",
        note: "The steepest climb was the 1960s, up 54 percent in ten years. Between 2015 and 2020 the count rose 4.9 percent, compared with 13.7 percent in the five years before.",
    },
    mayors: {
        heading: "Mayors of Pagbilao",
        intro: "From the municipal government's list, 1901 to today.",
        loading: "Loading the list of mayors…",
        error: "We could not load the list of mayors.",
        retry: "Try again",
        note: "The published list has no entry for 1917 to 1919, 1941 to 1943, or 1946, and it gives 1998 to July 1999 to two mayors. We show it as published and do not guess who served.",
        present: "Present",
    },
    traditions: {
        heading: "Living traditions",
        intro: "History is also what a town does every year.",
        cards: [
            {
                when: "Late August",
                title: "Papag at Bilao Festival and Araw ng Pagbilao",
                body: "The anniversary of the 1730 founding is marked with street dancing, parades and cultural shows that retell Pablo and Rita and the winnowing basket.",
            },
            {
                when: "25 November",
                title: "Fiesta of Santa Catalina",
                body: "The feast of the patroness, with the Indak Gala procession from Barangay Daungan to the church.",
            },
            {
                when: "26 July",
                title: "Feast of St. Anne, Malicboy",
                body: "A devotion that began in 1908 as a group's annual feast and grew into its own parish.",
            },
        ],
    },
    contribute: {
        heading: "Help us complete the record",
        intro: "This history is built from published sources, so it has gaps. Families, parishes and barangays hold the rest.",
        wantedHeading: "What we are looking for",
        wanted: [
            "Memories of the occupation years (1942 to 1945) and the liberation in Pagbilao",
            "Pagbilao's part in the 1898 revolution",
            "Where barangay names come from: Alupaye, Ikirin, Mapagong, Bukal and the rest",
            "The meaning of the municipal seal and flag",
            "Old photographs of the church, the poblacion and Isla Grande, especially before 1970",
            "Documents from before 1945: baptismal, land and school records",
        ],
        privacy: "Share only what you are comfortable making public, and tell us who may be credited.",
        facebook: "Message us on Facebook",
        github: "Open an issue on GitHub",
    },
    sources: {
        heading: "Sources and corrections",
        intro: "Numbers in the timeline point to this list. Where sources disagree, we say so instead of picking quietly.",
        disagreeHeading: "Where sources disagree",
        disagree: [
            "The arrival of missionaries: 1725 is the naming tradition; the marker records the parish in 1688, and the parish counts a 1685 landing.",
            "The raid on Kalilayan: 1604 in one source, 1605 in another. We write 1604 to 1605.",
            "St. Anne Parish: 1952 in one source, 17 March 1958 in the church's own record, which fits its 50th anniversary in 2008.",
            "The power station: dates for the third unit differ between sources. We use the 2018 inauguration, and the mangrove area is reported as both 145 and 150 hectares.",
        ],
        gapsHeading: "Not yet documented",
        gaps: "Pre-Spanish Pagbilao, the 1898 revolution in Pagbilao, the occupation years, barangay name origins, the municipal seal, and notable people from the town.",
        disclaimer: "Better Pagbilao is an independent civic project, not the municipal government. Found a mistake? Please tell us and we will fix it.",
    },
}

const tl: HistoryPageCopy = {
    breadcrumb: "Kasaysayan ng Pagbilao",
    eyebrow: "Kasaysayan ng Pagbilao",
    heading: "Mula sa kanlungan sa tabing-look tungo sa pintuang bayan.",
    intro: "Tatlong siglo ng talaan ng parokya, isang alamat tungkol sa papag at bilao, isang sangandaan sa unang mga araw ng digmaan, at bayang lumaki nang labintatlong ulit. Bawat entry ay may tatak kung gaano ito kaugat sa dokumento, at nakalista ang bawat batis.",
    facts: [
        { value: "1730", label: "Petsa ng pagkakatatag, 29 Agosto" },
        { value: "1688", label: "Unang parokya, sa Binahaan" },
        { value: "27", label: "Barangay ngayon" },
        { value: "82,132", label: "Residente, 2024" },
    ],
    onThisPage: "Sa pahinang ito",
    homeCta: "Basahin ang buong kasaysayan ng Pagbilao",
    sections: {
        beginnings: "Simula",
        timeline: "Timeline",
        church: "Ang simbahan",
        war: "1941",
        growth: "Paglaki",
        mayors: "Mga alkalde",
        traditions: "Mga tradisyon",
        contribute: "Dagdagan ang tala",
        sources: "Mga batis",
    },
    howToRead: {
        heading: "Paano basahin ang pahinang ito",
        record: { label: "Tala", body: "May dokumento, marker o opisyal na batis." },
        tradition: { label: "Tradisyon", body: "Paano inaalala ng bayan ang sarili nito. Mahal, ngunit hindi napatunayan ng dokumento." },
        context: { label: "Konteksto", body: "Nangyari sa lalawigan o rehiyon. Hindi pa naitatala ang sariling bahagi ng Pagbilao." },
    },
    beginnings: {
        heading: "Tatlong paraan ng pagbasa sa simula",
        intro: "Isinasalaysay ang pinagmulan ng Pagbilao sa tatlong patong na hindi nagtutugma nang eksakto. Pinaghihiwalay namin ang mga ito para mabasa ang bawat isa ayon sa tunay nitong uri.",
        cards: [
            {
                label: "Tradisyon",
                title: "Ang kuwentong isinasalaysay ng bayan",
                body: "Nanirahan sina Pablo at Rita sa poblacion noong simula ng 1600s. Noong 1725, ang mga pari, isang papag at isang bilao ang nagbigay ng pangalan sa bayan. Ganito inaalala ng Pagbilao ang sarili nito, at ganito rin ito isinasalaysay ng taunang pista.",
            },
            {
                label: "Dokumento",
                title: "Ang sinasabi ng mga talaan",
                body: "Dumaong ang mga Pransiskano sa Binahaan noong 1685, itinatag ang parokya roon noong 1688, at inilipat ito noong 1730 sa kasalukuyang poblacion. Nakatala ang mga petsang ito sa marker ng National Historical Institute, at mula sa 29 Agosto 1730 binibilang ng bayan ang anibersaryo nito.",
            },
            {
                label: "Kanlungan",
                title: "Ang mas matandang baybayin",
                body: "Noong mga 1604 hanggang 1605, sumilong ang mga nakaligtas sa pagsalakay ng mga Moro sa Kalilayan malapit sa Ilog Palsabangon, kung saan nagtayo ang mga misyonero ng simbahang kawayan. Kanlungan at misyon na ang baybayin ng Pagbilao mga 120 taon bago ang kuwento ng pangalan.",
            },
        ],
        closing: "Hindi kailangang magsalungatan ang mga patong na ito: ang alamat tungkol sa pangalan ay maaaring nakakabit sa lugar na mas matanda pa. Hindi natin masasabing 1725 ang unang presensiya ng mga Espanyol, at wala pang natagpuang ugnayan nina Pablo at Rita sa mga nakaligtas mula sa Kalilayan.",
    },
    timeline: {
        heading: "Timeline",
        intro: "Mula sa unang naitalang kanlungan hanggang sa pinakabagong census. Salain ayon sa panahon, at sundan ang maliliit na numero patungo sa mga batis sa ibaba.",
        all: "Lahat ng panahon",
        sourcesLabel: "Mga batis",
        noResults: "Walang entry sa panahong ito.",
    },
    church: {
        heading: "Ang simbahan sa loob ng limang siglo",
        intro: "Ang parokya ni Santa Catalina de Alexandria ang sinulid na nag-uugnay sa mga talaan ng Pagbilao. Itinatag ito sa kubong kawayan, inilipat nang minsan, itinayo sa bato, binomba, at muling itinayo.",
        markerHeading: "Ang nakasulat sa marker",
        markerNote: "Marker ng National Historical Institute na \"Simbahan ng Pagbilao\", ikinabit noong 4 Hulyo 1986 (Level II). Filipino lamang ang wika ng marker.",
        translationLabel: "Ang ating salin sa Ingles",
        translation:
            "The Franciscan parish was founded at Binahaan in 1688, with Fr. Cristobal Mortanchez as minister. The church was moved to the present site of the town, with Saint Catherine of Alexandria as patroness, in 1730, and Fr. Francisco Xavier de Toledo became parish priest. The stone church was built under Fr. Victorino Peralija in 1845, and finished with its convent and tower in 1877 under Fr. Eugenio Gomez. It was destroyed during the liberation in 1945 and rebuilt under Fr. Vicente Urlanda in 1954.",
    },
    war: {
        heading: "Disyembre 1941: ang sangandaan",
        paragraphs: [
            "Nasa Pagbilao ang tagpuan ng Ruta 1 mula Atimonan at ng daan patungong Tayabas at Lucena. Nang lumapag ang mga Hapones sa Lamon Bay noong 24 Disyembre 1941, naging pintuan ang bayan patungong Lucena at sa daan tungong Maynila: mahalagang sangandaan na mga labinlimang milya (24 km) papasok mula sa Atimonan.",
            "Tumawid ang mga tropang reconnaissance ng mga Hapones sa mga bundok patungong Malicboy, kung saan naghuhukay pa lamang ng depensa ang Philippine 52nd Infantry. Sa araw ng Pasko, inutusan ang regimen, sa ilalim ni Col. Virgil Cordero, na hawakan ang daang Pagbilao-Tayabas, ngunit nakatawid na ang mga Hapones sa Ilog Palsabangon. Pagsapit ng gabing iyon, hawak na nila ang Pagbilao, at umatras ang regimen sa Lucena patungong Sariaya at Tiaong.",
            "Mula ang salaysay na ito sa opisyal na kasaysayan ng kampanya ng US Army. Hindi pa naisusulat kung paano nabuhay ang Pagbilao sa tatlong taon ng pananakop na sumunod.",
        ],
        facts: [
            { value: "24 Dis", label: "Lumapag ang mga Hapones sa Lamon Bay" },
            { value: "25 Dis", label: "Hawak na ang Pagbilao pagsapit ng gabi" },
            { value: "1945", label: "Nawasak ang simbahan sa paglaya" },
        ],
    },
    growth: {
        heading: "Paano lumaki ang bayan",
        intro: "Mga bilang sa census mula 1903 hanggang 2024.",
        chartTitle: "Populasyon ng Pagbilao, 1903 hanggang 2024",
        chartLabel: "Line chart ng populasyon ng Pagbilao ayon sa taon ng census, tumaas mula 6,085 noong 1903 tungong 82,132 noong 2024.",
        showTable: "Tingnan bilang talahanayan",
        showChart: "Tingnan bilang chart",
        yearColumn: "Taon ng census",
        populationColumn: "Populasyon",
        readout: "Mula 6,085 noong 1903 tungong 82,132 noong 2024: mga 13.5 ulit ang dami ng tao.",
        note: "Pinakamatarik ang pag-akyat noong dekada 1960, tumaas nang 54 porsiyento sa loob ng sampung taon. Mula 2015 hanggang 2020, tumaas ang bilang nang 4.9 porsiyento, kumpara sa 13.7 porsiyento sa limang taon bago nito.",
    },
    mayors: {
        heading: "Mga alkalde ng Pagbilao",
        intro: "Mula sa talaan ng pamahalaang bayan, 1901 hanggang ngayon.",
        loading: "Nilo-load ang talaan ng mga alkalde…",
        error: "Hindi namin ma-load ang talaan ng mga alkalde.",
        retry: "Subukan muli",
        note: "Walang entry ang inilathalang talaan para sa 1917 hanggang 1919, 1941 hanggang 1943, at 1946, at ibinibigay nito ang 1998 hanggang Hulyo 1999 sa dalawang alkalde. Ipinapakita namin ito ayon sa pagkakalathala at hindi kami nanghuhula kung sino ang nanungkulan.",
        present: "Kasalukuyan",
    },
    traditions: {
        heading: "Mga buhay na tradisyon",
        intro: "Kasaysayan din ang ginagawa ng bayan taon-taon.",
        cards: [
            {
                when: "Huling bahagi ng Agosto",
                title: "Papag at Bilao Festival at Araw ng Pagbilao",
                body: "Ipinagdiriwang ang anibersaryo ng pagkakatatag noong 1730 sa street dancing, parada at mga palabas pangkultura na muling nagsasalaysay kina Pablo at Rita at ng bilao.",
            },
            {
                when: "25 Nobyembre",
                title: "Pista ni Santa Catalina",
                body: "Ang kapistahan ng patrona, kasama ang prusisyong Indak Gala mula Barangay Daungan hanggang simbahan.",
            },
            {
                when: "26 Hulyo",
                title: "Pista ni Santa Ana, Malicboy",
                body: "Debosyong nagsimula noong 1908 bilang taunang pista ng isang pangkat at lumago tungo sa sarili nitong parokya.",
            },
        ],
    },
    contribute: {
        heading: "Tulungan kaming buuin ang tala",
        intro: "Mula sa mga nailathalang batis ang kasaysayang ito, kaya may mga puwang. Nasa mga pamilya, parokya at barangay ang iba pa.",
        wantedHeading: "Ang hinahanap namin",
        wanted: [
            "Mga alaala ng panahon ng pananakop (1942 hanggang 1945) at ng paglaya sa Pagbilao",
            "Bahagi ng Pagbilao sa himagsikan ng 1898",
            "Pinagmulan ng mga pangalan ng barangay: Alupaye, Ikirin, Mapagong, Bukal at iba pa",
            "Kahulugan ng selyo at watawat ng bayan",
            "Lumang larawan ng simbahan, poblacion at Isla Grande, lalo na bago mag-1970",
            "Mga dokumentong bago mag-1945: talaan ng binyag, lupa at paaralan",
        ],
        privacy: "Ibahagi lamang ang komportable kayong maging pampubliko, at sabihin kung sino ang maaaring bigyan ng kredito.",
        facebook: "Mag-message sa Facebook",
        github: "Magbukas ng issue sa GitHub",
    },
    sources: {
        heading: "Mga batis at pagwawasto",
        intro: "Tumutukoy sa listahang ito ang mga numero sa timeline. Kapag nagkakaiba ang mga batis, sinasabi namin ito sa halip na tahimik na pumili.",
        disagreeHeading: "Kung saan nagkakaiba ang mga batis",
        disagree: [
            "Ang pagdating ng mga misyonero: 1725 ang tradisyon ng pangalan; itinatala ng marker ang parokya noong 1688, at 1685 ang pagdaong ayon sa parokya.",
            "Ang pagsalakay sa Kalilayan: 1604 sa isang batis, 1605 sa isa pa. Isinusulat namin ang 1604 hanggang 1605.",
            "Parokya ni Santa Ana: 1952 sa isang batis, 17 Marso 1958 sa sariling talaan ng simbahan, na akma sa ika-50 anibersaryo nito noong 2008.",
            "Ang planta ng kuryente: nagkakaiba ang mga petsa ng ikatlong yunit sa mga batis. Ginagamit namin ang pagpapasinaya noong 2018, at iniulat ang lawak ng bakawan na 145 at 150 ektarya.",
        ],
        gapsHeading: "Hindi pa naitatala",
        gaps: "Ang Pagbilao bago ang panahong Espanyol, ang himagsikan ng 1898 sa Pagbilao, ang mga taon ng pananakop, pinagmulan ng mga pangalan ng barangay, ang selyo ng bayan, at mga kilalang tao mula sa bayan.",
        disclaimer: "Ang Better Pagbilao ay independiyenteng proyektong sibiko, hindi ang pamahalaang bayan. May nakitang mali? Sabihin sa amin at aayusin namin ito.",
    },
}

export const historyPageCopy: Record<Language, HistoryPageCopy> = { en, tl }
