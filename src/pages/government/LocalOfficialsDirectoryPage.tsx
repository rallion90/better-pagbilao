import { Building2, Landmark, MapPin, PhoneCall, ShieldCheck } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useGovernance } from "../../hooks/useGovernance"
import { usePublicOffices } from "../../hooks/usePublicOffices"
import { useSeo } from "../../hooks/useSeo"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"

const PAGE_PATH = "/government/local-officials-directory"

function toTelHref(telephone: string) {
    return `tel:${telephone.replace(/[^0-9]/g, "")}`
}

const LocalOfficialsDirectoryPage = () => {
    const { t } = useLanguage()
    const governance = useGovernance()
    const { data, loading, error } = usePublicOffices()
    const copy = t.government.directory

    const mayorOffice = data?.offices.find((office) => office.office === "Office of the Municipal Mayor")
    const otherOffices = data?.offices.filter((office) => office.office !== "Office of the Municipal Mayor") ?? []
    const viceMayor = governance.data?.municipalCouncil[0]

    const title = `${copy.heading} | Better Pagbilao Government`
    const description =
        "Directory of Pagbilao, Quezon local government officials and department heads, with office addresses and telephone numbers, sourced from the official municipal portal."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd: data
            ? {
                  "@context": "https://schema.org",
                  "@type": "GovernmentOrganization",
                  name: "Local Government Unit of Pagbilao",
                  address: {
                      "@type": "PostalAddress",
                      streetAddress: data.mainOffice.address,
                      addressLocality: data.municipality,
                      addressRegion: data.province,
                      addressCountry: "PH",
                  },
                  telephone: data.mainOffice.telephone,
                  employee: data.offices.map((office) => ({ "@type": "Person", name: office.head, jobTitle: office.office })),
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
                            { label: t.government.breadcrumbHome, to: "/" },
                            { label: t.government.breadcrumbGovernment },
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
                    {loading && <p className="text-sm font-semibold text-slate-500">Loading local officials directory…</p>}
                    {error && (
                        <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            Could not load the officials directory right now. Please try again later.
                        </p>
                    )}

                    {data && (
                        <>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.executiveLabel}</h2>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {mayorOffice && (
                                        <article className="rounded-lg border border-slate-200 bg-bayan-mist p-6">
                                            <span className="grid h-12 w-12 place-items-center rounded-md bg-blue-50 text-bayan-blue">
                                                <Landmark className="h-6 w-6" />
                                            </span>
                                            <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500">{mayorOffice.office}</p>
                                            <p className="mt-1 text-lg font-black">{mayorOffice.head}</p>
                                            {mayorOffice.telephone && (
                                                <a href={toTelHref(mayorOffice.telephone)} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-bayan-blue">
                                                    <PhoneCall className="h-4 w-4" /> {mayorOffice.telephone}
                                                </a>
                                            )}
                                        </article>
                                    )}
                                    {viceMayor && (
                                        <article className="rounded-lg border border-slate-200 bg-bayan-mist p-6">
                                            <span className="grid h-12 w-12 place-items-center rounded-md bg-emerald-50 text-bayan-green">
                                                <ShieldCheck className="h-6 w-6" />
                                            </span>
                                            <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500">{viceMayor.role}</p>
                                            <p className="mt-1 text-lg font-black">{viceMayor.name}</p>
                                        </article>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10">
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.officesLabel}</h2>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {otherOffices.map((office) => (
                                        <article
                                            key={office.office}
                                            className="rounded-lg border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
                                        >
                                            <span className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-bayan-blue">
                                                <Building2 className="h-5 w-5" />
                                            </span>
                                            <p className="mt-4 text-sm font-black uppercase tracking-[0.08em] text-slate-500">{office.office}</p>
                                            <p className="mt-1 text-base font-black">{office.head}</p>
                                            <div className="mt-3 space-y-1.5 text-sm font-semibold text-slate-600">
                                                {office.telephone && (
                                                    <a href={toTelHref(office.telephone)} className="flex items-center gap-2 hover:text-bayan-blue">
                                                        <PhoneCall className="h-3.5 w-3.5 shrink-0" /> {office.telephone}
                                                    </a>
                                                )}
                                                <p className="flex items-start gap-2">
                                                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {office.address}
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    )
}

export default LocalOfficialsDirectoryPage
