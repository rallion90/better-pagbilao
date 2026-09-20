import { ArrowRight, BookOpenText, ExternalLink, LoaderCircle, Quote } from "lucide-react"
import { lazy, Suspense, useState } from "react"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import { CENSUS, CHURCH_STEPS, HISTORY_ERAS, HISTORY_SOURCES, HISTORY_TIMELINE, MARKER_TEXT } from "../../data/pagbilaoHistory"
import type { EntryKind, EraId } from "../../data/pagbilaoHistory"
import { useGovernance } from "../../hooks/useGovernance"
import { useSeo } from "../../hooks/useSeo"
import { historyPageCopy } from "../../i18n/historyPage"
import { useLanguage } from "../../i18n/useLanguage"

const PopulationChart = lazy(() => import("../../components/explore/PopulationChart"))

const PAGE_PATH = "/explore/history"

const KIND_STYLE: Record<EntryKind, { badge: string; dot: string }> = {
    record: { badge: "bg-blue-50 text-bayan-blue ring-blue-200", dot: "bg-bayan-blue" },
    tradition: { badge: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-bayan-gold" },
    context: { badge: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
}

const SECTION_IDS = ["beginnings", "timeline", "church", "war", "growth", "mayors", "traditions", "contribute", "sources"] as const

const SectionHeading = ({ eyebrow, children }: { eyebrow?: string; children: string }) => (
    <div className="max-w-3xl">
        {eyebrow && <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-blue">{eyebrow}</p>}
        <h2 className="mt-2 text-2xl font-black sm:text-3xl">{children}</h2>
    </div>
)

const KindBadge = ({ kind, label }: { kind: EntryKind; label: string }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1 ${KIND_STYLE[kind].badge}`}>{label}</span>
)

const MayorList = () => {
    const { lang } = useLanguage()
    const copy = historyPageCopy[lang].mayors
    const { data, loading, error } = useGovernance()

    if (loading) {
        return (
            <p role="status" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                <LoaderCircle className="h-4 w-4 animate-spin text-bayan-blue" /> {copy.loading}
            </p>
        )
    }
    if (error || !data) {
        return <p role="alert" className="mt-6 rounded-lg border border-bayan-red/40 bg-red-50 p-4 text-sm font-semibold text-bayan-red">{copy.error}</p>
    }

    const formatTerm = (term: string) => term.replace(/-Present$/i, `–${copy.present}`).replace(/(\d{4})-(\d{4})/, "$1–$2")

    return (
        <ol className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {data.formerMayors.map((mayor, index) => (
                <li key={`${mayor.name}-${index}`} className="flex items-baseline gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <span className="w-6 shrink-0 text-xs font-black text-slate-400">{index + 1}</span>
                    <span className="min-w-0">
                        <span className="block text-sm font-black">{mayor.name}</span>
                        <span className="block text-xs font-semibold text-slate-500">{mayor.terms.map(formatTerm).join(", ")}</span>
                    </span>
                </li>
            ))}
        </ol>
    )
}

const HistoryPage = () => {
    const { lang, t } = useLanguage()
    const copy = historyPageCopy[lang]
    const [era, setEra] = useState<EraId | "all">("all")

    useSeo({
        title: `${copy.breadcrumb} | Better Pagbilao`,
        description:
            "The history of Pagbilao, Quezon: Franciscan parish records from 1688, the 1730 founding date, the papag and bilao origin story, the 1941 crossroads, and 120 years of census counts, with every source listed.",
        path: PAGE_PATH,
    })

    const visibleEras = HISTORY_ERAS.filter((item) => era === "all" || item.id === era)

    return (
        <>
            {/* Hero */}
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb items={[{ label: t.services.breadcrumbHome, to: "/" }, { label: copy.breadcrumb }]} />
                    <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.eyebrow}</p>
                    <h1 className="mt-3 max-w-4xl text-3xl font-black sm:text-4xl lg:text-5xl lg:leading-[1.1]">{copy.heading}</h1>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-white/76">{copy.intro}</p>

                    <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
                        {copy.facts.map((fact) => (
                            <div key={fact.label} className="rounded-lg bg-white/8 px-4 py-3 ring-1 ring-white/12">
                                <dd className="text-2xl font-black text-bayan-gold sm:text-3xl">{fact.value}</dd>
                                <dt className="mt-0.5 text-xs font-bold leading-4 text-white/64">{fact.label}</dt>
                            </div>
                        ))}
                    </dl>

                    <nav aria-label={copy.onThisPage} className="mt-8">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-white/56">{copy.onThisPage}</p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                            {SECTION_IDS.map((id) => (
                                <li key={id}>
                                    <a href={`#${id}`} className="inline-flex rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-black text-white ring-1 ring-white/20 transition hover:bg-white/16">
                                        {copy.sections[id]}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </section>

            {/* How to read + beginnings */}
            <section id="beginnings" className="scroll-mt-32 bg-bayan-mist py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
                        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">{copy.howToRead.heading}</h2>
                        <ul className="mt-4 grid gap-4 md:grid-cols-3">
                            {(["record", "tradition", "context"] as const).map((kind) => (
                                <li key={kind} className="flex items-start gap-3">
                                    <KindBadge kind={kind} label={copy.howToRead[kind].label} />
                                    <p className="text-sm font-semibold leading-6 text-slate-600">{copy.howToRead[kind].body}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-12">
                        <SectionHeading eyebrow={copy.sections.beginnings}>{copy.beginnings.heading}</SectionHeading>
                        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">{copy.beginnings.intro}</p>
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-3">
                        {copy.beginnings.cards.map((card, index) => {
                            const kind: EntryKind = index === 0 ? "tradition" : "record"
                            return (
                                <article key={card.title} className="flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
                                    <div className="flex items-center gap-3">
                                        <span className="grid h-9 w-9 place-items-center rounded-full bg-bayan-ink text-sm font-black text-bayan-gold">{index + 1}</span>
                                        <KindBadge kind={kind} label={card.label} />
                                    </div>
                                    <h3 className="mt-4 text-lg font-black leading-6">{card.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">{card.body}</p>
                                </article>
                            )
                        })}
                    </div>
                    <p className="mt-6 max-w-3xl rounded-lg border-l-4 border-bayan-gold bg-white px-5 py-4 text-sm font-semibold leading-7 text-slate-700">{copy.beginnings.closing}</p>
                </div>
            </section>

            {/* Timeline */}
            <section id="timeline" className="scroll-mt-32 bg-white py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow={copy.sections.timeline}>{copy.timeline.heading}</SectionHeading>
                    <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">{copy.timeline.intro}</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {[{ id: "all" as const, label: copy.timeline.all }, ...HISTORY_ERAS.map((item) => ({ id: item.id, label: item.title[lang] }))].map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                aria-pressed={era === option.id}
                                onClick={() => setEra(option.id)}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-black transition ${
                                    era === option.id ? "bg-bayan-ink text-white" : "bg-bayan-mist text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 grid gap-12">
                        {visibleEras.map((item) => {
                            const entries = HISTORY_TIMELINE.filter((entry) => entry.era === item.id)
                            return (
                                <div key={item.id}>
                                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-slate-200 pb-3">
                                        <h3 className="text-xl font-black">{item.title[lang]}</h3>
                                        <span className="text-sm font-black text-bayan-blue">{item.years}</span>
                                    </div>
                                    <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">{item.blurb[lang]}</p>

                                    {entries.length === 0 ? (
                                        <p className="mt-6 text-sm font-semibold text-slate-500">{copy.timeline.noResults}</p>
                                    ) : (
                                        <ol className="relative mt-6 ml-2 border-l-2 border-slate-200 pl-6 sm:ml-3 sm:pl-8">
                                            {entries.map((entry) => (
                                                <li key={entry.id} className="relative pb-9 last:pb-0">
                                                    <span className={`absolute -left-[33px] top-1.5 h-4 w-4 rounded-full ring-4 ring-white sm:-left-[41px] ${KIND_STYLE[entry.kind].dot}`} />
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                        <p className="text-sm font-black text-bayan-blue">{entry.year[lang]}</p>
                                                        <KindBadge kind={entry.kind} label={copy.howToRead[entry.kind].label} />
                                                    </div>
                                                    <h4 className="mt-1.5 text-lg font-black leading-6">{entry.title[lang]}</h4>
                                                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{entry.text[lang]}</p>
                                                    <p className="mt-2 text-xs font-bold text-slate-400">
                                                        {copy.timeline.sourcesLabel}:{" "}
                                                        {entry.sources.map((id, position) => (
                                                            <span key={id}>
                                                                {position > 0 && ", "}
                                                                <a href={`#source-${id}`} className="text-bayan-blue hover:underline">
                                                                    {id}
                                                                </a>
                                                            </span>
                                                        ))}
                                                    </p>
                                                </li>
                                            ))}
                                        </ol>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Church */}
            <section id="church" className="scroll-mt-32 bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.sections.church}</p>
                    <h2 className="mt-2 max-w-3xl text-2xl font-black sm:text-3xl">{copy.church.heading}</h2>
                    <p className="mt-3 max-w-3xl text-base leading-8 text-white/76">{copy.church.intro}</p>

                    <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {CHURCH_STEPS.map((step) => (
                            <li key={step.year} className="rounded-lg bg-white/8 p-4 ring-1 ring-white/12">
                                <p className="text-sm font-black text-bayan-gold">{step.year}</p>
                                <p className="mt-1 text-base font-black leading-5">{step.title[lang]}</p>
                                <p className="mt-1 text-sm leading-6 text-white/72">{step.text[lang]}</p>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        <figure className="rounded-lg bg-white p-6 text-bayan-ink shadow-soft">
                            <div className="flex items-center gap-2 text-bayan-blue">
                                <Quote className="h-5 w-5" />
                                <h3 className="text-sm font-black uppercase tracking-[0.14em]">{copy.church.markerHeading}</h3>
                            </div>
                            <blockquote lang="tl" className="mt-4 border-l-4 border-bayan-gold pl-4 text-sm font-semibold italic leading-7 text-slate-700">
                                {MARKER_TEXT}
                            </blockquote>
                            <figcaption className="mt-3 text-xs font-semibold leading-5 text-slate-500">{copy.church.markerNote}</figcaption>
                        </figure>
                        <div className="rounded-lg bg-white/8 p-6 ring-1 ring-white/12">
                            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-bayan-gold">{copy.church.translationLabel}</h3>
                            <p lang="en" className="mt-4 text-sm leading-7 text-white/82">{copy.church.translation}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1941 */}
            <section id="war" className="scroll-mt-32 bg-white py-14 sm:py-16">
                <div className="mx-auto grid max-w-[1600px] gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
                    <div>
                        <SectionHeading eyebrow={copy.sections.war}>{copy.war.heading}</SectionHeading>
                        <div className="mt-4 grid max-w-3xl gap-4 text-base leading-8 text-slate-600">
                            {copy.war.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                    <dl className="grid content-start gap-3">
                        {copy.war.facts.map((fact) => (
                            <div key={fact.label} className="rounded-lg border border-slate-200 bg-bayan-mist px-5 py-4">
                                <dd className="text-2xl font-black text-bayan-blue">{fact.value}</dd>
                                <dt className="mt-0.5 text-sm font-bold text-slate-600">{fact.label}</dt>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* Growth */}
            <section id="growth" className="scroll-mt-32 bg-bayan-mist py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow={copy.sections.growth}>{copy.growth.heading}</SectionHeading>
                    <p className="mt-3 text-base leading-8 text-slate-600">{copy.growth.intro}</p>
                    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
                        <Suspense fallback={<div className="h-80 animate-pulse rounded-lg bg-white" />}>
                            <PopulationChart
                                data={CENSUS}
                                lang={lang}
                                title={copy.growth.chartTitle}
                                ariaLabel={copy.growth.chartLabel}
                                showTable={copy.growth.showTable}
                                showChart={copy.growth.showChart}
                                yearColumn={copy.growth.yearColumn}
                                populationColumn={copy.growth.populationColumn}
                            />
                        </Suspense>
                        <div className="grid gap-4">
                            <p className="rounded-lg bg-bayan-ink p-5 text-lg font-black leading-7 text-white">{copy.growth.readout}</p>
                            <p className="text-sm font-semibold leading-7 text-slate-600">{copy.growth.note}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mayors */}
            <section id="mayors" className="scroll-mt-32 bg-white py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow={copy.sections.mayors}>{copy.mayors.heading}</SectionHeading>
                    <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">{copy.mayors.intro}</p>
                    <MayorList />
                    <p className="mt-6 max-w-3xl text-xs font-semibold leading-6 text-slate-500">{copy.mayors.note}</p>
                </div>
            </section>

            {/* Traditions */}
            <section id="traditions" className="scroll-mt-32 bg-bayan-mist py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow={copy.sections.traditions}>{copy.traditions.heading}</SectionHeading>
                    <p className="mt-3 text-base leading-8 text-slate-600">{copy.traditions.intro}</p>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {copy.traditions.cards.map((card) => (
                            <article key={card.title} className="rounded-lg border border-slate-200 bg-white p-6">
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-bayan-blue">{card.when}</p>
                                <h3 className="mt-2 text-lg font-black leading-6">{card.title}</h3>
                                <p className="mt-2 text-sm leading-7 text-slate-600">{card.body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contribute */}
            <section id="contribute" className="scroll-mt-32 bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto grid max-w-[1600px] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{copy.sections.contribute}</p>
                        <h2 className="mt-2 text-2xl font-black sm:text-3xl">{copy.contribute.heading}</h2>
                        <p className="mt-3 max-w-xl text-base leading-8 text-white/76">{copy.contribute.intro}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href="https://www.facebook.com/profile.php?id=61593848205577"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-md bg-bayan-gold px-5 py-3 text-sm font-black text-bayan-ink transition hover:bg-amber-400"
                            >
                                {copy.contribute.facebook} <ArrowRight className="h-4 w-4" />
                            </a>
                            <a
                                href="https://github.com/rallion90/better-pagbilao/issues"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/16"
                            >
                                {copy.contribute.github} <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                        <p className="mt-4 max-w-xl text-xs font-semibold leading-6 text-white/60">{copy.contribute.privacy}</p>
                    </div>
                    <div className="rounded-lg bg-white/8 p-6 ring-1 ring-white/12">
                        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-bayan-gold">
                            <BookOpenText className="h-4 w-4" /> {copy.contribute.wantedHeading}
                        </h3>
                        <ul className="mt-4 grid gap-3 text-sm font-semibold leading-6 text-white/84">
                            {copy.contribute.wanted.map((item) => (
                                <li key={item} className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bayan-gold" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Sources */}
            <section id="sources" className="scroll-mt-32 bg-white py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow={copy.sections.sources}>{copy.sources.heading}</SectionHeading>
                    <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">{copy.sources.intro}</p>

                    <ol className="mt-8 grid gap-3 lg:grid-cols-2">
                        {HISTORY_SOURCES.map((source) => (
                            <li key={source.id} id={`source-${source.id}`} className="scroll-mt-32 flex gap-3 rounded-lg border border-slate-200 bg-bayan-mist p-4">
                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-bayan-ink text-xs font-black text-white">{source.id}</span>
                                <div className="min-w-0">
                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="break-words text-sm font-black text-bayan-blue hover:underline">
                                        {source.title}
                                    </a>
                                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{source.note[lang]}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-10 grid gap-8 lg:grid-cols-2">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">{copy.sources.disagreeHeading}</h3>
                            <ul className="mt-3 grid gap-2 text-sm font-semibold leading-7 text-slate-600">
                                {copy.sources.disagree.map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">{copy.sources.gapsHeading}</h3>
                            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{copy.sources.gaps}</p>
                            <p className="mt-6 rounded-lg border-l-4 border-bayan-blue bg-bayan-mist px-5 py-4 text-sm font-semibold leading-7 text-slate-700">{copy.sources.disclaimer}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HistoryPage
