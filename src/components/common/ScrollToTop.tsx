import { useEffect } from "react"
import { useLocation, useNavigationType } from "react-router"

/**
 * Scrolls to the top when the route path changes (or to the #hash target, once it has rendered).
 * Query-string-only changes, like the business directory's ?page= links, are left alone, so their
 * preventScrollReset + scroll-to-list behavior is unchanged. Back/forward (POP) is left to the browser.
 */
const ScrollToTop = () => {
    const { pathname, hash } = useLocation()
    const navigationType = useNavigationType()

    useEffect(() => {
        if (navigationType === "POP") return

        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" })
            return
        }

        // Lazy routes and API data can render the anchor a little later: retry for about a second.
        let attempts = 0
        let frame = 0
        const tryScroll = () => {
            const target = document.getElementById(decodeURIComponent(hash.slice(1)))
            if (target) {
                target.scrollIntoView({ block: "start" })
                return
            }
            if (attempts++ < 60) frame = requestAnimationFrame(tryScroll)
        }
        tryScroll()
        return () => cancelAnimationFrame(frame)
        // eslint-disable-next-line react-hooks/exhaustive-deps -- run per path change, not per hash-only change
    }, [pathname])

    return null
}

export default ScrollToTop
