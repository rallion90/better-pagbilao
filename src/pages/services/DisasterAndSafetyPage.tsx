import {
    AlertTriangle,
    CircleCheck,
    Flame,
    Landmark,
    PhoneCall,
    Shield,
    ShieldCheck,
    Siren,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useServices } from "../../hooks/useServices"
import { useSeo } from "../../hooks/useSeo"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import OfficeMap, { type OfficeMapMarker } from "../../components/common/OfficeMap"
import type { DisasterServiceCategory } from "../../types/services"

const PAGE_PATH = "/services/disaster-and-safety"

type Agency = "MDRRMO" | "PNP" | "BFP"

const AGENCY_META: Record<Agency, { Icon: LucideIcon; badgeColor: string; pinColor: string }> = {
    MDRRMO: { Icon: Siren, badgeColor: "text-bayan-red bg-red-50", pinColor: "#d92d20" },
    PNP: { Icon: Shield, badgeColor: "text-bayan-blue bg-blue-50", pinColor: "#155eef" },
    BFP: { Icon: Flame, badgeColor: "text-amber-700 bg-amber-50", pinColor: "#b45309" },
}

function detectAgency(name: string): Agency {
    if (name.includes("MDRRMO") || name.includes("Disaster")) return "MDRRMO"
    if (name.includes("PNP") || name.includes("Police")) return "PNP"
    return "BFP"
}

function toTelHref(telephone: string) {
    return `tel:${telephone.replace(/[^0-9]/g, "")}`
}

