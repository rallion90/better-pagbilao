import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export type OfficeMapMarker = {
    id: string
    name: string
    telephone: string
    address: string
    color: string
    position: [number, number]
}

function createPinIcon(color: string) {
    return L.divIcon({
        className: "",
        html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 1px 6px rgba(23,32,51,0.45)"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -10],
    })
}

const OfficeMap = ({ markers }: { markers: OfficeMapMarker[] }) => {
    const center = markers[0]?.position ?? [13.9714, 121.6869]

    return (
        <MapContainer
            center={center}
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            attributionControl={false}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers.map((marker) => (
                <Marker key={marker.id} position={marker.position} icon={createPinIcon(marker.color)}>
                    <Popup>
                        <p className="font-black text-bayan-ink">{marker.name}</p>
                        <p className="mt-1 text-xs text-slate-600">{marker.address}</p>
                        <p className="mt-1 text-xs font-bold text-bayan-blue">{marker.telephone}</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default OfficeMap
