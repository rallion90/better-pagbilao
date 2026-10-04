import { ArrowLeft, Clock, EyeOff, FilePlus2, Globe, LoaderCircle, MapPin, Package, PhoneCall, SearchX, TriangleAlert } from "lucide-react"
import { lazy, Suspense } from "react"
import type { ReactNode } from "react"
import { Link, useParams } from "react-router"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import ShareButton from "../../components/common/ShareButton"
import { useBusiness } from "../../hooks/useBusiness"
import { useBusinessDirectory } from "../../hooks/useBusinessDirectory"
import { useBusinessList } from "../../hooks/useBusinessList"
import { useSeo } from "../../hooks/useSeo"
import { businessDirectoryCopy } from "../../i18n/businessDirectory"
import { useLanguage } from "../../i18n/useLanguage"
import { businessPosition, onlineHref, telHref } from "../../lib/businessApi"
import { businessCategoryMeta, categorySchemaType } from "../../lib/businessCategories"
import type { Business } from "../../types/businesses"

const BusinessMap = lazy(() => import("../../components/community/BusinessMap"))

const SITE_URL = "https://betterpagbilao.org"
const DIRECTORY_PATH = "/community/businesses"
const ADD_PATH = "/community/businesses/add"
const RELATED_LIMIT = 6

