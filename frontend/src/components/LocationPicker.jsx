import React, { useEffect, useRef, useState } from 'react';

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerInstance = useRef(null);

    const [coords, setCoords] = useState(initialLocation?.lat ? initialLocation : { lat: 26.9124, lng: 75.7873 });
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const [isFetchingAddress, setIsFetchingAddress] = useState(false);

    useEffect(() => {
        // Initialize map if not already initialized
        if (!mapInstance.current && window.L) {
            mapInstance.current = window.L.map(mapRef.current).setView([coords.lat, coords.lng], 13);

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(mapInstance.current);

            // Add initial marker if exists
            markerInstance.current = window.L.marker([coords.lat, coords.lng], { draggable: true }).addTo(mapInstance.current);

            // Click event
            mapInstance.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                updateLocation(lat, lng);
            });

            // Marker drag event
            markerInstance.current.on('dragend', (e) => {
                const { lat, lng } = e.target.getLatLng();
                updateLocation(lat, lng);
            });
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateLocation = async (lat, lng) => {
        const newCoords = { lat, lng };
        setCoords(newCoords);
        if (markerInstance.current) {
            markerInstance.current.setLatLng([lat, lng]);
        }

        setIsFetchingAddress(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (onLocationSelect) {
                onLocationSelect(newCoords, data.address);
            }
        } catch (error) {
            console.error("Reverse geocoding failed", error);
            if (onLocationSelect) {
                onLocationSelect(newCoords, null);
            }
        } finally {
            setIsFetchingAddress(false);
        }
    };

    const getCurrentLocation = () => {
        setIsLocating(true);
        setLocationError(false);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                updateLocation(latitude, longitude);
                mapInstance.current?.setView([latitude, longitude], 15);
                setIsLocating(false);
            }, () => {
                setLocationError(true);
                setIsLocating(false);
            });
        } else {
            setLocationError(true);
            setIsLocating(false);
        }
    };

    return (
        <div className="location-picker-wrapper">
            <div style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)' }}>
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                    style={{
                        padding: '6px 14px',
                        background: 'rgba(31, 81, 198, 0.1)',
                        color: 'var(--glacier-blue)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isLocating ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: '700',
                        fontSize: '0.8em',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isLocating ? '📍 Locating...' : '🎯 Use Current Location'}
                </button>
                <span style={{ fontSize: '0.75em', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    {locationError ? '⚠️ Location unavailable' : 'Tap map to adjust pin'}
                </span>
            </div>
            <div
                ref={mapRef}
                style={{ height: '300px', width: '100%', borderRadius: '12px', marginTop: '10px', zIndex: 1 }}
                id="leaflet-map-container"
            ></div>
            {coords.lat && (
                <div className="coord-preview">
                    📍 {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    {isFetchingAddress && <span style={{ marginLeft: '10px', fontSize: '0.8em', color: 'var(--glacier-blue)', fontWeight: 'bold' }}>Fetching address... ⏳</span>}
                </div>
            )}
        </div>
    );
};

export default LocationPicker;
