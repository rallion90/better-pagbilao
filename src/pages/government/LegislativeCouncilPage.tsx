import { Gavel, Scale, ScrollText, UserRound } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useGovernance } from "../../hooks/useGovernance"
import { useSeo } from "../../hooks/useSeo"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"

const PAGE_PATH = "/government/legislative-council"

const LegislativeCouncilPage = () => {
    const { t } = useLanguage()
    const { data, loading, error } = useGovernance()
    const copy = t.government.legislative
    const secretary = data?.departmentHeadsAndOffices.find((entry) => entry.office === "Office of the Secretary to the Sangguniang Bayan")

    const title = `${copy.heading} | Better Pagbilao Government`
    const description =
        "Meet the Sangguniang Bayan ng Pagbilao: the Municipal Vice Mayor as presiding officer and the full roster of municipal councilors of Pagbilao, Quezon."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd: data
            ? {
                  "@context": "https://schema.org",
                  "@type": "GovernmentOrganization",
                  name: "Sangguniang Bayan ng Pagbilao",
                  areaServed: { "@type": "City", name: "Pagbilao", address: { "@type": "PostalAddress", addressRegion: "Quezon", addressCountry: "PH" } },
                  employee: [
                      { "@type": "Person", name: data.municipalCouncil[0]?.name, jobTitle: data.municipalCouncil[0]?.role },
                      ...data.municipalCouncil.slice(1).map((member) => ({ "@type": "Person", name: member.name, jobTitle: member.role })),
                  ],
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
                    {loading && <p className="text-sm font-semibold text-slate-500">Loading legislative council…</p>}
                    {error && (
                        <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            Could not load the current council roster right now. Please try again later.
                        </p>
                    )}

                    {data && (
                        <>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.presidingOfficerLabel}</h2>
                                <article className="mt-4 flex items-center gap-4 rounded-lg border border-slate-200 bg-bayan-mist p-6 sm:max-w-md">
                                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-blue-50 text-bayan-blue">
                                        <Gavel className="h-7 w-7" />
                                    </span>
                                    <div>
                                        <p className="text-lg font-black">{data.municipalCouncil[0]?.name}</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-600">{data.municipalCouncil[0]?.role}</p>
                                    </div>
                                </article>
                            </div>

                            <div className="mt-10">
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.councilorsLabel}</h2>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {data.municipalCouncil.slice(1).map((member) => (
                                        <article
                                            key={member.name}
                                            className="rounded-lg border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
                                        >
                                            <span className="grid h-11 w-11 place-items-center rounded-md bg-emerald-50 text-bayan-green">
                                                <UserRound className="h-5 w-5" />
                                            </span>
                                            <p className="mt-4 text-base font-black">{member.name}</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-500">{member.role}</p>
                                        </article>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10 rounded-lg border border-slate-200 bg-bayan-mist p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
                                <div className="flex items-center gap-3">
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700">
                                        <ScrollText className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{copy.secretariatLabel}</p>
                                        <p className="mt-1 text-base font-black">{secretary?.name ?? data.ordinanceAndExecutiveOrder.status}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-bayan-blue sm:mt-0">
                                    <Scale className="h-4 w-4" />
                                    Office of the Secretary to the Sangguniang Bayan
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    )
}

export default LegislativeCouncilPage
