import { ArrowLeft, ArrowRight, Calendar, Check, Info, LoaderCircle, MapPin, Navigation, PhoneCall, SearchX, Wallet } from "lucide-react"
import { Link, useParams } from "react-router"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import DestinationPhoto from "../../components/explore/DestinationPhoto"
import { DESTINATIONS_PATH, findTouristSpot, mapsHref, relatedTouristSpots, TOURISM_OFFICE } from "../../data/touristDestinations"
import type { TouristSpot } from "../../data/touristDestinations"
import { useSeo } from "../../hooks/useSeo"
import { useTouristGuide } from "../../hooks/useTouristGuide"
import { touristDestinationsCopy } from "../../i18n/touristDestinations"
import { useLanguage } from "../../i18n/useLanguage"
import { telHref } from "../../lib/businessApi"
import { destinationCategoryMeta } from "../../lib/destinationCategories"

const SITE_URL = "https://betterpagbilao.org"

function placeLabel(spot: TouristSpot): string {
    if (spot.nearby) return "Quezon Province"
    return spot.area && spot.area !== "Municipality-wide" ? `${spot.area}, Pagbilao, Quezon` : "Pagbilao, Quezon"
}

const TouristDestinationDetailPage = () => {
    const { lang, t } = useLanguage()
    const copy = touristDestinationsCopy[lang]
    const { slug = "" } = useParams()
    const { spots, sources, settled } = useTouristGuide()
    const spot = findTouristSpot(spots, slug)

    // Keyword-rich on purpose: the place name plus "Pagbilao, Quezon" is what visitors search for.
    const title = spot ? `${spot.name}${spot.nearby ? " near" : " in"} Pagbilao, Quezon | Better Pagbilao` : `${copy.breadcrumb} | Better Pagbilao`
    const description = spot
        ? `${spot.description} Things to do: ${spot.activities.join(", ").toLowerCase()}. Visitor tips and what to confirm before you go.`
        : "Tourist destinations in Pagbilao, Quezon."
    const path = `${DESTINATIONS_PATH}/${slug}`

    useSeo({
        title,
        description,
        path,
        // Not in the snapshot and the API has not answered yet: it may still be a newly added destination.
        noindex: !spot && settled,
        jsonLd: spot
            ? {
                  "@context": "https://schema.org",
                  "@type": "TouristAttraction",
                  "@id": `${SITE_URL}${path}`,
                  name: spot.name,
                  description: spot.description,
                  url: `${SITE_URL}${path}`,
                  touristType: spot.bestFor,
                  address: {
                      "@type": "PostalAddress",
                      ...(spot.nearby ? {} : { addressLocality: "Pagbilao" }),
                      addressRegion: "Quezon",
                      addressCountry: "PH",
                  },
                  ...(spot.image ? { image: new URL(spot.image.src, SITE_URL).href } : {}),
              }
            : undefined,
    })

    if (!spot) {
        const pending = !settled
        return (
            <section className="bg-bayan-ink py-20 text-white sm:py-28">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb items={[{ label: t.explore.breadcrumbHome, to: "/" }, { label: t.explore.breadcrumbExplore }, { label: copy.breadcrumb, to: DESTINATIONS_PATH }]} />
                    <div className="mx-auto mt-10 max-w-2xl text-center">
                        <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white/10 text-bayan-gold ring-1 ring-white/15">
                            {pending ? <LoaderCircle className="h-9 w-9 animate-spin" /> : <SearchX className="h-9 w-9" />}
                        </span>
                        <h1 className="mt-5 text-3xl font-black sm:text-4xl">{pending ? copy.detail.loading : copy.detail.notFoundHeading}</h1>
                        {!pending && <p className="mt-4 text-base leading-8 text-white/76">{copy.detail.notFoundBody}</p>}
                        <Link
                            to={DESTINATIONS_PATH}
                            className="mt-8 inline-flex items-center gap-2 rounded-md bg-bayan-gold px-5 py-3 text-sm font-black text-bayan-ink transition hover:bg-amber-400"
                        >
                            <ArrowLeft className="h-4 w-4" /> {copy.detail.back}
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    const { Icon, color } = destinationCategoryMeta(spot.categories)
    const related = relatedTouristSpots(spots, spot)
    const officeTel = telHref(TOURISM_OFFICE.telephone)
    const sectionHeading = "text-sm font-black uppercase tracking-[0.16em] text-slate-500"

    return (
        <>
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb
                        items={[
                            { label: t.explore.breadcrumbHome, to: "/" },
                            { label: t.explore.breadcrumbExplore },
                            { label: copy.breadcrumb, to: DESTINATIONS_PATH },
                            { label: spot.name },
                        ]}
                    />
                    <div className="mt-8 flex flex-wrap items-center gap-5">
                        <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${color}`}>
                            <Icon className="h-7 w-7" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-black uppercase tracking-[0.14em] text-bayan-gold">{spot.categories.join(" · ")}</p>
                            <h1 className="mt-1 text-3xl font-black tracking-normal sm:text-4xl">{spot.name}</h1>
                        </div>
                    </div>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-white/76">{spot.description}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <a
                            href={mapsHref(spot)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-black text-bayan-ink shadow-soft"
                        >
                            <Navigation className="h-4 w-4 text-bayan-blue" /> {copy.detail.openMap}
                        </a>
                        {spot.nearby && <span className="rounded-md bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20">{copy.nearbyBadge}</span>}
                    </div>
                </div>
            </section>

            <section className="bg-white py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
                        <div className="space-y-10">
                            <DestinationPhoto key={spot.slug} spot={spot} className="h-72 w-full sm:h-96" showCredit lazy={false} />

                            {spot.activities.length > 0 && (
                                <div>
                                    <h2 className={sectionHeading}>{copy.detail.activitiesHeading}</h2>
                                    <ul className="mt-4 flex flex-wrap gap-2">
                                        {spot.activities.map((activity) => (
                                            <li key={activity} className="rounded-full bg-bayan-mist px-3.5 py-1.5 text-sm font-bold text-bayan-ink ring-1 ring-slate-200">
                                                {activity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {spot.bestFor.length > 0 && (
                                <div>
                                    <h2 className={sectionHeading}>{copy.detail.bestForHeading}</h2>
                                    <ul className="mt-4 flex flex-wrap gap-2">
                                        {spot.bestFor.map((audience) => (
                                            <li key={audience} className="rounded-full bg-blue-50 px-3.5 py-1.5 text-sm font-bold text-bayan-blue">
                                                {audience}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {spot.visitorTips.length > 0 && (
                                <div>
                                    <h2 className={sectionHeading}>{copy.detail.tipsHeading}</h2>
                                    <ul className="mt-4 space-y-3">
                                        {spot.visitorTips.map((tip) => (
                                            <li key={tip} className="flex items-start gap-3 text-base leading-7 text-slate-700">
                                                <Check className="mt-1 h-4 w-4 shrink-0 text-bayan-green" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {(spot.routes.length > 0 || spot.gettingThereNotes.length > 0) && (
                                <div>
                                    <h2 className={sectionHeading}>{copy.detail.gettingThereHeading}</h2>
                                    {spot.routes.map((route) => (
                                        <p key={route.from} className="mt-4 text-base leading-7 text-slate-700">
                                            <span className="font-black text-bayan-ink">{route.from}:</span> {route.directions}
                                        </p>
                                    ))}
                                    <ul className="mt-4 space-y-2">
                                        {spot.gettingThereNotes.map((note) => (
                                            <li key={note} className="flex items-start gap-3 text-base leading-7 text-slate-700">
                                                <Info className="mt-1 h-4 w-4 shrink-0 text-amber-700" />
                                                {note}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Sidebar: quick facts + who to ask */}
                        <div className="space-y-6 lg:sticky lg:top-36">
                            <div className="rounded-lg border border-slate-200 bg-white p-5">
                                <dl className="space-y-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bayan-blue" />
                                        <div>
                                            <dt className="text-xs font-black uppercase tracking-widest text-slate-400">{copy.detail.locationLabel}</dt>
                                            <dd className="mt-0.5 font-semibold text-slate-700">{placeLabel(spot)}</dd>
                                            {spot.nearby && <dd className="mt-1 text-xs font-semibold leading-5 text-slate-500">{copy.detail.nearbyNote}</dd>}
                                        </div>
                                    </div>
                                    {spot.dateLabel && (
                                        <div className="flex items-start gap-3">
                                            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-bayan-blue" />
                                            <div>
                                                <dt className="text-xs font-black uppercase tracking-widest text-slate-400">{copy.detail.whenLabel}</dt>
                                                <dd className="mt-0.5 font-semibold text-slate-700">{spot.dateLabel}</dd>
                                            </div>
                                        </div>
                                    )}
                                    {(spot.fees.length > 0 || spot.feesNote) && (
                                        <div className="flex items-start gap-3">
                                            <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-bayan-blue" />
                                            <div>
                                                <dt className="text-xs font-black uppercase tracking-widest text-slate-400">{copy.detail.feesHeading}</dt>
                                                {spot.fees.map((fee) => (
                                                    <dd key={fee} className="mt-0.5 font-black text-bayan-ink">
                                                        {fee}
                                                    </dd>
                                                ))}
                                                {spot.feesNote && <dd className="mt-0.5 font-semibold leading-6 text-slate-700">{spot.feesNote}</dd>}
                                            </div>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                                <h2 className="flex items-center gap-2 text-sm font-black text-bayan-ink">
                                    <Info className="h-4 w-4 text-amber-700" /> {copy.verifyHeading}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-700">{copy.verifyBody}</p>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-white p-5">
                                <h2 className={sectionHeading}>{copy.detail.officeHeading}</h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600">{copy.detail.officeBody}</p>
                                <p className="mt-3 text-sm font-black text-bayan-ink">{TOURISM_OFFICE.name}</p>
                                <p className="mt-1 text-sm leading-6 text-slate-600">{TOURISM_OFFICE.address}</p>
                                <div className="mt-4 flex flex-col items-start gap-2 text-sm font-bold text-bayan-blue">
                                    {officeTel && (
                                        <a href={officeTel} className="inline-flex items-center gap-2 hover:underline">
                                            <PhoneCall className="h-4 w-4" /> {TOURISM_OFFICE.telephone}
                                        </a>
                                    )}
                                    <a href={`mailto:${TOURISM_OFFICE.email}`} className="break-all hover:underline">
                                        {TOURISM_OFFICE.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {related.length > 0 && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-black sm:text-3xl">{copy.detail.relatedHeading}</h2>
                        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((other) => {
                                const meta = destinationCategoryMeta(other.categories)
                                return (
                                    <li key={other.slug}>
                                        <Link
                                            to={`${DESTINATIONS_PATH}/${other.slug}`}
                                            className="flex h-full items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
                                        >
                                            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${meta.color}`}>
                                                <meta.Icon className="h-5 w-5" />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-base font-black leading-6 text-bayan-ink">{other.name}</span>
                                                <span className="mt-1 block text-xs font-bold text-slate-500">{other.categories.slice(0, 2).join(" · ")}</span>
                                            </span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                        <Link to={DESTINATIONS_PATH} className="mt-8 inline-flex items-center gap-1 text-sm font-bold text-bayan-ink hover:gap-2 hover:text-bayan-blue">
                            {copy.detail.back} <ArrowRight className="h-4 w-4 transition-all" />
                        </Link>
                    </div>
                </section>
            )}

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

export default TouristDestinationDetailPage
