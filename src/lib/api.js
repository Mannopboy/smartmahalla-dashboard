import { fallbackProblemIcon, mahallaCoords } from "@/lib/constants";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://100.126.4.84:5000/api";

const get = async (path) => {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
};

const toText = (value) =>
    typeof value === "string" ? value : String(value ?? "");

const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.items)) return value.items;
    return [];
};

const toNumber = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
};

const normalizeName = (value) => toText(value).trim().toLowerCase();

const normalizeStatus = (status = "") => {
    const s = toText(status).toLowerCase();
    if (s === "yangi") return "Yangi";
    if (s === "yuklandi") return "Yuklandi";
    if (s === "jarayonda") return "Jarayonda";
    if (s === "bajarildi") return "Bajarildi";
    return status;
};

const normalizePriority = (priority = "") => {
    const p = toText(priority).toLowerCase();
    if (p === "yuqori") return "Yuqori";
    if (p === "o'rta" || p === "orta") return "O'rta";
    if (p === "past") return "Past";
    return priority;
};

const normalizeCategory = (category = "") => {
    const categoryText = toText(category);
    const c = categoryText.toLowerCase();

    if (c === "kommunal") return "Kommunal";
    if (c === "ekologiya") return "Ekologiya";
    if (c === "adliya") return "Adliya";
    if (c === "yo'l" || c === "yol") return "Yo'l";

    return categoryText
        ? categoryText[0].toUpperCase() + categoryText.slice(1)
        : "Kommunal";
};

const normalizeSource = (source = "") => {
    const sourceText = toText(source);

    if (sourceText === "landing-page") return "Landing Page";
    if (sourceText === "telegram-bot") return "Telegram Bot";
    if (sourceText === "ai") return "AI";

    return sourceText || "AI";
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
    getDashboard: async () => {
        const [dashboardData, mahallalarData] = await Promise.all([
            get("/dashboard"),
            get("/mahallalar").catch(() => []),
        ]);

        const payload =
            dashboardData?.data && !Array.isArray(dashboardData.data)
                ? dashboardData.data
                : dashboardData;

        const idByName = new Map(
            toArray(mahallalarData).map((m) => [
                normalizeName(m.name),
                m.id,
            ])
        );

        return {
            ...payload,
            total_mahallas: toNumber(payload?.total_mahallas),
            total_complaints: toNumber(payload?.total_complaints),
            resolved_percent: toNumber(payload?.resolved_percent),
            open_tasks: toNumber(payload?.open_tasks),

            top_mahallas: toArray(payload?.top_mahallas).map((item) => ({
                ...item,
                id: item?.id ?? idByName.get(normalizeName(item?.name)),
                complaints: toNumber(item?.complaints),
                resolved_percent: toNumber(item?.resolved_percent),
            })),
        };
    },

    getMahallalar: async () => {
        const [mahallalarData, dashboardData] = await Promise.all([
            get("/mahallalar"),
            get("/dashboard").catch(() => null),
        ]);

        const dashboardPayload =
            dashboardData?.data && !Array.isArray(dashboardData.data)
                ? dashboardData.data
                : dashboardData;

        const statByName = new Map(
            toArray(dashboardPayload?.top_mahallas).map((item) => [
                normalizeName(item?.name),
                item,
            ])
        );

        return toArray(mahallalarData).map((m) => {
            const stat = statByName.get(normalizeName(m.name));

            return {
                ...m,
                complaints: toNumber(m.complaints, toNumber(stat?.complaints)),
                population: toNumber(m.population),
                resolved: toNumber(
                    m.resolved_percent,
                    toNumber(stat?.resolved_percent)
                ),
                ...(mahallaCoords[m.name] || {}),
            };
        });
    },

    getMahallaDetail: async (id) => {
        const data = await get(`/mahalla/${id}`);

        return {
            ...data,
            resolved: data.resolved_percent,
            problems: (data.complaints || []).map((c) =>
                mapComplaint(c, data.name)
            ),
        };
    },

    getOrganizations: async () => {
        const data = await get("/organizations");

        return toArray(data).map((o) => ({
            ...o,
            address: toText(o.address ?? o.adress),
            phone: toText(o.phone),
            total: toNumber(o.total),
            done: toNumber(o.done),
            in_progress: toNumber(o.in_progress),
        }));
    },

    getTasks: async () => {
        const data = await get("/tasks");

        return toArray(data).map((t) => ({
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

        const details = await Promise.all(
            toArray(mahallas).map((m) => get(`/mahalla/${m.id}`))
        );

        return details.flatMap((d) =>
            (d.complaints || []).map((c) =>
                mapComplaint(c, d.name)
            )
        );
    },
};