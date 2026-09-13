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
        accent: "bg-bayan-blue",
        iconBg: "bg-blue-50",
        iconColor: "text-bayan-blue",
    },
    {
        key: "population",
        icon: UsersRound,
        accent: "bg-bayan-red",
        iconBg: "bg-red-50",
        iconColor: "text-bayan-red",
    },
    {
        key: "barangays",
        icon: Map,
        accent: "bg-bayan-green",
        iconBg: "bg-emerald-50",
        iconColor: "text-bayan-green",
    },
    {
        key: "landArea",
        icon: Sprout,
        accent: "bg-amber-500",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-700",
    },
]

const CardStat = () => {
    const { t } = useLanguage()

    return (
        <section className="border-b border-slate-200 bg-bayan-mist">
            <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                {STAT_META.map((meta) => {
                    const stat = t.stats[meta.key]
                    return (
                        <article
                            key={meta.key}
                            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-soft)"
                        >
                            <span className={`absolute inset-x-0 top-0 h-1 ${meta.accent}`} />
                            <div className="flex items-center gap-4">
                                <span
                                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${meta.iconBg} ${meta.iconColor} ring-1 ring-inset ring-black/5 transition-transform duration-200 group-hover:scale-105`}
                                >
                                    <meta.icon className="h-6 w-6" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{stat.label}</p>
                                    <p className="mt-0.5 text-2xl font-black tabular-nums text-bayan-ink">{stat.value}</p>
                                    <p className="mt-1 text-xs font-semibold text-slate-400">{stat.caption}</p>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

export default CardStat
