import { useState } from "react"
import type { TouristSpot } from "../../data/touristDestinations"
import { destinationCategoryMeta } from "../../lib/destinationCategories"
import { useLanguage } from "../../i18n/useLanguage"

type DestinationPhotoProps = {
    spot: TouristSpot
    /** "card" is the 4:3 listing thumbnail, "feature" the 16:9 photo on the detail page. */
    variant?: "card" | "feature"
    /** Show the icon panel when there is no photo (or it fails to load). Without it, nothing is rendered. */
    placeholderLabel?: string
    lazy?: boolean
}

const ASPECT = { card: "aspect-[4/3]", feature: "aspect-video" }

/** A destination's licensed photo with its credit line, or the category icon when there is no photo. */
const DestinationPhoto = ({ spot, variant = "card", placeholderLabel, lazy = true }: DestinationPhotoProps) => {
    const { t, lang } = useLanguage()
    const [failed, setFailed] = useState(false)
    const image = failed ? null : spot.image
    const aspect = ASPECT[variant]

    if (!image) {
        if (!placeholderLabel) return null
        const { Icon, color } = destinationCategoryMeta(spot.categories)
        return (
            <div className={`grid w-full place-items-center ${aspect} ${color}`} role="img" aria-label={placeholderLabel}>
                <Icon className="h-12 w-12 opacity-70" />
            </div>
        )
    }

    const credit = (
        <a
            href={image.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-bayan-ink hover:underline focus-visible:outline-2 focus-visible:outline-bayan-blue"
        >
            {t.banner.photo}: {image.author}, {image.license}
        </a>
    )

    return (
        <figure className={variant === "feature" ? "overflow-hidden rounded-lg border border-slate-200 bg-white" : "bg-white"}>
            <img
                src={image.src}
                width={image.width}
                height={image.height}
                alt={image.alt[lang]}
                loading={lazy ? "lazy" : undefined}
                fetchPriority={lazy ? undefined : "high"}
                decoding="async"
                onError={() => setFailed(true)}
                className={`block w-full bg-slate-200 object-cover ${aspect}`}
                style={image.position ? { objectPosition: image.position } : undefined}
            />
            <figcaption
                className={
                    variant === "feature"
                        ? "px-4 py-2 text-xs font-semibold text-slate-500"
                        : "truncate px-5 pt-2 text-[11px] font-semibold text-slate-500"
                }
            >
                {credit}
            </figcaption>
        </figure>
    )
}

export default DestinationPhoto
