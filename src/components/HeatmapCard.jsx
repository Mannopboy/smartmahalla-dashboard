import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Map as MapIcon, Satellite, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";

const tiles = {
    street: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        label: "Xarita",
        options: { subdomains: ["a", "b", "c"], maxZoom: 19 },
    },
    satellite: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        label: "Sputnik",
        options: { maxZoom: 19 },
    },
    topo: {
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        label: "Topo",
        options: { subdomains: ["a", "b", "c"], maxZoom: 17 },
    },
};

const icons = {
    street: MapIcon,
    satellite: Satellite,
    topo: Layers,
};

const getColor = (count) => {
    if (count > 0) return "hsl(0, 84%, 60%)";
    return "hsl(142, 71%, 45%)";
};

const CHIRCHIQ_CENTER = [41.4689, 69.5822];
const CHIRCHIQ_BOUNDS = L.latLngBounds([41.445, 69.548], [41.487, 69.606]);

const HeatmapCard = () => {
    const [style, setStyle] = useState("street");
    const [isMapReady, setIsMapReady] = useState(false);

    const navigate = useNavigate();

    const mapElementRef = useRef(null);
    const mapRef = useRef(null);
    const tileLayerRef = useRef(null);
    const markerLayerRef = useRef(null);

    const { data: mahallasData = [] } = useApiData(api.getMahallalar, []);

    useEffect(() => {
        if (!mapElementRef.current || mapRef.current) return;

        const map = L.map(mapElementRef.current, {
            zoomControl: true,
            attributionControl: false,
            maxBounds: CHIRCHIQ_BOUNDS,
            maxBoundsViscosity: 1,
            minZoom: 12,
            maxZoom: 19,
        }).setView(CHIRCHIQ_CENTER, 13);

        mapRef.current = map;

        tileLayerRef.current = L.tileLayer(
            tiles.street.url,
            tiles.street.options
        ).addTo(map);

        markerLayerRef.current = L.layerGroup().addTo(map);

        const handleResize = () => {
            map.invalidateSize({ pan: false, debounceMoveend: true });
        };

        let resizeObserver = null;

        if (typeof ResizeObserver !== "undefined" && mapElementRef.current) {
            resizeObserver = new ResizeObserver(() => handleResize());
            resizeObserver.observe(mapElementRef.current);
        }

        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        setTimeout(handleResize, 120);

        setIsMapReady(true);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
            resizeObserver?.disconnect();

            map.remove();

            mapRef.current = null;
            tileLayerRef.current = null;
            markerLayerRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !tileLayerRef.current) return;

        mapRef.current.removeLayer(tileLayerRef.current);

        tileLayerRef.current = L.tileLayer(
            tiles[style].url,
            tiles[style].options
        ).addTo(mapRef.current);
    }, [style]);

    useEffect(() => {
        if (!mapRef.current || !markerLayerRef.current) return;

        markerLayerRef.current.clearLayers();

        const validMahallas = mahallasData
            .map((m) => ({
                ...m,
                lat: Number(m.lat),
                lng: Number(m.lng),
            }))
            .filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng));

        const isGeneralView = validMahallas.length !== 1;

        if (isGeneralView) {
            mapRef.current.setView(CHIRCHIQ_CENTER, 13, { animate: false });
        } else {
            mapRef.current.setView(
                [validMahallas[0].lat, validMahallas[0].lng],
                14,
                { animate: false }
            );
        }

        validMahallas.forEach((m) => {
            const complaints = Number(m.complaints) || 0;
            const resolved = Number(m.resolved) || 0;

            L.circle([m.lat, m.lng], {
                radius: 800,
                color: getColor(complaints),
                fillColor: getColor(complaints),
                fillOpacity: 0.22,
                weight: 2.5,
            }).addTo(markerLayerRef.current);

            const marker = L.circleMarker([m.lat, m.lng], {
                radius: 10,
                color: getColor(complaints),
                fillColor: getColor(complaints),
                fillOpacity: 0.7,
                weight: 2,
            });

            marker.bindPopup(
                `<div style="text-align:center">
          <strong>${m.name}</strong><br/>
          Shikoyatlar: ${complaints}<br/>
          Hal qilingan: ${resolved}%
        </div>`
            );

            marker.on("click", () => {
                if (m.id) navigate(`/shikoyatlar?mahalla_id=${m.id}`);
            });

            marker.addTo(markerLayerRef.current);

            L.marker([m.lat, m.lng], {
                icon: L.divIcon({
                    className: "mahalla-label",
                    html: `<span style="font-size:10px;font-weight:600;color:hsl(var(--foreground));text-shadow:0 0 3px hsl(var(--background)),0 0 3px hsl(var(--background));white-space:nowrap">${m.name}</span>`,
                    iconSize: [0, 0],
                    iconAnchor: [0, -12],
                }),
            }).addTo(markerLayerRef.current);
        });
    }, [mahallasData, navigate]);

    return (
        <div className="gov-card flex flex-col h-[420px] sm:h-[480px] min-h-0">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                    Chirchiq – Mahallalar Xaritasi
                </h2>

                <div className="flex gap-1 bg-muted rounded-xl p-1">
                    {Object.keys(tiles).map((key) => {
                        const Icon = icons[key];

                        return (
                            <button
                                key={key}
                                onClick={() => setStyle(key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    style === key
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tiles[key].label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden border border-border isolate">
                <div ref={mapElementRef} className="absolute inset-0" />

                {!isMapReady && (
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                )}

                <div className="absolute bottom-4 left-4 right-4 z-[1000] flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-border">
                    <span className="text-xs text-muted-foreground">Kam</span>

                    <div
                        className="flex-1 h-2 rounded-full"
                        style={{
                            background:
                                "linear-gradient(90deg, hsl(142, 71%, 45%), hsl(38, 92%, 50%), hsl(0, 84%, 60%))",
                        }}
                    />

                    <span className="text-xs text-muted-foreground">Ko'p</span>
                </div>
            </div>
        </div>
    );
};

export default HeatmapCard;
