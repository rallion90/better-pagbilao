import { ExternalLink, FileImage, FileText, Landmark } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useFormsAndDocuments } from "../../hooks/useFormsAndDocuments"
import { useSeo } from "../../hooks/useSeo"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"

const PAGE_PATH = "/transparency/permits-and-clearances"

const PermitsAndClearancesPage = () => {
    const { t } = useLanguage()
    const { data: forms, loading, error } = useFormsAndDocuments()
    const copy = t.transparencyPages.permitsAndClearances

    const title = `${copy.heading} | Better Pagbilao Transparency`
    const description =
        "Downloadable forms for business permits, locational clearance, zoning certificates, and building permits in Pagbilao, Quezon."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd: forms
            ? {
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  name: "Permits and Clearances — Downloadable Forms",
                  itemListElement: forms.downloadableForms.map((section, index) => ({
                      "@type": "ListItem",
                      position: index + 1,
                      name: section.section,
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
                    {loading && <p className="text-sm font-semibold text-slate-500">Loading…</p>}
                    {error && (
                        <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            Could not load this page right now. Please try again later.
                        </p>
                    )}

                    {forms && (
                        <>
                            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.formsLabel}</h2>
                            <div className="mt-5 space-y-6">
                                {forms.downloadableForms.map((section) => (
                                    <div key={section.section} className="rounded-lg border border-slate-200 bg-bayan-mist p-5 sm:p-6">
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
                                                        className="group flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3 transition hover:border-bayan-blue hover:bg-blue-50"
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

                            <div className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-6 text-sm font-semibold text-slate-500">
                                <Landmark className="h-4 w-4 text-bayan-blue" />
                                Source: {forms.source.name}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    )
}

export default PermitsAndClearancesPage
