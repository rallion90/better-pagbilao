export type TouristDestination = {
  id: string
  name: string
  category: string[]
  barangay: string | null
  description: string
  image: string | null
}

export type TouristDestinationsData = {
  municipality: string
  province: string
  destinations: TouristDestination[]
}
