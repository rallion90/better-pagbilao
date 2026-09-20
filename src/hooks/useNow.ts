import { useEffect, useState } from "react"

/** The current time, ticking once a minute on the minute. Format it with timeZone "Asia/Manila" so it is Pagbilao time on any device. */
export function useNow() {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        let timer: number
        const schedule = () => {
            timer = window.setTimeout(() => {
                setNow(new Date())
                schedule()
            }, 60_000 - (Date.now() % 60_000) + 50)
        }
        schedule()
        return () => window.clearTimeout(timer)
    }, [])

    return now
}
