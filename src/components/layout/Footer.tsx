import {
    Accessibility,
    Boxes,
    Code2,
    HandHeart,
    HeartPulse,
    MessageCircle,
} from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"

const quickLinkHrefs = ["#", "#", "#transparency", "#", "#", "#", "#"]
const resourceHrefs = [
    "https://data.gov.ph/",
    "https://www.foi.gov.ph/",
    "https://pagbilao.gov.ph/",
    "#",
    "#",
    "https://blgf.gov.ph/",
    "https://cmci.dti.gov.ph/",
]

const supportMarkIcons = [Accessibility, HeartPulse, HandHeart]
const supportMarkLabels = ["Abakada", "HIV Care PH", "BetterGov.ph"]

const Footer = () => {
    const { t } = useLanguage()

    return (
        <footer className="bg-[#111111] text-white">
            <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
                <div className="grid gap-y-14 gap-x-10 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1.3fr] lg:gap-x-16 xl:gap-x-24">
                    <div>
                        <a href="#home" className="inline-flex items-center gap-4" aria-label="Better Pagbilao home">
                             <span className="flex h-16 shrink-0 items-center py-1 sm:h-20">
                                <img src="/betterpagbilao_logo_dark.svg" alt="Better Pagbilao" className="h-full w-auto object-contain" />
                            </span>

                        </a>

                        <p className="mt-8 max-w-sm text-lg font-medium leading-8 text-white/68">
                            {t.footer.tagline}
                        </p>

                        <div className="mt-10 flex items-center gap-5">
                            <a href="#" className="grid h-14 w-14 place-items-center rounded-lg bg-white/10 text-white/78 transition hover:bg-white/16 hover:text-white" aria-label="Follow Better Pagbilao on Facebook">
                                <span className="text-2xl font-black leading-none">f</span>
                            </a>
                            <a href="#" className="grid h-14 w-14 place-items-center rounded-lg bg-white/10 text-white/78 transition hover:bg-white/16 hover:text-white" aria-label="Follow Better Pagbilao on LinkedIn">
                                <span className="text-xl font-black leading-none">in</span>
                            </a>
                            <a href="#" className="grid h-14 w-14 place-items-center rounded-lg bg-white/10 text-white/78 transition hover:bg-white/16 hover:text-white" aria-label="Join Better Pagbilao community chat">
                                <MessageCircle className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    <nav aria-label="Footer quick links">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white/52">{t.footer.quickLinksHeading}</h2>
                        <ul className="mt-9 space-y-6 text-base font-semibold text-white/72">
                            {t.footer.quickLinks.map((label, index) => (
                                <li key={label}>
                                    <a href={quickLinkHrefs[index]} className="transition hover:text-white">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Footer resources">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white/52">{t.footer.resourcesHeading}</h2>
                        <ul className="mt-9 space-y-6 text-base font-semibold text-white/72">
                            {t.footer.resources.map((label, index) => (
                                <li key={label}>
                                    <a href={resourceHrefs[index]} className="transition hover:text-white">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="lg:justify-self-end">
                        <div className="inline-flex items-center whitespace-nowrap rounded-md bg-emerald-950/30 px-4 py-3 text-sm font-black text-white/78 ring-1 ring-emerald-400/5">
                            {t.footer.costLabel}&nbsp;<span className="text-emerald-400">₱0</span>
                        </div>

                        <div className="mt-7 flex flex-col items-start gap-4">

                            <a href="#" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white/8 px-5 text-base font-semibold text-white/76 transition hover:bg-white/12 hover:text-white">
                                <Code2 className="h-5 w-5" />
                                {t.footer.contribute}
                            </a>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-9 text-white/[0.55]">
                            {supportMarkLabels.map((label, index) => {
                                const Icon = supportMarkIcons[index]
                                return (
                                    <div key={label} className="grid justify-items-center gap-2">
                                        <Icon className="h-14 w-14 stroke-[1.7]" />
                                        <span className="text-[10px] font-black uppercase leading-none tracking-normal">{label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex flex-col gap-5 border-t border-white/10 pt-10 text-sm font-semibold text-white/48 md:flex-row md:items-center md:justify-between">
                    <p>{t.footer.copyright}</p>
                    <p className="inline-flex items-center gap-2">
                        <Boxes className="h-5 w-5" />
                        {t.footer.version}
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
