import type { Language } from "../i18n/translations"

// Typed on purpose: this is reviewed editorial content, not live data. It is shaped like an API response
// (ids, ISO-ish years, per-language text) so it can be served from the API later without touching the page.
// Facts and their confidence ratings are documented in data-sources/pagbilao-history-research.md.

export type Text = Record<Language, string>

export type EntryKind = "record" | "tradition" | "context"

export type EraId = "roots" | "spanish" | "american" | "war" | "republic" | "modern"

export interface HistoryEra {
    id: EraId
    years: string
    title: Text
    blurb: Text
}

export interface TimelineEntry {
    id: string
    year: Text
    era: EraId
    kind: EntryKind
    title: Text
    text: Text
    /** ids from HISTORY_SOURCES */
    sources: number[]
}

export interface HistorySource {
    id: number
    title: string
    url: string
    note: Text
}

export const HISTORY_ERAS: HistoryEra[] = [
    {
        id: "roots",
        years: "to 1688",
        title: { en: "Roots and refuge", tl: "Ugat at kanlungan" },
        blurb: {
            en: "A shore on Tayabas Bay, a legendary couple, and the first missionaries.",
            tl: "Baybayin ng Tayabas Bay, isang maalamat na mag-asawa, at ang mga unang misyonero.",
        },
    },
    {
        id: "spanish",
        years: "1725 to 1898",
        title: { en: "Parish and pueblo", tl: "Parokya at pueblo" },
        blurb: {
            en: "The naming story, the 1730 founding, and a stone church built over three decades.",
            tl: "Ang kuwento ng pangalan, ang pagkakatatag noong 1730, at simbahang bato na tatlong dekadang itinayo.",
        },
    },
    {
        id: "american",
        years: "1901 to 1940",
        title: { en: "A young municipality", tl: "Batang munisipalidad" },
        blurb: {
            en: "Civil government, the first census, and the first mayors.",
            tl: "Pamahalaang sibil, unang census, at mga unang alkalde.",
        },
    },
    {
        id: "war",
        years: "1941 to 1945",
        title: { en: "War and liberation", tl: "Digmaan at paglaya" },
        blurb: {
            en: "A crossroads in the first days of the invasion, and a church lost in the liberation.",
            tl: "Sangandaan sa unang mga araw ng pagsalakay, at simbahang nawasak sa paglaya.",
        },
    },
    {
        id: "republic",
        years: "1946 to 1995",
        title: { en: "Rebuilding", tl: "Muling pagbangon" },
        blurb: {
            en: "The province takes a new name, the church rises again, and the mangroves are protected.",
            tl: "Nagpalit ng pangalan ang lalawigan, muling itinayo ang simbahan, at pinangalagaan ang bakawan.",
        },
    },
    {
        id: "modern",
        years: "1996 to today",
        title: { en: "Power and a growing town", tl: "Kuryente at lumalaking bayan" },
        blurb: {
            en: "A power station on Isla Grande and a population that keeps growing.",
            tl: "Planta ng kuryente sa Isla Grande at populasyong patuloy na lumalaki.",
        },
    },
]