const DisasterAndSafetyPage = () => {
    const { t } = useLanguage()
    const { data, loading, error } = useServices()
    const copy = t.services.disasterAndSafety
    const disaster = data?.categories.find(
        (category): category is DisasterServiceCategory => category.id === "disaster-and-safety",
    )

    const title = `${copy.heading} | Better Pagbilao Services`
    const description =
        "Emergency hotlines and office locations for Pagbilao's MDRRMO, PNP, and BFP, plus typical disaster response, police, and fire services and how to avail of each."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd: disaster
            ? {
                  "@context": "https://schema.org",
                  "@graph": disaster.confirmed.offices.map((office) => {
                      const agency = detectAgency(office.name)
                      const schemaType = agency === "PNP" ? "PoliceStation" : agency === "BFP" ? "FireStation" : "GovernmentOrganization"
                      return {
                          "@type": schemaType,
                          name: office.name,
                          telephone: office.telephone,
                          address: {
                              "@type": "PostalAddress",
                              streetAddress: office.address,
                              addressLocality: disaster.municipality,
                              addressRegion: disaster.province,
                              addressCountry: "PH",
                          },
                          geo: {
                              "@type": "GeoCoordinates",
                              latitude: office.coordinates.latitude,
                              longitude: office.coordinates.longitude,
                          },
                      }
                  }),
              }
            : undefined,
    })

    const mapMarkers: OfficeMapMarker[] = disaster
        ? disaster.confirmed.offices.map((office) => {
              const agency = detectAgency(office.name)
              return {
                  id: office.name,
                  name: office.name,
                  telephone: office.telephone,
                  address: office.address,
                  color: AGENCY_META[agency].pinColor,
                  position: [office.coordinates.latitude, office.coordinates.longitude],
              }
          })
        : []

    return (
        <>
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb
                        items={[
                            { label: t.services.breadcrumbHome, to: "/" },
                            { label: t.services.breadcrumbServices },
                            { label: copy.heading },
                        ]}
                    />
                    <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.eyebrow}</p>
                    <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{copy.heading}</h1>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-white/76">{copy.intro}</p>
                </div>
            </section>

            <section className="bg-white py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    {loading && <p className="text-sm font-semibold text-slate-500">Loading disaster and safety services…</p>}
                    {error && (
                        <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            Could not load disaster and safety services right now. Please try again later.
                        </p>
                    )}

                    {disaster && (
                        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-5">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                            <p className="text-sm leading-6 font-semibold text-amber-900">{disaster.dataConfidence}</p>
                        </div>
                    )}
                </div>
            </section>

            {disaster && (
                <section className="bg-bayan-red py-14 text-white sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-white/72">{copy.hotlinesLabel}</p>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            {disaster.confirmed.emergencyHotlines.map((hotline) => {
                                const agency = detectAgency(hotline.agency)
                                const Icon = AGENCY_META[agency].Icon
                                return (
                                    <a
                                        key={hotline.agency}
                                        href={toTelHref(hotline.telephone)}
                                        className="rounded-lg bg-white p-5 text-bayan-ink shadow-soft"
                                    >
                                        <Icon className={`h-7 w-7 ${AGENCY_META[agency].badgeColor.split(" ")[0]}`} />
                                        <p className="mt-4 text-sm font-black text-slate-500">{hotline.agency}</p>
                                        <p className="mt-1 text-2xl font-black">{hotline.telephone}</p>
                                        {hotline.alternateTelephone && (
                                            <p className="mt-0.5 text-xs font-semibold text-slate-500">or {hotline.alternateTelephone}</p>
                                        )}
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {disaster && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.officesLabel}</h2>
                        <div className="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                            <div className="space-y-4">
                                {disaster.confirmed.offices.map((office) => {
                                    const agency = detectAgency(office.name)
                                    const Icon = AGENCY_META[agency].Icon
                                    return (
                                        <article key={office.name} className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-5">
                                            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${AGENCY_META[agency].badgeColor}`}>
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-base font-black">{office.name}</p>
                                                <p className="mt-1 text-sm font-semibold text-slate-600">{office.head}</p>
                                                <p className="mt-1 text-sm text-slate-600">{office.address}</p>
                                                <a href={toTelHref(office.telephone)} className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-bayan-blue">
                                                    <PhoneCall className="h-4 w-4" /> {office.telephone}
                                                </a>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>

                            <div className="overflow-hidden rounded-lg border border-slate-200 shadow-soft">
                                <div className="h-80 w-full sm:h-96">
                                    <OfficeMap markers={mapMarkers} />
                                </div>
                                <div className="bg-bayan-ink px-4 py-2 text-xs font-semibold text-white/60">
                                    Map data © OpenStreetMap contributors — pins approximate the building footprint, not an official LGU-published location.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {disaster && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.servicesLabel}</h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{disaster.typicalServices.note}</p>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {disaster.typicalServices.categories.map((service) => {
                                const agency = detectAgency(service.office)
                                const Icon = AGENCY_META[agency].Icon
                                const isFree = service.typicalFee.toLowerCase().startsWith("free")
                                return (
                                    <article
                                        key={service.category}
                                        className="flex flex-col rounded-lg border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`grid h-11 w-11 place-items-center rounded-md ${AGENCY_META[agency].badgeColor}`}>
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <span className="text-xs font-black uppercase tracking-[0.08em] text-slate-400">{service.office}</span>
                                        </div>
                                        <h3 className="mt-4 text-base font-black">{service.category}</h3>
                                        <ul className="mt-3 space-y-1.5 text-sm leading-5 text-slate-600">
                                            {service.typicalCoverage.map((item) => (
                                                <li key={item} className="flex items-start gap-2">
                                                    <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bayan-green" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        {service.typicalRequirements && (
                                            <div className="mt-3 border-t border-slate-100 pt-3">
                                                <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">Bring</p>
                                                <ul className="mt-1.5 space-y-1 text-xs leading-5 text-slate-500">
                                                    {service.typicalRequirements.map((item) => (
                                                        <li key={item}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <span
                                            className={`mt-4 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-black ${
                                                isFree ? "bg-emerald-50 text-bayan-green" : "bg-amber-50 text-amber-700"
                                            }`}
                                        >
                                            {service.typicalFee}
                                        </span>
                                    </article>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {disaster && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-bayan-red">{copy.emergencyStepsLabel}</h2>
                                <div className="mt-4 space-y-3 rounded-lg border border-red-200 bg-red-50/60 p-5">
                                    {disaster.howToAvail.emergencySteps.map((step, index) => (
                                        <div key={step} className="flex items-start gap-3">
                                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-bayan-red text-xs font-black text-white">
                                                {index + 1}
                                            </span>
                                            <p className="text-sm leading-6 text-slate-700">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-bayan-blue">{copy.nonEmergencyStepsLabel}</h2>
                                <div className="mt-4 space-y-3 rounded-lg border border-blue-200 bg-blue-50/60 p-5">
                                    {disaster.howToAvail.nonEmergencySteps.map((step, index) => (
                                        <div key={step} className="flex items-start gap-3">
                                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-bayan-blue text-xs font-black text-white">
                                                {index + 1}
                                            </span>
                                            <p className="text-sm leading-6 text-slate-700">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 text-sm font-semibold leading-6 text-slate-600">{disaster.howToAvail.hoursNote}</p>
                    </div>
                </section>
            )}

            {disaster && (
                <section className="bg-bayan-ink py-14 text-white sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.verificationLabel}</p>
                                <p className="mt-4 text-base leading-8 text-white/76">{disaster.verificationGuide.recommendation}</p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    {disaster.confirmed.offices.map((office) => (
                                        <a
                                            key={office.name}
                                            href={toTelHref(office.telephone)}
                                            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-black text-bayan-ink shadow-soft"
                                        >
                                            <PhoneCall className="h-4 w-4 text-bayan-blue" /> {office.telephone}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                {disaster.verificationGuide.howToConfirm.map((item) => (
                                    <div key={item} className="flex items-start gap-3 rounded-lg bg-white/8 p-4 ring-1 ring-white/12">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                                        <p className="text-sm leading-6 text-white/84">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm font-semibold text-white/60">
                            <Landmark className="h-4 w-4 text-bayan-gold" />
                            Sources: {disaster.confirmed.sources.map((source) => source.name).join(" · ")}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

export default DisasterAndSafetyPage
