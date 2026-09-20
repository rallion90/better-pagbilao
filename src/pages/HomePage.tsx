import { Link } from 'react-router'
import HeroSlider from '../components/home/HeroSlider'
import CardStat from '../components/home/CardStat'
import { useLanguage } from '../i18n/useLanguage'
import { historyPageCopy } from '../i18n/historyPage'
import { useSeo } from '../hooks/useSeo'

import {
    ArrowRight,
    Binoculars,
    BookOpenCheck,
    BookOpenText,
    BriefcaseBusiness,
    ChevronRight,
    ClipboardCheck,
    FileDown,
    Flame,
    FolderDown,
    HandHeart,
    HeartPulse,
    Landmark,
    MapPinned,
    MessageSquareHeart,
    Palmtree,
    Route,
    ScrollText,
    Shield,
    ShieldAlert,
    Siren,
    Sprout,
    UsersRound,
    Waves,
    Wheat,
} from 'lucide-react'

const SERVICE_ICONS = [BriefcaseBusiness, HeartPulse, ShieldAlert, Wheat, UsersRound, Palmtree]
const SERVICE_COLORS = ["text-bayan-blue", "text-bayan-red", "text-bayan-green", "text-amber-700", "text-bayan-blue", "text-bayan-green"]
const SERVICE_LINK_HREFS = [
    "/services/business-and-permits",
    "/services/health-services",
    "/services/disaster-and-safety",
    "/services/agriculture-and-livelihood",
    "/services/social-welfare",
    "#tourism",
]

const IDENTITY_ICONS = [Route, Waves, HandHeart]
const IDENTITY_COLORS = ["text-bayan-gold", "text-cyan-300", "text-emerald-300"]

const TRANSPARENCY_ICONS = [ScrollText, ClipboardCheck, BookOpenCheck, FolderDown]
const TRANSPARENCY_COLORS = ["text-bayan-green", "text-bayan-blue", "text-bayan-red", "text-amber-700"]
const TRANSPARENCY_LINK_HREFS = [
    "/transparency/ordinances-and-executive-orders",
    "/transparency/procurement",
    "/transparency/citizens-charter",
    "/transparency/permits-and-clearances",
]

const HOTLINE_ICONS = [Siren, Shield, Flame, HeartPulse]
const HOTLINE_COLORS = ["text-bayan-red", "text-bayan-blue", "text-amber-700", "text-bayan-green"]
const HOTLINE_TELS = ["tel:09186244564", "tel:09985985764", "tel:09234424945", "tel:0427973092"]
const HOTLINE_NUMBERS = ["0918-624-4564", "0998-598-5764", "0923-442-4945", "(042) 797-3092"]

const TIMELINE_ICONS = [Sprout, BookOpenText, Route]
const TIMELINE_COLORS = [
    { bg: "bg-blue-50", text: "text-bayan-blue" },
    { bg: "bg-red-50", text: "text-bayan-red" },
    { bg: "bg-emerald-50", text: "text-bayan-green" },
]
const HISTORY_STAT_COLORS = ["text-bayan-blue", "text-bayan-green", "text-bayan-red"]

