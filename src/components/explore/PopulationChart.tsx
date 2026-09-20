import { useState } from "react"
import type { CensusPoint } from "../../data/pagbilaoHistory"
import { formatNumber } from "../../lib/barangayMetrics"

type PopulationChartProps = {
    data: CensusPoint[]
    lang: string
    title: string
    ariaLabel: string
    showTable: string
    showChart: string
    yearColumn: string
    populationColumn: string
}

// One series, so no legend: the title names it. Single brand hue, thin line, direct labels at both ends only.
const WIDTH = 560
const HEIGHT = 300
const MARGIN = { top: 28, right: 28, bottom: 34, left: 52 }
const X_MIN = 1900
const X_MAX = 2030
const Y_MAX = 90000
const X_TICKS = [1900, 1925, 1950, 1975, 2000, 2025]
const Y_TICKS = [0, 30000, 60000, 90000]

const LINE = "#155eef"
const INK = "#172033"
const MUTED = "#667085"
const GRID = "#e2e8f0"

const x = (year: number) => MARGIN.left + ((year - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - MARGIN.left - MARGIN.right)
const y = (value: number) => HEIGHT - MARGIN.bottom - (value / Y_MAX) * (HEIGHT - MARGIN.top - MARGIN.bottom)

const PopulationChart = ({ data, lang, title, ariaLabel, showTable, showChart, yearColumn, populationColumn }: PopulationChartProps) => {
    const [asTable, setAsTable] = useState(false)
    const [active, setActive] = useState<number | null>(null)

    const path = data.map((point, index) => `${index === 0 ? "M" : "L"}${x(point.year).toFixed(1)},${y(point.population).toFixed(1)}`).join(" ")
    const activePoint = active === null ? null : data[active]
    const activeX = activePoint ? (x(activePoint.year) / WIDTH) * 100 : 0
    const activeY = activePoint ? (y(activePoint.population) / HEIGHT) * 100 : 0
    const align = activeX > 80 ? "-100%" : activeX < 20 ? "0%" : "-50%"

    return (
        <figure className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <figcaption className="text-sm font-black">{title}</figcaption>
                <button
                    type="button"
                    onClick={() => setAsTable((current) => !current)}
                    className="rounded-md bg-bayan-mist px-3 py-1.5 text-xs font-black text-bayan-blue ring-1 ring-slate-200 transition hover:bg-blue-50"
                >
                    {asTable ? showChart : showTable}
                </button>
            </div>

            {asTable ? (
                <div className="mt-4 max-h-96 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.1em] text-slate-500">
                                <th className="py-2 pr-4">{yearColumn}</th>
                                <th className="py-2 text-right">{populationColumn}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((point) => (
                                <tr key={point.year} className="border-b border-slate-100">
                                    <td className="py-2 pr-4 font-bold">{point.year}</td>
                                    <td className="py-2 text-right font-semibold tabular-nums">{formatNumber(point.population, lang)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="relative mt-3">
                    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel} className="h-auto w-full">
                        {Y_TICKS.map((tick) => (
                            <g key={tick}>
                                <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(tick)} y2={y(tick)} stroke={GRID} strokeWidth={1} />
                                <text x={MARGIN.left - 8} y={y(tick) + 5} textAnchor="end" fontSize={15} fill={MUTED}>
                                    {tick === 0 ? "0" : `${tick / 1000}k`}
                                </text>
                            </g>
                        ))}
                        {X_TICKS.map((tick) => (
                            <text key={tick} x={x(tick)} y={HEIGHT - 8} textAnchor="middle" fontSize={15} fill={MUTED}>
                                {tick}
                            </text>
                        ))}

                        <path d={path} fill="none" stroke={LINE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

                        {data.map((point, index) => {
                            const isActive = active === index
                            return (
                                <g key={point.year}>
                                    <circle cx={x(point.year)} cy={y(point.population)} r={isActive ? 7 : 5} fill={LINE} stroke="#ffffff" strokeWidth={2} />
                                    {/* Larger invisible target so the point is easy to hit and to focus with a keyboard. */}
                                    <circle
                                        cx={x(point.year)}
                                        cy={y(point.population)}
                                        r={16}
                                        fill="transparent"
                                        tabIndex={0}
                                        role="img"
                                        aria-label={`${point.year}: ${formatNumber(point.population, lang)}`}
                                        onMouseEnter={() => setActive(index)}
                                        onMouseLeave={() => setActive(null)}
                                        onFocus={() => setActive(index)}
                                        onBlur={() => setActive(null)}
                                        style={{ outline: "none", cursor: "pointer" }}
                                    />
                                </g>
                            )
                        })}

                        <text x={x(data[0].year) + 6} y={y(data[0].population) - 12} fontSize={16} fontWeight={800} fill={INK}>
                            {formatNumber(data[0].population, lang)}
                        </text>
                        <text x={x(data[data.length - 1].year) - 4} y={y(data[data.length - 1].population) - 14} textAnchor="end" fontSize={16} fontWeight={800} fill={INK}>
                            {formatNumber(data[data.length - 1].population, lang)}
                        </text>
                    </svg>

                    {activePoint && (
                        <div
                            className="pointer-events-none absolute z-10 rounded-md bg-bayan-ink px-3 py-2 text-xs font-bold text-white shadow-lg"
                            style={{ left: `${activeX}%`, top: `${activeY}%`, transform: `translate(${align}, calc(-100% - 14px))` }}
                            role="status"
                        >
                            <span className="text-white/70">{activePoint.year}</span>
                            <span className="ml-2 tabular-nums">{formatNumber(activePoint.population, lang)}</span>
                        </div>
                    )}
                </div>
            )}
        </figure>
    )
}

export default PopulationChart
