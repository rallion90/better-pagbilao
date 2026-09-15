import {
    Accessibility,
    AlertTriangle,
    Baby,
    ClipboardCheck,
    Coins,
    HandHeart,
    HeartPulse,
    Landmark,
    Mail,
    PhoneCall,
    PiggyBank,
    Quote,
    Scissors,
    ShieldAlert,
    ShieldCheck,
    UserRound,
    Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useServices } from "../../hooks/useServices"
import { useSeo } from "../../hooks/useSeo"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import type { SocialWelfareCategory } from "../../types/services"

const PAGE_PATH = "/services/social-welfare"

const FACILITY_ICONS: LucideIcon[] = [UserRound, Baby, Scissors]
const FACILITY_COLORS = ["text-bayan-blue bg-blue-50", "text-bayan-red bg-red-50", "text-bayan-green bg-emerald-50"]

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    "Assistance to Individuals in Crisis Situations (Medical)": HeartPulse,
    "Burial Assistance": HandHeart,
    "Senior Citizen Services (OSCA)": UserRound,
    "PWD Services (PDAO)": Accessibility,
    "Barangay Day Care Services": Baby,
    "Solo Parent Assistance": Users,
    "Pantawid Pamilyang Pilipino Program (4Ps)": Coins,
    "Sustainable Livelihood Program (SLP)": PiggyBank,
    "Skills Training (Training and Production Center)": Scissors,
    "Violence Against Women and Children (VAWC) Desk": ShieldAlert,
}

function toTelHref(telephone: string) {
    return `tel:${telephone.replace(/[^0-9]/g, "")}`
}

const SocialWelfarePage = () => {
    const { t } = useLanguage()
    const { data, loading, error } = useServices()
    const copy = t.services.socialWelfare
    const social = data?.categories.find(
        (category): category is SocialWelfareCategory => category.id === "social-welfare",
    )

    const title = `${copy.heading} | Better Pagbilao Services`
    const description =
        "Social welfare assistance in Pagbilao: MSWDO medical and burial aid, senior citizen and PWD IDs, barangay day care, solo parent support, and DSWD program coordination."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd: social
            ? {
                  "@context": "https://schema.org",
                  "@type": "GovernmentOrganization",
                  name: social.confirmed.office.name,
                  telephone: social.confirmed.office.telephone,
                  description: social.confirmed.office.mandate,
                  address: {
                      "@type": "PostalAddress",
                      streetAddress: social.confirmed.office.address,
                      addressLocality: social.municipality,
                      addressRegion: social.province,
                      addressCountry: "PH",
                  },
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
                    {loading && <p className="text-sm font-semibold text-slate-500">Loading social welfare services…</p>}
                    {error && (
                        <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            Could not load social welfare services right now. Please try again later.
                        </p>
                    )}

                    {social && (
                        <>
                            <div className="flex items-start gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-5">
                                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-bayan-green" />
                                <p className="text-sm leading-6 font-semibold text-emerald-900">{social.dataConfidence}</p>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.officeLabel}</h2>
                                <article className="mt-4 rounded-lg border border-slate-200 bg-bayan-mist p-6 sm:max-w-2xl">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-blue-50 text-bayan-blue">
                                            <Users className="h-7 w-7" />
                                        </span>
                                        <div>
                                            <p className="text-lg font-black">{social.confirmed.office.name}</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-600">{social.confirmed.office.head}</p>
                                            <p className="mt-1 text-sm text-slate-600">{social.confirmed.office.address}</p>
                                            <a
                                                href={toTelHref(social.confirmed.office.telephone)}
                                                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-bayan-blue"
                                            >
                                                <PhoneCall className="h-4 w-4" /> {social.confirmed.office.telephone}
                                            </a>
                                        </div>
                                    </div>
                                    <blockquote className="mt-5 flex gap-3 border-t border-slate-200 pt-4">
                                        <Quote className="h-5 w-5 shrink-0 text-slate-400" />
                                        <p className="text-sm italic leading-6 text-slate-600">{social.confirmed.office.mandate}</p>
                                    </blockquote>
                                </article>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {social && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.facilitiesLabel}</h2>
                        <div className="mt-5 grid gap-4 sm:grid-cols-3">
                            {social.confirmed.facilities.map((facility, index) => {
                                const Icon = FACILITY_ICONS[index % FACILITY_ICONS.length]
                                return (
                                    <article key={facility.name} className="rounded-lg border border-slate-200 bg-white p-5">
                                        <span className={`grid h-11 w-11 place-items-center rounded-md ${FACILITY_COLORS[index % FACILITY_COLORS.length]}`}>
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <p className="mt-4 text-base font-black">{facility.name}</p>
                                        {facility.legalBasis && (
                                            <p className="mt-1 text-xs font-bold uppercase tracking-[0.06em] text-slate-500">{facility.legalBasis}</p>
                                        )}
                                        <p className="mt-2 text-sm leading-6 text-slate-600">{facility.description}</p>
                                    </article>
                                )
                            })}
                        </div>

                        <div className="mt-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm leading-6 text-slate-600">{social.confirmed.generalInquiry.note}</p>
                            <div className="flex shrink-0 flex-wrap gap-3">
                                <a href={toTelHref(social.confirmed.generalInquiry.telephone)} className="inline-flex items-center gap-2 text-sm font-bold text-bayan-blue">
                                    <PhoneCall className="h-4 w-4" /> {social.confirmed.generalInquiry.telephone}
                                </a>
                                <a href={`mailto:${social.confirmed.generalInquiry.email}`} className="inline-flex items-center gap-2 text-sm font-bold text-bayan-blue">
                                    <Mail className="h-4 w-4" /> {social.confirmed.generalInquiry.email}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {social && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.servicesLabel}</h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{social.typicalServices.note}</p>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {social.typicalServices.categories.map((service) => {
                                const Icon = CATEGORY_ICONS[service.category] ?? Users
                                const isFree = service.typicalFee.toLowerCase().startsWith("free")
                                return (
                                    <article
                                        key={service.category}
                                        className="flex flex-col rounded-lg border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
                                    >
                                        <span className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-bayan-blue">
                                            <Icon className="h-5 w-5" />
                                        </span>
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

            {social && (
                <section className="bg-bayan-mist py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.howToAvailLabel}</h2>
                                <div className="mt-5 space-y-4">
                                    {social.howToAvail.generalSteps.map((step, index) => (
                                        <div key={step} className="flex items-start gap-4 rounded-lg bg-white p-4 shadow-sm">
                                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-black text-bayan-blue">
                                                {index + 1}
                                            </span>
                                            <p className="text-sm leading-6 text-slate-700">{step}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-5 text-sm font-semibold leading-6 text-slate-600">{social.howToAvail.hoursNote}</p>
                            </div>

                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.requirementsLabel}</h2>
                                <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
                                    <ul className="space-y-3">
                                        {social.howToAvail.commonRequirements.map((item) => (
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

            {social && (
                <section className="bg-bayan-ink py-14 text-white sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.verificationLabel}</p>
                                <p className="mt-4 text-base leading-8 text-white/76">{social.verificationGuide.recommendation}</p>
                                <a
                                    href={toTelHref(social.confirmed.office.telephone)}
                                    className="mt-6 inline-flex items-center gap-3 rounded-lg bg-white px-5 py-3 text-base font-black text-bayan-ink shadow-soft"
                                >
                                    <PhoneCall className="h-5 w-5 text-bayan-blue" />
                                    Call {social.confirmed.office.telephone}
                                </a>
                            </div>
                            <div className="space-y-3">
                                {social.verificationGuide.howToConfirm.map((item) => (
                                    <div key={item} className="flex items-start gap-3 rounded-lg bg-white/8 p-4 ring-1 ring-white/12">
                                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-bayan-gold" />
                                        <p className="text-sm leading-6 text-white/84">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm font-semibold text-white/60">
                            <Landmark className="h-4 w-4 text-bayan-gold" />
                            Sources: {social.confirmed.sources.map((source) => source.name).join(" · ")}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

export default SocialWelfarePage
