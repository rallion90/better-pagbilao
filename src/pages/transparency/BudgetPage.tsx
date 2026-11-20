import { useMemo, useState } from "react"
import { useSearchParams } from "react-router"
import { AlertTriangle, ExternalLink, FileText, Info, Landmark, Search } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import { budgetPageCopy } from "../../i18n/budgetPage"
import type { BudgetPageCopy } from "../../i18n/budgetPage"
import { useBudget2027, useBudgetEnacted } from "../../hooks/useBudget"
import { useSeo } from "../../hooks/useSeo"
import PageBanner from "../../components/common/PageBanner"
import { BUDGET_SITE, GAA_YEARS, gaaAmount } from "../../lib/budgetApi"
import type { BridgeGroup, Disclaimer, EnactedProgram, Excluded, ProjectRow } from "../../lib/budgetApi"

const PAGE_PATH = "/transparency/budget"

const pesoFull = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 })
const pesoCompact = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", notation: "compact", maximumFractionDigits: 1 })

const peso = (n: number) => pesoFull.format(n)
const pesoShort = (n: number) => pesoCompact.format(n)
const signedPesoShort = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "") + pesoCompact.format(Math.abs(n))

const GROUP_ORDER: BridgeGroup[] = ["house_only", "nep_only", "increased", "decreased", "scope_review", "unchanged"]

const GROUP_BADGE: Record<BridgeGroup, string> = {
    house_only: "border-bayan-sea/40 bg-bayan-sea-light text-bayan-sea-deep",
    nep_only: "border-bayan-bamboo/50 bg-bayan-bamboo-light text-bayan-bamboo-deep",
    increased: "border-bayan-green/30 bg-green-50 text-bayan-green",
    decreased: "border-bayan-red/30 bg-red-50 text-bayan-red",
    scope_review: "border-slate-300 bg-slate-100 text-slate-700",
    unchanged: "border-slate-200 bg-white text-slate-600",
}

const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()

/** "Department of Public Works and Highways (DPWH)" → "DPWH". */
const shortDepartment = (name: string) => name.match(/\(([^)]+)\)\s*$/)?.[1] ?? name

const isUnconfirmed = (row: ProjectRow) => row.held || row.house_match === "fuzzy_candidate"

