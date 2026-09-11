import { PhoneCall, Siren, Shield, Flame, HeartPulse, Landmark } from "lucide-react"

const QuickLinks = () => {
    return (
        <div className="bg-bayan-ink text-white">
            <div className="mx-auto flex max-w-[1600px] items-center gap-3 overflow-x-auto px-4 py-2 text-xs font-bold sm:px-6 lg:px-8">
                <span className="sticky left-0 z-10 inline-flex shrink-0 items-center gap-2 bg-bayan-ink pr-1 uppercase tracking-[0.14em] text-white/62">
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span data-i18n="quickContacts">Quick Contacts</span>
                </span>
                <a href="tel:09186244564" className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-white/8 px-3 py-1.5 ring-1 ring-white/12 hover:bg-white/[0.14]">
                    <Siren className="h-3.5 w-3.5 text-bayan-gold" />
                    MDRRMO: 0918-624-4564
                </a>
                <a href="tel:09985985764" className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-white/8 px-3 py-1.5 ring-1 ring-white/8 hover:bg-white/[0.14]">
                    <Shield className="h-3.5 w-3.5 text-sky-300" />
                    <span><span data-i18n="police">Police</span>: 0998-598-5764</span>
                </a>
                <a href="tel:09234424945" className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-white/8 px-3 py-1.5 ring-1 ring-white/12 hover:bg-white/[0.14]">
                    <Flame className="h-3.5 w-3.5 text-red-300" />
                    <span><span data-i18n="fire">Fire</span>: 0923-442-4945</span>
                </a>
                <a href="tel:0427973092" className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-white/8 px-3 py-1.5 ring-1 ring-white/12 hover:bg-white/[0.14]">
                    <HeartPulse className="h-3.5 w-3.5 text-emerald-300" />
                    <span><span data-i18n="health">Health</span>: (042) 797-3092</span>
                </a>
                <a href="tel:0427970937" className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-white/8 px-3 py-1.5 ring-1 ring-white/12 hover:bg-white/[0.14]">
                    <Landmark className="h-3.5 w-3.5 text-white" />
                    <span><span data-i18n="lgu">LGU</span>: (042) 797-0937</span>
                </a>
            </div>
        </div>
    )
};

export default QuickLinks