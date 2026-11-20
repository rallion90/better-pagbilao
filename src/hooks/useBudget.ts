import { useEffect, useState } from "react"
import { loadBudget2027, loadBudgetEnacted } from "../lib/budgetApi"
import type { Budget2027, BudgetEnacted } from "../lib/budgetApi"

type Result<T> = { data: T | null; loading: boolean; error: string | null }

function useLoad<T>(load: () => Promise<T>, enabled = true): Result<T> {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<string | null>(null)
    const pending = enabled && !data && !error

    useEffect(() => {
        if (!pending) return
        let cancelled = false
        load()
            .then((result) => {
                if (!cancelled) setData(result)
            })
            .catch((err: unknown) => {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load budget data")
            })
        return () => {
            cancelled = true
        }
    }, [pending, load])

    return { data, loading: pending, error }
}

/** FY 2027 NEP and House bill lines that name Pagbilao. */
export function useBudget2027(): Result<Budget2027> {
    return useLoad(loadBudget2027)
}

/** Enacted budgets 2020–2026. About 40 requests, so it loads only once its tab is opened. */
export function useBudgetEnacted(enabled: boolean): Result<BudgetEnacted> {
    return useLoad(loadBudgetEnacted, enabled)
}