export const HISTORY_TIMELINE: TimelineEntry[] = [
    // ---------- roots ----------
    {
        id: "pablo-rita",
        year: { en: "Early 1600s", tl: "Simula ng 1600s" },
        era: "roots",
        kind: "tradition",
        title: { en: "Pablo and Rita", tl: "Sina Pablo at Rita" },
        text: {
            en: "Local tradition says a couple, Pablo and Rita, crossed the wilderness with a handful of rice seedlings and provisions and reached the site of today's poblacion. Finding it promising, they brought their married children and made it their permanent home. In the years that followed, more people, including groups from distant places, joined them.",
            tl: "Ayon sa tradisyon ng bayan, ang mag-asawang Pablo at Rita ay naglakbay sa ilang dala ang kaunting punlang palay at mga kailangan, at narating ang kinatatayuan ngayon ng poblacion. Nakita nilang maaasahan ang lugar kaya dinala nila ang kanilang mga anak na may asawa at doon nanirahan. Sa mga sumunod na taon, dumami pa ang mga nanirahan, kabilang ang mga mula sa malalayong lugar.",
        },
        sources: [1],
    },
    {
        id: "kalilayan",
        year: { en: "1591", tl: "1591" },
        era: "roots",
        kind: "context",
        title: { en: "A province called Kalilayan", tl: "Lalawigang tinawag na Kalilayan" },
        text: {
            en: "The Spanish created the province of Kalilayan, named for its capital, the town that later became Unisan. The shore of what is now Pagbilao would soon become part of its story.",
            tl: "Itinatag ng mga Espanyol ang lalawigan ng Kalilayan, na ipinangalan sa kabisera nitong bayan na kalaunan ay naging Unisan. Malapit nang maging bahagi ng kuwentong ito ang baybayin ng kasalukuyang Pagbilao.",
        },
        sources: [2, 9],
    },
    {
        id: "palsabangon",
        year: { en: "1604 to 1605", tl: "1604 hanggang 1605" },
        era: "roots",
        kind: "record",
        title: { en: "Refuge at the Palsabangon River", tl: "Kanlungan sa Ilog Palsabangon" },
        text: {
            en: "Kalilayan was wrecked by Moro raiders. One account says only about 1,000 of some 9,000 residents survived. The survivors took refuge near the Palsabangon River, in what is now Pagbilao, where missionaries built a church, convent and school of bamboo and nipa. Sources give the year as 1604 or 1605. By 1613 the people moved on to Cabuyao because of crocodiles. This is the oldest documented chapter on Pagbilao's shore.",
            tl: "Winasak ng mga mananalakay na Moro ang Kalilayan. Ayon sa isang salaysay, mga 1,000 lamang sa mga 9,000 na naninirahan ang nakaligtas. Sumilong ang mga nakaligtas malapit sa Ilog Palsabangon, sa kasalukuyang Pagbilao, kung saan nagtayo ang mga misyonero ng simbahan, kumbento at paaralang yari sa kawayan at nipa. 1604 o 1605 ang taong binabanggit ng mga batis. Pagsapit ng 1613, lumipat ang mga tao sa Cabuyao dahil sa mga buwaya. Ito ang pinakamatandang naitalang yugto sa baybayin ng Pagbilao.",
        },
        sources: [2, 3],
    },
    {
        id: "landing-1685",
        year: { en: "1685", tl: "1685" },
        era: "roots",
        kind: "record",
        title: { en: "Franciscans land at Binahaan", tl: "Dumaong ang mga Pransiskano sa Binahaan" },
        text: {
            en: "Franciscan missionaries landed at a site now called Dinaungang-Pari, in Binahaan. Parish tradition counts its anniversary from this landing.",
            tl: "Dumaong ang mga misyonerong Pransiskano sa lugar na ngayon ay tinatawag na Dinaungang-Pari, sa Binahaan. Dito binibilang ng tradisyon ng parokya ang anibersaryo nito.",
        },
        sources: [5],
    },
    {
        id: "parish-1688",
        year: { en: "1688", tl: "1688" },
        era: "roots",
        kind: "record",
        title: { en: "The first parish and church", tl: "Ang unang parokya at simbahan" },
        text: {
            en: "The Franciscan parish was founded at Binahaan, with Fr. Cristobal Mortanchez as its minister. Its first church was made of bamboo with a cogon-grass roof. The date is carved into the National Historical Institute's 1986 marker.",
            tl: "Naitatag ang parokya ng mga Pransiskano sa Binahaan, at si Padre Cristobal Mortanchez ang naging ministro. Yari sa kawayan at bubong na cogon ang unang simbahan. Nakasulat ang petsang ito sa marker ng National Historical Institute noong 1986.",
        },
        sources: [4, 5],
    },
    // ---------- spanish ----------
    {
        id: "naming-1725",
        year: { en: "1725", tl: "1725" },
        era: "spanish",
        kind: "tradition",
        title: { en: "Papag and bilao", tl: "Papag at bilao" },
        text: {
            en: "Under a local leader named Don Luis Felipe, the story goes, Spanish missionaries arrived with open right hands to show they came as friends. One pointed at a bamboo bed and asked the name of the place; a villager answered \"papag.\" Another pointed at a winnowing basket; someone answered \"bilao.\" The friars joined the words and shortened \"papag\" to \"pag,\" giving Pagbilao. This is how the town tells its own name, and it is best read as folklore, not as etymology.",
            tl: "Sa panahon ng lokal na pinunong si Don Luis Felipe, ayon sa kuwento, dumating ang mga misyonerong Espanyol na nakabukas ang kanang kamay bilang tanda ng pakikipagkaibigan. Itinuro ng isa ang papag at tinanong ang pangalan ng lugar; sumagot ang isang taganayon ng \"papag.\" Itinuro naman ng isa pa ang bilao; may sumagot ng \"bilao.\" Pinagsama ng mga pari ang dalawang salita at pinaikli ang \"papag\" tungo sa \"pag,\" kaya nabuo ang Pagbilao. Ganito isinasalaysay ng bayan ang sarili nitong pangalan, at higit na angkop ituring na alamat kaysa etimolohiya.",
        },
        sources: [1],
    },
    {
        id: "founding-1730",
        year: { en: "29 August 1730", tl: "29 Agosto 1730" },
        era: "spanish",
        kind: "record",
        title: { en: "The town's founding date", tl: "Petsa ng pagkakatatag ng bayan" },
        text: {
            en: "The church was moved to the present site of the poblacion under Fr. Francisco Xavier de Toledo, with Saint Catherine of Alexandria as patroness. Pagbilao counts its anniversary from 29 August 1730. The 2026 celebration was billed as the 296th Araw ng Pagbilao.",
            tl: "Inilipat ang simbahan sa kasalukuyang kinatatayuan ng poblacion sa ilalim ni Padre Francisco Xavier de Toledo, at si Santa Catalina de Alexandria ang patrona. Mula sa 29 Agosto 1730 binibilang ng Pagbilao ang anibersaryo nito. Ang pagdiriwang noong 2026 ay tinaguriang ika-296 na Araw ng Pagbilao.",
        },
        sources: [4, 6, 7],
    },
    {
        id: "tayabas-1749",
        year: { en: "1749", tl: "1749" },
        era: "spanish",
        kind: "context",
        title: { en: "The province becomes Tayabas", tl: "Naging Tayabas ang lalawigan" },
        text: {
            en: "The provincial capital moved to the town of Tayabas, and the province took its name from it. Pagbilao would remain part of Tayabas province for the next two centuries.",
            tl: "Inilipat ang kabisera ng lalawigan sa bayan ng Tayabas, at mula rito nakuha ng lalawigan ang pangalan nito. Mananatiling bahagi ng lalawigan ng Tayabas ang Pagbilao sa loob ng dalawang siglo.",
        },
        sources: [2, 9],
    },
    {
        id: "stone-church",
        year: { en: "1845 to 1877", tl: "1845 hanggang 1877" },
        era: "spanish",
        kind: "record",
        title: { en: "The stone church", tl: "Ang simbahang bato" },
        text: {
            en: "Work on the present stone church began in 1845 under Fr. Victorino Peralija. It was completed, with its convent and bell tower, in 1877 under Fr. Eugenio Gomez: thirty-two years of building.",
            tl: "Nagsimula noong 1845 ang pagtatayo ng kasalukuyang simbahang bato sa ilalim ni Padre Victorino Peralija. Natapos ito, kasama ang kumbento at tore, noong 1877 sa ilalim ni Padre Eugenio Gomez: tatlumpu't dalawang taon ng pagtatayo.",
        },
        sources: [4],
    },
    {
        id: "tayabas-1898",
        year: { en: "1898", tl: "1898" },
        era: "spanish",
        kind: "context",
        title: { en: "Spanish rule ends in the province", tl: "Nagwakas ang pamamahalang Espanyol sa lalawigan" },
        text: {
            en: "After the Battle of Tayabas (24 June to 13 August 1898), the Spanish governor surrendered and Spanish rule in the province ended. No account of Pagbilao's own part in the revolution has been found yet.",
            tl: "Matapos ang Labanan sa Tayabas (24 Hunyo hanggang 13 Agosto 1898), sumuko ang gobernador ng Espanya at natapos ang pamamahalang Espanyol sa lalawigan. Wala pang natatagpuang salaysay tungkol sa sariling bahagi ng Pagbilao sa himagsikan.",
        },
        sources: [10],
    },
    // ---------- american ----------
    {
        id: "civil-1901",
        year: { en: "1901", tl: "1901" },
        era: "american",
        kind: "record",
        title: { en: "Civil government and the first mayor", tl: "Pamahalaang sibil at ang unang alkalde" },
        text: {
            en: "A civil government was organized in the province on 12 March 1901, with Lucena as capital. The town's list of mayors begins that year with Lino De Castro, who served in 1901 to 1903 and again in 1906 and 1907.",
            tl: "Naitatag ang pamahalaang sibil sa lalawigan noong 12 Marso 1901, at Lucena ang kabisera. Nagsisimula sa taong iyon ang talaan ng mga alkalde ng bayan kay Lino De Castro, na nanungkulan noong 1901 hanggang 1903 at muli noong 1906 at 1907.",
        },
        sources: [1, 9],
    },
    {
        id: "census-1903",
        year: { en: "1903", tl: "1903" },
        era: "american",
        kind: "record",
        title: { en: "The first census", tl: "Ang unang census" },
        text: {
            en: "The first census under American rule counted 6,085 people in Pagbilao. By 1939 there were 11,379.",
            tl: "Ang unang census sa ilalim ng pamahalaang Amerikano ay nagbilang ng 6,085 tao sa Pagbilao. Pagsapit ng 1939, 11,379 na sila.",
        },
        sources: [6],
    },
    {
        id: "st-anne-1908",
        year: { en: "1908", tl: "1908" },
        era: "american",
        kind: "record",
        title: { en: "Devotion to St. Anne begins in Malicboy", tl: "Nagsimula ang debosyon kay Santa Ana sa Malicboy" },
        text: {
            en: "A group in Malicboy began its annual feast for St. Anne. The devotion would grow into the town's second parish, still celebrated every 26 July.",
            tl: "Sinimulan ng isang pangkat sa Malicboy ang taunang pista para kay Santa Ana. Lalago ang debosyong ito at magiging ikalawang parokya ng bayan, na ipinagdiriwang pa rin tuwing 26 Hulyo.",
        },
        sources: [5, 16],
    },
    // ---------- war ----------
    {
        id: "crossroads-1941",
        year: { en: "24 to 25 December 1941", tl: "24 hanggang 25 Disyembre 1941" },
        era: "war",
        kind: "record",
        title: { en: "The crossroads on Route 1", tl: "Ang sangandaan sa Ruta 1" },
        text: {
            en: "After the Japanese landed at Lamon Bay, Pagbilao, an important road junction, became their immediate objective. Their reconnaissance regiment crossed the mountains to Malicboy, where the 2nd Battalion of the Philippine 52nd Infantry was still setting up defences, and the defenders fell back along Route 1. Japanese forces crossed the Palsabangon River and held Pagbilao by the evening of 25 December.",
            tl: "Matapos lumapag ang mga Hapones sa Lamon Bay, ang Pagbilao, isang mahalagang sangandaan ng mga daan, ang naging agarang target nila. Tumawid ang kanilang reconnaissance regiment sa mga bundok patungong Malicboy, kung saan itinatayo pa lamang ng 2nd Battalion ng Philippine 52nd Infantry ang depensa, at umatras ang mga tagapagtanggol sa Ruta 1. Tumawid ang mga Hapones sa Ilog Palsabangon at hawak na nila ang Pagbilao pagsapit ng gabi ng 25 Disyembre.",
        },
        sources: [8, 11],
    },
    {
        id: "occupation",
        year: { en: "1942 to 1945", tl: "1942 hanggang 1945" },
        era: "war",
        kind: "context",
        title: { en: "The occupation years", tl: "Ang mga taon ng pananakop" },
        text: {
            en: "The province lived under Japanese occupation, and guerrilla units operated across Tayabas. No account specific to Pagbilao has been documented yet. The municipal list shows no mayor for 1941 to 1943 and names Vicente Medina for 1944 to 1945. If your family remembers these years, we would like to record them.",
            tl: "Nasa ilalim ng pananakop ng mga Hapones ang lalawigan, at kumilos ang mga grupong gerilya sa buong Tayabas. Wala pang naitatalang salaysay na partikular sa Pagbilao. Walang alkaldeng nakalista para sa 1941 hanggang 1943 sa talaan ng bayan, at si Vicente Medina ang nakalista para sa 1944 hanggang 1945. Kung naaalala ng inyong pamilya ang mga taong ito, nais naming itala ang mga ito.",
        },
        sources: [1, 9],
    },
    {
        id: "church-1945",
        year: { en: "1945", tl: "1945" },
        era: "war",
        kind: "record",
        title: { en: "The church is destroyed", tl: "Nawasak ang simbahan" },
        text: {
            en: "The church and convent were destroyed during the liberation, when American aircraft bombed the complex. Only the three-storey hexagonal bell tower survived. Local accounts say the bombing followed a report that Japanese soldiers were hiding inside. The province is recorded as liberated by 4 April 1945.",
            tl: "Nawasak ang simbahan at kumbento noong paglaya nang bombahin ng mga eroplanong Amerikano ang lugar. Ang tatlong-palapag na heksagonal na tore lamang ang natirang nakatayo. Ayon sa mga salaysay ng bayan, sumunod ang pambobomba sa ulat na may mga sundalong Hapones na nagtatago sa loob. Naitalang nakalaya ang lalawigan pagsapit ng 4 Abril 1945.",
        },
        sources: [4, 5, 2],
    },
    // ---------- republic ----------
    {
        id: "quezon-1946",
        year: { en: "7 September 1946", tl: "7 Setyembre 1946" },
        era: "republic",
        kind: "record",
        title: { en: "Tayabas becomes Quezon", tl: "Naging Quezon ang Tayabas" },
        text: {
            en: "Republic Act No. 14 renamed the province from Tayabas to Quezon, in honor of the late President Manuel L. Quezon.",
            tl: "Pinalitan ng Republic Act No. 14 ang pangalan ng lalawigan mula Tayabas tungong Quezon bilang parangal sa yumaong Pangulong Manuel L. Quezon.",
        },
        sources: [9],
    },
    {
        id: "church-1954",
        year: { en: "1954", tl: "1954" },
        era: "republic",
        kind: "record",
        title: { en: "The church is rebuilt", tl: "Muling itinayo ang simbahan" },
        text: {
            en: "The church was repaired and rebuilt under Fr. Vicente Urlanda, nine years after its destruction.",
            tl: "Inayos at muling itinayo ang simbahan sa pangangasiwa ni Padre Vicente Urlanda, siyam na taon matapos itong masira.",
        },
        sources: [4],
    },
    {
        id: "st-anne-1958",
        year: { en: "17 March 1958", tl: "17 Marso 1958" },
        era: "republic",
        kind: "record",
        title: { en: "St. Anne Parish is established", tl: "Naitatag ang Parokya ni Santa Ana" },
        text: {
            en: "The parish of St. Anne in Malicboy was officially established, its 50th anniversary being celebrated on 15 March 2008. (Some sources say 1952; the anniversary supports 1958.)",
            tl: "Opisyal na naitatag ang Parokya ni Santa Ana sa Malicboy; ipinagdiwang ang ika-50 anibersaryo nito noong 15 Marso 2008. (May mga batis na nagsasabing 1952; sinusuportahan ng anibersaryo ang 1958.)",
        },
        sources: [16],
    },
    {
        id: "mangrove-1975",
        year: { en: "1975", tl: "1975" },
        era: "republic",
        kind: "record",
        title: { en: "The mangrove forest is protected", tl: "Pinangalagaan ang gubat ng bakawan" },
        text: {
            en: "About 145 hectares of mangrove in Palsabangon were declared the Pagbilao Mangrove Experimental Forest by Bureau of Forest Development Administrative Order No. 7. It later became a national research and training site for mangroves.",
            tl: "Humigit-kumulang 145 ektarya ng bakawan sa Palsabangon ang idineklarang Pagbilao Mangrove Experimental Forest sa bisa ng Administrative Order No. 7 ng Bureau of Forest Development. Kalaunan, naging pambansang pook-pananaliksik at pagsasanay ito para sa bakawan.",
        },
        sources: [14],
    },
    {
        id: "radovan",
        year: { en: "1972 to 1993", tl: "1972 hanggang 1993" },
        era: "republic",
        kind: "record",
        title: { en: "The longest run in the mayors' list", tl: "Pinakamahabang panunungkulan sa talaan ng mga alkalde" },
        text: {
            en: "Rosauro Radovan served as mayor from 1972 to 1986 and again from 1988 to 1993. Juan Zaporteza is listed for 1986 to 1988 in between.",
            tl: "Nanungkulan si Rosauro Radovan bilang alkalde mula 1972 hanggang 1986 at muli mula 1988 hanggang 1993. Nakalista si Juan Zaporteza sa pagitan, mula 1986 hanggang 1988.",
        },
        sources: [1],
    },
    {
        id: "marker-1986",
        year: { en: "4 July 1986", tl: "4 Hulyo 1986" },
        era: "republic",
        kind: "record",
        title: { en: "A national historical marker", tl: "Pambansang makasaysayang marker" },
        text: {
            en: "The National Historical Institute installed a Level II marker, \"Simbahan ng Pagbilao,\" recording the church's story from 1688 to 1954.",
            tl: "Nagkabit ang National Historical Institute ng Level II na marker, ang \"Simbahan ng Pagbilao,\" na nagtatala ng kasaysayan ng simbahan mula 1688 hanggang 1954.",
        },
        sources: [4],
    },
    // ---------- modern ----------
    {
        id: "power-1996",
        year: { en: "1993 to 1996", tl: "1993 hanggang 1996" },
        era: "modern",
        kind: "record",
        title: { en: "The power station on Isla Grande", tl: "Ang planta ng kuryente sa Isla Grande" },
        text: {
            en: "Construction of the coal-fired Pagbilao Power Station began in 1993. Its two units, rated 735 megawatts together, started operating in 1996, and the town later became known as the power capital of Southern Luzon.",
            tl: "Nagsimula noong 1993 ang pagtatayo ng coal-fired na Pagbilao Power Station. Nagsimulang gumana noong 1996 ang dalawang yunit nito na may kabuuang 735 megawatt, at kalaunan ay nakilala ang bayan bilang power capital ng Timog Luzon.",
        },
        sources: [13, 15],
    },
    {
        id: "unit3-2018",
        year: { en: "31 May 2018", tl: "31 Mayo 2018" },
        era: "modern",
        kind: "record",
        title: { en: "A third unit", tl: "Ikatlong yunit" },
        text: {
            en: "A third, 420-megawatt unit built by Pagbilao Energy Corporation was inaugurated, raising the station to 1,155 megawatts.",
            tl: "Pinasinayaan ang ikatlong yunit na 420 megawatt na itinayo ng Pagbilao Energy Corporation, kaya umabot sa 1,155 megawatt ang planta.",
        },
        sources: [15],
    },
    {
        id: "richest-2018",
        year: { en: "2018", tl: "2018" },
        era: "modern",
        kind: "record",
        title: { en: "The richest municipality in Quezon", tl: "Pinakamayamang munisipalidad sa Quezon" },
        text: {
            en: "By 2018 asset figures, the municipal portal reports, Pagbilao ranked as the richest municipality in Quezon Province, with assets of PHP 1,639 million. Agriculture still occupies about 70 percent of the land, mostly coconut.",
            tl: "Ayon sa ulat ng portal ng munisipyo, sa datos ng ari-arian noong 2018 ay ang Pagbilao ang pinakamayamang munisipalidad sa lalawigan ng Quezon, na may ari-ariang PHP 1,639 milyon. Mga 70 porsiyento ng lupain ay nakalaan pa rin sa agrikultura, higit sa lahat niyog.",
        },
        sources: [13],
    },
    {
        id: "census-2024",
        year: { en: "2024", tl: "2024" },
        era: "modern",
        kind: "record",
        title: { en: "82,132 residents", tl: "82,132 na residente" },
        text: {
            en: "The 2024 Census of Population counted 82,132 people across Pagbilao's 27 barangays, more than thirteen times the 1903 count.",
            tl: "Ang 2024 Census of Population ay nagbilang ng 82,132 katao sa 27 barangay ng Pagbilao, mahigit labintatlong ulit ng bilang noong 1903.",
        },
        sources: [12],
    },
    {
        id: "araw-2026",
        year: { en: "August 2026", tl: "Agosto 2026" },
        era: "modern",
        kind: "record",
        title: { en: "The 296th Araw ng Pagbilao", tl: "Ika-296 na Araw ng Pagbilao" },
        text: {
            en: "The town marked its 296th anniversary with the Papag at Bilao Festival, retelling the story of Pablo and Rita and the winnowing basket.",
            tl: "Ipinagdiwang ng bayan ang ika-296 na anibersaryo nito sa Papag at Bilao Festival, na muling nagsasalaysay ng kuwento nina Pablo at Rita at ng bilao.",
        },
        sources: [7],
    },
]

