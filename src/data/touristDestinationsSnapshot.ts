import type { TouristDestinationsData } from "../types/touristDestinations"

// Copy of GET /tourist-destinations taken on 2026-10-04. The tourism pages render this first and swap in the
// live API response when it arrives, so they still have content if the API is slow or down.
// Regenerate it from the API when destinations change; do not edit entries by hand.
export const TOURIST_DESTINATIONS_SNAPSHOT: TouristDestinationsData = {
    "municipality": "Pagbilao",
    "province": "Quezon",
    "sources": [
        {
            "name": "Pagbilao Tourism",
            "url": "https://tourism.pagbilao.gov.ph/"
        },
        {
            "name": "Quezon Tourism",
            "url": "https://tourism.quezon.gov.ph/"
        },
        {
            "name": "Department of Tourism - Quezon",
            "url": "https://www.tourism.gov.ph/destination/calabarzon/quezon/"
        },
        {
            "name": "Municipality of Pagbilao Official Government Portal",
            "url": "https://www.pagbilao.gov.ph/"
        }
    ],
    "destinations": [
        {
            "id": "pagbilao-grande-island",
            "name": "Pagbilao Grande Island",
            "category": [
                "Island",
                "Beach",
                "Nature",
                "Bodies of Water"
            ],
            "barangay": "Ibabang Polo",
            "description": "Island tourism area in Pagbilao associated with Pagbilao Bay, Tayabas Bay, beaches, coastal views, and island activities.",
            "activities": [
                "Swimming",
                "Beachcombing",
                "Camping",
                "Sightseeing",
                "Island hopping"
            ],
            "bestFor": [
                "Beach trips",
                "Friends",
                "Families",
                "Nature trips"
            ],
            "nearbyWaterbodies": [
                "Pagbilao Bay",
                "Tayabas Bay"
            ],
            "image": null,
            "mapQuery": "Pagbilao Grande Island, Pagbilao, Quezon",
            "howToGetThere": {
                "notes": [
                    "Needs local verification for current routes, fares, and boat access."
                ],
                "fromPagbilaoTownProper": null,
                "fromLucenaGrandTerminal": null
            },
            "fees": {
                "notes": "Fees may change. Verify with local tourism office or destination operator before visiting.",
                "boatFee": null,
                "parkingFee": null,
                "entranceFee": null
            },
            "visitorTips": [
                "Check weather and sea conditions before travel.",
                "Bring drinking water and sun protection.",
                "Confirm boat access and return schedule before leaving town."
            ],
            "verificationStatus": "needs local confirmation"
        },
        {
            "id": "palsabangon-falls",
            "name": "Palsabangon Falls",
            "category": [
                "Waterfall",
                "Nature",
                "Bodies of Water"
            ],
            "barangay": "Palsabangon area",
            "description": "Waterfall destination featured on the Pagbilao Tourism website.",
            "activities": [
                "Nature viewing",
                "Photography",
                "Outdoor trip"
            ],
            "bestFor": [
                "Nature trips",
                "Small groups",
                "Local exploration"
            ],
            "image": null,
            "mapQuery": "Palsabangon Falls, Pagbilao, Quezon",
            "howToGetThere": {
                "notes": [
                    "Confirm access route and local guide requirements before visiting."
                ],
                "fromPagbilaoTownProper": null,
                "fromLucenaGrandTerminal": null
            },
            "fees": {
                "notes": "Needs local confirmation.",
                "guideFee": null,
                "entranceFee": null
            },
            "visitorTips": [
                "Wear footwear suitable for wet or uneven ground.",
                "Avoid visiting during heavy rain or unsafe water conditions.",
                "Ask the tourism office or barangay for current access guidance."
            ],
            "verificationStatus": "needs local confirmation"
        },
        {
            "id": "patayan-island",
            "name": "Patayan Island",
            "category": [
                "Island",
                "Land Formation",
                "Beach",
                "Nature"
            ],
            "barangay": null,
            "description": "Land formation destination referenced by the Pagbilao Tourism site.",
            "activities": [
                "Sightseeing",
                "Photography",
                "Beach trip"
            ],
            "bestFor": [
                "Island trips",
                "Nature photography",
                "Adventure travelers"
            ],
            "image": null,
            "mapQuery": "Patayan Island, Pagbilao, Quezon",
            "howToGetThere": {
                "notes": [
                    "Verify if boat transfer is required and whether public access is currently allowed."
                ],
                "fromPagbilaoTownProper": null,
                "fromLucenaGrandTerminal": null
            },
            "fees": {
                "notes": "Needs local confirmation.",
                "boatFee": null,
                "entranceFee": null
            },
            "visitorTips": [
                "Confirm access rules before planning a trip.",
                "Check tide, weather, and sea conditions.",
                "Bring essentials and avoid leaving waste behind."
            ],
            "verificationStatus": "needs local confirmation"
        },
        {
            "id": "binahaan-dam",
            "name": "Binahaan Dam",
            "category": [
                "Dam",
                "Protected Area",
                "Nature",
                "Bodies of Water"
            ],
            "barangay": "Binahaan",
            "description": "Protected-area and water-related destination featured on the Pagbilao Tourism website.",
            "activities": [
                "Sightseeing",
                "Photography",
                "Nature viewing"
            ],
            "bestFor": [
                "Short visits",
                "Nature trips",
                "Local sightseeing"
            ],
            "image": null,
            "mapQuery": "Binahaan Dam, Pagbilao, Quezon",
            "howToGetThere": {
                "notes": [
                    "Confirm current access rules and safe viewing areas."
                ],
                "fromPagbilaoTownProper": null,
                "fromLucenaGrandTerminal": null
            },
            "fees": {
                "notes": "Needs local confirmation.",
                "entranceFee": null
            },
            "visitorTips": [
                "Respect restricted or protected areas.",
                "Do not swim unless explicitly allowed by local authorities.",
                "Follow local safety signs and barangay guidance."
            ],
            "verificationStatus": "needs local confirmation"
        },
        {
            "id": "pagbilao-bay",
            "name": "Pagbilao Bay",
            "category": [
                "Bodies of Water",
                "Beach",
                "Nature"
            ],
            "barangay": null,
            "description": "Coastal bay area associated with Pagbilao and its island and shoreline tourism.",
            "activities": [
                "Beachcombing",
                "Sightseeing",
                "Photography",
                "Boating"
            ],
            "bestFor": [
                "Scenic views",
                "Coastal trips",
                "Nature trips"
            ],
            "image": null,
            "mapQuery": "Pagbilao Bay, Quezon",
            "howToGetThere": {
                "notes": [
                    "Use destination-specific route details once locally verified."
                ],
                "fromPagbilaoTownProper": null,
                "fromLucenaGrandTerminal": null
            },
            "fees": {
                "notes": "Depends on the specific beach, resort, boat operator, or access point."
            },
            "visitorTips": [
                "Choose verified access points.",
                "Check weather and sea conditions.",
                "Confirm whether the destination is public, private, or resort-managed."
            ],
            "verificationStatus": "needs local confirmation"
        },
        {
            "id": "tayabas-bay-coastal-areas",
            "name": "Tayabas Bay Coastal Areas",
            "category": [
                "Bodies of Water",
                "Beach",
                "Nature"
            ],
            "barangay": null,
            "description": "Pagbilao is a coastal municipality with tourism connected to Tayabas Bay and nearby shoreline areas.",
            "activities": [
                "Swimming",
                "Beachcombing",
                "Sightseeing",
                "Photography"
            ],
            "bestFor": [
                "Beach trips",
                "Families",
                "Weekend visits"
            ],
            "image": null,
            "mapQuery": "Tayabas Bay, Pagbilao, Quezon",
            "howToGetThere": {
                "notes": [
                    "Route depends on the chosen resort, beach, or coastal access point."
                ],
                "fromPagbilaoTownProper": null,
                "fromLucenaGrandTerminal": null
            },
            "fees": {
                "notes": "Depends on the chosen access point."
            },
            "visitorTips": [
                "Verify if the area is public access or private resort property.",
                "Check local advisories during bad weather.",
                "Bring cash for local fees when visiting remote areas."
            ],
            "verificationStatus": "needs local confirmation"
        },
        {
            "id": "pagbilao-cultural-built-heritage",
            "name": "Pagbilao Cultural Built Heritage",
            "category": [
                "Heritage",
                "Culture"
            ],
            "barangay": null,
            "description": "Cultural built heritage category listed by the Pagbilao Tourism site.",
            "activities": [
                "Heritage viewing",
                "Photography",
                "Educational visit"
            ],
            "bestFor": [
                "Students",
                "Culture trips",
                "History walks"
            ],
            "image": null,
            "mapQuery": "Pagbilao cultural heritage, Quezon",
            "howToGetThere": {
                "notes": [
                    "Specific site list and route details need local confirmation."
                ]
            },
            "fees": {
                "notes": "Depends on the specific heritage site."
            },
            "visitorTips": [
                "Respect religious, cultural, and heritage spaces.",
                "Ask permission before taking close-up photos inside active facilities.",
                "Check visiting hours when going to churches, halls, or institutions."
            ],
            "verificationStatus": "needs local confirmation"
        },
        {
            "id": "pagbilao-cultural-institutions",
            "name": "Pagbilao Cultural Institutions",
            "category": [
                "Culture",
                "Heritage"
            ],
            "barangay": null,
            "description": "Cultural institution category listed by the Pagbilao Tourism site.",
            "activities": [
                "Educational visit",
                "Cultural learning",
                "Community tourism"
            ],
            "bestFor": [
                "Students",
                "Researchers",
                "Culture-focused visitors"
            ],
            "sourceName": "Cultural Instituition",
            "image": null,
            "mapQuery": "Pagbilao cultural institutions, Quezon",
            "howToGetThere": {
                "notes": [
                    "Specific institution list and visiting guidance need local confirmation."
                ]
            },
            "fees": {
                "notes": "Depends on the specific institution."
            },
            "visitorTips": [
                "Contact the tourism office before visiting institutions.",
                "Check whether appointments or permits are needed.",
                "Use respectful visitor behavior in active community spaces."
            ],
            "verificationStatus": "needs local confirmation"
        },
        {
            "id": "quezon-protected-landscape-nearby",
            "name": "Quezon Protected Landscape",
            "category": [
                "Protected Area",
                "Nature",
                "Viewpoint"
            ],
            "barangay": null,
            "description": "Protected landscape near Pagbilao and neighboring municipalities, useful for nature and eco-tourism context.",
            "activities": [
                "Nature viewing",
                "Hiking",
                "Scenic drive",
                "Photography"
            ],
            "bestFor": [
                "Nature trips",
                "Hikers",
                "Scenic route visitors"
            ],
            "image": null,
            "mapQuery": "Quezon Protected Landscape",
            "howToGetThere": {
                "notes": [
                    "Specific trailheads, rules, and access points need confirmation with local authorities."
                ]
            },
            "fees": {
                "notes": "Needs local confirmation."
            },
            "visitorTips": [
                "Follow protected-area rules.",
                "Avoid leaving trash.",
                "Check weather and trail conditions before going."
            ],
            "verificationStatus": "needs local confirmation"
        },
        {
            "id": "mount-pinagbanderahan-nearby",
            "name": "Mount Pinagbanderahan",
            "category": [
                "Nature",
                "Viewpoint",
                "Heritage"
            ],
            "barangay": null,
            "description": "Historic viewpoint in Quezon where visitors can see towns including Atimonan, Pagbilao, Tayabas, Lucena, and Padre Burgos from the summit.",
            "activities": [
                "Hiking",
                "Sightseeing",
                "Photography",
                "Heritage trip"
            ],
            "bestFor": [
                "Hikers",
                "Scenic viewpoint trips",
                "History-focused visitors"
            ],
            "elevationMeters": 365,
            "image": null,
            "mapQuery": "Mount Pinagbanderahan, Quezon",
            "howToGetThere": {
                "notes": [
                    "This is a nearby Quezon destination, not necessarily inside Pagbilao. Confirm access point and route before presenting as a Pagbilao itinerary stop."
                ]
            },
            "fees": {
                "notes": "Needs local confirmation."
            },
            "visitorTips": [
                "Wear proper hiking footwear.",
                "Bring water and rain protection.",
                "Go with local guidance if unfamiliar with the area."
            ],
            "verificationStatus": "nearby destination; needs route confirmation"
        }
    ]
}
