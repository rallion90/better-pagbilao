import { Landmark, Map, Sprout, UsersRound, type LucideIcon } from "lucide-react"
import { useLanguage } from "../../i18n/useLanguage"
import type { Translations } from "../../i18n/translations"

const STAT_META: {
    key: keyof Translations["stats"]
    icon: LucideIcon
    accent: string
    iconBg: string
    iconColor: string
}[] = [
    {
        key: "municipalClass",
        icon: Landmark,
        accent: "border-bayan-blue",
        iconBg: "bg-blue-50",
        iconColor: "text-bayan-blue",
    },
    {
        key: "population",
        icon: UsersRound,
        accent: "border-bayan-red",
        iconBg: "bg-red-50",
        iconColor: "text-bayan-red",
    },
    {
        key: "barangays",
        icon: Map,
        accent: "border-bayan-green",
        iconBg: "bg-emerald-50",
        iconColor: "text-bayan-green",
    },
    {
        key: "landArea",
        icon: Sprout,
        accent: "border-bayan-gold",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-700",
    },
]

/** Town stats, pulled up to overlap the bottom of the home hero. */
const CardStat = () => {
    const { t } = useLanguage()

    return (
        <section className="relative z-10 flow-root border-b border-slate-200 bg-bayan-mist">
            <ul className="mx-auto -mt-[72px] grid max-w-[1600px] grid-cols-2 gap-3 px-4 pb-8 sm:gap-4 sm:px-6 lg:px-8 xl:grid-cols-4">
                {STAT_META.map((meta) => {
                    const stat = t.stats[meta.key]
                    return (
                        <li
                            key={meta.key}
                            className={`group rounded-xl border-t-4 bg-white p-4 shadow-[0_12px_32px_rgba(23,32,51,0.14)] ring-1 ring-slate-900/5 transition-all duration-200 hover:-translate-y-0.5 sm:p-5 ${meta.accent}`}
                        >
                            <div className="flex items-center gap-4">
                                <span
                                    className={`hidden h-12 w-12 shrink-0 place-items-center rounded-xl md:grid ${meta.iconBg} ${meta.iconColor} ring-1 ring-inset ring-black/5 transition-transform duration-200 group-hover:scale-105`}
                                >
                                    <meta.icon className="h-6 w-6" aria-hidden />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">{stat.label}</p>
                                    <p className="mt-0.5 text-xl font-black tabular-nums leading-tight text-bayan-ink sm:text-2xl">{stat.value}</p>
                                    <p className="mt-1 hidden text-xs font-semibold text-slate-500 md:block">{stat.caption}</p>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

export default CardStat
