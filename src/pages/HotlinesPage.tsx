import {
    ArrowRight,
    BriefcaseBusiness,
    Clock,
    Flame,
    HeartPulse,
    Landmark,
    Mail,
    PhoneCall,
    Shield,
    ShieldAlert,
    Siren,
    UsersRound,
    Wheat,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router"
import { useLanguage } from "../i18n/useLanguage"
import { useEmergencyDirectory } from "../hooks/useEmergencyDirectory"
import { usePublicOffices } from "../hooks/usePublicOffices"
import { useSeo } from "../hooks/useSeo"
import PageBreadcrumb from "../components/common/PageBreadcrumb"

const PAGE_PATH = "/hotlines"

const HOTLINE_ICONS: Record<string, LucideIcon> = {
    "Disaster response": Siren,
    Police: Shield,
    Fire: Flame,
    Health: HeartPulse,
}
const HOTLINE_COLORS: Record<string, string> = {
    "Disaster response": "text-bayan-red",
    Police: "text-bayan-blue",
    Fire: "text-amber-700",
    Health: "text-bayan-green",
}

function toTelHref(telephone: string) {
    return `tel:${telephone.replace(/[^0-9]/g, "")}`
}

const HotlinesPage = () => {
    const { t } = useLanguage()
    const { data: emergency, loading: emergencyLoading, error: emergencyError } = useEmergencyDirectory()
    const { data: offices } = usePublicOffices()
    const copy = t.hotlinesPage

    const title = `${copy.heading} | Better Pagbilao`
    const description =
        "Emergency hotlines and office contact numbers for Pagbilao, Quezon: MDRRMO, PNP, BFP, MHO, and every municipal office landline in one place."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd: emergency
            ? {
                  "@context": "https://schema.org",
                  "@type": "GovernmentOrganization",
                  name: "LGU Pagbilao",
                  telephone: emergency.municipalContact.telephone,
                  address: {
                      "@type": "PostalAddress",
                      streetAddress: emergency.municipalContact.address,
                      addressLocality: emergency.municipality,
                      addressRegion: emergency.province,
                      addressCountry: "PH",
                  },
                  contactPoint: emergency.hotlines.map((hotline) => ({
                      "@type": "ContactPoint",
                      contactType: hotline.category,
                      telephone: hotline.telephone,
                      areaServed: "PH",
                  })),
                  mainEntityOfPage: `https://betterpagbilao.org${PAGE_PATH}`,
              }
            : undefined,
    })

    const findOffice = (nameIncludes: string) => offices?.offices.find((office) => office.office.includes(nameIncludes))

    const categories = [
        {
            label: t.nav.menus.government.label,
            href: "/government/local-officials-directory",
            Icon: Landmark,
            color: "text-bayan-green bg-emerald-50",
            office: findOffice("Office of the Municipal Mayor"),
        },
        {
            label: t.services.healthService.heading,
            href: "/services/health-services",
            Icon: HeartPulse,
            color: "text-bayan-red bg-red-50",
            office: findOffice("Municipal Health Office"),
        },
        {
            label: t.services.disasterAndSafety.heading,
            href: "/services/disaster-and-safety",
            Icon: ShieldAlert,
            color: "text-bayan-green bg-emerald-50",
            office: findOffice("Municipal Disaster Risk Reduction"),
        },
        {
            label: t.services.agricultureAndLivelihood.heading,
            href: "/services/agriculture-and-livelihood",
            Icon: Wheat,
            color: "text-amber-700 bg-amber-50",
            office: findOffice("Municipal Agriculturist Office"),
        },
        {
            label: t.services.socialWelfare.heading,
            href: "/services/social-welfare",
            Icon: UsersRound,
            color: "text-bayan-blue bg-blue-50",
            office: findOffice("Municipal Social Welfare"),
        },
        {
            label: t.services.businessAndPermits.heading,
            href: "/services/business-and-permits",
            Icon: BriefcaseBusiness,
            color: "text-bayan-blue bg-blue-50",
            office: findOffice("Municipal Treasurer's Office"),
        },
    ]

    return (
        <>
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb items={[{ label: t.services.breadcrumbHome, to: "/" }, { label: copy.heading }]} />
                    <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.eyebrow}</p>
                    <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{copy.heading}</h1>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-white/76">{copy.intro}</p>
                </div>
            </section>

            {emergencyLoading && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <p className="text-sm font-semibold text-slate-500">Loading hotlines…</p>
                    </div>
                </section>
            )}
            {emergencyError && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            Could not load hotlines right now. Please try again later.
                        </p>
                    </div>
                </section>
            )}

            {emergency && (
                <section className="bg-bayan-red py-14 text-white sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="mt-0 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {emergency.hotlines.map((hotline) => {
                                const Icon = HOTLINE_ICONS[hotline.category] ?? PhoneCall
                                const color = HOTLINE_COLORS[hotline.category] ?? "text-bayan-ink"
                                return (
                                    <a key={hotline.agency} href={toTelHref(hotline.telephone)} className="rounded-lg bg-white p-5 text-bayan-ink shadow-soft">
                                        <Icon className={`h-7 w-7 ${color}`} />
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

            {emergency && (
                <section className="bg-white py-14 sm:py-16">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.municipalContactLabel}</h2>
                        <article className="mt-4 flex flex-col gap-4 rounded-lg border border-slate-200 bg-bayan-mist p-6 sm:max-w-xl sm:flex-row sm:items-start">
                            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-blue-50 text-bayan-blue">
                                <Landmark className="h-7 w-7" />
                            </span>
                            <div>
                                <p className="text-lg font-black">{emergency.municipalContact.office}</p>
                                <p className="mt-1 text-sm text-slate-600">{emergency.municipalContact.address}</p>
                                <a href={toTelHref(emergency.municipalContact.telephone)} className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-bayan-blue">
                                    <PhoneCall className="h-4 w-4" /> {emergency.municipalContact.telephone}
                                </a>
                                <div className="mt-1 flex flex-col gap-1">
                                    {emergency.municipalContact.emails.map((email) => (
                                        <a key={email} href={`mailto:${email}`} className="inline-flex items-center gap-2 text-sm font-bold text-bayan-blue">
                                            <Mail className="h-4 w-4" /> {email}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </article>
                    </div>
                </section>
            )}

            <section className="bg-bayan-mist py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.moreNumbersLabel}</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <article
                                key={category.label}
                                className="group flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
                            >
                                <span className={`grid h-11 w-11 place-items-center rounded-md ${category.color}`}>
                                    <category.Icon className="h-5 w-5" />
                                </span>
                                <p className="mt-4 text-base font-black">{category.label}</p>
                                {category.office ? (
                                    <>
                                        <p className="mt-1 text-sm font-semibold text-slate-600">{category.office.head}</p>
                                        {category.office.telephone && (
                                            <a
                                                href={toTelHref(category.office.telephone)}
                                                className="mt-1 inline-flex w-fit items-center gap-2 text-lg font-black text-bayan-ink hover:text-bayan-blue"
                                            >
                                                <PhoneCall className="h-4 w-4" /> {category.office.telephone}
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <p className="mt-1 text-sm text-slate-500">See full page for contact details</p>
                                )}
                                <Link
                                    to={category.href}
                                    className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-bold text-bayan-blue group-hover:gap-2"
                                >
                                    {copy.viewFullPageLabel} <ArrowRight className="h-4 w-4 transition-all" />
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.guidanceLabel}</p>
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="flex items-start gap-4 rounded-lg bg-white/8 p-5 ring-1 ring-white/12">
                            <Siren className="mt-0.5 h-6 w-6 shrink-0 text-bayan-red" />
                            <div>
                                <p className="text-base font-black">{copy.guidanceEmergencyTitle}</p>
                                <p className="mt-2 text-sm leading-6 text-white/76">{copy.guidanceEmergencyNote}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 rounded-lg bg-white/8 p-5 ring-1 ring-white/12">
                            <Clock className="mt-0.5 h-6 w-6 shrink-0 text-bayan-blue" />
                            <div>
                                <p className="text-base font-black">{copy.guidanceOfficeTitle}</p>
                                <p className="mt-2 text-sm leading-6 text-white/76">{copy.guidanceOfficeNote}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HotlinesPage
