import {
    Accessibility,
    Boxes,
    Code2,
    HandHeart,
    HeartPulse,
    Mail,
    MessageCircle,
} from "lucide-react"

const quickLinks = [
    { label: "Pagbilao Quiz", href: "#" },
    { label: "Sitemap", href: "#" },
    { label: "Citizen's Charter", href: "#transparency" },
    { label: "Terms of Use", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Accessibility", href: "#" },
    { label: "FAQ", href: "#" },
]

const resources = [
    { label: "Open Data Philippines", href: "https://data.gov.ph/" },
    { label: "Freedom of Information", href: "https://www.foi.gov.ph/" },
    { label: "Official LGU Pagbilao Portal", href: "https://pagbilao.gov.ph/" },
    { label: "Sangguniang Bayan", href: "#" },
    { label: "LGU Pagbilao Facebook", href: "#" },
    { label: "BLGF Portal", href: "https://blgf.gov.ph/" },
    { label: "CMCI DTI Portal", href: "https://cmci.dti.gov.ph/" },
]

const supportMarks = [
    { label: "Abakada", Icon: Accessibility },
    { label: "HIV Care PH", Icon: HeartPulse },
    { label: "BetterGov.ph", Icon: HandHeart },
]

const Footer = () => {
    return (
        <footer className="bg-[#111111] text-white">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_1fr_1fr]">
                    <div>
                        <a href="#home" className="inline-flex items-center gap-4" aria-label="Better Pagbilao home">
                            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white p-2 ring-1 ring-white/20">
                                <img src="logo.png" alt="Bayan ng Pagbilao official seal" className="h-full w-full object-contain" />
                            </span>
                            <span className="leading-none">
                                <span className="block text-3xl font-black tracking-normal">Better</span>
                                <span className="block text-3xl font-black tracking-normal">Pagbilao</span>
                                <span className="block text-sm font-black text-white/85">.org</span>
                            </span>
                        </a>

                        <p className="mt-7 max-w-sm text-lg font-medium leading-8 text-white/68">
                            Empowering the people of Pagbilao with transparent access to the services, programs, and public funds of LGU Pagbilao.
                        </p>

                        <div className="mt-10 flex items-center gap-4">
                            <a href="#" className="grid h-14 w-14 place-items-center rounded-lg bg-white/10 text-white/78 transition hover:bg-white/16 hover:text-white" aria-label="Follow Better Pagbilao on Facebook">
                                <span className="text-2xl font-black leading-none">f</span>
                            </a>
                            <a href="#" className="grid h-14 w-14 place-items-center rounded-lg bg-white/10 text-white/78 transition hover:bg-white/16 hover:text-white" aria-label="Follow Better Pagbilao on LinkedIn">
                                <span className="text-xl font-black leading-none">in</span>
                            </a>
                            <a href="#" className="grid h-14 w-14 place-items-center rounded-lg bg-white/10 text-white/78 transition hover:bg-white/16 hover:text-white" aria-label="Join Better Pagbilao community chat">
                                <MessageCircle className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    <nav aria-label="Footer quick links">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white/52">Quick Links</h2>
                        <ul className="mt-8 space-y-5 text-base font-semibold text-white/72">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="transition hover:text-white">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Footer resources">
                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white/52">Resources</h2>
                        <ul className="mt-8 space-y-5 text-base font-semibold text-white/72">
                            {resources.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="transition hover:text-white">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="lg:justify-self-end">
                        <div className="inline-flex items-center rounded-md bg-emerald-950/30 px-4 py-3 text-sm font-black text-white/78 ring-1 ring-emerald-400/5">
                            Cost to the People of Pagbilao =&nbsp;<span className="text-emerald-400">₱0</span>
                        </div>

                        <div className="mt-5 flex flex-col items-start gap-4">
                            <a href="mailto:pagwebteam@gmail.com" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white/8 px-5 text-base font-semibold text-white/76 transition hover:bg-white/12 hover:text-white">
                                <Mail className="h-5 w-5" />
                                Volunteer with us
                            </a>
                            <a href="#" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white/8 px-5 text-base font-semibold text-white/76 transition hover:bg-white/12 hover:text-white">
                                <Code2 className="h-5 w-5" />
                                Contribute code with us
                            </a>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-7 text-white/[0.55]">
                            {supportMarks.map(({ label, Icon }) => (
                                <div key={label} className="grid justify-items-center gap-1">
                                    <Icon className="h-14 w-14 stroke-[1.7]" />
                                    <span className="text-[10px] font-black uppercase leading-none tracking-normal">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-8 text-sm font-semibold text-white/48 md:flex-row md:items-center md:justify-between">
                    <p>&copy; 2026 BetterPagbilao.org&nbsp; MIT | CC BY 4.0&nbsp; All public information sourced from official government portals.</p>
                    <p className="inline-flex items-center gap-2">
                        <Boxes className="h-5 w-5" />
                        Ver. 1.1.9
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
