import { Compass, Home, PhoneCall } from "lucide-react"
import { Link } from "react-router"
import { useSeo } from "../hooks/useSeo"

const NotFoundPage = () => {
    useSeo({
        title: "Page Not Found | Better Pagbilao",
        description: "This page doesn't exist on Better Pagbilao. Head back home to find government services, hotlines, tourism spots, and public documents for Pagbilao, Quezon.",
        path: typeof window !== "undefined" ? window.location.pathname : "/404",
        noindex: true,
    })

    return (
        <section className="bg-white py-20 sm:py-28">
            <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-bayan-blue">404</p>
                <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">Page not found</h1>
                <p className="mt-4 text-base leading-7 text-slate-600">
                    The page you're looking for doesn't exist or may have moved. Try heading back to the homepage, or jump straight to hotlines.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-md bg-bayan-blue px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <Home className="h-4 w-4" />
                        Back to home
                    </Link>
                    <Link
                        to="/hotlines"
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-2.5 text-sm font-black text-slate-800 transition hover:bg-slate-50"
                    >
                        <PhoneCall className="h-4 w-4" />
                        Emergency hotlines
                    </Link>
                    <a
                        href="/#services"
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-2.5 text-sm font-black text-slate-800 transition hover:bg-slate-50"
                    >
                        <Compass className="h-4 w-4" />
                        Browse services
                    </a>
                </div>
            </div>
        </section>
    )
}

export default NotFoundPage
