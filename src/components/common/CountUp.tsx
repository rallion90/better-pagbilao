import { useEffect, useRef, useState } from "react"

// A leading whole number with optional thousands commas, followed by nothing or by a space + unit
// ("82,132", "27", "17,760 hectares"). Ordinals and other text ("1st Class") are left as they are.
const NUMBER_PATTERN = /^(\d{1,3}(?:,\d{3})+|\d+)(\s.*)?$/
const DURATION_MS = 1200

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/**
 * Counts a stat up from 0 when it scrolls into view. Screen readers only get the final text, and the
 * final text also reserves the width so nothing shifts while the digits change. No animation under
 * prefers-reduced-motion.
 */
const CountUp = ({ value }: { value: string }) => {
    const match = NUMBER_PATTERN.exec(value)
    const target = match ? Number(match[1].replace(/,/g, "")) : null
    const suffix = match?.[2] ?? ""
    const ref = useRef<HTMLSpanElement>(null)
    const [current, setCurrent] = useState<number | null>(null)

    useEffect(() => {
        const element = ref.current
        if (target === null || !element) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        if (typeof IntersectionObserver === "undefined") return

        let frame = 0
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                observer.disconnect()
                const start = performance.now()
                const tick = (now: number) => {
                    const progress = Math.min(1, (now - start) / DURATION_MS)
                    setCurrent(Math.round(target * easeOutCubic(progress)))
                    if (progress < 1) frame = requestAnimationFrame(tick)
                    else setCurrent(null)
                }
                frame = requestAnimationFrame(tick)
            },
            { threshold: 0.4 },
        )
        observer.observe(element)
        return () => {
            observer.disconnect()
            cancelAnimationFrame(frame)
        }
    }, [target])

    if (target === null) return <>{value}</>

    return (
        <span ref={ref} className="relative inline-grid">
            <span className={current === null ? "" : "select-none text-transparent"}>{value}</span>
            {current !== null && (
                <span aria-hidden className="absolute inset-0">
                    {current.toLocaleString("en-US")}
                    {suffix}
                </span>
            )}
        </span>
    )
}

export default CountUp
