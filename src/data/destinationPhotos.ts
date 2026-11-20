// Freely licensed photos for tourist destinations, keyed by destination slug.
// Every file is stored locally and listed in public/destinations/ATTRIBUTIONS.md (or public/hero/ATTRIBUTIONS.md).
// Destinations without an entry show their category icon instead.
//
// Still needed (no freely licensed photo found on Wikimedia Commons as of 2026-11):
// palsabangon-falls, patayan-island, binahaan-dam, pagbilao-bay, pagbilao-cultural-institutions,
// araw-ng-pagbilao-papag-at-bilao-festival.

export type DestinationPhotoSource = {
    src: string
    width: number
    height: number
    alt: { en: string; tl: string }
    /** CSS object-position for cropping, e.g. "50% 40%" */
    position?: string
    author: string
    license: string
    sourceUrl: string
}

export const DESTINATION_PHOTOS: Record<string, DestinationPhotoSource> = {
    "pagbilao-grande-island": {
        src: "/hero/pagbilao-grande-island.jpg",
        width: 1920,
        height: 1440,
        alt: {
            en: "Aerial view of Pagbilao Grande Island and Tayabas Bay",
            tl: "Tanaw mula sa himpapawid ng Pagbilao Grande Island at Tayabas Bay",
        },
        author: "Patrickroque01",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Pagbilao_Grande_Island_from_air_(Quezon;_12-09-2023).jpg",
    },
    "tayabas-bay-coastal-areas": {
        src: "/destinations/tayabas-bay-coast.jpg",
        width: 1280,
        height: 960,
        alt: {
            en: "Tayabas Bay coastline seen from the air",
            tl: "Baybayin ng Tayabas Bay na tanaw mula sa himpapawid",
        },
        position: "50% 60%",
        author: "Patrickroque01",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Tayabas_Bay_from_air_(Quezon;_11-24-2021).jpg",
    },
    "pagbilao-cultural-built-heritage": {
        src: "/hero/pagbilao-church-1280.jpg",
        width: 1280,
        height: 741,
        alt: {
            en: "Pagbilao Church (St. Catherine of Alexandria Parish), Pagbilao, Quezon",
            tl: "Simbahan ng Pagbilao (Parokya ni Sta. Catalina ng Alejandria), Pagbilao, Quezon",
        },
        position: "25% 40%",
        author: "Carmelo Bayarcal",
        license: "CC BY-SA 3.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Saint_Catherine_of_Alexandria.jpg",
    },
    "quezon-protected-landscape": {
        src: "/destinations/quezon-protected-landscape.jpg",
        width: 1280,
        height: 720,
        alt: {
            en: "Forested peak in the Quezon Protected Landscape",
            tl: "Kagubatang tuktok sa Quezon Protected Landscape",
        },
        author: "Badette71",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Quezon_National_Forest_Park_Atiimonan,_Quezon_Philippines.jpg",
    },
    "mount-pinagbanderahan": {
        src: "/destinations/mount-pinagbanderahan.jpg",
        width: 1280,
        height: 960,
        alt: {
            en: "View from the summit of Mount Pinagbanderahan over the Quezon lowlands",
            tl: "Tanaw mula sa tuktok ng Bundok Pinagbanderahan sa kapatagan ng Quezon",
        },
        position: "50% 55%",
        author: "RJArts00001",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Pinagbanderahan,_Atimonan,_Quezon_Province,_Philippines.jpg",
    },
}