/** Dark hero used for the loading, error and not-found states. */
const StatusHero = ({ icon, heading, body, children }: { icon: ReactNode; heading: string; body?: string; children?: ReactNode }) => {
    const { lang, t } = useLanguage()
    const copy = businessDirectoryCopy[lang]
    return (
        <section className="bg-bayan-ink py-20 text-white sm:py-28">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                <PageBreadcrumb items={[{ label: t.services.breadcrumbHome, to: "/" }, { label: copy.breadcrumbCommunity }, { label: copy.directory.breadcrumb, to: DIRECTORY_PATH }]} />
                <div className="mx-auto mt-10 max-w-2xl text-center">
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white/10 text-bayan-gold ring-1 ring-white/15">{icon}</span>
                    <h1 className="mt-5 text-3xl font-black sm:text-4xl">{heading}</h1>
                    {body && <p className="mt-4 text-base leading-8 text-white/76">{body}</p>}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        {children}
                        <Link
                            to={DIRECTORY_PATH}
                            className="inline-flex items-center gap-2 rounded-md bg-bayan-gold px-5 py-3 text-sm font-black text-bayan-ink transition hover:bg-amber-400"
                        >
                            <ArrowLeft className="h-4 w-4" /> {copy.detail.backToDirectory}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

/** Other listings in the same category. Gives every business page links to its neighbors, for visitors and crawlers alike. */
const RelatedBusinesses = ({ business, categoryLabel }: { business: Business; categoryLabel: string }) => {
    const { lang } = useLanguage()
    const copy = businessDirectoryCopy[lang].detail
    const { businesses } = useBusinessList({ q: "", category: business.category, barangay: "", page: 1 })
    const related = businesses.filter((other) => other.id !== business.id && other.category === business.category).slice(0, RELATED_LIMIT)

    if (related.length === 0) return null

    return (
        <section className="bg-bayan-mist py-14 sm:py-16">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-black sm:text-3xl">{categoryLabel ? copy.relatedHeading(categoryLabel) : copy.relatedFallbackHeading}</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {related.map((other) => {
                        const { Icon, color } = businessCategoryMeta(other.category)
                        return (
                            <li key={other.id}>
                                <Link
                                    to={`${DIRECTORY_PATH}/${other.id}`}
                                    className="flex h-full items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
                                >
                                    {other.logoUrl ? (
                                        <img src={other.logoUrl} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-md object-cover ring-1 ring-slate-200" />
                                    ) : (
                                        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${color}`}>
                                            <Icon className="h-5 w-5" />
                                        </span>
                                    )}
                                    <span className="min-w-0">
                                        <span className="block text-base font-black leading-6 text-bayan-ink">{other.name}</span>
                                        <span className="mt-1 flex items-start gap-1.5 text-xs font-bold text-slate-500">
                                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                            <span>
                                                {other.barangay} · {other.address}
                                            </span>
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

const BusinessDetailPage = () => {
    const { lang, t } = useLanguage()
    const copy = businessDirectoryCopy[lang]
    const { id = "" } = useParams()
    const { categoryName } = useBusinessDirectory()
    const { business, loading, notFound, failed, reload } = useBusiness(id)

    const category = business ? categoryName(business.category) : ""
    const callHref = business ? telHref(business.phone) : null

    // Keyword-rich on purpose: category and barangay in the title/description are what let someone find this
    // specific business — not just the site — from a Google search for e.g. "carinderia Daungan Pagbilao".
    const title = business
        ? `${business.name} — ${category ? `${category} in ` : ""}Barangay ${business.barangay}, Pagbilao | Better Pagbilao`
        : `${copy.directory.breadcrumb} | Better Pagbilao`
    const description = business
        ? `${business.description} Find ${business.name} in Barangay ${business.barangay}, Pagbilao, Quezon — hours, contact number, and location on the map.`
        : "Community directory of local businesses in Pagbilao, Quezon."

    // Slugs never change, so the slug URL is the canonical one.
    const canonicalPath = `${DIRECTORY_PATH}/${business?.id ?? id}`

    const jsonLd = business
        ? {
              "@context": "https://schema.org",
              "@type": categorySchemaType(business.category),
              "@id": `${SITE_URL}${canonicalPath}`,
              name: business.name,
              description: business.description,
              url: `${SITE_URL}${canonicalPath}`,
              ...(callHref ? { telephone: business.phone } : {}),
              address: {
                  "@type": "PostalAddress",
                  streetAddress: `${business.address}, Barangay ${business.barangay}`,
                  addressLocality: "Pagbilao",
                  addressRegion: "Quezon",
                  postalCode: "4302",
                  addressCountry: "PH",
              },
              // Omitted entirely (not rounded) unless the owner chose "exact" — publishing even the server's offset
              // pin in structured data would hand out coordinates that defeat an "approximate" choice.
              ...(business.pinPrecision === "exact" && business.latitude !== null && business.longitude !== null
                  ? { geo: { "@type": "GeoCoordinates", latitude: business.latitude, longitude: business.longitude } }
                  : {}),
              ...(business.logoUrl ? { logo: business.logoUrl } : {}),
              ...(business.logoUrl || business.gallery.length > 0
                  ? { image: [business.logoUrl, ...business.gallery.map((photo) => photo.url)].filter(Boolean) }
                  : {}),
              ...(business.online ? { sameAs: [onlineHref(business.online)] } : {}),
          }
        : undefined

    useSeo({ title, description, path: canonicalPath, jsonLd, noindex: !business })

    if (loading) {
        return <StatusHero icon={<LoaderCircle className="h-9 w-9 animate-spin" />} heading={copy.detail.loading} />
    }

    if (notFound || !business) {
        return failed ? (
            <StatusHero icon={<TriangleAlert className="h-9 w-9" />} heading={copy.detail.loadFailed}>
                <button type="button" onClick={reload} className="rounded-md bg-bayan-blue px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700">
                    {copy.detail.retry}
                </button>
            </StatusHero>
        ) : (
            <StatusHero icon={<SearchX className="h-9 w-9" />} heading={copy.detail.notFoundHeading} body={copy.detail.notFoundBody} />
        )
    }

    const { Icon, color } = businessCategoryMeta(business.category)
    const galleryLabel = copy.galleryLabel[business.category] ?? copy.galleryLabel.other
    const position = businessPosition(business)

    return (
        <>
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb
                        items={[
                            { label: t.services.breadcrumbHome, to: "/" },
                            { label: copy.breadcrumbCommunity },
                            { label: copy.directory.breadcrumb, to: DIRECTORY_PATH },
                            { label: business.name },
                        ]}
                    />
                    <div className="mt-8 flex flex-wrap items-center gap-5">
                        {business.logoUrl ? (
                            <img src={business.logoUrl} alt={copy.detail.logoAlt(business.name)} className="h-16 w-16 shrink-0 rounded-2xl bg-white object-cover" />
                        ) : (
                            <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${color}`}>
                                <Icon className="h-7 w-7" />
                            </span>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-black uppercase tracking-[0.14em] text-bayan-gold">{category}</p>
                            <h1 className="mt-1 text-3xl font-black tracking-normal sm:text-4xl">{business.name}</h1>
                        </div>
                    </div>
                    <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-8 text-white/76">{business.description}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        {callHref && (
                            <a href={callHref} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-black text-bayan-ink shadow-soft">
                                <PhoneCall className="h-4 w-4 text-bayan-blue" /> {business.phone}
                            </a>
                        )}
                        {business.online && (
                            <a
                                href={onlineHref(business.online)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/16"
                            >
                                <Globe className="h-4 w-4" /> {copy.detail.online}
                            </a>
                        )}
                        <ShareButton title={`${business.name}, Barangay ${business.barangay}, Pagbilao`} path={canonicalPath} />
                    </div>
                </div>
            </section>

            <section className="bg-white py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
                        <div>
                            {/* Gallery */}
                            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{galleryLabel}</h2>
                            {business.gallery.length > 0 ? (
                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {business.gallery.map((photo, index) => (
                                        <a
                                            key={photo.url}
                                            href={photo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block aspect-square overflow-hidden rounded-lg border border-slate-200 bg-bayan-mist"
                                        >
                                            <img
                                                src={photo.url}
                                                alt={copy.detail.photoAlt(business.name, index + 1)}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition hover:scale-105"
                                            />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-5 rounded-lg border border-dashed border-slate-300 bg-bayan-mist p-6 text-center text-sm font-semibold text-slate-500">
                                    {copy.detail.galleryEmpty}
                                </p>
                            )}
                        </div>

                        {/* Sidebar: about + map */}
                        <div className="space-y-6 lg:sticky lg:top-36">
                            <div className="rounded-lg border border-slate-200 bg-white p-5">
                                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.detail.aboutHeading}</h2>
                                <dl className="mt-4 space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bayan-blue" />
                                        <div>
                                            <dt className="text-xs font-black uppercase tracking-widest text-slate-400">{copy.detail.addressLabel}</dt>
                                            <dd className="mt-0.5 font-semibold text-slate-700">
                                                {business.address} · {business.barangay}
                                            </dd>
                                        </div>
                                    </div>
                                    {business.hours && (
                                        <div className="flex items-start gap-3">
                                            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-bayan-blue" />
                                            <div>
                                                <dt className="text-xs font-black uppercase tracking-widest text-slate-400">{copy.detail.hoursLabel}</dt>
                                                <dd className="mt-0.5 font-semibold text-slate-700">{business.hours}</dd>
                                            </div>
                                        </div>
                                    )}
                                    {business.productsServices && (
                                        <div className="flex items-start gap-3">
                                            <Package className="mt-0.5 h-4 w-4 shrink-0 text-bayan-blue" />
                                            <div>
                                                <dt className="text-xs font-black uppercase tracking-widest text-slate-400">{copy.detail.productsLabel}</dt>
                                                <dd className="mt-0.5 font-semibold text-slate-700">{business.productsServices}</dd>
                                            </div>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
                                <div className="border-b border-slate-200 px-5 py-3">
                                    <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.detail.mapHeading}</h2>
                                </div>
                                {position ? (
                                    <>
                                        <div className="isolate h-64 bg-slate-100 sm:h-80">
                                            <Suspense fallback={<div className="grid h-full place-items-center text-sm font-semibold text-slate-500">{copy.directory.map.loading}</div>}>
                                                <BusinessMap businesses={[business]} selectedId={business.id} initialCenter={position} initialZoom={business.pinPrecision === "exact" ? 16 : 15} />
                                            </Suspense>
                                        </div>
                                        {business.pinPrecision === "approximate" && (
                                            <p className="border-t border-slate-200 bg-bayan-mist px-5 py-3 text-xs font-semibold leading-5 text-slate-500">
                                                {copy.detail.approxNote}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="flex items-start gap-3 bg-bayan-mist px-5 py-5 text-sm font-semibold leading-6 text-slate-600">
                                        <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /> {copy.detail.hiddenNote}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <RelatedBusinesses business={business} categoryLabel={category} />

            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto grid max-w-[1600px] gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:px-8">
                    <div>
                        <h2 className="text-2xl font-black sm:text-3xl">{copy.detail.ctaHeading}</h2>
                        <p className="mt-3 max-w-xl text-base leading-8 text-white/76">{copy.detail.ctaBody}</p>
                    </div>
                    <div className="flex flex-col items-start gap-4 lg:items-end">
                        <Link
                            to={ADD_PATH}
                            className="inline-flex items-center gap-2 rounded-md bg-bayan-gold px-5 py-3 text-sm font-black text-bayan-ink transition hover:bg-amber-400"
                        >
                            <FilePlus2 className="h-4 w-4" /> {copy.detail.ctaButton}
                        </Link>
                        <Link to={DIRECTORY_PATH} className="inline-flex items-center gap-1 text-sm font-bold text-white/76 hover:gap-2 hover:text-white">
                            <ArrowLeft className="h-4 w-4 transition-all" /> {copy.detail.backToDirectory}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default BusinessDetailPage
