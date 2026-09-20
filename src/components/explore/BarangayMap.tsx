import { useMemo } from "react"
import { GeoJSON, MapContainer, TileLayer, Tooltip } from "react-leaflet"
import L from "leaflet"
import type { Feature, FeatureCollection, Geometry } from "geojson"
import "leaflet/dist/leaflet.css"
import boundaryData from "../../data/barangayBoundaries.json"

// Polygons from OpenStreetMap (ODbL), each tagged with its PSGC code so it joins to the API without name matching.
const boundaries = boundaryData as unknown as FeatureCollection<Geometry, { psgc: string }>

type BarangayMapProps = {
    /** fill colour by PSGC code */
    fills: Record<string, string>
    /** tooltip text by PSGC code */
    labels: Record<string, string>
    selectedCode: string | null
    onSelect: (psgc: string) => void
}

const OUTLINE = "#475467"
const SELECTED_OUTLINE = "#172033"

const BarangayMap = ({ fills, labels, selectedCode, onSelect }: BarangayMapProps) => {
    const bounds = useMemo(() => L.geoJSON(boundaries).getBounds(), [])

    // Selected polygon is drawn last so its heavier outline is not covered by its neighbours.
    const ordered = useMemo(
        () => [...boundaries.features].sort((a, b) => Number(a.properties.psgc === selectedCode) - Number(b.properties.psgc === selectedCode)),
        [selectedCode]
    )

    return (
        <MapContainer bounds={bounds} boundsOptions={{ padding: [8, 8] }} minZoom={10} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            {ordered.map((feature: Feature<Geometry, { psgc: string }>) => {
                const code = feature.properties.psgc
                const selected = code === selectedCode
                const style = { color: selected ? SELECTED_OUTLINE : OUTLINE, weight: selected ? 3.5 : 1, fillColor: fills[code] ?? "#e2e8f0", fillOpacity: 0.78 }
                return (
                    <GeoJSON
                        key={`${code}-${fills[code]}-${selected}`}
                        data={feature}
                        style={style}
                        eventHandlers={{
                            click: () => onSelect(code),
                            mouseover: (event) => event.target.setStyle({ weight: 3, color: SELECTED_OUTLINE }),
                            mouseout: (event) => event.target.setStyle(style),
                        }}
                    >
                        <Tooltip sticky>{labels[code]}</Tooltip>
                    </GeoJSON>
                )
            })}
        </MapContainer>
    )
}

export default BarangayMap
