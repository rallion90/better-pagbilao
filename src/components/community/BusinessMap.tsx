import { useEffect } from "react"
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Business } from "../../types/businesses"
import { PAGBILAO_CENTER } from "../../lib/communityReports"
import type { LatLng } from "../../lib/communityReports"

export type BusinessMapFocus = { position: LatLng; key: number }

type BusinessMapProps = {
    /** Listings with pinPrecision "hidden" (null coordinates) are skipped. */
    businesses?: Business[]
    selectedId?: string | null
    onSelect?: (id: string) => void
    /** The pin an owner is placing in the form. */
    draft?: LatLng | null
    pickEnabled?: boolean
    onPick?: (position: LatLng) => void
    focus?: BusinessMapFocus | null
    /** Where the map opens. Defaults to the whole municipality. */
    initialCenter?: LatLng
    initialZoom?: number
    /** Radius, in metres, of the area circle drawn for approximate pins. The server already offsets those coordinates by ~200–400 m. */
    approximateRadius?: number
}

function businessIcon(selected: boolean) {
    const size = selected ? 30 : 22
    const fill = selected ? "#fdb022" : "#155eef"
    const ring = selected ? "0 0 0 4px rgba(23,32,51,0.22)," : ""
    return L.divIcon({
        className: "",
        html: `<span style="display:grid;place-items:center;width:${size}px;height:${size}px;border-radius:9999px;background:${fill};border:3px solid white;box-shadow:${ring}0 1px 6px rgba(23,32,51,0.45)">
            <svg viewBox="0 0 24 24" width="${size - 12}" height="${size - 12}" fill="none" stroke="${selected ? "#172033" : "white"}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.4-4h11.2L22 7"/><path d="M4 11v9h16v-9"/><path d="M2 7c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3"/></svg>
        </span>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    })
}

const draftIcon = L.divIcon({
    className: "",
    html: `<span style="display:block;position:relative;width:34px;height:42px">
        <svg viewBox="0 0 34 42" width="34" height="42" style="filter:drop-shadow(0 3px 4px rgba(23,32,51,0.4))">
            <path d="M17 1C8.7 1 2 7.5 2 15.6 2 26 17 41 17 41s15-15 15-25.4C32 7.5 25.3 1 17 1z" fill="#d92d20" stroke="white" stroke-width="2.5"/>
            <circle cx="17" cy="15.5" r="5.5" fill="white"/>
        </svg>
    </span>`,
    iconSize: [34, 42],
    iconAnchor: [17, 41],
})

const ClickToPick = ({ enabled, onPick }: { enabled: boolean; onPick?: (position: LatLng) => void }) => {
    useMapEvents({
        click: (event) => {
            if (enabled) onPick?.([event.latlng.lat, event.latlng.lng])
        },
    })
    return null
}

const FlyToFocus = ({ focus }: { focus: BusinessMapFocus | null }) => {
    const map = useMap()
    useEffect(() => {
        if (focus) map.flyTo(focus.position, Math.max(map.getZoom(), 16), { duration: 0.7 })
    }, [focus, map])
    return null
}

const BusinessMap = ({
    businesses = [],
    selectedId = null,
    onSelect,
    draft = null,
    pickEnabled = false,
    onPick,
    focus = null,
    initialCenter = PAGBILAO_CENTER,
    initialZoom = 13,
    approximateRadius = 300,
}: BusinessMapProps) => (
    <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        minZoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", cursor: pickEnabled ? "crosshair" : "" }}
        attributionControl={false}
    >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickToPick enabled={pickEnabled} onPick={onPick} />
        <FlyToFocus focus={focus} />
        {businesses.map((business) => {
            if (business.pinPrecision === "hidden" || business.latitude === null || business.longitude === null) return null
            const selected = business.id === selectedId
            const position: LatLng = [business.latitude, business.longitude]
            return business.pinPrecision === "approximate" ? (
                <Circle
                    key={business.id}
                    center={position}
                    radius={approximateRadius}
                    pathOptions={{
                        color: selected ? "#fdb022" : "#155eef",
                        weight: selected ? 3 : 2,
                        fillColor: selected ? "#fdb022" : "#155eef",
                        fillOpacity: selected ? 0.3 : 0.18,
                    }}
                    eventHandlers={{ click: () => onSelect?.(business.id) }}
                />
            ) : (
                <Marker
                    key={business.id}
                    position={position}
                    icon={businessIcon(selected)}
                    zIndexOffset={selected ? 500 : 0}
                    eventHandlers={{ click: () => onSelect?.(business.id) }}
                />
            )
        })}
        {draft && <Marker position={draft} icon={draftIcon} zIndexOffset={1000} />}
    </MapContainer>
)

export default BusinessMap
