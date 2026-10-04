import { ArrowRight, Info, MapPin } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import DestinationPhoto from "../../components/explore/DestinationPhoto"
import { DESTINATION_FILTERS, DESTINATIONS_PATH } from "../../data/touristDestinations"
import type { TouristSpot } from "../../data/touristDestinations"
import { useSeo } from "../../hooks/useSeo"
import { useTouristGuide } from "../../hooks/useTouristGuide"
import { touristDestinationsCopy } from "../../i18n/touristDestinations"
import type { TouristDestinationsCopy } from "../../i18n/touristDestinations"
import { useLanguage } from "../../i18n/useLanguage"

const SITE_URL = "https://betterpagbilao.org"

const DestinationCard = ({ spot, copy }: { spot: TouristSpot; copy: TouristDestinationsCopy }) => {
    const href = `${DESTINATIONS_PATH}/${spot.slug}`
    return (
        <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-soft">
            <DestinationPhoto spot={spot} className="h-48 w-full" placeholderLabel={copy.noPhoto} />
            <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{spot.categories.slice(0, 2).join(" · ")}</p>
                <h2 className="mt-1 text-lg font-black leading-6">
                    <Link to={href} className="hover:text-bayan-blue hover:underline">
                        {spot.name}
                    </Link>
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{spot.description}</p>
                <p className="mt-4 flex items-start gap-2 text-xs font-bold text-slate-500">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{spot.nearby ? copy.nearbyBadge : spot.area ? `${spot.area}, Pagbilao` : "Pagbilao, Quezon"}</span>
                </p>
                <div className="mt-auto pt-4">
                    <Link to={href} className="inline-flex items-center gap-1 border-t border-slate-100 pt-4 text-sm font-bold text-bayan-ink hover:gap-2 hover:text-bayan-blue">
                        {copy.viewDetails} <ArrowRight className="h-4 w-4 transition-all" />
                    </Link>
                </div>
            </div>
        </article>
    )
}

const TouristDestinationsPage = () => {
    const { lang, t } = useLanguage()
    const copy = touristDestinationsCopy[lang]
    const { spots, sources } = useTouristGuide()
    const [filter, setFilter] = useState("all")
    const filters = DESTINATION_FILTERS.filter((category) => spots.some((spot) => spot.categories.includes(category)))

    useSeo({
        title: "Tourist Destinations in Pagbilao, Quezon | Better Pagbilao",
        description:
            "Tourist spots in Pagbilao, Quezon: Pagbilao Grande Island, Palsabangon Falls, Patayan Island, Binahaan Dam, Pagbilao Bay, and heritage sites, with things to do and visitor tips.",
        path: DESTINATIONS_PATH,
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Tourist destinations in Pagbilao, Quezon",
            itemListElement: spots.map((spot, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE_URL}${DESTINATIONS_PATH}/${spot.slug}`,
                name: spot.name,
            })),
        },
    })

    const visible = spots.filter((spot) => filter === "all" || spot.categories.includes(filter))

    return (
        <>
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb items={[{ label: t.explore.breadcrumbHome, to: "/" }, { label: t.explore.breadcrumbExplore }, { label: copy.breadcrumb }]} />
                    <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.eyebrow}</p>
                    <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-normal sm:text-4xl lg:text-5xl lg:leading-[1.1]">{copy.heading}</h1>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-white/76">{copy.intro}</p>
                </div>
            </section>

            <section className="bg-white py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-2" role="group" aria-label={copy.filterLabel}>
                        {["all", ...filters].map((option) => {
                            const active = filter === option
                            return (
                                <button
                                    key={option}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => setFilter(option)}
                                    className={`rounded-full px-3.5 py-1.5 text-xs font-black transition ${
                                        active ? "bg-bayan-ink text-white" : "bg-bayan-mist text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                    {option === "all" ? copy.allFilter : option}
                                </button>
                            )
                        })}
                    </div>

                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-slate-500" aria-live="polite">
                        {copy.count(visible.length)}
                    </p>

                    <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {visible.map((spot) => (
                            <DestinationCard key={spot.slug} spot={spot} copy={copy} />
                        ))}
                    </div>

                    <div className="mt-10 flex items-start gap-4 rounded-lg border border-amber-200 bg-amber-50 p-5">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                        <div>
                            <h2 className="text-sm font-black text-bayan-ink">{copy.verifyHeading}</h2>
                            <p className="mt-1 text-sm leading-6 text-slate-700">{copy.verifyBody}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-bayan-ink py-10 text-white">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <p className="text-sm font-semibold leading-7 text-white/60">
                        {copy.sourcesLabel}:{" "}
                        {sources.map((source, index) => (
                            <span key={source.url}>
                                {index > 0 && " · "}
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
                                    {source.name}
                                </a>
                            </span>
                        ))}
                    </p>
                </div>
            </section>
        </>
    )
}

export default TouristDestinationsPage