export interface CensusPoint {
    year: number
    population: number
}

// Census counts from the Philippine Statistics Authority, as compiled by Wikipedia and PhilAtlas.
export const CENSUS: CensusPoint[] = [
    { year: 1903, population: 6085 },
    { year: 1918, population: 6879 },
    { year: 1939, population: 11379 },
    { year: 1948, population: 12978 },
    { year: 1960, population: 17303 },
    { year: 1970, population: 26587 },
    { year: 1975, population: 29304 },
    { year: 1980, population: 31681 },
    { year: 1990, population: 41635 },
    { year: 1995, population: 49605 },
    { year: 2000, population: 53442 },
    { year: 2007, population: 62561 },
    { year: 2010, population: 65996 },
    { year: 2015, population: 75023 },
    { year: 2020, population: 78700 },
    { year: 2024, population: 82132 },
]

export interface ChurchStep {
    year: string
    title: Text
    text: Text
}

export const CHURCH_STEPS: ChurchStep[] = [
    {
        year: "1685",
        title: { en: "Landing at Binahaan", tl: "Pagdaong sa Binahaan" },
        text: { en: "Franciscans land at Dinaungang-Pari.", tl: "Dumaong ang mga Pransiskano sa Dinaungang-Pari." },
    },
    {
        year: "1688",
        title: { en: "Bamboo and cogon", tl: "Kawayan at cogon" },
        text: { en: "The first church rises at Binahaan under Fr. Cristobal Mortanchez.", tl: "Itinayo ang unang simbahan sa Binahaan sa ilalim ni Padre Cristobal Mortanchez." },
    },
    {
        year: "1730",
        title: { en: "The move to the poblacion", tl: "Paglipat sa poblacion" },
        text: { en: "Moved to the present site with St. Catherine of Alexandria as patroness.", tl: "Inilipat sa kasalukuyang lugar, kasama si Santa Catalina de Alexandria bilang patrona." },
    },
    {
        year: "1845 to 1877",
        title: { en: "Built in stone", tl: "Itinayo sa bato" },
        text: { en: "Church, convent and hexagonal bell tower completed after thirty-two years.", tl: "Natapos ang simbahan, kumbento at heksagonal na tore matapos ang tatlumpu't dalawang taon." },
    },
    {
        year: "1945",
        title: { en: "Lost in the liberation", tl: "Nawasak sa paglaya" },
        text: { en: "Only the bell tower is left standing.", tl: "Ang tore lamang ang natirang nakatayo." },
    },
    {
        year: "1954",
        title: { en: "Rebuilt", tl: "Muling itinayo" },
        text: { en: "Reconstruction under Fr. Vicente Urlanda.", tl: "Muling pagtatayo sa ilalim ni Padre Vicente Urlanda." },
    },
    {
        year: "1986",
        title: { en: "Marked", tl: "Minarkahan" },
        text: { en: "National Historical Institute installs its marker.", tl: "Ikinabit ng National Historical Institute ang marker nito." },
    },
    {
        year: "2003 to 2005",
        title: { en: "Restored", tl: "Ipinagawang muli" },
        text: { en: "Termite damage repaired and the facade restored with adobe blocks.", tl: "Naayos ang pinsala ng anay at naibalik ang harapan gamit ang adobe." },
    },
]

