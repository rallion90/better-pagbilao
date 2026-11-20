import type { Language } from "./translations"
import type { BridgeGroup } from "../lib/budgetApi"

export interface BudgetPageCopy {
    breadcrumb: string
    eyebrow: string
    heading: string
    intro: string
    whatIsThis: { heading: string; body: string }
    tabs: { proposed: string; enacted: string }
    loading: string
    error: string
    proposed: {
        heading: string
        intro: string
        nepLabel: string
        nepSub: string
        houseLabel: string
        houseSub: string
        diffLabel: string
        diffSub: string
        notAdded: string
        projects: (n: number) => string
        searchLabel: string
        searchPlaceholder: string
        all: string
        noResults: string
        office: string
        nep: string
        house: string
        noLine: string
        page: (n: number) => string
        document: string
        unconfirmed: string
        unconfirmedHelp: string
        moreDetails: string
        groups: Record<BridgeGroup, { label: string; help: string }>
    }
    enacted: {
        heading: string
        intro: string
        chartLabel: string
        chartNote: string
        lines: (n: number) => string
        tableLabel: string
        searchPlaceholder: string
        yearFilter: string
        allYears: string
        program: string
        department: string
        total: string
        noResults: string
        partial: (departments: string) => string
    }
    excluded: {
        summary: (n: number) => string
        body: string
        manual: string
    }
    notices: {
        heading: string
        sourceLabel: string
        source: string
        builtAt: string
        codeCredit: string
    }
}

const en: BudgetPageCopy = {
    breadcrumb: "Budget",
    eyebrow: "Accountability",
    heading: "Pagbilao in the National Budget",
    intro:
        "Every national project whose title names Pagbilao: what the 2027 budget proposes for our town, and what the enacted budgets gave it from 2020 to 2026. Each figure links to the page of the document it comes from.",
    whatIsThis: {
        heading: "What this page shows",
        body: "These are national government funds for projects in Pagbilao (mostly DPWH roads, buildings and flood control, plus Department of Agriculture farm-to-market roads), not the municipality's own annual budget. Amounts are what the documents allot, not what has been spent.",
    },
    tabs: { proposed: "2027 proposed budget", enacted: "2020–2026 enacted budgets" },
    loading: "Loading budget data…",
    error: "Could not load the budget data right now. Please try again later, or see budget.bettergov.ph directly.",
    proposed: {
        heading: "FY 2027: the NEP and the House bill",
        intro:
            "The NEP is the President's proposed budget. The House bill (House Bill 10858) is the House of Representatives' version of it. They are two versions of one budget, so they are compared side by side, never added.",
        nepLabel: "NEP (President's proposal)",
        nepSub: "Total for Pagbilao lines",
        houseLabel: "House bill",
        houseSub: "Total for Pagbilao lines",
        diffLabel: "Difference",
        diffSub: "House bill minus NEP",
        notAdded: "The two totals are compared, never added.",
        projects: (n) => (n === 1 ? "1 project" : `${n} projects`),
        searchLabel: "Search projects",
        searchPlaceholder: "Search a barangay or project…",
        all: "All",
        noResults: "No projects match this search.",
        office: "Office",
        nep: "NEP",
        house: "House bill",
        noLine: "Not in this version",
        page: (n) => `p. ${n}`,
        document: "document",
        unconfirmed: "Unconfirmed match",
        unconfirmedHelp: "The pairing between the NEP and House bill lines is fuzzy, so treat this as a lead to check.",
        moreDetails: "Details on budget.bettergov.ph",
        groups: {
            house_only: { label: "House bill only", help: "Listed in the House bill but not found in the NEP. A candidate, not a confirmed insertion: it may be new, renamed or re-scoped." },
            nep_only: { label: "NEP only", help: "Listed in the NEP but not found in the House bill. A candidate, not a confirmed deletion: it may have been dropped, renamed or merged." },
            unchanged: { label: "Same amount", help: "The same amount in both versions." },
            increased: { label: "Increased", help: "The House bill gives more than the NEP." },
            decreased: { label: "Decreased", help: "The House bill gives less than the NEP." },
            scope_review: { label: "Scope changed", help: "Matched across versions, but the scope of the line changed." },
        },
    },
    enacted: {
        heading: "2020–2026: the enacted budgets (GAA)",
        intro:
            "The General Appropriations Act is the budget as signed into law each year. These are the programs and projects in any department whose name places them in Pagbilao. An appropriation is the authority to spend, not spending.",
        chartLabel: "Total for Pagbilao lines, by year",
        chartNote: "Years are shown side by side; they are not a running total.",
        lines: (n) => (n === 1 ? "1 line" : `${n} lines`),
        tableLabel: "Every program and project",
        searchPlaceholder: "Search a barangay or project…",
        yearFilter: "Funded in",
        allYears: "Any year",
        program: "Program or project",
        department: "Department",
        total: "Total",
        noResults: "No lines match this search.",
        partial: (departments) => `Some departments could not be loaded, so these totals may be incomplete: ${departments}.`,
    },
    excluded: {
        summary: (n) => (n === 1 ? "1 line was set aside because its title does not place it in Pagbilao" : `${n} lines were set aside because their titles do not place them in Pagbilao`),
        body: "These lines matched the search only because they are on a road named after Pagbilao (such as the Pagbilao–Tayabas–Lucban Diversion Road or the Pagbilao–Dalahican Port Road), but their titles put them in another town or give no town. They are not counted above.",
        manual: "Removed by hand",
    },
    notices: {
        heading: "About this data",
        sourceLabel: "Source",
        source: "BetterGov.ph Budget API",
        builtAt: "Data built",
        codeCredit: "Matching rules adapted from the BetterGov.ph transparency portal (MIT License).",
    },
}

const tl: BudgetPageCopy = {
    breadcrumb: "Budget",
    eyebrow: "Accountability",
    heading: "Ang Pagbilao sa Pambansang Budget",
    intro:
        "Bawat pambansang proyekto na may pangalang Pagbilao sa titulo: ang ipinapanukala ng 2027 budget para sa ating bayan, at ang ibinigay ng mga naipasang budget mula 2020 hanggang 2026. Bawat halaga ay may link sa mismong pahina ng dokumento.",
    whatIsThis: {
        heading: "Ano ang makikita rito",
        body: "Ito ay pondo ng pambansang pamahalaan para sa mga proyekto sa Pagbilao (karamihan ay kalsada, gusali at flood control ng DPWH, at farm-to-market road ng Department of Agriculture), hindi ang sariling taunang budget ng munisipyo. Ang mga halaga ay inilaan ng mga dokumento, hindi pa ang aktwal na nagastos.",
    },
    tabs: { proposed: "Panukalang budget 2027", enacted: "Naipasang budget 2020–2026" },
    loading: "Kinukuha ang budget data…",
    error: "Hindi makuha ang budget data sa ngayon. Subukan ulit mamaya, o tingnan direkta ang budget.bettergov.ph.",
    proposed: {
        heading: "FY 2027: ang NEP at ang House bill",
        intro:
            "Ang NEP ay ang panukalang budget ng Pangulo. Ang House bill (House Bill 10858) ay ang bersyon nito ng Kamara de Representantes. Dalawang bersyon ito ng iisang budget, kaya pinaghahambing ang mga ito, hindi pinagsasama.",
        nepLabel: "NEP (panukala ng Pangulo)",
        nepSub: "Kabuuan ng mga linya para sa Pagbilao",
        houseLabel: "House bill",
        houseSub: "Kabuuan ng mga linya para sa Pagbilao",
        diffLabel: "Pagkakaiba",
        diffSub: "House bill bawas NEP",
        notAdded: "Pinaghahambing ang dalawang kabuuan, hindi pinagsasama.",
        projects: (n) => `${n} proyekto`,
        searchLabel: "Maghanap ng proyekto",
        searchPlaceholder: "Maghanap ng barangay o proyekto…",
        all: "Lahat",
        noResults: "Walang proyektong tugma sa paghahanap.",
        office: "Opisina",
        nep: "NEP",
        house: "House bill",
        noLine: "Wala sa bersyong ito",
        page: (n) => `p. ${n}`,
        document: "dokumento",
        unconfirmed: "Hindi pa kumpirmadong tugma",
        unconfirmedHelp: "Hindi tiyak ang pagtutugma ng linya sa NEP at House bill, kaya ituring itong lead na dapat suriin.",
        moreDetails: "Detalye sa budget.bettergov.ph",
        groups: {
            house_only: { label: "Sa House bill lang", help: "Nasa House bill pero hindi makita sa NEP. Kandidato pa lang, hindi kumpirmadong dagdag: maaaring bago, pinalitan ng pangalan, o binago ang saklaw." },
            nep_only: { label: "Sa NEP lang", help: "Nasa NEP pero hindi makita sa House bill. Kandidato pa lang, hindi kumpirmadong tinanggal: maaaring inalis, pinalitan ng pangalan, o pinagsama." },
            unchanged: { label: "Parehong halaga", help: "Parehong halaga sa dalawang bersyon." },
            increased: { label: "Tumaas", help: "Mas malaki ang ibinigay ng House bill kaysa sa NEP." },
            decreased: { label: "Bumaba", help: "Mas maliit ang ibinigay ng House bill kaysa sa NEP." },
            scope_review: { label: "Nagbago ang saklaw", help: "Tugma sa dalawang bersyon, pero nagbago ang saklaw ng linya." },
        },
    },
    enacted: {
        heading: "2020–2026: ang mga naipasang budget (GAA)",
        intro:
            "Ang General Appropriations Act ay ang budget na pinirmahan bilang batas bawat taon. Ito ang mga programa at proyekto sa kahit anong departamento na ang pangalan ay nagsasabing nasa Pagbilao. Ang appropriation ay pahintulot na gumastos, hindi pa aktwal na gastos.",
        chartLabel: "Kabuuan ng mga linya para sa Pagbilao, kada taon",
        chartNote: "Magkakatabi ang mga taon; hindi ito pinagsama-samang kabuuan.",
        lines: (n) => `${n} linya`,
        tableLabel: "Lahat ng programa at proyekto",
        searchPlaceholder: "Maghanap ng barangay o proyekto…",
        yearFilter: "May pondo sa",
        allYears: "Kahit anong taon",
        program: "Programa o proyekto",
        department: "Departamento",
        total: "Kabuuan",
        noResults: "Walang linyang tugma sa paghahanap.",
        partial: (departments) => `Hindi nakuha ang ilang departamento, kaya maaaring kulang ang mga kabuuan: ${departments}.`,
    },
    excluded: {
        summary: (n) => `${n} linya ang itinabi dahil hindi sinasabi ng titulo na nasa Pagbilao ito`,
        body: "Lumabas lang ang mga linyang ito sa paghahanap dahil nasa kalsadang may pangalang Pagbilao (gaya ng Pagbilao–Tayabas–Lucban Diversion Road o Pagbilao–Dalahican Port Road), pero ang titulo nila ay nagsasabing nasa ibang bayan o walang bayang binanggit. Hindi sila kasama sa mga kabuuan sa itaas.",
        manual: "Inalis nang mano-mano",
    },
    notices: {
        heading: "Tungkol sa data",
        sourceLabel: "Pinagmulan",
        source: "BetterGov.ph Budget API",
        builtAt: "Petsa ng data",
        codeCredit: "Ang mga patakaran sa pagtutugma ay hango sa BetterGov.ph transparency portal (MIT License).",
    },
}

export const budgetPageCopy: Record<Language, BudgetPageCopy> = { en, tl }
