import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Map as MapIcon, Satellite, Layers } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { mahallasData } from "@/data/mahallas";
import { useNavigate } from "react-router-dom";
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
    if (count >= 70)
        return "hsl(0, 84%, 60%)";
    if (count >= 40)
        return "hsl(38, 92%, 50%)";
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
    useEffect(() => {
        if (!mapElementRef.current || mapRef.current)
            return;
        const map = L.map(mapElementRef.current, {
            zoomControl: true,
            attributionControl: false,
            maxBounds: CHIRCHIQ_BOUNDS,
            maxBoundsViscosity: 1,
            minZoom: 12,
            maxZoom: 19,
        }).setView(CHIRCHIQ_CENTER, 13);
        mapRef.current = map;
        tileLayerRef.current = L.tileLayer(tiles.street.url, tiles.street.options).addTo(map);
        // Add mahalla markers with boundaries (circles as approximate boundaries)
        mahallasData.forEach((m) => {
            // Boundary circle
            L.circle([m.lat, m.lng], {
                radius: 200 + m.complaints * 2,
                color: getColor(m.complaints),
                fillColor: getColor(m.complaints),
                fillOpacity: 0.15,
                weight: 2,
                dashArray: "5 5",
            }).addTo(map);
            // Center marker
            const marker = L.circleMarker([m.lat, m.lng], {
                radius: Math.max(6, Math.min(14, m.complaints / 6)),
                color: getColor(m.complaints),
                fillColor: getColor(m.complaints),
                fillOpacity: 0.7,
                weight: 2,
            });
            marker.bindPopup(`<div style="text-align:center">
          <strong>${m.name}</strong><br/>
          Shikoyatlar: ${m.complaints}<br/>
          Hal qilingan: ${m.resolved}%
        </div>`);
            marker.on("click", () => {
                navigate(`/mahallalar/${m.id}`);
            });
            marker.addTo(map);
            // Label
            L.marker([m.lat, m.lng], {
                icon: L.divIcon({
                    className: "mahalla-label",
                    html: `<span style="font-size:10px;font-weight:600;color:hsl(var(--foreground));text-shadow:0 0 3px hsl(var(--background)),0 0 3px hsl(var(--background));white-space:nowrap">${m.name}</span>`,
                    iconSize: [0, 0],
                    iconAnchor: [0, -12],
                }),
            }).addTo(map);
        });
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
        };
    }, [navigate]);
    useEffect(() => {
        if (!mapRef.current || !tileLayerRef.current)
            return;
        mapRef.current.removeLayer(tileLayerRef.current);
        tileLayerRef.current = L.tileLayer(tiles[style].url, tiles[style].options).addTo(mapRef.current);
    }, [style]);
    return (<div className="gov-card flex flex-col h-[420px] sm:h-[480px] min-h-0">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Chirchiq – Mahallalar Xaritasi</h2>
            <div className="flex gap-1 bg-muted rounded-xl p-1">
                {Object.keys(tiles).map((key) => {
                    const Icon = icons[key];
                    return (<button key={key} onClick={() => setStyle(key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${style === key
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"}`}>
                        <Icon className="w-3.5 h-3.5"/>
                        {tiles[key].label}
                    </button>);
                })}
            </div>
        </div>

        <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden border border-border isolate">
            <div ref={mapElementRef} className="absolute inset-0"/>
            {!isMapReady && <div className="absolute inset-0 bg-muted animate-pulse"/>}
            <div className="absolute bottom-4 left-4 right-4 z-[1000] flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-border">
                <span className="text-xs text-muted-foreground">Kam</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "linear-gradient(90deg, hsl(142, 71%, 45%), hsl(38, 92%, 50%), hsl(0, 84%, 60%))" }}/>
                <span className="text-xs text-muted-foreground">Ko'p</span>
            </div>
        </div>
    </div>);
};
export default HeatmapCard;
