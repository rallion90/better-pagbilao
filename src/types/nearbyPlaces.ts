export type NearbyPlacesSource = {
  name: string
  url: string
  accessed: string
}

export type PlaceProfile = {
  islandGroup: string
  region: string
  postalCode: string
  coastalOrLandlocked: string
  marineWaterbodies: string[]
  coordinates: {
    latitude: number
    longitude: number
    label: string
  }
  estimatedElevationMeters: number
  areaSquareKm: number
}

export type BorderingPlace = {
  name: string
  direction: string
  type: string
}

export type NearbyUsefulPlace = {
  name: string
  type: string
  note: string
}

export type NearbyPlaces = {
  municipality: string
  province: string
  sources: NearbyPlacesSource[]
  profile: PlaceProfile
  borderingPlaces: BorderingPlace[]
  nearbyUsefulPlaces: NearbyUsefulPlace[]
  transportationNotes: string[]
}
