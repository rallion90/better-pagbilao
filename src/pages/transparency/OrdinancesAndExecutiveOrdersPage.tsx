import { AlertCircle, ExternalLink, FileText, Landmark } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useGovernance } from "../../hooks/useGovernance"
import { useFormsAndDocuments } from "../../hooks/useFormsAndDocuments"
import { useSeo } from "../../hooks/useSeo"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"

const PAGE_PATH = "/transparency/ordinances-and-executive-orders"

const OrdinancesAndExecutiveOrdersPage = () => {
    const { t } = useLanguage()
    const { data: governance, loading: governanceLoading, error: governanceError } = useGovernance()
    const { data: forms } = useFormsAndDocuments()
    const copy = t.transparencyPages.ordinances

    const relatedDocuments = forms?.transparency.filter((item) => !item.title.toLowerCase().includes("procurement") && item.title !== "Citizen's Charter") ?? []

    const title = `${copy.heading} | Better Pagbilao Transparency`
    const description =
        "Municipal ordinances, resolutions, and executive orders for Pagbilao, Quezon — publication status and related public documents."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd: governance
            ? {
                  "@context": "https://schema.org",
                  "@type": "GovernmentService",
                  name: "Ordinances and Executive Orders",
                  serviceType: "Public records access",
                  provider: {
                      "@type": "GovernmentOrganization",
                      name: "Sangguniang Bayan ng Pagbilao",
                  },
                  areaServed: { "@type": "City", name: "Pagbilao", address: { "@type": "PostalAddress", addressRegion: "Quezon", addressCountry: "PH" } },
              }
            : undefined,
    })

    return (
        <>
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb
                        items={[
                            { label: t.transparencyPages.breadcrumbHome, to: "/" },
                            { label: t.transparencyPages.breadcrumbTransparency },
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
                    {governanceLoading && <p className="text-sm font-semibold text-slate-500">Loading…</p>}
                    {governanceError && (
                        <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            Could not load this page right now. Please try again later.
                        </p>
                    )}

                    {governance && (
                        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-5">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-amber-800">{copy.statusLabel}</h2>
                                <p className="mt-1 text-sm leading-6 text-amber-900">{governance.ordinanceAndExecutiveOrder.status}</p>
                            </div>
                        </div>
                    )}

                    {relatedDocuments.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.documentsLabel}</h2>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {relatedDocuments.map((item) => (
                                    <a
                                        key={item.url}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 rounded-md border border-slate-200 p-4 transition hover:border-bayan-blue hover:bg-blue-50"
                                    >
                                        <FileText className="h-5 w-5 shrink-0 text-bayan-blue" />
                                        <span className="min-w-0 flex-1 text-sm font-semibold text-slate-700 group-hover:text-bayan-blue">
                                            {item.title}
                                        </span>
                                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-bayan-blue" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-6 text-sm font-semibold text-slate-500">
                        <Landmark className="h-4 w-4 text-bayan-blue" />
                        Source: Municipality of Pagbilao Official Government Portal
                    </div>
                </div>
            </section>
        </>
    )
}

export default OrdinancesAndExecutiveOrdersPage
