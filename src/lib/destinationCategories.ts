import { Droplets, Landmark, Mountain, Palmtree, PartyPopper, TreePine, Umbrella, Waves } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type CategoryMeta = { Icon: LucideIcon; color: string }

const META: Record<string, CategoryMeta> = {
    Beach: { Icon: Umbrella, color: "text-amber-700 bg-amber-50" },
    Island: { Icon: Palmtree, color: "text-bayan-green bg-emerald-50" },
    "Bodies of Water": { Icon: Waves, color: "text-bayan-blue bg-blue-50" },
    Waterfall: { Icon: Droplets, color: "text-bayan-blue bg-blue-50" },
    Dam: { Icon: Waves, color: "text-bayan-blue bg-blue-50" },
    "Protected Area": { Icon: TreePine, color: "text-bayan-green bg-emerald-50" },
    "Land Formation": { Icon: Mountain, color: "text-amber-700 bg-amber-50" },
    Heritage: { Icon: Landmark, color: "text-bayan-red bg-red-50" },
    Culture: { Icon: Landmark, color: "text-bayan-red bg-red-50" },
    Festival: { Icon: PartyPopper, color: "text-bayan-red bg-red-50" },
    Viewpoint: { Icon: Mountain, color: "text-amber-700 bg-amber-50" },
    Nature: { Icon: TreePine, color: "text-bayan-green bg-emerald-50" },
}

/** Icon and color for a destination, taken from its main (first) category. Unknown categories get the nature icon. */
export function destinationCategoryMeta(categories: string[]): CategoryMeta {
    return META[categories[0]] ?? META.Nature
}
