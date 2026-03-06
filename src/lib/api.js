import { fallbackProblemIcon, mahallaCoords } from "@/lib/constants";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://100.126.4.84:5000/api";

const get = async (path) => {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
};

const normalizeStatus = (status = "") => {
    const s = status.toLowerCase();
    if (s === "yangi") return "Yangi";
    if (s === "yuklandi") return "Yuklandi";
    if (s === "jarayonda") return "Jarayonda";
    if (s === "bajarildi") return "Bajarildi";
    return status;
};

const normalizePriority = (priority = "") => {
    const p = priority.toLowerCase();
    if (p === "yuqori") return "Yuqori";
    if (p === "o'rta" || p === "orta") return "O'rta";
    if (p === "past") return "Past";
    return priority;
};

const normalizeCategory = (category = "") => {
    const c = category.toLowerCase();
    if (c === "kommunal") return "Kommunal";
    if (c === "ekologiya") return "Ekologiya";
    if (c === "adliya") return "Adliya";
    if (c === "yo'l" || c === "yol") return "Yo'l";
    return category ? category[0].toUpperCase() + category.slice(1) : "Kommunal";
};

const normalizeSource = (source = "") => {
    if (source === "landing-page") return "Landing Page";
    if (source === "telegram-bot") return "Telegram Bot";
    if (source === "ai") return "AI";
    return source || "AI";
};

const mapComplaint = (complaint, mahallaName) => ({
    ...complaint,
    mahalla: mahallaName,
    date: complaint.created_at,
    status: normalizeStatus(complaint.status),
    priority: normalizePriority(complaint.priority),
    category: normalizeCategory(complaint.category),
    source: normalizeSource(complaint.source),
    icon: fallbackProblemIcon,
});

export const api = {
    getDashboard: () => get("/dashboard"),
    getMahallalar: async () => {
        const data = await get("/mahallalar");
        return data.map((m) => ({ ...m, resolved: m.resolved_percent, ...(mahallaCoords[m.name] || {}) }));
    },
    getMahallaDetail: async (id) => {
        const data = await get(`/mahalla/${id}`);
        return {
            ...data,
            resolved: data.resolved_percent,
            problems: (data.complaints || []).map((c) => mapComplaint(c, data.name)),
        };
    },
    getOrganizations: () => get("/organizations"),
    getTasks: async () => {
        const data = await get("/tasks");
        return data.map((t) => ({
            ...t,
            status: normalizeStatus(t.status),
            priority: normalizePriority(t.priority),
            mahalla: t.mahalla?.name,
            org: t.organization?.name,
        }));
    },
    getAnalytics: () => get("/analytics"),
    getAllProblems: async () => {
        const mahallas = await get("/mahallalar");
        const details = await Promise.all(mahallas.map((m) => get(`/mahalla/${m.id}`)));
        return details.flatMap((d) => (d.complaints || []).map((c) => mapComplaint(c, d.name)));
    },
};
