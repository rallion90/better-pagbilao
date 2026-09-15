import {
    AlertTriangle,
    Beef,
    ClipboardCheck,
    ClipboardList,
    Coins,
    Fish,
    GraduationCap,
    Handshake,
    Landmark,
    PhoneCall,
    ShieldCheck,
    Sprout,
    Store,
    Tractor,
    Umbrella,
    Wheat,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useServices } from "../../hooks/useServices"
import { useSeo } from "../../hooks/useSeo"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import OfficeMap, { type OfficeMapMarker } from "../../components/common/OfficeMap"
import type { AgricultureServiceCategory } from "../../types/services"

const PAGE_PATH = "/services/agriculture-and-livelihood"

type Office = "MAO" | "Negosyo Center"

const OFFICE_META: Record<Office, { badgeColor: string; pinColor: string }> = {
    MAO: { badgeColor: "text-bayan-green bg-emerald-50", pinColor: "#12805c" },
    "Negosyo Center": { badgeColor: "text-bayan-blue bg-blue-50", pinColor: "#155eef" },
}

function detectOffice(name: string): Office {
    return name.includes("Negosyo Center") ? "Negosyo Center" : "MAO"
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    "Agricultural Extension Services": Sprout,
    "RSBSA Registration": ClipboardList,
    "Seedling and Input Distribution": Wheat,
    "Livestock and Veterinary Services": Beef,
    "Fisheries Support": Fish,
    "Farm Machinery Assistance": Tractor,
    "Crop Insurance Referral": Umbrella,
    "Cooperative Development Assistance": Handshake,
    "Business Name Registration Assistance": Store,
    "Livelihood Seed Capital / Negosyo Kits": Coins,
    "Business Counseling and Mentoring": GraduationCap,
}

function toTelHref(telephone: string) {
    return `tel:${telephone.replace(/[^0-9]/g, "")}`
}

