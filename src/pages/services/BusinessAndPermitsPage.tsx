import {
    AlertTriangle,
    ClipboardCheck,
    ExternalLink,
    FileCheck,
    FileImage,
    FileText,
    HardHat,
    Landmark,
    Map,
    MapPin,
    PhoneCall,
    Receipt,
    RefreshCw,
    ShieldCheck,
    Store,
    Wallet,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useServices } from "../../hooks/useServices"
import { useSeo } from "../../hooks/useSeo"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import type { BusinessAndPermitsCategory } from "../../types/services"

const PAGE_PATH = "/services/business-and-permits"

const OFFICE_ICONS: LucideIcon[] = [Wallet, HardHat, Map, Receipt]
const OFFICE_COLORS = [
    "text-bayan-blue bg-blue-50",
    "text-amber-700 bg-amber-50",
    "text-bayan-green bg-emerald-50",
    "text-bayan-red bg-red-50",
]

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    "New Business Permit (Mayor's Permit)": Store,
    "Business Permit Renewal": RefreshCw,
    "Locational Clearance": MapPin,
    "Zoning Certificate": Map,
    "Building Permit and Related Construction Permits": HardHat,
    "Real Property Tax and Assessment": Landmark,
    "Sanitary Permit": FileCheck,
    "Fire Safety Inspection Certificate (FSIC)": FileCheck,
}

function toTelHref(telephone: string) {
    return `tel:${telephone.replace(/[^0-9]/g, "")}`
}

const BusinessAndPermitsPage = () => {
    const { t } = useLanguage()
    const { data, loading, error } = useServices()
    const copy = t.services.businessAndPermits
    const business = data?.categories.find(
        (category): category is BusinessAndPermitsCategory => category.id === "business-and-permits",
    )

    const title = `${copy.heading} | Better Pagbilao Services`
    const description =
        "Business permits, building permits, zoning, and locational clearance in Pagbilao — offices involved, official downloadable forms, and how to file each."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd: business
            ? {
                  "@context": "https://schema.org",
                  "@graph": business.confirmed.offices.map((office) => ({
                      "@type": "GovernmentOrganization",
                      name: office.name,
                      telephone: office.telephone,
                      address: {
                          "@type": "PostalAddress",
                          streetAddress: office.address,
                          addressLocality: business.municipality,
                          addressRegion: business.province,
                          addressCountry: "PH",
                      },
                  })),
              }
            : undefined,
    })

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
                    {loading && <p className="text-sm font-semibold text-slate-500">Loading business and permits services…</p>}
                    {error && (
                        <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            Could not load business and permits services right now. Please try again later.
                        </p>
                    )}

                    {business && (
                        <>
                            <div className="flex items-start gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-5">
                                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-bayan-green" />
                                <p className="text-sm leading-6 font-semibold text-emerald-900">{business.dataConfidence}</p>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.officesLabel}</h2>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {business.confirmed.offices.map((office, index) => {
                                        const Icon = OFFICE_ICONS[index % OFFICE_ICONS.length]
                                        return (
                                            <article key={office.name} className="rounded-lg border border-slate-200 bg-bayan-mist p-5">
                                                <span className={`grid h-11 w-11 place-items-center rounded-md ${OFFICE_COLORS[index % OFFICE_COLORS.length]}`}>
                                                    <Icon className="h-5 w-5" />
                                                </span>
                                                <p className="mt-4 text-base font-black">{office.name}</p>
                                                <p className="mt-1 text-sm font-semibold text-slate-600">{office.head}</p>
                                                <p className="mt-1 text-xs text-slate-500">{office.address}</p>
                                                <a href={toTelHref(office.telephone)} className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-bayan-blue">
                                                    <PhoneCall className="h-4 w-4" /> {office.telephone}
                                                </a>
                                            </article>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="mt-6 flex items-start gap-3 rounded-lg border border-slate-200 bg-bayan-mist p-5">
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-blue-50 text-bayan-blue">
                                    <Store className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-base font-black">{business.confirmed.businessOneStopShop.name}</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">{business.confirmed.businessOneStopShop.description}</p>
                                    <p className="mt-1 text-xs font-semibold text-amber-700">{business.confirmed.businessOneStopShop.note}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {business && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.formsLabel}</h2>
                        <div className="mt-5 space-y-6">
                            {business.confirmed.downloadableForms.map((section) => (
                                <div key={section.section} className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <h3 className="text-lg font-black">{section.section}</h3>
                                        {section.note && <p className="text-xs font-semibold text-amber-700">{section.note}</p>}
                                    </div>
                                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {section.items.map((item) => {
                                            const FileIcon = item.type === "image" ? FileImage : FileText
                                            return (
                                                <a
                                                    key={item.url}
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center gap-3 rounded-md border border-slate-200 p-3 transition hover:border-bayan-blue hover:bg-blue-50"
                                                >
                                                    <FileIcon className="h-5 w-5 shrink-0 text-bayan-blue" />
                                                    <span className="min-w-0 flex-1 text-sm font-semibold text-slate-700 group-hover:text-bayan-blue">
                                                        {item.title}
                                                    </span>
                                                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-bayan-blue" />
                                                </a>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {business && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.servicesLabel}</h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{business.typicalServices.note}</p>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {business.typicalServices.categories.map((service) => {
                                const Icon = CATEGORY_ICONS[service.category] ?? FileText
                                const isFree = service.typicalFee.toLowerCase().startsWith("free") || service.typicalFee.toLowerCase().startsWith("assessment is free")
                                return (
                                    <article
                                        key={service.category}
                                        className="flex flex-col rounded-lg border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-bayan-blue">
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <span className="text-xs font-black uppercase tracking-[0.08em] text-slate-400">{service.office}</span>
                                        </div>
                                        <h3 className="mt-4 text-base font-black">{service.category}</h3>
                                        <ul className="mt-3 space-y-1.5 text-sm leading-5 text-slate-600">
                                            {service.typicalCoverage.map((item) => (
                                                <li key={item} className="flex items-start gap-2">
                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bayan-blue" />
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

            {business && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.howToAvailLabel}</h2>
                                <div className="mt-5 space-y-4">
                                    {business.howToAvail.generalSteps.map((step, index) => (
                                        <div key={step} className="flex items-start gap-4 rounded-lg bg-white p-4 shadow-sm">
                                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-black text-bayan-blue">
                                                {index + 1}
                                            </span>
                                            <p className="text-sm leading-6 text-slate-700">{step}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-5 text-sm font-semibold leading-6 text-slate-600">{business.howToAvail.hoursNote}</p>
                            </div>

                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.requirementsLabel}</h2>
                                <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
                                    <ul className="space-y-3">
                                        {business.howToAvail.commonRequirements.map((item) => (
                                            <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                                                <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-bayan-blue" />
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

            {business && (
                <section className="bg-bayan-ink py-14 text-white sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.verificationLabel}</p>
                                <p className="mt-4 text-base leading-8 text-white/76">{business.verificationGuide.recommendation}</p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    {business.confirmed.offices.map((office) => (
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
                                {business.verificationGuide.howToConfirm.map((item) => (
                                    <div key={item} className="flex items-start gap-3 rounded-lg bg-white/8 p-4 ring-1 ring-white/12">
                                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-bayan-gold" />
                                        <p className="text-sm leading-6 text-white/84">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm font-semibold text-white/60">
                            <Landmark className="h-4 w-4 text-bayan-gold" />
                            Sources: {business.confirmed.sources.map((source) => source.name).join(" · ")}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

export default BusinessAndPermitsPage
