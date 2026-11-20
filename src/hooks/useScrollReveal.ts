import { useEffect } from "react"

const REVEAL_ATTR = "data-reveal"
const GRID_CLASS = "reveal-grid"

/**
 * Fades sections (and staggers their card grids) in as they scroll into view.
 *
 * Only sections that start below the fold when they appear are animated, so nothing that is already
 * on screen ever blinks. The styles live in index.css and only apply under
 * `prefers-reduced-motion: no-preference`, so reduced-motion users see everything immediately.
 * Opt a section out with `data-no-reveal`.
 */
export function useScrollReveal() {
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        const root = document.documentElement
        root.classList.add("reveal-ready")

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue
                    entry.target.classList.add("is-revealed")
                    observer.unobserve(entry.target)
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
        )

        const mark = () => {
            const sections = document.querySelectorAll<HTMLElement>(`main section:not([${REVEAL_ATTR}]):not([data-no-reveal])`)
            for (const section of sections) {
                // Seen once: never animate it again, whatever happens.
                section.setAttribute(REVEAL_ATTR, "")
                if (section.getBoundingClientRect().top < window.innerHeight) {
                    section.classList.add("is-revealed")
                    continue
                }
                for (const grid of section.querySelectorAll<HTMLElement>(".grid")) {
                    if (grid.children.length >= 3) grid.classList.add(GRID_CLASS)
                }
                observer.observe(section)
            }
        }

        let frame = 0
        const schedule = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(mark)
        }
        const mutations = new MutationObserver(schedule)
        const main = document.querySelector("main")
        if (main) mutations.observe(main, { childList: true, subtree: true })
        schedule()

        return () => {
            cancelAnimationFrame(frame)
            mutations.disconnect()
            observer.disconnect()
            root.classList.remove("reveal-ready")
        }
    }, [])
}
