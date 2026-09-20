import { ImageOff } from "lucide-react"
import { useState } from "react"

type AnnouncementImageProps = {
    src: string
    /** the announcement's title */
    alt: string
    className?: string
    failedLabel: string
}

// Renders an <img> only (never HTML from the API). If the file cannot be loaded, a quiet placeholder takes its place.
const AnnouncementImage = ({ src, alt, className = "", failedLabel }: AnnouncementImageProps) => {
    const [failed, setFailed] = useState(false)

    if (failed) {
        return (
            <div role="img" aria-label={failedLabel} className={`grid place-items-center bg-slate-100 text-slate-400 ${className}`}>
                <ImageOff className="h-8 w-8" aria-hidden />
            </div>
        )
    }

    return <img src={src} alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} className={`bg-slate-100 object-cover ${className}`} />
}

export default AnnouncementImage
