import { PhoneCall, Siren, Shield, Flame, HeartPulse, Landmark, type LucideIcon } from "lucide-react"
import { useSiteData } from "../../hooks/useSiteData"

const HOTLINE_ICONS: { match: string; icon: LucideIcon; color: string }[] = [
    { match: "mdrrmo", icon: Siren, color: "text-bayan-gold" },
    { match: "police", icon: Shield, color: "text-sky-300" },
    { match: "fire", icon: Flame, color: "text-red-300" },
    { match: "health", icon: HeartPulse, color: "text-emerald-300" },
]

function getHotlineIcon(name: string) {
    const lower = name.toLowerCase()
    const found = HOTLINE_ICONS.find((entry) => lower.includes(entry.match))
    return found ?? { icon: PhoneCall, color: "text-white" }
}

function toTelHref(telephone: string) {
    return `tel:${telephone.replace(/[^0-9]/g, "")}`
}

const QuickLinks = () => {
    const { data } = useSiteData()
    const contact = data?.contact

    const items = contact
        ? [
              ...contact.hotlines.map((hotline) => ({
                  label: hotline.name,
                  telephone: hotline.telephone,
                  ...getHotlineIcon(hotline.name),
              })),
              { label: "LGU", telephone: contact.telephone, icon: Landmark, color: "text-white" },
          ]
        : []

    return (
        <div className="bg-bayan-ink text-white">
            <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-2 text-xs font-bold sm:px-6 lg:px-8">
                <span className="z-10 inline-flex shrink-0 items-center gap-2 bg-bayan-ink pr-3 uppercase tracking-[0.14em] text-white/62">
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Quick Contacts</span>
                </span>

                <div className="group relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]">
                    <div className="flex w-max animate-marquee items-center gap-3 group-hover:[animation-play-state:paused]">
                        {[...items, ...items].map((item, index) => (
                            <a
                                key={`${item.label}-${index}`}
                                href={toTelHref(item.telephone)}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-white/8 px-3 py-1.5 ring-1 ring-white/12 hover:bg-white/[0.14]"
                            >
                                <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                                <span>{item.label}: {item.telephone}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default QuickLinks