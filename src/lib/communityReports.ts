import {
    Construction,
    Droplets,
    Lightbulb,
    MessageSquareWarning,
    ShieldAlert,
    Trash2,
    TreePine,
    Waves,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type ReportStatus = "received" | "in-progress" | "resolved"

export type CategoryId = "road" | "streetlight" | "garbage" | "drainage" | "water" | "safety" | "trees" | "other"

export type LatLng = [number, number]

export interface CommunityReport {
    id: string
    category: CategoryId
    title: string
    description: string
    barangay: string
    position: LatLng
    status: ReportStatus
    createdAt: string
    upvotes: number
    sample?: boolean
}

export const PAGBILAO_CENTER: LatLng = [13.9714, 121.6869]

// Loose bounding box around the municipality (includes Pagbilao Grande Island) used to reject pins dropped far away.
const PAGBILAO_BOUNDS = { south: 13.85, north: 14.08, west: 121.58, east: 121.82 }

export function isWithinPagbilao([lat, lng]: LatLng) {
    return lat >= PAGBILAO_BOUNDS.south && lat <= PAGBILAO_BOUNDS.north && lng >= PAGBILAO_BOUNDS.west && lng <= PAGBILAO_BOUNDS.east
}

export const CATEGORY_META: Record<CategoryId, { Icon: LucideIcon; color: string }> = {
    road: { Icon: Construction, color: "text-amber-700 bg-amber-50" },
    streetlight: { Icon: Lightbulb, color: "text-bayan-blue bg-blue-50" },
    garbage: { Icon: Trash2, color: "text-bayan-green bg-emerald-50" },
    drainage: { Icon: Waves, color: "text-bayan-blue bg-blue-50" },
    water: { Icon: Droplets, color: "text-bayan-blue bg-blue-50" },
    safety: { Icon: ShieldAlert, color: "text-bayan-red bg-red-50" },
    trees: { Icon: TreePine, color: "text-bayan-green bg-emerald-50" },
    other: { Icon: MessageSquareWarning, color: "text-slate-600 bg-slate-100" },
}

export const CATEGORY_IDS = Object.keys(CATEGORY_META) as CategoryId[]

export const STATUS_META: Record<ReportStatus, { pin: string; badge: string }> = {
    received: { pin: "#155eef", badge: "bg-blue-50 text-bayan-blue ring-blue-200" },
    "in-progress": { pin: "#fdb022", badge: "bg-amber-50 text-amber-700 ring-amber-200" },
    resolved: { pin: "#12805c", badge: "bg-emerald-50 text-bayan-green ring-emerald-200" },
}

export const STATUS_IDS = Object.keys(STATUS_META) as ReportStatus[]

export const BARANGAYS = [
    "Añato",
    "Alupaye",
    "Antipolo",
    "Ibabang Bagumbungan",
    "Ilayang Bagumbungan",
    "Bantigue",
    "Bigo",
    "Binahaan",
    "Bukal",
    "Castillo",
    "Daungan",
    "Del Carmen",
    "Ikirin",
    "Kanlurang Malicboy",
    "Silangang Malicboy",
    "Mapagong",
    "Mayhay",
    "Ibabang Palsabangon",
    "Ilayang Palsabangon",
    "Parang",
    "Pinagbayanan",
    "Ibabang Polo",
    "Ilayang Polo",
    "Sta. Catalina",
    "Talipan",
    "Tambak",
    "Tukalan",
]

const DAY_MS = 24 * 60 * 60 * 1000
const daysAgo = (days: number) => new Date(Date.now() - days * DAY_MS).toISOString()

// Illustrative placeholder reports so the page has something to show before real submissions exist.
// Positions are approximate and are not tied to real incidents.
export const SAMPLE_REPORTS: CommunityReport[] = [
    {
        id: "PG-SAMPLE-0001",
        category: "road",
        title: "Deep pothole near the highway junction",
        description: "A wide pothole has formed on the right lane. Tricycles and motorcycles swerve into oncoming traffic to avoid it.",
        barangay: "Ibabang Polo",
        position: [13.9752, 121.6893],
        status: "in-progress",
        createdAt: daysAgo(6),
        upvotes: 14,
        sample: true,
    },
    {
        id: "PG-SAMPLE-0002",
        category: "streetlight",
        title: "Streetlights out along the coastal road",
        description: "Three consecutive posts have been dark for over a week, making the stretch unsafe for students walking home in the evening.",
        barangay: "Daungan",
        position: [13.9671, 121.7002],
        status: "received",
        createdAt: daysAgo(2),
        upvotes: 9,
        sample: true,
    },
    {
        id: "PG-SAMPLE-0003",
        category: "garbage",
        title: "Uncollected garbage beside the public market",
        description: "Sacks of waste have piled up for several days and are attracting stray animals and flies.",
        barangay: "Ilayang Polo",
        position: [13.9701, 121.6822],
        status: "resolved",
        createdAt: daysAgo(12),
        upvotes: 21,
        sample: true,
    },
    {
        id: "PG-SAMPLE-0004",
        category: "drainage",
        title: "Clogged canal floods the street after light rain",
        description: "The drainage canal is blocked with silt and plastic. Water reaches the doorsteps of nearby homes within minutes of rainfall.",
        barangay: "Bigo",
        position: [13.9618, 121.6744],
        status: "in-progress",
        createdAt: daysAgo(4),
        upvotes: 17,
        sample: true,
    },
    {
        id: "PG-SAMPLE-0005",
        category: "water",
        title: "Leaking water main on the barangay road",
        description: "Clean water has been flowing onto the road since morning and the pressure in nearby households is very low.",
        barangay: "Talipan",
        position: [13.9805, 121.6738],
        status: "received",
        createdAt: daysAgo(1),
        upvotes: 6,
        sample: true,
    },
    {
        id: "PG-SAMPLE-0006",
        category: "trees",
        title: "Leaning tree threatening the electric line",
        description: "A large acacia is leaning toward the power line after the last typhoon and could fall in strong wind.",
        barangay: "Castillo",
        position: [13.9769, 121.7051],
        status: "in-progress",
        createdAt: daysAgo(8),
        upvotes: 11,
        sample: true,
    },
    {
        id: "PG-SAMPLE-0007",
        category: "safety",
        title: "Open manhole cover at a school crossing",
        description: "The cover is missing and the hole is only marked with a tree branch. It is a hazard for pupils crossing in the morning.",
        barangay: "Parang",
        position: [13.9563, 121.6931],
        status: "resolved",
        createdAt: daysAgo(15),
        upvotes: 26,
        sample: true,
    },
    {
        id: "PG-SAMPLE-0008",
        category: "road",
        title: "Broken sidewalk slabs by the elementary school",
        description: "Several concrete slabs are cracked and lifted, forcing pupils and senior citizens to walk on the roadway.",
        barangay: "Mapagong",
        position: [13.9847, 121.6902],
        status: "received",
        createdAt: daysAgo(3),
        upvotes: 5,
        sample: true,
    },
]

const REPORTS_KEY = "bp_community_reports"
const VOTES_KEY = "bp_community_votes"

export function loadUserReports(): CommunityReport[] {
    try {
        const raw = window.localStorage.getItem(REPORTS_KEY)
        const parsed: unknown = raw ? JSON.parse(raw) : []
        return Array.isArray(parsed) ? (parsed as CommunityReport[]) : []
    } catch {
        return []
    }
}

export function saveUserReports(reports: CommunityReport[]) {
    try {
        window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
    } catch {
        // storage unavailable, the report still shows for this session
    }
}

export function loadVotes(): string[] {
    try {
        const raw = window.localStorage.getItem(VOTES_KEY)
        const parsed: unknown = raw ? JSON.parse(raw) : []
        return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []
    } catch {
        return []
    }
}

export function saveVotes(ids: string[]) {
    try {
        window.localStorage.setItem(VOTES_KEY, JSON.stringify(ids))
    } catch {
        // ignore storage errors
    }
}

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function createReference() {
    const bytes = new Uint8Array(4)
    crypto.getRandomValues(bytes)
    const suffix = Array.from(bytes, (byte) => REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length]).join("")
    return `PG-${new Date().getFullYear()}-${suffix}`
}
