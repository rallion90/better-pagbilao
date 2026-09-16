import { fetchPgApi, pgApiEndpoints } from "./pgApi"
import type { GovernanceData } from "../types/governance"
import type { PublicOfficesData } from "../types/publicOffices"
import type { EmergencyDirectory } from "../types/emergencyDirectory"
import type { FormsAndDocumentsData } from "../types/formsAndDocuments"
import type { ServicesData, ServiceCategory } from "../types/services"
import type { TouristDestinationsData } from "../types/touristDestinations"

export type SearchItem = {
  id: string
  title: string
  subtitle?: string
  category: string
  path: string
  external?: boolean
}

const STATIC_PAGES: SearchItem[] = [
  { id: "page-home", title: "Home", subtitle: "Better Pagbilao overview", category: "Page", path: "/" },
  { id: "page-legislative-council", title: "Legislative Council", subtitle: "Sangguniang Bayan members", category: "Page", path: "/government/legislative-council" },
  { id: "page-local-officials", title: "Local Officials Directory", subtitle: "Municipal offices and department heads", category: "Page", path: "/government/local-officials-directory" },
  { id: "page-health", title: "Health Services", subtitle: "Municipal health office and programs", category: "Page", path: "/services/health-services" },
  { id: "page-disaster", title: "Disaster and Safety", subtitle: "MDRRMO and emergency preparedness", category: "Page", path: "/services/disaster-and-safety" },
  { id: "page-agriculture", title: "Agriculture and Livelihood", subtitle: "Farming and fisheries support", category: "Page", path: "/services/agriculture-and-livelihood" },
  { id: "page-social-welfare", title: "Social Welfare", subtitle: "MSWD assistance and facilities", category: "Page", path: "/services/social-welfare" },
  { id: "page-business", title: "Business and Permits", subtitle: "Business registration and permits", category: "Page", path: "/services/business-and-permits" },
  { id: "page-hotlines", title: "Hotlines", subtitle: "Emergency numbers and public offices", category: "Page", path: "/hotlines" },
  { id: "page-gateway", title: "Gateway Location", subtitle: "Geography, nearby places, tourism", category: "Page", path: "/explore/gateway-location" },
  { id: "page-ordinances", title: "Ordinances and Executive Orders", subtitle: "Legislative issuances", category: "Page", path: "/transparency/ordinances-and-executive-orders" },
  { id: "page-procurement", title: "Procurement", subtitle: "Bids and procurement notices", category: "Page", path: "/transparency/procurement" },
  { id: "page-citizens-charter", title: "Citizen's Charter", subtitle: "Service standards and requirements", category: "Page", path: "/transparency/citizens-charter" },
  { id: "page-permits", title: "Permits and Clearances", subtitle: "Transparency documents", category: "Page", path: "/transparency/permits-and-clearances" },
]

function getCategoryOffices(category: ServiceCategory): { name: string; head: string }[] {
  const confirmed = category.confirmed as Record<string, unknown>
  const offices: { name: string; head: string }[] = []
  if (Array.isArray(confirmed.offices)) offices.push(...(confirmed.offices as { name: string; head: string }[]))
  if (confirmed.office) offices.push(confirmed.office as { name: string; head: string })
  return offices
}

function getCategoryFacilities(category: ServiceCategory): { name: string }[] {
  const confirmed = category.confirmed as Record<string, unknown>
  if (Array.isArray(confirmed.facilities)) return confirmed.facilities as { name: string }[]
  return []
}

let cachedIndex: Promise<SearchItem[]> | null = null

// Fetched once per session and shared by every consumer — the index only
// changes when the underlying municipal data changes, which isn't often
// enough to justify re-fetching six endpoints on every search-box focus.
export function loadSearchIndex(): Promise<SearchItem[]> {
  if (!cachedIndex) {
    cachedIndex = buildSearchIndex().catch((err: unknown) => {
      cachedIndex = null
      throw err
    })
  }
  return cachedIndex
}

async function buildSearchIndex(): Promise<SearchItem[]> {
  const [governance, publicOffices, emergency, forms, services, destinations] = await Promise.all([
    fetchPgApi<GovernanceData>(pgApiEndpoints.core.governance),
    fetchPgApi<PublicOfficesData>(pgApiEndpoints.core.publicOffices),
    fetchPgApi<EmergencyDirectory>(pgApiEndpoints.core.emergencyDirectory),
    fetchPgApi<FormsAndDocumentsData>(pgApiEndpoints.core.formsAndDocuments),
    fetchPgApi<ServicesData>(pgApiEndpoints.core.services),
    fetchPgApi<TouristDestinationsData>(pgApiEndpoints.tourism.touristDestinations),
  ])

  const items: SearchItem[] = [...STATIC_PAGES]

  governance.municipalCouncil.forEach((member, index) => {
    items.push({
      id: `council-${index}`,
      title: member.name,
      subtitle: member.role,
      category: "Council Member",
      path: "/government/legislative-council",
    })
  })

  publicOffices.offices.forEach((office, index) => {
    items.push({
      id: `office-${index}`,
      title: office.office,
      subtitle: office.head,
      category: "Local Official",
      path: "/government/local-officials-directory",
    })
  })

  emergency.hotlines.forEach((hotline, index) => {
    items.push({
      id: `hotline-${index}`,
      title: hotline.agency,
      subtitle: `${hotline.category} • ${hotline.telephone}`,
      category: "Hotline",
      path: "/hotlines",
    })
  })

  destinations.destinations.forEach((destination) => {
    items.push({
      id: `destination-${destination.id}`,
      title: destination.name,
      subtitle: destination.barangay ?? "Tourist destination",
      category: "Tourist Spot",
      path: "/explore/gateway-location",
    })
  })

  services.categories.forEach((category) => {
    items.push({
      id: `service-${category.id}`,
      title: category.label,
      subtitle: "Municipal service",
      category: "Service",
      path: `/services/${category.id}`,
    })

    getCategoryOffices(category).forEach((office, index) => {
      items.push({
        id: `service-${category.id}-office-${index}`,
        title: office.name,
        subtitle: office.head,
        category: "Service Office",
        path: `/services/${category.id}`,
      })
    })

    getCategoryFacilities(category).forEach((facility, index) => {
      items.push({
        id: `service-${category.id}-facility-${index}`,
        title: facility.name,
        subtitle: "Facility",
        category: "Service Office",
        path: `/services/${category.id}`,
      })
    })
  })

  forms.transparency.forEach((doc, index) => {
    items.push({
      id: `transparency-${index}`,
      title: doc.title,
      subtitle: doc.category,
      category: "Document",
      path: doc.url,
      external: true,
    })
  })

  forms.downloadableForms.forEach((section, sectionIndex) => {
    section.items.forEach((item, itemIndex) => {
      items.push({
        id: `form-${sectionIndex}-${itemIndex}`,
        title: item.title,
        subtitle: section.section,
        category: "Form",
        path: item.url,
        external: true,
      })
    })
  })

  return items
}

export function searchItems(items: SearchItem[], query: string, limit = 8): SearchItem[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return []

  return items
    .map((item) => {
      const titleLower = item.title.toLowerCase()
      const haystack = `${item.title} ${item.subtitle ?? ""} ${item.category}`.toLowerCase()
      let score = 0
      if (titleLower === trimmed) score = 100
      else if (titleLower.startsWith(trimmed)) score = 80
      else if (haystack.includes(trimmed)) score = 40
      return { item, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item)
}
