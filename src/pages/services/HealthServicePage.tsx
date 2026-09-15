import {
    Activity,
    AlertTriangle,
    Apple,
    CircleCheck,
    ClipboardCheck,
    Clock,
    Droplets,
    FileText,
    HeartHandshake,
    HeartPulse,
    Landmark,
    PawPrint,
    PhoneCall,
    ShieldCheck,
    Stethoscope,
    Syringe,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useServices } from "../../hooks/useServices"
import { useSeo } from "../../hooks/useSeo"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import type { HealthServiceCategory } from "../../types/services"

const PAGE_PATH = "/services/health-services"

const CATEGORY_ICONS: LucideIcon[] = [Syringe, HeartHandshake, Apple, Activity, PawPrint, Stethoscope, FileText, Droplets]
const CATEGORY_COLORS = [
    "text-bayan-blue bg-blue-50",
    "text-bayan-red bg-red-50",
    "text-bayan-green bg-emerald-50",
    "text-amber-700 bg-amber-50",
    "text-bayan-blue bg-blue-50",
    "text-bayan-green bg-emerald-50",
    "text-bayan-red bg-red-50",
    "text-amber-700 bg-amber-50",
]

function toTelHref(telephone: string) {
    return `tel:${telephone.replace(/[^0-9]/g, "")}`
}

const HealthServicePage = () => {
    const { t } = useLanguage()
    const { data, loading, error } = useServices()
    const copy = t.services.healthService
    const health = data?.categories.find((category): category is HealthServiceCategory => category.id === "health-services")

    const title = `${copy.heading} | Better Pagbilao Services`
    const description =
        "Health services available through Pagbilao's Municipal Health Office: immunization, maternal and child health, TB DOTS, animal bite treatment, and how to avail of each."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd: health
            ? {
                  "@context": "https://schema.org",
                  "@type": "MedicalClinic",
                  name: health.confirmed.office.name,
                  medicalSpecialty: "Public Health",
                  telephone: health.confirmed.office.telephone,
                  address: {
                      "@type": "PostalAddress",
                      streetAddress: health.confirmed.office.address,
                      addressLocality: health.municipality,
                      addressRegion: health.province,
                      addressCountry: "PH",
                  },
                  areaServed: { "@type": "City", name: health.municipality },
                  mainEntityOfPage: `https://betterpagbilao.org${PAGE_PATH}`,
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
                    {loading && <p className="text-sm font-semibold text-slate-500">Loading health services…</p>}
                    {error && (
                        <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            Could not load health services right now. Please try again later.
                        </p>
                    )}

                    {health && (
                        <>
                            <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-5">
                                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                                <p className="text-sm leading-6 font-semibold text-amber-900">{health.dataConfidence}</p>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.officeLabel}</h2>
                                <article className="mt-4 flex flex-col gap-4 rounded-lg border border-slate-200 bg-bayan-mist p-6 sm:max-w-lg sm:flex-row sm:items-center">
                                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-red-50 text-bayan-red">
                                        <HeartPulse className="h-7 w-7" />
                                    </span>
                                    <div>
                                        <p className="text-lg font-black">{health.confirmed.office.name}</p>
                                        {health.confirmed.office.facility && (
                                            <p className="text-sm font-semibold text-slate-500">{health.confirmed.office.facility}</p>
                                        )}
                                        <p className="mt-1 text-sm font-semibold text-slate-600">{health.confirmed.office.head}</p>
                                        <p className="mt-1 text-sm text-slate-600">{health.confirmed.office.address}</p>
                                        <a
                                            href={toTelHref(health.confirmed.office.telephone)}
                                            className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-bayan-blue"
                                        >
                                            <PhoneCall className="h-4 w-4" /> {health.confirmed.office.telephone}
                                        </a>
                                    </div>
                                </article>
                            </div>

                            <div className="mt-10">
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.servicesLabel}</h2>
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{health.typicalServices.note}</p>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {health.typicalServices.categories.map((service, index) => {
                                        const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length]
                                        const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                                        const isFree = service.typicalFee.toLowerCase().startsWith("free")
                                        return (
                                            <article
                                                key={service.category}
                                                className="flex flex-col rounded-lg border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
                                            >
                                                <span className={`grid h-11 w-11 place-items-center rounded-md ${color}`}>
                                                    <Icon className="h-5 w-5" />
                                                </span>
                                                <h3 className="mt-4 text-base font-black">{service.category}</h3>
                                                {service.targetGroup && (
                                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                                                        {service.targetGroup}
                                                    </p>
                                                )}
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
                        </>
                    )}
                </div>
            </section>

            {health && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.howToAvailLabel}</h2>
                                <div className="mt-5 space-y-4">
                                    {health.howToAvail.generalSteps.map((step, index) => (
                                        <div key={step} className="flex items-start gap-4 rounded-lg bg-white p-4 shadow-sm">
                                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-black text-bayan-blue">
                                                {index + 1}
                                            </span>
                                            <p className="text-sm leading-6 text-slate-700">{step}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 flex items-start gap-3 rounded-lg bg-bayan-ink p-4 text-white">
                                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-bayan-gold" />
                                    <p className="text-sm font-semibold leading-6 text-white/84">{health.howToAvail.hoursNote}</p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.requirementsLabel}</h2>
                                <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
                                    <ul className="space-y-3">
                                        {health.howToAvail.commonRequirements.map((item) => (
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

            {health && (
                <section className="bg-bayan-ink py-14 text-white sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.verificationLabel}</p>
                                <p className="mt-4 text-base leading-8 text-white/76">{health.verificationGuide.recommendation}</p>
                                <a
                                    href={toTelHref(health.confirmed.office.telephone)}
                                    className="mt-6 inline-flex items-center gap-3 rounded-lg bg-white px-5 py-3 text-base font-black text-bayan-ink shadow-soft"
                                >
                                    <PhoneCall className="h-5 w-5 text-bayan-blue" />
                                    Call {health.confirmed.office.telephone}
                                </a>
                            </div>
                            <div className="space-y-3">
                                {health.verificationGuide.howToConfirm.map((item) => (
                                    <div key={item} className="flex items-start gap-3 rounded-lg bg-white/8 p-4 ring-1 ring-white/12">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                                        <p className="text-sm leading-6 text-white/84">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm font-semibold text-white/60">
                            <Landmark className="h-4 w-4 text-bayan-gold" />
                            Sources: {health.confirmed.sources.map((source) => source.name).join(" · ")}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

export default HealthServicePage
