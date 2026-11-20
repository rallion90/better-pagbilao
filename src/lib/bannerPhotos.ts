import type { BannerPhoto } from "../components/common/PageBanner"

// Freely licensed local photos already in public/hero (see public/hero/ATTRIBUTIONS.md).
export const BANNER_PHOTOS = {
    highway: {
        src: "/hero/maharlika-highway-pagbilao.jpg",
        position: "50% 55%",
        credit: {
            author: "Ralff Nestor Nacor",
            license: "CC BY-SA 4.0",
            href: "https://commons.wikimedia.org/wiki/File:Maharlika_Highway,_Pagbilao,_Quezon,_May_2025.jpg",
        },
    },
    grandeIsland: {
        src: "/hero/pagbilao-grande-island.jpg",
        position: "50% 50%",
        credit: {
            author: "Patrickroque01",
            license: "CC BY-SA 4.0",
            href: "https://commons.wikimedia.org/wiki/File:Pagbilao_Grande_Island_from_air_(Quezon;_12-09-2023).jpg",
        },
    },
    church: {
        src: "/hero/pagbilao-church-1280.jpg",
        position: "30% 35%",
        credit: {
            author: "Carmelo Bayarcal",
            license: "CC BY-SA 3.0",
            href: "https://commons.wikimedia.org/wiki/File:Saint_Catherine_of_Alexandria.jpg",
        },
    },
} satisfies Record<string, BannerPhoto>
