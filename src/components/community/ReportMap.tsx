import { useEffect } from "react"
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { PAGBILAO_CENTER, STATUS_META } from "../../lib/communityReports"
import type { CommunityReport, LatLng } from "../../lib/communityReports"

export type MapFocus = { position: LatLng; key: number }

type ReportMapProps = {
    reports: CommunityReport[]
    draft: LatLng | null
    selectedId: string | null
    focus: MapFocus | null
    onPick: (position: LatLng) => void
    onSelect: (id: string) => void
}

function reportIcon(color: string, selected: boolean) {
    const size = selected ? 26 : 18
    const ring = selected ? "0 0 0 4px rgba(23,32,51,0.22)," : ""
    return L.divIcon({
        className: "",
        html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:${ring}0 1px 6px rgba(23,32,51,0.45)"></span>`,
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

const ClickToPick = ({ onPick }: { onPick: (position: LatLng) => void }) => {
    useMapEvents({
        click: (event) => onPick([event.latlng.lat, event.latlng.lng]),
    })
    return null
}

const FlyToFocus = ({ focus }: { focus: MapFocus | null }) => {
    const map = useMap()
    useEffect(() => {
        if (focus) map.flyTo(focus.position, Math.max(map.getZoom(), 16), { duration: 0.7 })
    }, [focus, map])
    return null
}

const ReportMap = ({ reports, draft, selectedId, focus, onPick, onSelect }: ReportMapProps) => (
    <MapContainer
        center={PAGBILAO_CENTER}
        zoom={14}
        minZoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", cursor: "crosshair" }}
        attributionControl={false}
    >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickToPick onPick={onPick} />
        <FlyToFocus focus={focus} />
        {reports.map((report) => (
            <Marker
                key={report.id}
                position={report.position}
                icon={reportIcon(STATUS_META[report.status].pin, report.id === selectedId)}
                zIndexOffset={report.id === selectedId ? 500 : 0}
                eventHandlers={{ click: () => onSelect(report.id) }}
            />
        ))}
        {draft && <Marker position={draft} icon={draftIcon} zIndexOffset={1000} />}
    </MapContainer>
)

export default ReportMap
