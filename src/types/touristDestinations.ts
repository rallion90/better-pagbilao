// GET /tourist-destinations. Only id, name, category, barangay, description and image are on every entry;
// the rest varies by destination.
export type TouristDestination = {
  id: string
  name: string
  category: string[]
  barangay: string | null
  description: string
  image: string | null
  activities?: string[]
  bestFor?: string[]
  /** Only on events */
  dateLabel?: string
  mapQuery?: string
  howToGetThere?: {
    fromPagbilaoTownProper?: string | null
    fromLucenaGrandTerminal?: string | null
    notes?: string[]
  }
  /** Amounts are null until confirmed locally; `notes` is free text. */
  fees?: Record<string, string | number | null | undefined>
  visitorTips?: string[]
  /** e.g. "needs local confirmation", "nearby destination; needs route confirmation" */
  verificationStatus?: string
  nearbyWaterbodies?: string[]
  sourceName?: string
  elevationMeters?: number
}

export type TouristDestinationsData = {
  municipality: string
  province: string
  destinations: TouristDestination[]
  sources?: { name: string; url: string }[]
}
