import { ExternalLink, FileSearch, Info, Landmark } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { useFormsAndDocuments } from "../../hooks/useFormsAndDocuments"
import { useSeo } from "../../hooks/useSeo"
import PageBanner from "../../components/common/PageBanner"

const PAGE_PATH = "/transparency/procurement"

/** Which explainer goes with a document, by a keyword in its title. */
function formatCheckedDate(isoDate: string, lang: string) {
    const locale = lang === "tl" ? "fil-PH" : "en-PH"
    return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "Asia/Manila" }).format(new Date(isoDate + "T00:00:00+08:00"))
}

function guideKey(title: string): "notices" | "monitoring" | null {
    const lower = title.toLowerCase()
    if (lower.includes("monitoring")) return "monitoring"
    if (lower.includes("notice")) return "notices"
    return null
}

const ProcurementPage = () => {
    const { t, lang } = useLanguage()
    const { data: forms, loading, error } = useFormsAndDocuments()
    const copy = t.transparencyPages.procurement

    const procurementDocs = forms?.transparency.filter((item) => item.title.toLowerCase().includes("procurement")) ?? []

    const title = `${copy.heading} | Better Pagbilao Transparency`
    const description = "Procurement notices and monitoring reports for Pagbilao, Quezon's local government, sourced from the official municipal portal."

    useSeo({
        title,
        description,
        path: PAGE_PATH,
        jsonLd:
            forms && procurementDocs.length > 0
                ? {
                      "@context": "https://schema.org",
                      "@type": "ItemList",
                      name: "Procurement Notices and Reports",
                      itemListElement: procurementDocs.map((doc, index) => ({
                          "@type": "ListItem",
                          position: index + 1,
                          name: doc.title,
                          url: doc.url,
                      })),
                  }
                : undefined,
    })

    return (
        <>
            <PageBanner
                breadcrumbs={[
                    { label: t.transparencyPages.breadcrumbHome, to: "/" },
                    { label: t.transparencyPages.breadcrumbTransparency },
                    { label: copy.heading },
                ]}
                eyebrow={copy.eyebrow}
                title={copy.heading}
                description={copy.intro}
            />

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
                            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.documentsLabel}</h2>

                            {procurementDocs.length > 0 ? (
                                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {procurementDocs.map((item) => (
                                        <a
                                            key={item.url}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-3 rounded-md border border-slate-200 p-4 transition hover:border-bayan-blue hover:bg-blue-50"
                                        >
                                            <FileSearch className="h-5 w-5 shrink-0 text-bayan-blue" />
                                            <span className="min-w-0 flex-1 text-sm font-semibold text-slate-700 group-hover:text-bayan-blue">
                                                {item.title}
                                            </span>
                                            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-bayan-blue" />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-3 text-sm leading-6 text-slate-600">{copy.emptyNote}</p>
                            )}

                            {procurementDocs.some((doc) => guideKey(doc.title)) && (
                                <div className="mt-10">
                                    <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.guideLabel}</h2>
                                    <dl className="mt-4 grid gap-4 lg:grid-cols-2">
                                        {procurementDocs.map((doc) => {
                                            const key = guideKey(doc.title)
                                            if (!key) return null
                                            return (
                                                <div key={doc.url} className="rounded-lg border border-slate-200 bg-bayan-mist p-5">
                                                    <dt className="flex items-center gap-2 text-base font-black text-bayan-ink">
                                                        <Info className="h-4 w-4 shrink-0 text-bayan-blue" aria-hidden />
                                                        {doc.title}
                                                    </dt>
                                                    <dd className="mt-2 text-sm leading-6 text-slate-600">{copy.guide[key]}</dd>
                                                </div>
                                            )
                                        })}
                                    </dl>
                                </div>
                            )}

                            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-200 pt-6 text-sm font-semibold text-slate-500">
                                <Landmark className="h-4 w-4 text-bayan-blue" aria-hidden />
                                <span>
                                    {copy.sourceLabel}:{" "}
                                    <a href={forms.source.url} target="_blank" rel="noopener noreferrer" className="text-bayan-blue hover:underline">
                                        {forms.source.name}
                                    </a>
                                </span>
                                {forms.source.accessed && (
                                    <span>
                                        · {copy.lastChecked}: <time dateTime={forms.source.accessed}>{formatCheckedDate(forms.source.accessed, lang)}</time>
                                    </span>
                                )}
                            </p>
                        </>
                    )}
                </div>
            </section>
        </>
    )
}

export default ProcurementPage
