import { AlertTriangle } from "lucide-react";

export const statusColors = {
    Yangi: "bg-muted text-muted-foreground",
    Yuklandi: "bg-primary/15 text-primary",
    Jarayonda: "bg-warning/15 text-warning",
    Bajarildi: "bg-success/15 text-success",
};

export const priorityColors = {
    Yuqori: "bg-destructive/15 text-destructive",
    "O'rta": "bg-warning/15 text-warning",
    Past: "bg-muted text-muted-foreground",
};

export const categoryColors = {
    Kommunal: "bg-primary/10 text-primary",
    "Yo'l": "bg-warning/15 text-warning",
    Ekologiya: "bg-success/15 text-success",
    Adliya: "bg-destructive/10 text-destructive",
    Ijtimoiy: "bg-accent text-accent-foreground",
};

export const fallbackProblemIcon = AlertTriangle;

export const mahallaCoords = {
    "M.Ulug'bek": { lat: 41.4732, lng: 69.578 },
    "Voyit Haydarov": { lat: 41.471, lng: 69.585 },
    Gulzor: { lat: 41.4755, lng: 69.59 },
    Nur: { lat: 41.468, lng: 69.575 },
    Quyosh: { lat: 41.465, lng: 69.583 },
    Ishonch: { lat: 41.462, lng: 69.57 },
    Bobur: { lat: 41.46, lng: 69.577 },
    Kimyogar: { lat: 41.477, lng: 69.568 },
    "Amir Temur": { lat: 41.47, lng: 69.592 },
    Iftixor: { lat: 41.474, lng: 69.573 },
};
