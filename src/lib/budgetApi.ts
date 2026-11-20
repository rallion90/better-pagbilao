/**
 * National budget lines for Pagbilao, read from the public BetterGov.ph Budget API
 * (https://budget.bettergov.ph/docs). Read-only, CORS-open, no key needed.
 *
 * The paging and the "whole word" rule are adapted from bettergovph/transparency-portal
 * (src/api/client.ts, src/lib/match.ts), MIT License, Copyright (c) 2026 BetterGov.ph.
 * https://github.com/bettergovph/transparency-portal/blob/main/LICENSE
 */

export const BUDGET_API = "https://budget.bettergov.ph/api/v1"
export const BUDGET_SITE = "https://budget.bettergov.ph/hgab/2027/overview"

/** The place search. Every program title that names it is a candidate. */
export const PLACE_QUERY = "Pagbilao"
export const PLACE_REGION = "IV-A"

/** The four 2027 House bill datasets: DPWH, farm-to-market roads, health facilities, irrigation. */
export const DATASETS_2027 = ["dpwh", "fmr", "hfep", "nia"] as const
export type Dataset2027 = (typeof DATASETS_2027)[number]

export const GAA_YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026] as const

/**
 * Lines removed by hand, with the reason. Key: `<dataset>:<id>` for 2027, `gaa:<fam_key>` for 2020–2026.
 * The page lists them, so nothing is hidden silently.
 */
export const MANUAL_EXCLUSIONS: Record<string, string> = {}

export type BridgeGroup = "house_only" | "nep_only" | "unchanged" | "increased" | "decreased" | "scope_review"

export interface Disclaimer {
    id: string
    title: string
    body: string
    url?: string
}

export interface ProjectRow {
    id: string
    dataset: Dataset2027
    title: string
    program: string | null
    pap: string | null
    region_key: string | null
    office: string | null
    bridge_group: BridgeGroup
    status_label: string
    held: boolean
    house_match: string | null
    nep_php: number | null
    house_php: number | null
    nep_page: number | null
    hgab3_page: number | null
    hgab2_page: number | null
    pdf_url: { nep: string | null; hgab2: string | null; hgab3: string | null }
    url: string
}

export interface GaaDepartment {
    id: string
    description: string
}

export interface GaaProgram {
    department_id: string
    agency_id: string | null
    fam_key: string
    name: string
    years: Record<string, { count: number; amount: number }>
}

interface Envelope<T> {
    meta: { notice?: string; built_at?: string; source_repo?: string }
    disclaimers?: Disclaimer[]
    data: T
    next_cursor?: string | null
}

const PAGE_SIZE = 200
const GAA_PAGE_SIZE = 500
/** No single town should match more than this; the list is cut there. */
const MAX_ROWS = 4000

async function getJson<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
    const url = new URL(BUDGET_API + path)
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") url.searchParams.set(key, String(value))
    }
    const res = await fetch(url, { headers: { accept: "application/json" } })
    if (!res.ok) throw new Error(`Budget API ${res.status} for ${url.pathname}`)
    return (await res.json()) as T
}

const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()

/**
 * Whether a title places the line in Pagbilao.
 *
 * The API's `q` matches inside words and inside road names, so "Pagbilao-Tayabas-Lucban
 * Diversion Road (Lucban Section)" and "Mayao Br. along Pagbilao-Dalahican Port Rd" come
 * back too, though both are in other towns. A title counts only when "Pagbilao" stands
 * alone as a word at least once, not joined to another place by a hyphen.
 */
export function namesPagbilao(title: string): boolean {
    const word = fold(PLACE_QUERY)
    return fold(title)
        // "Pagbilao - Dalahican Port Rd" and "Pagbilao – Tayabas" are road names too.
        .replace(/\s*[-‐‑‒–—]\s*/g, "-")
        .split(/\s+/)
        .some((token) => {
            if (!token.includes(word)) return false
            if (token.includes(`-${word}`) || token.includes(`${word}-`)) return false
            return new RegExp(`(?<![\\p{L}\\p{N}])${word}(?![\\p{L}\\p{N}])`, "u").test(token)
        })
}

export type Excluded = { key: string; title: string; reason: "namesake" | "manual"; note?: string }

export interface Budget2027 {
    rows: ProjectRow[]
    excluded: Excluded[]
    notice: string | null
    builtAt: string | null
    disclaimers: Disclaimer[]
}