// Verbatim text of the NHI marker (Filipino only).
export const MARKER_TEXT =
    "Itinatag ang parokya ng mga Pransiskano sa Binahaan noong 1688 at naging ministro si Padre Cristobal Mortanchez. Inilipat ang simbahan sa kasalukuyang tayo ng bayan sa patrona no Sta. Catalina de Alexandria, 1730 at naging kura paroko si Padre Francisco Xavier de Toledo. Itinayo ang simbahang bato sa pamamahala ni Padre Victorino Peralija, 1845; at natapos kasama ang kumbento at tore, 1877 sa pamamahala ni Padre Eugenio Gomez. Nawasak noong liberasyon, 1945, at muling ipinaayos sa pangangasiwa ni Padre Vicente Urlanda noong 1954."

export const HISTORY_SOURCES: HistorySource[] = [
    {
        id: 1,
        title: "Municipality of Pagbilao, \"Pagbilao History\"",
        url: "https://pagbilao.gov.ph/pagbilao-history/",
        note: { en: "Pablo and Rita, the 1725 naming story, and the full list of mayors.", tl: "Sina Pablo at Rita, kuwento ng pangalan noong 1725, at buong talaan ng mga alkalde." },
    },
    {
        id: 2,
        title: "Wikipedia, \"Quezon\" (history)",
        url: "https://en.wikipedia.org/wiki/Quezon",
        note: { en: "Kalilayan (1591), the 1604 destruction, the 1749 move to Tayabas.", tl: "Kalilayan (1591), pagkawasak noong 1604, paglipat sa Tayabas noong 1749." },
    },
    {
        id: 3,
        title: "Wikipedia, \"Unisan, Quezon\"",
        url: "https://en.wikipedia.org/wiki/Unisan,_Quezon",
        note: { en: "The 1605 raid, the Palsabangon River refuge, and the move to Cabuyao.", tl: "Ang pagsalakay noong 1605, kanlungan sa Ilog Palsabangon, at paglipat sa Cabuyao." },
    },
    {
        id: 4,
        title: "National Historical Institute marker, \"Simbahan ng Pagbilao\" (1986)",
        url: "http://nhcphistoricsites.blogspot.com/2013/02/simbahan-ng-pagbilao.html",
        note: { en: "Official marker text for the church, 1688 to 1954.", tl: "Opisyal na teksto ng marker ng simbahan, 1688 hanggang 1954." },
    },
    {
        id: 5,
        title: "Pagbilao Church history (WOW Pagbilao)",
        url: "https://wowpagbilao.blogspot.com/2013/08/pagbilao-church.html",
        note: { en: "The 1685 landing, the 1945 bombing account, and the 2003 to 2005 restoration.", tl: "Ang pagdaong noong 1685, salaysay ng pambobomba noong 1945, at pagsasaayos noong 2003 hanggang 2005." },
    },
    {
        id: 6,
        title: "Wikipedia, \"Pagbilao\"",
        url: "https://en.wikipedia.org/wiki/Pagbilao",
        note: { en: "Founding date of 29 August 1730 and census counts.", tl: "Petsa ng pagkakatatag na 29 Agosto 1730 at mga bilang sa census." },
    },
    {
        id: 7,
        title: "Pagbilao Tourism Office",
        url: "https://tourism.pagbilao.gov.ph/",
        note: { en: "The 296th Araw ng Pagbilao and heritage categories.", tl: "Ang ika-296 na Araw ng Pagbilao at mga kategorya ng pamana." },
    },
    {
        id: 8,
        title: "Louis Morton, The Fall of the Philippines (US Army), chapter 11",
        url: "http://www.ibiblio.org/hyperwar/USA/USA-P-PI/USA-P-PI-11.html",
        note: { en: "The December 1941 withdrawal through Pagbilao.", tl: "Ang pag-atras noong Disyembre 1941 sa Pagbilao." },
    },
    {
        id: 9,
        title: "Quezon Province, \"History and Culture\"",
        url: "https://quezon.gov.ph/history/",
        note: { en: "Civil government in 1901 and the 1946 renaming.", tl: "Pamahalaang sibil noong 1901 at pagpapalit ng pangalan noong 1946." },
    },
    {
        id: 10,
        title: "Wikipedia, \"Battle of Tayabas\"",
        url: "https://en.wikipedia.org/wiki/Battle_of_Tayabas",
        note: { en: "The 1898 fight that ended Spanish rule in the province.", tl: "Ang labanan noong 1898 na nagtapos sa pamamahalang Espanyol sa lalawigan." },
    },
    {
        id: 11,
        title: "Wikipedia, \"Japanese invasion of Lamon Bay\"",
        url: "https://en.wikipedia.org/wiki/Japanese_invasion_of_Lamon_Bay",
        note: { en: "Malicboy and the retreat along Route 1.", tl: "Ang Malicboy at ang pag-atras sa Ruta 1." },
    },
    {
        id: 12,
        title: "PhilAtlas, Pagbilao profile (PSA census data)",
        url: "https://www.philatlas.com/luzon/r04a/quezon/pagbilao.html",
        note: { en: "Census counts from 1903 to 2020, with the 2024 count from the Better Pagbilao API.", tl: "Mga bilang sa census mula 1903 hanggang 2020, at ang bilang noong 2024 mula sa Better Pagbilao API." },
    },
    {
        id: 13,
        title: "Municipality of Pagbilao, \"Economy\"",
        url: "https://pagbilao.gov.ph/economy/",
        note: { en: "Land use, the power station, and 2018 asset figures.", tl: "Gamit ng lupa, ang planta ng kuryente, at datos ng ari-arian noong 2018." },
    },
    {
        id: 14,
        title: "Pagbilao Mangrove research (MSEUF)",
        url: "https://mseuf.edu.ph/research/read/1053",
        note: { en: "BFD Administrative Order No. 7 (1975). Reported area varies between 145 and 150 hectares.", tl: "Administrative Order No. 7 ng BFD (1975). Nag-iiba ang iniulat na lawak sa pagitan ng 145 at 150 ektarya." },
    },
    {
        id: 15,
        title: "Pagbilao Power Station (Wikipedia; TeaM Energy)",
        url: "https://en.wikipedia.org/wiki/Pagbilao_Power_Station",
        note: { en: "1993 construction, 1996 start, Unit 3 in 2018. Sources disagree on some Unit 3 dates.", tl: "Pagtatayo noong 1993, pagsisimula noong 1996, Unit 3 noong 2018. May pagkakaiba ang mga batis sa ilang petsa ng Unit 3." },
    },
    {
        id: 16,
        title: "Malicboy Church, St. Anne Parish (WOW Pagbilao)",
        url: "http://wowpagbilao.blogspot.com/",
        note: { en: "Devotion from 1908, parish established 17 March 1958.", tl: "Debosyon mula 1908, parokya na naitatag noong 17 Marso 1958." },
    },
]
