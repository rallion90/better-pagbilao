// Colored initials for officials, instead of a generic person icon. Decorative: the name is always shown next to it.

const HONORIFICS = new Set(["hon", "dr", "engr", "atty", "mr", "ms", "mrs", "arch", "gov", "mayor", "vice", "sk"])
const SUFFIXES = new Set(["jr", "sr", "ii", "iii", "iv"])

// No red: red is reserved for emergency UI. Each pair passes WCAG AA for its text.
const PALETTE = [
    "bg-blue-50 text-bayan-blue",
    "bg-emerald-50 text-bayan-green",
    "bg-amber-50 text-amber-800",
    "bg-bayan-sea-light text-bayan-sea-deep",
    "bg-bayan-bamboo-light text-bayan-bamboo-deep",
    "bg-slate-100 text-bayan-ink",
]

function initialsOf(name: string): string {
    const words = name
        .split(",")[0] // drop ", MD, FPAMS" style credentials
        .split(/\s+/)
        .map((word) => word.replace(/[^\p{L}]/gu, ""))
        .filter((word) => word.length > 1 && !HONORIFICS.has(word.toLowerCase()) && !SUFFIXES.has(word.toLowerCase()))
    if (words.length === 0) return "?"
    const first = words[0][0]
    const last = words.length > 1 ? words[words.length - 1][0] : ""
    return (first + last).toUpperCase()
}

function paletteFor(name: string) {
    let hash = 0
    for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
    return PALETTE[hash % PALETTE.length]
}

const SIZES = { md: "h-11 w-11 text-sm", lg: "h-14 w-14 text-base" }

const InitialsAvatar = ({ name, size = "md" }: { name: string; size?: keyof typeof SIZES }) => (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full font-black tracking-wide ring-1 ring-inset ring-black/5 ${SIZES[size]} ${paletteFor(name)}`}>
        {initialsOf(name)}
    </span>
)

export default InitialsAvatar