async function allProjects(dataset: Dataset2027) {
    const path = `/hgab/2027/datasets/${dataset}/projects`
    const filters = { q: PLACE_QUERY }
    const first = await getJson<Envelope<{ total: number; rows: ProjectRow[] }>>(path, { ...filters, limit: PAGE_SIZE, offset: 0 })
    const total = Math.min(first.data.total, MAX_ROWS)
    const rest: Promise<Envelope<{ total: number; rows: ProjectRow[] }>>[] = []
    for (let offset = PAGE_SIZE; offset < total; offset += PAGE_SIZE) {
        rest.push(getJson(path, { ...filters, limit: PAGE_SIZE, offset }))
    }
    const pages = await Promise.all(rest)
    return { first, rows: [first, ...pages].flatMap((page) => page.data.rows) }
}

export async function loadBudget2027(): Promise<Budget2027> {
    const results = await Promise.all(DATASETS_2027.map((dataset) => allProjects(dataset)))
    const rows: ProjectRow[] = []
    const excluded: Excluded[] = []
    const seen = new Set<string>()

    for (const { rows: datasetRows } of results) {
        for (const row of datasetRows) {
            const key = `${row.dataset}:${row.id}`
            if (seen.has(key)) continue
            seen.add(key)
            // The irrigation list gives no region, so a missing region is kept.
            if (row.region_key && row.region_key !== PLACE_REGION) continue
            if (MANUAL_EXCLUSIONS[key]) {
                excluded.push({ key, title: row.title, reason: "manual", note: MANUAL_EXCLUSIONS[key] })
            } else if (!namesPagbilao(row.title)) {
                excluded.push({ key, title: row.title, reason: "namesake" })
            } else {
                rows.push(row)
            }
        }
    }

    const first = results[0].first
    return {
        rows,
        excluded,
        notice: first.meta.notice ?? null,
        builtAt: first.meta.built_at ?? null,
        disclaimers: first.disclaimers ?? [],
    }
}

export interface EnactedProgram extends GaaProgram {
    department: string
}

export interface BudgetEnacted {
    programs: EnactedProgram[]
    excluded: Excluded[]
    /** Departments whose search failed; their lines are missing from the totals. */
    failedDepartments: string[]
}

async function gaaPrograms(departmentId: string): Promise<GaaProgram[]> {
    const path = `/gaa/departments/${departmentId}/programs`
    const rows: GaaProgram[] = []
    let cursor: string | null | undefined
    do {
        const page: Envelope<GaaProgram[]> = await getJson(path, { q: PLACE_QUERY, limit: GAA_PAGE_SIZE, cursor: cursor ?? undefined })
        rows.push(...page.data)
        cursor = page.next_cursor
    } while (cursor && rows.length < MAX_ROWS)
    return rows
}

/** Every department's enacted programs (GAA 2020–2026) whose name places them in Pagbilao. */
export async function loadBudgetEnacted(): Promise<BudgetEnacted> {
    const departments = (await getJson<Envelope<GaaDepartment[]>>("/gaa/departments")).data
    const programs: EnactedProgram[] = []
    const excluded: Excluded[] = []
    const failedDepartments: string[] = []

    // A few departments at a time, to be kind to the API.
    for (let i = 0; i < departments.length; i += 6) {
        const batch = departments.slice(i, i + 6)
        const settled = await Promise.allSettled(batch.map((department) => gaaPrograms(department.id)))
        settled.forEach((result, index) => {
            const department = batch[index]
            if (result.status === "rejected") {
                failedDepartments.push(department.description)
                return
            }
            for (const program of result.value) {
                const key = `gaa:${program.fam_key}`
                if (MANUAL_EXCLUSIONS[key]) {
                    excluded.push({ key, title: program.name, reason: "manual", note: MANUAL_EXCLUSIONS[key] })
                } else if (!namesPagbilao(program.name)) {
                    excluded.push({ key, title: program.name, reason: "namesake" })
                } else if (GAA_YEARS.some((year) => (program.years[year]?.amount ?? 0) > 0)) {
                    programs.push({ ...program, department: department.description })
                }
            }
        })
    }

    return { programs, excluded, failedDepartments }
}

/** A year counts only where its amount is above zero: later years carry old lines at ₱0. */
export function gaaAmount(program: GaaProgram, year: number): number {
    return Math.max(0, program.years[year]?.amount ?? 0)
}
