import { useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = new L.Icon({
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function FitMarkers({ points }) {
    const map = useMap();

    useEffect(() => {
        if (!points.length) return;

        if (points.length === 1) {
            map.setView(
                [points[0].latitude, points[0].longitude],
                15
            );
            return;
        }

        const bounds = L.latLngBounds(
            points.map((r) => [r.latitude, r.longitude])
        );

        map.fitBounds(bounds, {
            padding: [40, 40]
        });
    }, [points, map]);

    return null;
}

export default function MapView({ reports, open }) {
    const pts = reports.filter(
        (r) => r.latitude != null && r.longitude != null
    );

    const withoutLocation = reports.length - pts.length;

    return (
        <div className="panel wide">

            <div className="row-h">
                <div>
                    <h1 className="pt">Map View</h1>
                    <p className="sub">
                        View reported civic issues by location.
                    </p>
                </div>
            </div>

            <div className="stats">

                <div className="card stat">
                    <div>
                        <small>Total Reports</small>
                        <strong>{reports.length}</strong>
                    </div>
                </div>

                <div className="card stat">
                    <div>
                        <small>Located Reports</small>
                        <strong>{pts.length}</strong>
                    </div>
                </div>

                <div className="card stat">
                    <div>
                        <small>No Location</small>
                        <strong>{withoutLocation}</strong>
                    </div>
                </div>

            </div>

            <div className="card flush">

                {pts.length === 0 ? (

                    <div className="empty">
                        <p>
                            No reports with location data are available.
                        </p>
                    </div>

                ) : (

                    <MapContainer
                        center={[
                            pts[0].latitude,
                            pts[0].longitude
                        ]}
                        zoom={13}
                        className="civic-map"
                        style={{
                            height: 520,
                            width: "100%"
                        }}
                    >

                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <FitMarkers points={pts} />

                        {pts.map((r) => (

                            <Marker
                                key={r.report_id}
                                position={[
                                    r.latitude,
                                    r.longitude
                                ]}
                                icon={icon}
                            >

                                <Popup>

                                    <div style={{ minWidth: 210 }}>

                                        <strong>
                                            {r.report_id}
                                        </strong>

                                        <p style={{
                                            margin: "8px 0"
                                        }}>
                                            <strong>Issue:</strong>{" "}
                                            {r.issue}
                                        </p>

                                        <p style={{
                                            margin: "6px 0"
                                        }}>
                                            <strong>Category:</strong>{" "}
                                            {r.category}
                                        </p>

                                        <p style={{
                                            margin: "6px 0"
                                        }}>
                                            <strong>Status:</strong>{" "}
                                            {r.status}
                                        </p>

                                        <button
                                            className="btn"
                                            style={{
                                                marginTop: 8,
                                                padding: "7px 12px"
                                            }}
                                            onClick={() => open(r)}
                                        >
                                            Open Report
                                        </button>

                                    </div>

                                </Popup>

                            </Marker>

                        ))}

                    </MapContainer>

                )}

            </div>

        </div>
    );
}