import { useEffect, useRef, useState } from "react";
import { Layers, MapIcon, Satellite } from "lucide-react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "@/lib/api";

const tiles = {
    street: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        label: "Street",
        options: { maxZoom: 19 },
    },
    satellite: {
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
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

        api.getMahallalar().then((mahallas) => {
            mahallas.forEach((m) => {
                if (!m.lat || !m.lng) return;

                L.circle([m.lat, m.lng], {
                    radius: 200 + m.complaints * 2,
                    color: getColor(m.complaints),
                    fillColor: getColor(m.complaints),
                    fillOpacity: 0.15,
                    weight: 2,
                }).addTo(map);

                const marker = L.circleMarker([m.lat, m.lng], {
                    radius: Math.max(6, Math.min(14, m.complaints / 6)),
                    color: getColor(m.complaints),
                    fillColor: getColor(m.complaints),
                    fillOpacity: 0.7,
                    weight: 2,
                });

                marker.bindPopup(`
          <strong>${m.name}</strong><br/>
          Shikoyatlar: ${m.complaints}<br/>
          Hal qilingan: ${m.resolved}%
        `);

                marker.on("click", () => navigate(`/mahallalar/${m.id}`));

                marker.addTo(map);
            });

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