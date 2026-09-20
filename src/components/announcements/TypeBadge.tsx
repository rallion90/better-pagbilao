import { TYPE_STYLE } from "../../lib/announcementFormat"
import type { AnnouncementType } from "../../types/announcements"

const FALLBACK = TYPE_STYLE.general

// The text is the API's typeLabel; colour and icon are decided here.
const TypeBadge = ({ type, label }: { type: AnnouncementType; label: string }) => {
    const style = TYPE_STYLE[type] ?? FALLBACK
    const Icon = style.icon
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ring-1 ${style.badge}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
        </span>
    )
}

export default TypeBadge
