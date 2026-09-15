import {
    Bus,
    Compass,
    Landmark,
    MapPin,
    Milestone,
    Mountain,
    Navigation,
    Route,
    TreePine,
    Waves,
} from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useSiteData } from "../../hooks/useSiteData"
import { useNearbyPlaces } from "../../hooks/useNearbyPlaces"
import { useTouristDestinations } from "../../hooks/useTouristDestinations"
import { useSeo } from "../../hooks/useSeo"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"

const PAGE_PATH = "/explore/gateway-location"

const TOPOGRAPHY_ICONS = [Landmark, Waves, Route, TreePine]
const TOPOGRAPHY_COLORS = ["text-bayan-blue bg-blue-50", "text-bayan-green bg-emerald-50", "text-amber-700 bg-amber-50", "text-bayan-red bg-red-50"]

const GatewayLocationPage = () => {
    const { t } = useLanguage()
    const { data: siteData, loading: siteLoading, error: siteError } = useSiteData()
    const { data: places, loading: placesLoading, error: placesError } = useNearbyPlaces()
    const { data: destinations, loading: destinationsLoading, error: destinationsError } = useTouristDestinations()
    const copy = t.explore.gatewayLocation

    const loading = siteLoading || placesLoading || destinationsLoading
    const error = siteError || placesError || destinationsError

    const grandeIsland = destinations?.destinations.find((d) => d.id === "pagbilao-grande-island")
    const protectedLandscape = destinations?.destinations.find((d) => d.id === "quezon-protected-landscape-nearby")

    const title = `${copy.heading} | Better Pagbilao`
    const description =
        "Pagbilao's gateway location between Lucena City, the Bondoc Peninsula, and the Bicol Region — bordering towns, major roads, and how to get there."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd:
            places && siteData
                ? {
                      "@context": "https://schema.org",
                      "@type": "Place",
                      name: "Pagbilao, Quezon",
                      geo: {
                          "@type": "GeoCoordinates",
                          latitude: places.profile.coordinates.latitude,
                          longitude: places.profile.coordinates.longitude,
                      },
                      description: siteData.about.geography.description,
                      mainEntityOfPage: `https://betterpagbilao.org${PAGE_PATH}`,
                  }
                : undefined,
    })

    const quickFacts = places
        ? [
              { label: "From Lucena City", value: "8 km", caption: "Provincial capital of Quezon", Icon: Navigation, accent: "bg-bayan-blue", iconBg: "bg-blue-50", iconColor: "text-bayan-blue" },
              { label: "Land Area", value: `${places.profile.areaSquareKm.toLocaleString()} km²`, caption: "Total municipal area", Icon: Compass, accent: "bg-bayan-green", iconBg: "bg-emerald-50", iconColor: "text-bayan-green" },
              { label: "Elevation", value: `${places.profile.estimatedElevationMeters} m`, caption: "Estimated average elevation", Icon: Mountain, accent: "bg-amber-500", iconBg: "bg-amber-50", iconColor: "text-amber-700" },
              { label: "Region", value: "CALABARZON", caption: "Region IV-A, Luzon", Icon: MapPin, accent: "bg-bayan-red", iconBg: "bg-red-50", iconColor: "text-bayan-red" },
          ]
        : []

    return (
        <>
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb
                        items={[
                            { label: t.explore.breadcrumbHome, to: "/" },
                            { label: t.explore.breadcrumbExplore },
                            { label: copy.heading },
                        ]}
                    />
                    <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.eyebrow}</p>
                    <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{copy.heading}</h1>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-white/76">{copy.intro}</p>
                </div>
            </section>

            {loading && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <p className="text-sm font-semibold text-slate-500">Loading gateway location details…</p>
                    </div>
                </section>
            )}
            {error && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            Could not load gateway location details right now. Please try again later.
                        </p>
                    </div>
                </section>
            )}

            {places && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.quickFactsLabel}</h2>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {quickFacts.map((fact) => (
                                <article key={fact.label} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <span className={`absolute inset-x-0 top-0 h-1 ${fact.accent}`} />
                                    <span className={`grid h-11 w-11 place-items-center rounded-xl ${fact.iconBg} ${fact.iconColor}`}>
                                        <fact.Icon className="h-5 w-5" />
                                    </span>
                                    <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">{fact.label}</p>
                                    <p className="mt-1 text-2xl font-black text-bayan-ink">{fact.value}</p>
                                    <p className="mt-1 text-xs font-semibold text-slate-400">{fact.caption}</p>
                                </article>
                            ))}
                        </div>

                        {siteData && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {siteData.about.topography.clusters.map((cluster, index) => {
                                    const Icon = TOPOGRAPHY_ICONS[index % TOPOGRAPHY_ICONS.length]
                                    return (
                                        <span
                                            key={cluster}
                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${TOPOGRAPHY_COLORS[index % TOPOGRAPHY_COLORS.length]}`}
                                        >
                                            <Icon className="h-3.5 w-3.5" /> {cluster}
                                        </span>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {places && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.borderingPlacesLabel}</h2>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {places.borderingPlaces.map((place) => (
                                <article key={place.name} className="rounded-lg border border-slate-200 bg-bayan-mist p-5">
                                    <span className="text-xs font-black uppercase tracking-[0.1em] text-bayan-blue">{place.direction}</span>
                                    <p className="mt-2 text-lg font-black">{place.name}</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-500">{place.type}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {places && siteData && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.gettingThereLabel}</h2>
                        <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:items-start">
                            <div className="space-y-3">
                                {places.transportationNotes.map((note) => (
                                    <div key={note} className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
                                        <Bus className="mt-0.5 h-5 w-5 shrink-0 text-bayan-blue" />
                                        <p className="text-sm leading-6 text-slate-700">{note}</p>
                                    </div>
                                ))}

                                <div className="rounded-lg bg-bayan-ink p-5 text-white">
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-bayan-gold">{copy.majorRoadsLabel}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {siteData.infrastructure.majorRoads.map((road) => (
                                            <span key={road} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold ring-1 ring-white/15">
                                                <Milestone className="h-3.5 w-3.5 text-bayan-gold" /> {road}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <figure className="overflow-hidden rounded-lg shadow-soft">
                                    <img
                                        src="/hero/maharlika-highway-pagbilao.jpg"
                                        alt="Maharlika Highway passing through Pagbilao, Quezon"
                                        loading="lazy"
                                        className="h-48 w-full object-cover"
                                    />
                                    <figcaption className="bg-bayan-ink px-3 py-2 text-xs font-semibold text-white/60">
                                        Maharlika Highway — Photo: Ralff Nestor Nacor, CC BY-SA 4.0
                                    </figcaption>
                                </figure>
                                <figure className="overflow-hidden rounded-lg shadow-soft">
                                    <img
                                        src="/hero/diversion-road-pagbilao.jpg"
                                        alt="Diversion Road in Pagbilao, Quezon"
                                        loading="lazy"
                                        className="h-48 w-full object-cover"
                                    />
                                    <figcaption className="bg-bayan-ink px-3 py-2 text-xs font-semibold text-white/60">
                                        Diversion Road — Photo: Ralff Nestor Nacor, CC BY-SA 4.0
                                    </figcaption>
                                </figure>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {places && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.nearbyPlacesLabel}</h2>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {places.nearbyUsefulPlaces.map((place) => (
                                <article key={place.name} className="rounded-lg border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
                                    <span className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-bayan-blue">
                                        <MapPin className="h-5 w-5" />
                                    </span>
                                    <p className="mt-4 text-base font-black">{place.name}</p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.06em] text-slate-500">{place.type}</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{place.note}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {(grandeIsland || protectedLandscape) && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.tourismTeaserLabel}</h2>
                        <div className="mt-5 grid gap-6 lg:grid-cols-2">
                            {grandeIsland && (
                                <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                    <img
                                        src="/hero/pagbilao-grande-island.jpg"
                                        alt="Aerial view of Pagbilao Grande Island and Tayabas Bay"
                                        loading="lazy"
                                        className="h-56 w-full object-cover"
                                    />
                                    <div className="p-5">
                                        <p className="text-lg font-black">{grandeIsland.name}</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">{grandeIsland.description}</p>
                                        <p className="mt-3 text-xs font-semibold text-slate-400">Photo: Patrickroque01 via Wikimedia Commons, CC BY-SA 4.0</p>
                                    </div>
                                </article>
                            )}
                            {protectedLandscape && (
                                <article className="flex flex-col justify-center rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                    <span className="grid h-11 w-11 place-items-center rounded-md bg-emerald-50 text-bayan-green">
                                        <TreePine className="h-5 w-5" />
                                    </span>
                                    <p className="mt-4 text-lg font-black">{protectedLandscape.name}</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{protectedLandscape.description}</p>
                                </article>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {places && (
                <section className="bg-bayan-ink py-10 text-white">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <p className="flex flex-wrap items-center gap-3 text-sm font-semibold text-white/60">
                            <Landmark className="h-4 w-4 text-bayan-gold" />
                            Sources: {places.sources.map((source) => source.name).join(" · ")}
                        </p>
                    </div>
                </section>
            )}
        </>
    )
}

export default GatewayLocationPage
