import type { Language } from "./translations"

export interface ShareCopy {
    share: string
    heading: string
    copyLink: string
    copied: string
    email: string
    /** Appended to the page title in the shared message */
    via: string
}

export const shareCopy: Record<Language, ShareCopy> = {
    en: {
        share: "Share",
        heading: "Share this page",
        copyLink: "Copy link",
        copied: "Link copied",
        email: "Email",
        via: "via Better Pagbilao",
    },
    tl: {
        share: "Ibahagi",
        heading: "Ibahagi ang pahinang ito",
        copyLink: "Kopyahin ang link",
        copied: "Nakopya na ang link",
        email: "Email",
        via: "mula sa Better Pagbilao",
    },
}
