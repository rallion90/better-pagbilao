import { ArrowRight, Megaphone } from "lucide-react"
import { Link } from "react-router"
import { useAnnouncementList } from "../../hooks/useAnnouncementList"
import { announcementsCopy } from "../../i18n/announcementsPage"
import { useLanguage } from "../../i18n/useLanguage"
import AnnouncementCard from "./AnnouncementCard"

const PARAMS = { perPage: 3 } as const

/** "Latest announcements" for the home page: the three newest (pinned first, as the API orders them). */
const LatestAnnouncements = () => {
    const { lang } = useLanguage()
    const copy = announcementsCopy[lang]
    const { list, loading, error, reload } = useAnnouncementList(PARAMS)
    const items = list?.announcements ?? []

    return (
        <section id="announcements" className="scroll-mt-32 bg-bayan-mist py-14 sm:py-16">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-blue">{copy.home.eyebrow}</p>
                        <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{copy.home.heading}</h2>
                    </div>
                    <Link to="/announcements" className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-800 hover:bg-slate-50">
                        {copy.home.viewAll} <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                </div>

                <div className="mt-8" aria-live="polite">
                    {loading && items.length === 0 ? (
                        <div className="grid gap-4 md:grid-cols-3" aria-label={copy.list.loading}>
                            {[0, 1, 2].map((index) => (
                                <div key={index} className="h-56 animate-pulse rounded-lg bg-white" />
                            ))}
                        </div>
                    ) : items.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {items.map((item) => (
                                <AnnouncementCard key={item.slug} item={item} />
                            ))}
                        </div>
                    ) : error ? (
                        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-bayan-red/40 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                            <p className="min-w-0 flex-1 basis-56">{copy.errors.generic}</p>
                            <button type="button" onClick={reload} className="rounded-md bg-white px-3 py-2 text-xs font-black ring-1 ring-bayan-red/30 hover:bg-red-100">
                                {copy.errors.retry}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-white p-6">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700">
                                <Megaphone className="h-5 w-5" aria-hidden />
                            </span>
                            <div>
                                <p className="text-base font-black">{copy.list.empty}</p>
                                <p className="mt-0.5 text-sm font-semibold text-slate-500">{copy.home.emptyHint}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default LatestAnnouncements
