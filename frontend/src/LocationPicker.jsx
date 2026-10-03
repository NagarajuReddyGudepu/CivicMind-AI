import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icon
const markerIcon = new L.Icon({
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(event) {
            setPosition([
                event.latlng.lat,
                event.latlng.lng,
            ]);
        },
    });

    if (!position) {
        return null;
    }

    return (
        <Marker
            position={position}
            icon={markerIcon}
            draggable={true}
            eventHandlers={{
                dragend: (event) => {
                    const marker = event.target;
                    const newPosition = marker.getLatLng();

                    setPosition([
                        newPosition.lat,
                        newPosition.lng,
                    ]);
                },
            }}
        />
    );
}

function LocationPicker({
    selectedLocation,
    setSelectedLocation,
}) {
    const [loadingLocation, setLoadingLocation] = useState(false);

    const defaultPosition = [17.9689, 79.5941];

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setSelectedLocation([
                    position.coords.latitude,
                    position.coords.longitude,
                ]);

                setLoadingLocation(false);
            },
            () => {
                alert(
                    "Unable to get your current location. Please select a location manually on the map."
                );

                setLoadingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const position =
        selectedLocation || defaultPosition;

    return (
        <div className="location-picker">

            <div className="location-header">

                <div>
                    <span className="section-label">
                        STEP 04 · ISSUE LOCATION
                    </span>

                    <h3>
                        Where is the issue located?
                    </h3>

                    <p>
                        Select the exact location of the civic issue
                        on the map.
                    </p>
                </div>

                <div className="location-icon">
                    📍
                </div>

            </div>


            <div className="location-actions">

                <button
                    type="button"
                    className="location-button"
                    onClick={getCurrentLocation}
                    disabled={loadingLocation}
                >
                    {loadingLocation
                        ? "Getting Location..."
                        : "📍 Use My Current Location"}
                </button>

                <span>
                    Or click anywhere on the map
                </span>

            </div>


            <div className="map-container">

                <MapContainer
                    center={position}
                    zoom={15}
                    scrollWheelZoom={true}
                    className="civic-map"
                >

                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <LocationMarker
                        position={selectedLocation}
                        setPosition={setSelectedLocation}
                    />

                </MapContainer>

            </div>


            {selectedLocation && (

                <div className="selected-location">

                    <div className="location-check">
                        ✓
                    </div>

                    <div>

                        <span>
                            SELECTED LOCATION
                        </span>

                        <strong>
                            Location confirmed on map
                        </strong>

                        <p>
                            Latitude:{" "}
                            {selectedLocation[0].toFixed(6)}
                            {"  "}
                            |{" "}
                            Longitude:{" "}
                            {selectedLocation[1].toFixed(6)}
                        </p>

                    </div>

                </div>

            )}

            {!selectedLocation && (

                <div className="location-hint">
                    📌 Click on the map to place the issue marker.
                    You can drag the marker to adjust the exact position.
                </div>

            )}

        </div>
    );
}

export default LocationPicker;