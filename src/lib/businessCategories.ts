import { BedDouble, Fish, GraduationCap, HardHat, HeartPulse, ShoppingBag, Sparkles, Store, Truck, Utensils, Wrench, Scissors } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { BusinessCategoryId } from "../types/businesses"

// Category names and order come from the API (/business-categories); only the icon and tint are decided here.
export const CATEGORY_META: Record<BusinessCategoryId, { Icon: LucideIcon; color: string }> = {
    food: { Icon: Utensils, color: "text-amber-700 bg-amber-50" },
    retail: { Icon: Store, color: "text-bayan-blue bg-blue-50" },
    agri: { Icon: Fish, color: "text-bayan-green bg-emerald-50" },
    services: { Icon: Wrench, color: "text-bayan-blue bg-blue-50" },
    health: { Icon: HeartPulse, color: "text-bayan-red bg-red-50" },
    transport: { Icon: Truck, color: "text-amber-700 bg-amber-50" },
    construction: { Icon: HardHat, color: "text-amber-700 bg-amber-50" },
    beauty: { Icon: Scissors, color: "text-bayan-red bg-red-50" },
    education: { Icon: GraduationCap, color: "text-bayan-green bg-emerald-50" },
    stay: { Icon: BedDouble, color: "text-bayan-blue bg-blue-50" },
    online: { Icon: ShoppingBag, color: "text-bayan-green bg-emerald-50" },
    other: { Icon: Sparkles, color: "text-slate-600 bg-slate-100" },
}

export function businessCategoryMeta(slug: string) {
    return CATEGORY_META[slug as BusinessCategoryId] ?? CATEGORY_META.other
}

// schema.org type for each category's structured data (JSON-LD) on the business detail page. Doesn't need to
// be a perfect match — search engines treat these as valid LocalBusiness subtypes either way — just the
// closest reasonable fit so rich results (map cards, knowledge panels) categorize the listing sensibly.
const CATEGORY_SCHEMA_TYPE: Record<BusinessCategoryId, string> = {
    food: "Restaurant",
    retail: "Store",
    agri: "Store",
    services: "LocalBusiness",
    health: "MedicalBusiness",
    transport: "LocalBusiness",
    construction: "HardwareStore",
    beauty: "BeautySalon",
    education: "LocalBusiness",
    stay: "LodgingBusiness",
    online: "Store",
    other: "LocalBusiness",
}

export function categorySchemaType(slug: string) {
    return CATEGORY_SCHEMA_TYPE[slug as BusinessCategoryId] ?? "LocalBusiness"
}