const BudgetPage = () => {
    const { t, lang } = useLanguage()
    const copy = budgetPageCopy[lang]
    const [searchParams, setSearchParams] = useSearchParams()
    const view = searchParams.get("view") === "enacted" ? "enacted" : "proposed"

    const proposed = useBudget2027()
    const enacted = useBudgetEnacted(view === "enacted")

    useSeo({
        title: `${copy.heading} | Better Pagbilao Transparency`,
        description:
            "National budget projects for Pagbilao, Quezon: the FY 2027 NEP and House bill side by side, and the enacted budgets of 2020 to 2026, each linked to its source document.",
        path: PAGE_PATH,
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "Pagbilao in the National Budget",
            description: "FY 2027 NEP and House bill lines, and GAA 2020–2026 lines, whose titles name Pagbilao, Quezon.",
            isBasedOn: "https://budget.bettergov.ph/docs",
            spatialCoverage: { "@type": "Place", name: "Pagbilao, Quezon, Philippines" },
        },
    })

    const setView = (next: "proposed" | "enacted") => {
        const params = new URLSearchParams(searchParams)
        if (next === "enacted") params.set("view", "enacted")
        else params.delete("view")
        setSearchParams(params, { replace: true })
    }

    return (
        <>
            <PageBanner
                breadcrumbs={[
                    { label: t.transparencyPages.breadcrumbHome, to: "/" },
                    { label: t.transparencyPages.breadcrumbTransparency },
                    { label: copy.breadcrumb },
                ]}
                eyebrow={copy.eyebrow}
                title={copy.heading}
                description={copy.intro}
            />

            <section className="bg-white py-12 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-3 rounded-lg border border-slate-200 bg-bayan-mist p-4 sm:p-5">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-bayan-blue" aria-hidden />
                        <div>
                            <h2 className="text-sm font-black text-bayan-ink">{copy.whatIsThis.heading}</h2>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{copy.whatIsThis.body}</p>
                        </div>
                    </div>

                    <div role="tablist" aria-label={copy.heading} className="mt-8 flex flex-wrap gap-2 border-b border-slate-200">
                        {(["proposed", "enacted"] as const).map((key) => (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={view === key}
                                onClick={() => setView(key)}
                                className={`-mb-px border-b-2 px-3 pb-3 pt-1 text-sm font-black transition sm:px-4 ${
                                    view === key ? "border-bayan-blue text-bayan-blue" : "border-transparent text-slate-500 hover:text-bayan-ink"
                                }`}
                            >
                                {copy.tabs[key]}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8">
                        {view === "proposed" ? (
                            <>
                                {proposed.loading && <LoadingNote text={copy.loading} />}
                                {proposed.error && <ErrorNote text={copy.error} />}
                                {proposed.data && <ProposedView copy={copy} rows={proposed.data.rows} excluded={proposed.data.excluded} />}
                            </>
                        ) : (
                            <>
                                {enacted.loading && <LoadingNote text={copy.loading} />}
                                {enacted.error && <ErrorNote text={copy.error} />}
                                {enacted.data && (
                                    <EnactedView
                                        copy={copy}
                                        programs={enacted.data.programs}
                                        excluded={enacted.data.excluded}
                                        failed={enacted.data.failedDepartments}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    <Notices
                        copy={copy}
                        lang={lang}
                        notice={proposed.data?.notice ?? null}
                        builtAt={proposed.data?.builtAt ?? null}
                        disclaimers={proposed.data?.disclaimers ?? []}
                    />
                </div>
            </section>
        </>
    )
}

const LoadingNote = ({ text }: { text: string }) => (
    <div className="space-y-3" aria-busy="true">
        <p className="text-sm font-semibold text-slate-500">{text}</p>
        <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-100" />
            ))}
        </div>
    </div>
)

const ErrorNote = ({ text }: { text: string }) => (
    <p className="rounded-lg border border-bayan-red/30 bg-red-50 p-4 text-sm font-semibold text-bayan-red">{text}</p>
)

const StatCard = ({ label, value, sub, title }: { label: string; value: string; sub: string; title?: string }) => (
    <div className="rounded-lg border border-slate-200 p-5" title={title}>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-black tabular-nums text-bayan-ink">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{sub}</p>
    </div>
)

const ProposedView = ({ copy, rows, excluded }: { copy: BudgetPageCopy; rows: ProjectRow[]; excluded: Excluded[] }) => {
    const c = copy.proposed
    const [query, setQuery] = useState("")
    const [group, setGroup] = useState<BridgeGroup | "all">("all")

    const totals = useMemo(() => {
        const nep = rows.filter((r) => r.nep_php != null)
        const house = rows.filter((r) => r.house_php != null)
        const nepSum = nep.reduce((s, r) => s + (r.nep_php ?? 0), 0)
        const houseSum = house.reduce((s, r) => s + (r.house_php ?? 0), 0)
        return { nepSum, houseSum, nepCount: nep.length, houseCount: house.length }
    }, [rows])

    const counts = useMemo(() => {
        const map = new Map<BridgeGroup, number>()
        rows.forEach((r) => map.set(r.bridge_group, (map.get(r.bridge_group) ?? 0) + 1))
        return map
    }, [rows])

    const visible = useMemo(() => {
        const q = fold(query.trim())
        return rows
            .filter((r) => group === "all" || r.bridge_group === group)
            .filter((r) => !q || fold(`${r.title} ${r.program ?? ""} ${r.office ?? ""}`).includes(q))
            .sort((a, b) => Math.max(b.house_php ?? 0, b.nep_php ?? 0) - Math.max(a.house_php ?? 0, a.nep_php ?? 0))
    }, [rows, query, group])

    return (
        <div>
            <h2 className="text-xl font-black text-bayan-ink sm:text-2xl">{c.heading}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{c.intro}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <StatCard label={c.nepLabel} value={pesoShort(totals.nepSum)} sub={`${c.projects(totals.nepCount)} · ${c.nepSub}`} title={peso(totals.nepSum)} />
                <StatCard label={c.houseLabel} value={pesoShort(totals.houseSum)} sub={`${c.projects(totals.houseCount)} · ${c.houseSub}`} title={peso(totals.houseSum)} />
                <StatCard
                    label={c.diffLabel}
                    value={signedPesoShort(totals.houseSum - totals.nepSum)}
                    sub={c.diffSub}
                    title={peso(totals.houseSum - totals.nepSum)}
                />
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-500">{c.notAdded}</p>

            <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                    <FilterChip active={group === "all"} onClick={() => setGroup("all")} label={c.all} count={rows.length} />
                    {GROUP_ORDER.filter((g) => counts.get(g)).map((g) => (
                        <FilterChip
                            key={g}
                            active={group === g}
                            onClick={() => setGroup(g)}
                            label={c.groups[g].label}
                            count={counts.get(g) ?? 0}
                            title={c.groups[g].help}
                        />
                    ))}
                </div>
                <SearchBox label={c.searchLabel} placeholder={c.searchPlaceholder} value={query} onChange={setQuery} />
            </div>

            {group !== "all" && <p className="mt-3 text-sm leading-6 text-slate-600">{c.groups[group].help}</p>}

            {visible.length === 0 ? (
                <p className="mt-6 text-sm text-slate-600">{c.noResults}</p>
            ) : (
                <ul className="mt-6 grid gap-3 lg:grid-cols-2">
                    {visible.map((row) => (
                        <ProjectCard key={`${row.dataset}:${row.id}`} row={row} copy={copy} />
                    ))}
                </ul>
            )}

            <ExcludedList copy={copy} excluded={excluded} />
        </div>
    )
}

const ProjectCard = ({ row, copy }: { row: ProjectRow; copy: BudgetPageCopy }) => {
    const c = copy.proposed
    const housePage = row.hgab3_page ?? row.hgab2_page
    const housePdf = row.pdf_url.hgab3 ?? row.pdf_url.hgab2
    return (
        <li className="flex flex-col rounded-lg border border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${GROUP_BADGE[row.bridge_group]}`} title={c.groups[row.bridge_group].help}>
                    {c.groups[row.bridge_group].label}
                </span>
                {isUnconfirmed(row) && (
                    <span
                        className="inline-flex items-center gap-1 rounded-full border border-bayan-gold/60 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800"
                        title={c.unconfirmedHelp}
                    >
                        <AlertTriangle className="h-3 w-3" aria-hidden />
                        {c.unconfirmed}
                    </span>
                )}
                {row.program && <span className="text-xs font-semibold text-slate-500">{row.program}</span>}
            </div>
            <h3 className="mt-2 text-sm font-bold leading-6 text-bayan-ink sm:text-base">{row.title}</h3>
            {row.office && (
                <p className="mt-1 text-xs text-slate-500">
                    {c.office}: {row.office}
                </p>
            )}

            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <AmountCell label={c.nep} amount={row.nep_php} page={row.nep_page} pdf={row.pdf_url.nep} copy={copy} />
                <AmountCell label={c.house} amount={row.house_php} page={housePage} pdf={housePdf} copy={copy} />
            </dl>

            <a
                href={row.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 self-start text-xs font-bold text-bayan-blue hover:underline"
            >
                {c.moreDetails}
                <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
        </li>
    )
}

const AmountCell = ({
    label,
    amount,
    page,
    pdf,
    copy,
}: {
    label: string
    amount: number | null
    page: number | null
    pdf: string | null
    copy: BudgetPageCopy
}) => (
    <div>
        <dt className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{label}</dt>
        {amount == null ? (
            <dd className="mt-1 text-sm text-slate-400" title={copy.proposed.noLine}>
                — <span className="sr-only">{copy.proposed.noLine}</span>
            </dd>
        ) : (
            <dd className="mt-1">
                <span className="text-base font-black tabular-nums text-bayan-ink">{peso(amount)}</span>
                {pdf && (
                    <a
                        href={pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-bayan-blue hover:underline"
                    >
                        <FileText className="h-3 w-3" aria-hidden />
                        {page ? copy.proposed.page(page) : copy.proposed.document}
                    </a>
                )}
            </dd>
        )}
    </div>
)

const FilterChip = ({ active, onClick, label, count, title }: { active: boolean; onClick: () => void; label: string; count: number; title?: string }) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        title={title}
        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
            active ? "border-bayan-blue bg-bayan-blue text-white" : "border-slate-200 bg-white text-slate-600 hover:border-bayan-blue hover:text-bayan-blue"
        }`}
    >
        {label} <span className={active ? "text-white/80" : "text-slate-400"}>{count}</span>
    </button>
)

const SearchBox = ({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) => (
    <label className="relative block w-full lg:w-80">
        <span className="sr-only">{label}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm text-bayan-ink outline-none focus:border-bayan-blue focus:ring-2 focus:ring-bayan-blue/20"
        />
    </label>
)

const EnactedView = ({ copy, programs, excluded, failed }: { copy: BudgetPageCopy; programs: EnactedProgram[]; excluded: Excluded[]; failed: string[] }) => {
    const c = copy.enacted
    const [query, setQuery] = useState("")
    const [year, setYear] = useState<number | "all">("all")

    const yearly = useMemo(
        () =>
            GAA_YEARS.map((y) => {
                const funded = programs.filter((p) => gaaAmount(p, y) > 0)
                return { year: y, amount: funded.reduce((s, p) => s + gaaAmount(p, y), 0), lines: funded.length }
            }),
        [programs],
    )
    const max = Math.max(1, ...yearly.map((y) => y.amount))
    const peak = yearly.reduce((best, y) => (y.amount > best.amount ? y : best), yearly[0])

    const visible = useMemo(() => {
        const q = fold(query.trim())
        const total = (p: EnactedProgram) => GAA_YEARS.reduce((s, y) => s + gaaAmount(p, y), 0)
        return programs
            .filter((p) => year === "all" || gaaAmount(p, year) > 0)
            .filter((p) => !q || fold(`${p.name} ${p.department}`).includes(q))
            .map((p) => ({ program: p, total: total(p) }))
            .sort((a, b) => b.total - a.total)
    }, [programs, query, year])

    return (
        <div>
            <h2 className="text-xl font-black text-bayan-ink sm:text-2xl">{c.heading}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{c.intro}</p>

            {failed.length > 0 && (
                <p className="mt-4 rounded-lg border border-bayan-gold/60 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{c.partial(failed.join(", "))}</p>
            )}

            <figure className="mt-6 rounded-lg border border-slate-200 p-4 sm:p-6">
                <figcaption className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{c.chartLabel}</figcaption>
                <div className="mt-6 flex h-48 items-end gap-2 sm:gap-4">
                    {yearly.map((y) => {
                        const active = year === y.year
                        const label = `${y.year}: ${peso(y.amount)} · ${c.lines(y.lines)}`
                        return (
                            <button
                                key={y.year}
                                type="button"
                                onClick={() => setYear(active ? "all" : y.year)}
                                aria-pressed={active}
                                aria-label={label}
                                title={label}
                                className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                            >
                                <span
                                    className={`pointer-events-none mb-1 whitespace-nowrap text-[11px] font-bold tabular-nums text-slate-600 sm:text-xs ${
                                        y.year === peak.year || active ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                                    }`}
                                >
                                    {pesoShort(y.amount)}
                                </span>
                                <span
                                    className={`w-full max-w-14 rounded-t transition ${active ? "bg-bayan-ink" : "bg-bayan-blue group-hover:bg-bayan-ink"}`}
                                    style={{ height: `${Math.max(2, (y.amount / max) * 100)}%`, maxHeight: "calc(100% - 1.5rem)" }}
                                />
                            </button>
                        )
                    })}
                </div>
                <div className="mt-2 flex gap-2 border-t border-slate-200 pt-2 sm:gap-4">
                    {yearly.map((y) => (
                        <span key={y.year} className={`flex-1 text-center text-xs font-bold tabular-nums ${year === y.year ? "text-bayan-ink" : "text-slate-500"}`}>
                            {y.year}
                        </span>
                    ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">{c.chartNote}</p>
            </figure>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    {c.tableLabel} <span className="text-slate-400">({visible.length})</span>
                </h3>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        {c.yearFilter}
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value === "all" ? "all" : Number(e.target.value))}
                            className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-bayan-ink outline-none focus:border-bayan-blue"
                        >
                            <option value="all">{c.allYears}</option>
                            {GAA_YEARS.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </label>
                    <SearchBox label={c.tableLabel} placeholder={c.searchPlaceholder} value={query} onChange={setQuery} />
                </div>
            </div>

            {visible.length === 0 ? (
                <p className="mt-6 text-sm text-slate-600">{c.noResults}</p>
            ) : (
                <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full min-w-[960px] text-left text-sm">
                        <thead className="bg-bayan-mist text-xs font-black uppercase tracking-[0.1em] text-slate-500">
                            <tr>
                                <th scope="col" className="px-4 py-3">
                                    {c.program}
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    {c.department}
                                </th>
                                {GAA_YEARS.map((y) => (
                                    <th key={y} scope="col" className={`px-3 py-3 text-right ${year === y ? "text-bayan-ink" : ""}`}>
                                        {y}
                                    </th>
                                ))}
                                <th scope="col" className="px-4 py-3 text-right">
                                    {c.total}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visible.map(({ program, total }) => (
                                <tr key={program.fam_key} className="align-top">
                                    <td className="max-w-md px-4 py-3 font-semibold leading-5 text-bayan-ink">{program.name}</td>
                                    <td className="px-3 py-3 text-xs font-bold text-slate-500" title={program.department}>
                                        {shortDepartment(program.department)}
                                    </td>
                                    {GAA_YEARS.map((y) => {
                                        const amount = gaaAmount(program, y)
                                        return (
                                            <td
                                                key={y}
                                                className={`whitespace-nowrap px-3 py-3 text-right tabular-nums ${amount > 0 ? "text-slate-700" : "text-slate-300"} ${
                                                    year === y ? "bg-blue-50/60" : ""
                                                }`}
                                                title={amount > 0 ? peso(amount) : undefined}
                                            >
                                                {amount > 0 ? pesoShort(amount) : "—"}
                                            </td>
                                        )
                                    })}
                                    <td className="whitespace-nowrap px-4 py-3 text-right font-black tabular-nums text-bayan-ink" title={peso(total)}>
                                        {pesoShort(total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ExcludedList copy={copy} excluded={excluded} />
        </div>
    )
}

const ExcludedList = ({ copy, excluded }: { copy: BudgetPageCopy; excluded: Excluded[] }) => {
    if (excluded.length === 0) return null
    return (
        <details className="mt-8 rounded-lg border border-slate-200 p-4 text-sm">
            <summary className="cursor-pointer font-bold text-slate-700">{copy.excluded.summary(excluded.length)}</summary>
            <p className="mt-3 leading-6 text-slate-600">{copy.excluded.body}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
                {excluded.map((item) => (
                    <li key={item.key}>
                        {item.title}
                        {item.reason === "manual" && (
                            <span className="text-slate-500">
                                {" "}
                                ({copy.excluded.manual}: {item.note})
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </details>
    )
}

const Notices = ({
    copy,
    lang,
    notice,
    builtAt,
    disclaimers,
}: {
    copy: BudgetPageCopy
    lang: string
    notice: string | null
    builtAt: string | null
    disclaimers: Disclaimer[]
}) => {
    const built = builtAt
        ? new Intl.DateTimeFormat(lang === "tl" ? "fil-PH" : "en-PH", { dateStyle: "long", timeZone: "Asia/Manila" }).format(new Date(builtAt))
        : null
    return (
        <div className="mt-12 border-t border-slate-200 pt-6">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.notices.heading}</h2>
            {/* Printed from the API response itself, so the wording matches budget.bettergov.ph. */}
            {notice && <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">{notice}</p>}
            {disclaimers.length > 0 && (
                <ul className="mt-3 space-y-2">
                    {disclaimers.map((d) => (
                        <li key={d.id} className="max-w-4xl text-sm leading-6 text-slate-600">
                            <strong className="text-bayan-ink">{d.title}</strong> {d.body}{" "}
                            {d.url && (
                                <a href={d.url} target="_blank" rel="noopener noreferrer" aria-label={d.title} className="font-semibold text-bayan-blue hover:underline">
                                    ↗
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-slate-500">
                <Landmark className="h-4 w-4 text-bayan-blue" aria-hidden />
                <span>
                    {copy.notices.sourceLabel}:{" "}
                    <a href={BUDGET_SITE} target="_blank" rel="noopener noreferrer" className="text-bayan-blue hover:underline">
                        {copy.notices.source}
                    </a>
                </span>
                {built && (
                    <span>
                        · {copy.notices.builtAt}: <time dateTime={builtAt ?? undefined}>{built}</time>
                    </span>
                )}
            </p>
            <p className="mt-1 text-xs text-slate-400">
                <a href="https://github.com/bettergovph/transparency-portal" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {copy.notices.codeCredit}
                </a>
            </p>
        </div>
    )
}

export default BudgetPage