const AgricultureAndLivelihoodPage = () => {
    const { t } = useLanguage()
    const { data, loading, error } = useServices()
    const copy = t.services.agricultureAndLivelihood
    const agri = data?.categories.find(
        (category): category is AgricultureServiceCategory => category.id === "agriculture-and-livelihood",
    )

    const title = `${copy.heading} | Better Pagbilao Services`
    const description =
        "Agriculture and livelihood programs in Pagbilao: farmer and fisherfolk registration (RSBSA), seedling distribution, veterinary services, and DTI Negosyo Center business support."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd: agri
            ? {
                  "@context": "https://schema.org",
                  "@graph": agri.confirmed.offices.map((office) => ({
                      "@type": "GovernmentOrganization",
                      name: office.name,
                      telephone: office.telephone ?? undefined,
                      address: {
                          "@type": "PostalAddress",
                          streetAddress: office.address,
                          addressLocality: agri.municipality,
                          addressRegion: agri.province,
                          addressCountry: "PH",
                      },
                      geo: {
                          "@type": "GeoCoordinates",
                          latitude: office.coordinates.latitude,
                          longitude: office.coordinates.longitude,
                      },
                  })),
              }
            : undefined,
    })

    const mapMarkers: OfficeMapMarker[] = agri
        ? agri.confirmed.offices.map((office) => {
              const officeType = detectOffice(office.name)
              return {
                  id: office.name,
                  name: office.name,
                  telephone: office.telephone ?? "No published phone — visit in person",
                  address: office.address,
                  color: OFFICE_META[officeType].pinColor,
                  position: [office.coordinates.latitude, office.coordinates.longitude],
              }
          })
        : []

    const profile = agri?.confirmed.agriculturalProfile
    const profileStats = profile
        ? [
              { label: "Agricultural Land", value: `${profile.agriculturalLandPercentOfTotalLand}%`, caption: `${profile.agriculturalLandHectares.toLocaleString()} ha of total land` },
              { label: "Coconut Area", value: `${profile.coconutCropAreaHectares.toLocaleString()} ha`, caption: "Under coconut cultivation" },
              { label: "Irrigated Rice", value: `${profile.irrigatedLowlandRiceHectares.toLocaleString()} ha`, caption: "Lowland irrigated rice fields" },
              { label: "Fishponds", value: `${profile.fishpondsAndBreakwatersHectares.toLocaleString()} ha`, caption: "Fishponds and breakwaters" },
          ]
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
                    {loading && <p className="text-sm font-semibold text-slate-500">Loading agriculture and livelihood services…</p>}
                    {error && (
                        <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            Could not load agriculture and livelihood services right now. Please try again later.
                        </p>
                    )}

                    {agri && (
                        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-5">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                            <p className="text-sm leading-6 font-semibold text-amber-900">{agri.dataConfidence}</p>
                        </div>
                    )}
                </div>
            </section>

            {profile && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.profileLabel}</h2>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {profileStats.map((stat) => (
                                <article key={stat.label} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <span className="absolute inset-x-0 top-0 h-1 bg-bayan-green" />
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{stat.label}</p>
                                    <p className="mt-1.5 text-2xl font-black tabular-nums text-bayan-ink">{stat.value}</p>
                                    <p className="mt-1 text-xs font-semibold text-slate-400">{stat.caption}</p>
                                </article>
                            ))}
                        </div>
                        <p className="mt-4 text-xs font-semibold text-slate-500">
                            Main industries: {profile.mainIndustries.join(", ")}
                        </p>
                    </div>
                </section>
            )}

            {agri && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.officesLabel}</h2>
                        <div className="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                            <div className="space-y-4">
                                {agri.confirmed.offices.map((office) => {
                                    const officeType = detectOffice(office.name)
                                    const Icon = officeType === "MAO" ? Wheat : Store
                                    return (
                                        <article key={office.name} className="flex items-start gap-4 rounded-lg border border-slate-200 bg-bayan-mist p-5">
                                            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${OFFICE_META[officeType].badgeColor}`}>
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-base font-black">{office.name}</p>
                                                <p className="mt-1 text-sm font-semibold text-slate-600">{office.head}</p>
                                                <p className="mt-1 text-sm text-slate-600">{office.address}</p>
                                                {office.telephone ? (
                                                    <a href={toTelHref(office.telephone)} className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-bayan-blue">
                                                        <PhoneCall className="h-4 w-4" /> {office.telephone}
                                                    </a>
                                                ) : (
                                                    <p className="mt-2 text-sm font-semibold text-slate-500">No published phone — visit in person</p>
                                                )}
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
                                    Map data © OpenStreetMap contributors — both offices share the Sentrong Pangkabuhayan Building.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {agri && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.servicesLabel}</h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{agri.typicalServices.note}</p>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {agri.typicalServices.categories.map((service) => {
                                const officeType: Office = service.office === "Negosyo Center" ? "Negosyo Center" : "MAO"
                                const Icon = CATEGORY_ICONS[service.category] ?? Sprout
                                const isFree = service.typicalFee.toLowerCase().startsWith("free")
                                return (
                                    <article
                                        key={service.category}
                                        className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`grid h-11 w-11 place-items-center rounded-md ${OFFICE_META[officeType].badgeColor}`}>
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <span className="text-xs font-black uppercase tracking-[0.08em] text-slate-400">{service.office}</span>
                                        </div>
                                        <h3 className="mt-4 text-base font-black">{service.category}</h3>
                                        <ul className="mt-3 space-y-1.5 text-sm leading-5 text-slate-600">
                                            {service.typicalCoverage.map((item) => (
                                                <li key={item} className="flex items-start gap-2">
                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bayan-green" />
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

            {agri && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.howToAvailLabel}</h2>
                                <div className="mt-5 space-y-4">
                                    {agri.howToAvail.generalSteps.map((step, index) => (
                                        <div key={step} className="flex items-start gap-4 rounded-lg bg-bayan-mist p-4">
                                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-sm font-black text-bayan-green">
                                                {index + 1}
                                            </span>
                                            <p className="text-sm leading-6 text-slate-700">{step}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-5 text-sm font-semibold leading-6 text-slate-600">{agri.howToAvail.hoursNote}</p>
                            </div>

                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.requirementsLabel}</h2>
                                <div className="mt-5 rounded-lg border border-slate-200 bg-bayan-mist p-5">
                                    <ul className="space-y-3">
                                        {agri.howToAvail.commonRequirements.map((item) => (
                                            <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                                                <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-bayan-green" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {agri && (
                <section className="bg-bayan-ink py-14 text-white sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.verificationLabel}</p>
                                <p className="mt-4 text-base leading-8 text-white/76">{agri.verificationGuide.recommendation}</p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    {agri.confirmed.offices
                                        .filter((office) => office.telephone)
                                        .map((office) => (
                                            <a
                                                key={office.name}
                                                href={toTelHref(office.telephone as string)}
                                                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-black text-bayan-ink shadow-soft"
                                            >
                                                <PhoneCall className="h-4 w-4 text-bayan-blue" /> {office.telephone}
                                            </a>
                                        ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                {agri.verificationGuide.howToConfirm.map((item) => (
                                    <div key={item} className="flex items-start gap-3 rounded-lg bg-white/8 p-4 ring-1 ring-white/12">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                                        <p className="text-sm leading-6 text-white/84">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm font-semibold text-white/60">
                            <Landmark className="h-4 w-4 text-bayan-gold" />
                            Sources: {agri.confirmed.sources.map((source) => source.name).join(" · ")}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

export default AgricultureAndLivelihoodPage