const HomePage = () => {
    const { t, lang } = useLanguage()

    // No jsonLd here: the WebSite schema already lives as a static <script> in
    // index.html so it's present for crawlers even before JS runs. This call
    // exists to re-assert title/description/canonical when navigating back to
    // "/" from another page (those pages' useSeo cleanup can otherwise leave
    // stale values, since nothing else re-asserts Home's own on remount).
    useSeo({
        title: "Better Pagbilao | Pagbilao, Quezon Transparency Portal",
        description:
            "Better Pagbilao is a community-built portal for Pagbilao, Quezon — find government services, emergency hotlines, tourism spots, barangay info, and public documents in one place.",
        path: "/",
    })

    return (
        <>
            <HeroSlider />

            <CardStat />

            <section id="services" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-blue">{t.home.services.eyebrow}</p>
                            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{t.home.services.heading}</h2>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{t.home.services.description}</p>
                        </div>
                        <a href="#transparency" className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-black text-slate-800 hover:bg-slate-50">
                            <FileDown className="h-4 w-4" />
                            {t.home.services.formsLink}
                        </a>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {t.home.services.cards.map((card, index) => {
                            const Icon = SERVICE_ICONS[index]
                            const href = SERVICE_LINK_HREFS[index]
                            const linkClassName = `mt-5 inline-flex items-center gap-2 text-sm font-black ${SERVICE_COLORS[index]}`
                            return (
                                <article key={card.title} className="rounded-lg border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
                                    <Icon className={`h-7 w-7 ${SERVICE_COLORS[index]}`} />
                                    <h3 className="mt-5 text-xl font-black">{card.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                                    {href.startsWith("#") ? (
                                        <a href={href} className={linkClassName}>
                                            {card.linkText} <ChevronRight className="h-4 w-4" />
                                        </a>
                                    ) : (
                                        <Link to={href} className={linkClassName}>
                                            {card.linkText} <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-bayan-ink py-16 text-white sm:py-20">
                <div className="mx-auto grid max-w-[1600px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{t.home.identity.eyebrow}</p>
                        <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{t.home.identity.heading}</h2>
                        <p className="mt-5 text-base leading-8 text-white/76">{t.home.identity.paragraph}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {t.home.identity.cards.map((card, index) => {
                            const Icon = IDENTITY_ICONS[index]
                            return (
                                <article key={card.title} className="rounded-lg bg-white/8 p-5 ring-1 ring-white/12">
                                    <Icon className={`h-7 w-7 ${IDENTITY_COLORS[index]}`} />
                                    <h3 className="mt-4 font-black">{card.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-white/70">{card.description}</p>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section id="transparency" className="bg-bayan-mist py-16 sm:py-20">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-green">{t.home.transparency.eyebrow}</p>
                            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{t.home.transparency.heading}</h2>
                            <p className="mt-4 text-base leading-7 text-slate-600">{t.home.transparency.paragraph}</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {t.home.transparency.cards.map((card, index) => {
                                const Icon = TRANSPARENCY_ICONS[index]
                                return (
                                    <Link
                                        key={card.title}
                                        to={TRANSPARENCY_LINK_HREFS[index]}
                                        className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-soft"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-black text-slate-500">{card.category}</p>
                                                <h3 className="mt-2 text-xl font-black">{card.title}</h3>
                                            </div>
                                            <Icon className={`h-6 w-6 ${TRANSPARENCY_COLORS[index]}`} />
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section id="tourism" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <figure className="overflow-hidden rounded-lg shadow-soft">
                            <img
                                src="/hero/pagbilao-grande-island.jpg"
                                alt="Aerial view of Pagbilao Grande Island and Tayabas Bay"
                                loading="lazy"
                                className="h-90 w-full object-cover sm:h-115"
                            />
                            <figcaption className="bg-bayan-ink px-4 py-2 text-xs font-semibold text-white/60">
                                Photo: Patrickroque01 via Wikimedia Commons, CC BY-SA 4.0
                            </figcaption>
                        </figure>
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-red">{t.home.tourism.eyebrow}</p>
                            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{t.home.tourism.heading}</h2>
                            <p className="mt-4 text-base leading-8 text-slate-600">{t.home.tourism.paragraph}</p>
                            <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <Binoculars className="h-5 w-5 text-bayan-blue" />
                                    <p className="mt-3 font-black">{t.home.tourism.destinations.title}</p>
                                    <p className="mt-1 text-sm text-slate-600">{t.home.tourism.destinations.description}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <MessageSquareHeart className="h-5 w-5 text-bayan-green" />
                                    <p className="mt-3 font-black">{t.home.tourism.feedback.title}</p>
                                    <p className="mt-1 text-sm text-slate-600">{t.home.tourism.feedback.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="hotlines" className="bg-bayan-red py-16 text-white sm:py-20">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/72">{t.home.hotlines.eyebrow}</p>
                            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{t.home.hotlines.heading}</h2>
                        </div>
                        <p className="max-w-xl text-sm font-semibold leading-6 text-white/76">{t.home.hotlines.note}</p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {t.home.hotlines.cards.map((card, index) => {
                            const Icon = HOTLINE_ICONS[index]
                            return (
                                <a key={card.label} href={HOTLINE_TELS[index]} className="rounded-lg bg-white p-5 text-bayan-ink shadow-soft">
                                    <Icon className={`h-7 w-7 ${HOTLINE_COLORS[index]}`} />
                                    <p className="mt-4 text-sm font-black text-slate-500">{card.label}</p>
                                    <p className="mt-1 text-2xl font-black">{HOTLINE_NUMBERS[index]}</p>
                                </a>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section id="history" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-blue">{t.home.history.eyebrow}</p>
                            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
                                {t.home.history.heading}
                            </h2>
                            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">{t.home.history.paragraph1}</p>
                            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">{t.home.history.paragraph2}</p>

                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                {t.home.history.stats.map((stat, index) => (
                                    <div key={stat.label} className="rounded-lg border border-slate-200 bg-bayan-mist p-4">
                                        <p className={`text-2xl font-black ${HISTORY_STAT_COLORS[index]}`}>{stat.value}</p>
                                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/explore/history"
                                className="mt-6 inline-flex items-center gap-2 rounded-md bg-bayan-blue px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                            >
                                {historyPageCopy[lang].homeCta} <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-bayan-mist p-5 sm:p-6">
                            <div className="space-y-5">
                                {t.home.history.timeline.map((item, index) => {
                                    const Icon = TIMELINE_ICONS[index]
                                    const colors = TIMELINE_COLORS[index]
                                    return (
                                        <article key={item.title} className="grid gap-4 rounded-lg bg-white p-5 shadow-sm sm:grid-cols-[auto_1fr]">
                                            <span className={`grid h-12 w-12 place-items-center rounded-md ${colors.bg} ${colors.text}`}>
                                                <Icon className="h-6 w-6" />
                                            </span>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">{item.eyebrow}</p>
                                                <h3 className="mt-1 text-xl font-black">{item.title}</h3>
                                                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-lg bg-bayan-ink p-4 text-white">
                                    <MapPinned className="h-5 w-5 shrink-0 text-bayan-gold" />
                                    <span className="text-sm font-bold">{t.home.history.notes[0]}</span>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg bg-bayan-ink p-4 text-white">
                                    <Landmark className="h-5 w-5 shrink-0 text-bayan-gold" />
                                    <span className="text-sm font-bold">{t.home.history.notes[1]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage
