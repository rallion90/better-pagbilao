import type { BarangayProfile } from "../types/barangays"

export type BarangayMetric = "population" | "density" | "area"

export const METRICS: BarangayMetric[] = ["population", "density", "area"]

// Sequential blue ramp, light to dark. Five classes keep the map readable and the legend short.
export const SHADES = ["#dbeafe", "#93c5fd", "#4d8cf5", "#155eef", "#0b2f80"]

export function areaKm2(barangay: BarangayProfile) {
    return barangay.landAreaHectares / 100
}

export function density(barangay: BarangayProfile) {
    const area = areaKm2(barangay)
    return area > 0 ? barangay.psa.population2024 / area : 0
}

export function metricValue(barangay: BarangayProfile, metric: BarangayMetric) {
    if (metric === "population") return barangay.psa.population2024
    if (metric === "density") return density(barangay)
    return barangay.landAreaHectares
}

/** Upper bound of each class, chosen so every class holds roughly the same number of barangays. */
export function quantileBreaks(values: number[], classes = SHADES.length) {
    if (values.length === 0) return []
    const sorted = [...values].sort((a, b) => a - b)
    return Array.from({ length: classes }, (_, index) => sorted[Math.min(sorted.length - 1, Math.ceil(((index + 1) / classes) * sorted.length) - 1)])
}

export function classIndex(value: number, breaks: number[]) {
    const index = breaks.findIndex((upper) => value <= upper)
    return index === -1 ? breaks.length - 1 : index
}

export function formatNumber(value: number, lang: string, digits = 0) {
    return value.toLocaleString(lang === "tl" ? "fil-PH" : "en-PH", { maximumFractionDigits: digits })
}
