import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Map as MapIcon, Satellite, Layers } from "lucide-react";

import { api } from "@/lib/api";

const tiles = {
    street: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        label: "Street",
        options: { maxZoom: 19 },
    },
    satellite: {
        url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        label: "Satellite",
        options: { maxZoom: 17 },
    },
    topo: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        label: "Topo",
        options: { maxZoom: 19 },
    },
};

const icons = {
    street: MapIcon,
    satellite: Satellite,
    topo: Layers,
};

const getColor = (count) =>
    count >= 70
        ? "hsl(0, 84%, 60%)"
        : count >= 40
            ? "hsl(38, 92%, 50%)"
            : "hsl(142, 71%, 45%)";

const CHIRCHIQ_CENTER = [41.4689, 69.5822];

const toNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const HeatmapCard = () => {
    const [style, setStyle] = useState("street");
    const [isMapReady, setIsMapReady] = useState(false);

    const mapElementRef = useRef(null);
    const mapRef = useRef(null);
    const tileLayerRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!mapElementRef.current || mapRef.current) return;

        const map = L.map(mapElementRef.current).setView(CHIRCHIQ_CENTER, 13);
        mapRef.current = map;

        tileLayerRef.current = L.tileLayer(
            tiles.street.url,
            tiles.street.options
        ).addTo(map);

        api
            .getMahallalar()
            .then((mahallas) => {
                mahallas.forEach((m) => {
                    const lat = toNumber(m.lat, null);
                    const lng = toNumber(m.lng, null);
                    const complaints = toNumber(m.complaints);
                    const resolved = toNumber(m.resolved);

                    if (lat === null || lng === null) return;

                    try {
                        L.circle([lat, lng], {
                            radius: Math.max(150, 200 + complaints * 2),
                            color: getColor(complaints),
                            fillColor: getColor(complaints),
                            fillOpacity: 0.15,
                            weight: 2,
                        }).addTo(map);

                        const marker = L.circleMarker([lat, lng], {
                            radius: Math.max(6, Math.min(14, complaints / 6)),
                            color: getColor(complaints),
                            fillColor: getColor(complaints),
                            fillOpacity: 0.7,
                            weight: 2,
                        });

                        marker.bindPopup(`
              <strong>${m.name || "Noma'lum mahalla"}</strong><br/>
              Shikoyatlar: ${complaints}<br/>
              Hal qilingan: ${resolved}%
            `);

                        if (m.id) {
                            marker.on("click", () =>
                                navigate(`/mahallalar/${m.id}`)
                            );
                        }

                        marker.addTo(map);
                    } catch (error) {
                        console.error(
                            "Mahalla markerini chizishda xatolik:",
                            error,
                            m
                        );
                    }
                });

                setIsMapReady(true);
            })
            .catch((error) => {
                console.error(
                    "Mahallalar ma'lumotini olishda xatolik:",
                    error
                );
                setIsMapReady(true);
            });

        return () => map.remove();
    }, [navigate]);

    useEffect(() => {
        if (!mapRef.current || !tileLayerRef.current) return;

        mapRef.current.removeLayer(tileLayerRef.current);

        tileLayerRef.current = L.tileLayer(
            tiles[style].url,
            tiles[style].options
        ).addTo(mapRef.current);
    }, [style]);

    return (
        <div className="gov-card flex flex-col h-[420px] sm:h-[480px]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                    Chirchiq – Mahallalar Xaritasi
                </h2>

                <div className="flex gap-1 bg-muted rounded-xl p-1">
                    {Object.keys(tiles).map((key) => {
                        const Icon = icons[key];

                        return (
                            <button
                                key={key}
                                onClick={() => setStyle(key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                                    style === key
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground"
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tiles[key].label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="relative flex-1 rounded-2xl overflow-hidden border border-border">
                <div ref={mapElementRef} className="absolute inset-0" />

                {!isMapReady && (
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
            </div>
        </div>
    );
};

export default HeatmapCard;