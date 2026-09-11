import HeroSlider from '../components/home/HeroSlider'
import CardStat from '../components/home/CardStat'
import {
    Binoculars,
    BookOpenCheck,
    BookOpenText,
    BriefcaseBusiness,
    ChevronRight,
    ClipboardCheck,
    FileDown,
    Flame,
    FolderDown,
    HandHeart,
    HeartPulse,
    Landmark,
    MapPinned,
    MessageSquareHeart,
    Palmtree,
    Route,
    ScrollText,
    Shield,
    ShieldAlert,
    Siren,
    Sprout,
    UsersRound,
    Waves,
    Wheat,
} from 'lucide-react'

const HomePage = () => {
    return (
        <>
            <HeroSlider />

            <CardStat />
            
            <section id="services" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-blue">Government Services</p>
                            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">Start with the office you need.</h2>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                                Quick paths for common resident, business, health, safety, and livelihood concerns in Pagbilao.
                            </p>
                        </div>
                        <a href="#transparency" className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-black text-slate-800 hover:bg-slate-50">
                            <FileDown className="h-4 w-4" />
                            Downloadable Forms
                        </a>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <article className="rounded-lg border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
                            <BriefcaseBusiness className="h-7 w-7 text-bayan-blue" />
                            <h3 className="mt-5 text-xl font-black">Business and Permits</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">Business permit applications, renewals, zoning, locational clearance, and building permit forms.</p>
                            <a href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-bayan-blue">View requirements <ChevronRight className="h-4 w-4" /></a>
                        </article>
                        <article className="rounded-lg border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
                            <HeartPulse className="h-7 w-7 text-bayan-red" />
                            <h3 className="mt-5 text-xl font-black">Health Services</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">Municipal Health Office support, community wellness, vaccination programs, and local health referrals.</p>
                            <a href="#hotlines" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-bayan-red">Call health office <ChevronRight className="h-4 w-4" /></a>
                        </article>
                        <article className="rounded-lg border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
                            <ShieldAlert className="h-7 w-7 text-bayan-green" />
                            <h3 className="mt-5 text-xl font-black">Disaster and Safety</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">MDRRMO rescue, emergency reporting, police, fire, and public safety coordination.</p>
                            <a href="#hotlines" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-bayan-green">Open hotlines <ChevronRight className="h-4 w-4" /></a>
                        </article>
                        <article className="rounded-lg border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
                            <Wheat className="h-7 w-7 text-amber-700" />
                            <h3 className="mt-5 text-xl font-black">Agriculture and Livelihood</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">Support for coconut, rice, poultry, fisherfolk, livelihood programs, and local enterprise growth.</p>
                            <a href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-amber-700">Find office <ChevronRight className="h-4 w-4" /></a>
                        </article>
                        <article className="rounded-lg border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
                            <UsersRound className="h-7 w-7 text-bayan-blue" />
                            <h3 className="mt-5 text-xl font-black">Social Welfare</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">Assistance pathways for families, seniors, persons with disabilities, youth, and vulnerable residents.</p>
                            <a href="#hotlines" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-bayan-blue">Ask for help <ChevronRight className="h-4 w-4" /></a>
                        </article>
                        <article className="rounded-lg border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
                            <Palmtree className="h-7 w-7 text-bayan-green" />
                            <h3 className="mt-5 text-xl font-black">Tourism and Culture</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">Destinations, tourism directory, festivals, heritage, visitor feedback, and WOW Pagbilao experiences.</p>
                            <a href="#tourism" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-bayan-green">Explore Pagbilao <ChevronRight className="h-4 w-4" /></a>
                        </article>
                    </div>
                </div>
            </section>

            <section className="bg-bayan-ink py-16 text-white sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">Bayan ng Mananalo</p>
                        <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">From papag and bilao to a more connected town.</h2>
                        <p className="mt-5 text-base leading-8 text-white/76">
                            Local tradition traces the name Pagbilao to papag and bilao, everyday objects that became part of the
                            town's identity. This portal concept keeps that spirit practical: simple tools for daily civic life.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <article className="rounded-lg bg-white/8 p-5 ring-1 ring-white/12">
                            <Route className="h-7 w-7 text-bayan-gold" />
                            <h3 className="mt-4 font-black">Gateway Location</h3>
                            <p className="mt-2 text-sm leading-6 text-white/70">A strategic link near Lucena, Bondoc Peninsula, and the Bicol route.</p>
                        </article>
                        <article className="rounded-lg bg-white/8 p-5 ring-1 ring-white/12">
                            <Waves className="h-7 w-7 text-cyan-300" />
                            <h3 className="mt-4 font-black">Bay Communities</h3>
                            <p className="mt-2 text-sm leading-6 text-white/70">Coastal barangays, islands, resorts, and natural destinations.</p>
                        </article>
                        <article className="rounded-lg bg-white/8 p-5 ring-1 ring-white/12">
                            <HandHeart className="h-7 w-7 text-emerald-300" />
                            <h3 className="mt-4 font-black">HEARTS Lens</h3>
                            <p className="mt-2 text-sm leading-6 text-white/70">Health, education, assistance, resilience, tourism, and service.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section id="transparency" className="bg-bayan-mist py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-green">Transparency</p>
                            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">Public documents should be easy to find.</h2>
                            <p className="mt-4 text-base leading-7 text-slate-600">
                                A modern Pagbilao portal can put ordinances, executive orders, procurement notices,
                                budgets, and citizen-facing forms where residents can actually use them.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <a href="#" className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-soft">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black text-slate-500">Documents</p>
                                        <h3 className="mt-2 text-xl font-black">Ordinances and EOs</h3>
                                    </div>
                                    <ScrollText className="h-6 w-6 text-bayan-green" />
                                </div>
                            </a>
                            <a href="#" className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-soft">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black text-slate-500">Accountability</p>
                                        <h3 className="mt-2 text-xl font-black">Procurement</h3>
                                    </div>
                                    <ClipboardCheck className="h-6 w-6 text-bayan-blue" />
                                </div>
                            </a>
                            <a href="#" className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-soft">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black text-slate-500">Resident Help</p>
                                        <h3 className="mt-2 text-xl font-black">Citizen's Charter</h3>
                                    </div>
                                    <BookOpenCheck className="h-6 w-6 text-bayan-red" />
                                </div>
                            </a>
                            <a href="#" className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-soft">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black text-slate-500">Forms</p>
                                        <h3 className="mt-2 text-xl font-black">Permits and Clearances</h3>
                                    </div>
                                    <FolderDown className="h-6 w-6 text-amber-700" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="tourism" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <figure className="overflow-hidden rounded-lg shadow-soft">
                            <img
                                src="/hero/pagbilao-grande-island.jpg"
                                alt="Aerial view of Pagbilao Grande Island and Tayabas Bay"
                                className="h-90 w-full object-cover sm:h-115"
                            />
                            <figcaption className="bg-bayan-ink px-4 py-2 text-xs font-semibold text-white/60">
                                Photo: Patrickroque01 via Wikimedia Commons, CC BY-SA 4.0
                            </figcaption>
                        </figure>
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-red">WOW Pagbilao</p>
                            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">Tourism that feels local, useful, and alive.</h2>
                            <p className="mt-4 text-base leading-8 text-slate-600">
                                Pagbilao's tourism identity covers bodies of water, land formations, protected areas,
                                cultural built heritage, institutions, and festivities. A better portal can connect
                                residents and visitors to destinations, directories, registration, and feedback.
                            </p>
                            <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <Binoculars className="h-5 w-5 text-bayan-blue" />
                                    <p className="mt-3 font-black">Destinations</p>
                                    <p className="mt-1 text-sm text-slate-600">Beaches, falls, protected areas, and cultural stops.</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <MessageSquareHeart className="h-5 w-5 text-bayan-green" />
                                    <p className="mt-3 font-black">Feedback</p>
                                    <p className="mt-1 text-sm text-slate-600">Tourism registration and visitor survey pathways.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="hotlines" className="bg-bayan-red py-16 text-white sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/72">Emergency Hotlines</p>
                            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">Keep these numbers close.</h2>
                        </div>
                        <p className="max-w-xl text-sm font-semibold leading-6 text-white/76">
                            For urgent emergencies, contact the relevant local office directly. Numbers shown here are from Pagbilao local portal references.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <a href="tel:09186244564" className="rounded-lg bg-white p-5 text-bayan-ink shadow-soft">
                            <Siren className="h-7 w-7 text-bayan-red" />
                            <p className="mt-4 text-sm font-black text-slate-500">MDRRMO Rescue</p>
                            <p className="mt-1 text-2xl font-black">0918-624-4564</p>
                        </a>
                        <a href="tel:09985985764" className="rounded-lg bg-white p-5 text-bayan-ink shadow-soft">
                            <Shield className="h-7 w-7 text-bayan-blue" />
                            <p className="mt-4 text-sm font-black text-slate-500">Philippine National Police</p>
                            <p className="mt-1 text-2xl font-black">0998-598-5764</p>
                        </a>
                        <a href="tel:09234424945" className="rounded-lg bg-white p-5 text-bayan-ink shadow-soft">
                            <Flame className="h-7 w-7 text-amber-700" />
                            <p className="mt-4 text-sm font-black text-slate-500">Bureau of Fire Protection</p>
                            <p className="mt-1 text-2xl font-black">0923-442-4945</p>
                        </a>
                        <a href="tel:0427973092" className="rounded-lg bg-white p-5 text-bayan-ink shadow-soft">
                            <HeartPulse className="h-7 w-7 text-bayan-green" />
                            <p className="mt-4 text-sm font-black text-slate-500">Municipal Health Office</p>
                            <p className="mt-1 text-2xl font-black">(042) 797-3092</p>
                        </a>
                    </div>
                </div>
            </section>

            <section id="history" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-blue">History of Pagbilao</p>
                            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
                                From papag and bilao to a gateway town by the bay.
                            </h2>
                            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                                Local tradition traces Pagbilao's early settlement to Pablo and Rita in the early 17th century. The town's name is described as coming from papag, a bamboo bed, and bilao, a winnowing basket: ordinary objects that became part of a shared civic identity.
                            </p>
                            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                                Today, Pagbilao sits eight kilometers from Lucena City and serves as one of Quezon's gateways to the south, linking poblacion barangays, bay communities, highway settlements, and forested uplands.
                            </p>

                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-lg border border-slate-200 bg-bayan-mist p-4">
                                    <p className="text-2xl font-black text-bayan-blue">1700s</p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Early Roots</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-bayan-mist p-4">
                                    <p className="text-2xl font-black text-bayan-green">27</p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Barangays</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-bayan-mist p-4">
                                    <p className="text-2xl font-black text-bayan-red">8 km</p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">From Lucena</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-bayan-mist p-5 sm:p-6">
                            <div className="space-y-5">
                                <article className="grid gap-4 rounded-lg bg-white p-5 shadow-sm sm:grid-cols-[auto_1fr]">
                                    <span className="grid h-12 w-12 place-items-center rounded-md bg-blue-50 text-bayan-blue">
                                        <Sprout className="h-6 w-6" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Early Settlement</p>
                                        <h3 className="mt-1 text-xl font-black">Pablo and Rita</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            The local origin story remembers Pablo and Rita as early settlers who brought rice seedlings and provisions to the area that became Pagbilao.
                                        </p>
                                    </div>
                                </article>

                                <article className="grid gap-4 rounded-lg bg-white p-5 shadow-sm sm:grid-cols-[auto_1fr]">
                                    <span className="grid h-12 w-12 place-items-center rounded-md bg-red-50 text-bayan-red">
                                        <BookOpenText className="h-6 w-6" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Name Origin</p>
                                        <h3 className="mt-1 text-xl font-black">Papag plus bilao</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            Tradition connects the town name to two familiar household objects: the papag and the bilao, turning daily life into a lasting place-name.
                                        </p>
                                    </div>
                                </article>

                                <article className="grid gap-4 rounded-lg bg-white p-5 shadow-sm sm:grid-cols-[auto_1fr]">
                                    <span className="grid h-12 w-12 place-items-center rounded-md bg-emerald-50 text-bayan-green">
                                        <Route className="h-6 w-6" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Gateway Identity</p>
                                        <h3 className="mt-1 text-xl font-black">Bay, highway, and uplands</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            Pagbilao's story is shaped by movement: coastal barangays along Pagbilao Bay, communities near Maharlika Highway, and upland areas toward Quezon's protected landscapes.
                                        </p>
                                    </div>
                                </article>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-lg bg-bayan-ink p-4 text-white">
                                    <MapPinned className="h-5 w-5 shrink-0 text-bayan-gold" />
                                    <span className="text-sm font-bold">Poblacion, bay, highway, and forest barangay clusters</span>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg bg-bayan-ink p-4 text-white">
                                    <Landmark className="h-5 w-5 shrink-0 text-bayan-gold" />
                                    <span className="text-sm font-bold">Public history sourced from official local portal notes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage
