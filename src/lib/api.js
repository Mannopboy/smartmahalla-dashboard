import { fallbackProblemIcon, mahallaCoords } from "@/lib/constants";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://100.126.4.84:5000/api";

const get = async (path, options = {}) => {
    const token = localStorage.getItem("access_token");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
};

export const login = async (username, password) => {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error(`Login error: ${res.status}`);
    const data = await res.json();
    if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
};

export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
};

export const getUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
};

export const getOrganizations = async () => {
    const data = await get("/register");
    return data.organizations || [];
};

export const registerUser = async (userData) => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`Register error: ${res.status}`);
    return res.json();
};

export const downloadMahallaReport = async (mahallaId, startDate, endDate) => {
    const token = localStorage.getItem("access_token");
    const url = `${API_BASE}/mahalla/report/${mahallaId}?start=${startDate}&end=${endDate}`;
    
    const response = await fetch(url, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!response.ok) throw new Error(`Download error: ${response.status}`);

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = `mahalla_${mahallaId}_report.doc`;
    
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (filenameMatch) filename = filenameMatch[1];
    }

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
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
        let data;

        try {
            data = await get(`/mahalla?mahalla_id=${encodeURIComponent(id)}`);
        } catch {
            data = await get(`/mahalla/${id}`);
        }

        const normalizeStatus = (status = "") => {
            const s = String(status).toLowerCase();
            if (s === "new") return "Yangi";
            if (s === "downloaded") return "Yuklandi";
            if (s === "in_progress") return "Jarayonda";
            if (s === "resolved") return "Bajarildi";
            return status;
        };

        return {
            ...data,
            resolved: data.resolved_percent || 0,
            active_issues: data.active_issues || 0,
            population: toNumber(data.population),
            total_complaints: data.total_complaints || 0,
            categories: data.categories || {},
            problems: (data.complaints || []).map((c) => ({
                id: c.id,
                title: c.text,
                description: c.text,
                status: normalizeStatus(c.status),
                category: "Kommunal",
                priority: "O'rta",
                date: c.created_at || "",
            })),
        };
    },
    getMahallaOverview: async (mahallaId) => {
        let data;

        if (mahallaId) {
            try {
                data = await get(`/mahalla?mahalla_id=${encodeURIComponent(mahallaId)}`);
            } catch {
                data = await get(`/mahalla?mahala_id=${encodeURIComponent(mahallaId)}`);
            }
        } else {
            data = await get("/mahalla");
        }

        return {
            mahalla: data?.mahalla || { id: null, name: "Barcha mahallalar" },
            summary: {
                active_issues: toNumber(data?.summary?.active_issues),
                resolved_count: toNumber(data?.summary?.resolved_count),
                resolved_percent: toNumber(data?.summary?.resolved_percent),
                total_complaints: toNumber(data?.summary?.total_complaints),
            },
            category_chart: toArray(data?.category_chart).map((item) => ({
                name: toText(item?.name),
                value: toNumber(item?.value),
            })),
            organization_chart: toArray(data?.organization_chart).map((item) => ({
                name: toText(item?.name),
                value: toNumber(item?.value),
            })),
            departments: toArray(data?.departments).map((item) => ({
                id: item?.id,
                name: toText(item?.name),
                total: toNumber(item?.total),
                active: toNumber(item?.active),
                resolved: toNumber(item?.resolved),
                resolved_percent: toNumber(item?.resolved_percent),
            })),
        };
    },

    getDepartmentDetail: async (departmentId, mahallaId) => {
        let data;

        if (mahallaId) {
            try {
                data = await get(
                    `/department/${departmentId}?mahalla_id=${encodeURIComponent(mahallaId)}`
                );
            } catch {
                data = await get(
                    `/department/${departmentId}?mahala_id=${encodeURIComponent(mahallaId)}`
                );
            }
        } else {
            data = await get(`/department/${departmentId}`);
        }

        const normalizeDepartmentStatus = (status = "") => {
            const s = toText(status).toLowerCase();
            if (s === "new") return "Yangi";
            if (s === "in process" || s === "in_process" || s === "jarayonda") {
                return "Jarayonda";
            }
            if (s === "resolved" || s === "done" || s === "bajarildi") {
                return "Bajarildi";
            }
            if (s === "failed" || s === "bajarilmadi") return "Bajarilmadi";
            return toText(status);
        };

        const complaints = toArray(data?.complaints).map((item) => ({
            id: item?.id,
            text: toText(item?.text),
            user: toText(item?.user),
            category: toText(item?.category),
            date: toText(item?.date),
            deadline: toText(item?.deadline),
            status: normalizeDepartmentStatus(item?.status),
        }));

        const total = complaints.length;
        const resolved = complaints.filter((c) => c.status === "Bajarildi").length;
        const active = complaints.filter((c) => c.status === "Jarayonda").length;
        const unresolved = Math.max(total - resolved - active, 0);

        return {
            department: {
                id: data?.id ?? departmentId,
                name: toText(data?.name || data?.department || "Bo'lim"),
            },
            summary: {
                total,
                active,
                resolved,
                unresolved,
                resolved_percent: total ? Math.round((resolved / total) * 100) : 0,
            },
            complaints,
            status_chart: [
                { name: "Yangi", value: complaints.filter((c) => c.status === "Yangi").length },
                { name: "Jarayonda", value: active },
                { name: "Bajarildi", value: resolved },
                { name: "Bajarilmadi", value: unresolved },
            ],
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
