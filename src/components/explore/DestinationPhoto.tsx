import { useState } from "react"
import type { TouristSpot } from "../../data/touristDestinations"
import { destinationCategoryMeta } from "../../lib/destinationCategories"

type DestinationPhotoProps = {
    spot: TouristSpot
    /** Sizing for the photo and for the icon panel that stands in for it */
    className: string
    /** Show the icon panel when there is no photo (or it fails to load). Without it, nothing is rendered. */
    placeholderLabel?: string
    showCredit?: boolean
    lazy?: boolean
}

/** A destination's photo. Photos are hosted elsewhere, so a broken one falls back to the category icon. */
const DestinationPhoto = ({ spot, className, placeholderLabel, showCredit = false, lazy = true }: DestinationPhotoProps) => {
    const [failed, setFailed] = useState(false)
    const image = failed ? null : spot.image

    if (!image) {
        if (!placeholderLabel) return null
        const { Icon, color } = destinationCategoryMeta(spot.categories)
        return (
            <div className={`grid place-items-center ${color} ${className}`} role="img" aria-label={placeholderLabel}>
                <Icon className="h-12 w-12 opacity-70" />
            </div>
        )
    }

    const photo = (
        <img src={image.src} alt={image.alt} loading={lazy ? "lazy" : undefined} decoding="async" onError={() => setFailed(true)} className={`object-cover ${className}`} />
    )
    if (!showCredit) return photo

    return (
        <figure className="overflow-hidden rounded-lg shadow-soft">
            {photo}
            <figcaption className="bg-bayan-ink px-4 py-2 text-xs font-semibold text-white/60">
                {image.creditUrl ? (
                    <a href={image.creditUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        {image.credit}
                    </a>
                ) : (
                    image.credit
                )}
            </figcaption>
        </figure>
    )
}

export default DestinationPhoto
