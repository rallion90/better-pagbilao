import { useId } from "react"
import type { ReactNode } from "react"
import PageBreadcrumb from "./PageBreadcrumb"
import type { BreadcrumbItem } from "./PageBreadcrumb"
import { useSectionAccent } from "../../lib/sectionAccents"
import { useLanguage } from "../../i18n/useLanguage"

export type BannerPhoto = {
    src: string
    /** CSS object-position, e.g. "50% 30%" */
    position?: string
    /** Required for CC BY / CC BY-SA photos. */
    credit: { author: string; license: string; href: string }
}

type PageBannerProps = {
    breadcrumbs: BreadcrumbItem[]
    eyebrow?: ReactNode
    title?: ReactNode
    description?: ReactNode
    /** "large" is the bigger headline used on hub pages (announcements, history, barangays, destinations). */
    size?: "default" | "large"
    /** Optional background photo, shown under a navy gradient so the copy keeps its contrast. */
    photo?: BannerPhoto
    /** Breadcrumb-only strip (e.g. above an article). */
    compact?: boolean
    containerClassName?: string
    /** Anything after the description: stats, actions, forms, or a fully custom header. */
    children?: ReactNode
}

const DEFAULT_CONTAINER = "mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8"

/** The navy banner at the top of every inner page, tinted with the current section's accent. */
const PageBanner = ({
    breadcrumbs,
    eyebrow,
    title,
    description,
    size = "default",
    photo,
    compact = false,
    containerClassName = DEFAULT_CONTAINER,
    children,
}: PageBannerProps) => {
    const accent = useSectionAccent()
    const { t } = useLanguage()
    const patternId = `banig-${useId().replace(/:/g, "")}`
    const large = size === "large"

    return (
        <section className={`relative isolate overflow-hidden bg-bayan-ink text-white ${compact ? "py-6" : "py-14 sm:py-16"}`}>
            {photo && (
                <>
                    <img
                        src={photo.src}
                        alt=""
                        aria-hidden
                        decoding="async"
                        fetchPriority="high"
                        className="absolute inset-0 -z-20 h-full w-full object-cover"
                        style={{ objectPosition: photo.position ?? "50% 50%" }}
                    />
                    <div
                        aria-hidden
                        className="absolute inset-0 -z-10 bg-bayan-ink/85 md:bg-transparent md:bg-[linear-gradient(90deg,rgba(23,32,51,0.96)_0%,rgba(23,32,51,0.88)_42%,rgba(23,32,51,0.45)_75%,rgba(23,32,51,0.3)_100%)]"
                    />
                </>
            )}

            {/* Banig (woven mat) pattern, kept faint so it reads as texture, not decoration. */}
            <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-white opacity-[0.035]">
                <defs>
                    <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <g fill="currentColor">
                            <rect x="0" y="1" width="14" height="5" />
                            <rect x="0" y="8" width="14" height="5" />
                            <rect x="15" y="0" width="5" height="14" />
                            <rect x="22" y="0" width="5" height="14" />
                            <rect x="1" y="14" width="5" height="14" />
                            <rect x="8" y="14" width="5" height="14" />
                            <rect x="14" y="15" width="14" height="5" />
                            <rect x="14" y="22" width="14" height="5" />
                        </g>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>

            {/* Section accent along the bottom edge */}
            <span aria-hidden className={`absolute inset-x-0 bottom-0 h-1 bg-current opacity-80 ${accent.onDark}`} />

            <div className={containerClassName}>
                <PageBreadcrumb items={breadcrumbs} />

                {eyebrow && (
                    <p className={`${large ? "mt-8" : "mt-6"} flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] ${accent.onDark}`}>
                        <span aria-hidden className="h-1 w-6 rounded-full bg-current" />
                        {eyebrow}
                    </p>
                )}
                {title && (
                    <h1
                        className={
                            large
                                ? "mt-3 max-w-4xl text-3xl font-black tracking-normal sm:text-4xl lg:text-5xl lg:leading-[1.1]"
                                : "mt-3 text-3xl font-black tracking-normal sm:text-4xl"
                        }
                    >
                        {title}
                    </h1>
                )}
                {description && <p className="mt-4 max-w-3xl text-base leading-8 text-white/76">{description}</p>}

                {children}
            </div>

            {photo && (
                <a
                    href={photo.credit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-4 max-w-[60%] truncate text-[11px] font-medium text-white/60 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-bayan-gold sm:right-6 lg:right-8"
                >
                    {t.banner.photo}: {photo.credit.author}, {photo.credit.license}
                </a>
            )}
        </section>
    )
}

export default PageBanner
