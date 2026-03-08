import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    PieChart as PieChartIcon,
    TrendingUp,
    X,
} from "lucide-react";
import {
    Pie,
    PieChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";

const STATUS_COLORS = {
    Yangi: "bg-warning/10 text-warning border-warning/20",
    Jarayonda: "bg-primary/10 text-primary border-primary/20",
    Bajarildi: "bg-success/10 text-success border-success/20",
    Bajarilmadi: "bg-destructive/10 text-destructive border-destructive/20",
};

const PIE_COLORS = {
    Yangi: "#eab308",
    Jarayonda: "#3b82f6",
    Bajarildi: "#22c55e",
    Bajarilmadi: "#ef4444",
};

const StatCard = ({ icon: Icon, label, value, iconClass }) => (
    <div className="gov-card">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClass}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
        </div>
    </div>
);

const DepartmentDetail = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const mahallaId = searchParams.get("mahalla_id");
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const { data, loading, error } = useApiData(
        () => api.getDepartmentDetail(id, mahallaId),
        {
            department: { id: null, name: "Bo'lim" },
            summary: { total: 0, active: 0, resolved: 0, unresolved: 0, resolved_percent: 0 },
            complaints: [],
            status_chart: [],
        },
        [id, mahallaId]
    );

    const chartData = useMemo(
        () => data.status_chart.filter((item) => item.value > 0),
        [data.status_chart]
    );

    if (loading) {
        return (
            <DashboardLayout>
                <div className="py-20 text-center">Yuklanmoqda...</div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="py-20 text-center text-destructive">Xatolik: {error}</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3">
                    <BackButton />
                    <div>
                        <h1 className="text-xl font-bold text-foreground">{data.department.name}</h1>
                        <p className="text-xs text-muted-foreground">Bo'lim shikoyatlari</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard icon={FileText} label="Jami" value={data.summary.total} iconClass="bg-primary/10 text-primary" />
                    <StatCard icon={Clock} label="Jarayonda" value={data.summary.active} iconClass="bg-primary/10 text-primary" />
                    <StatCard icon={CheckCircle2} label="Bajarildi" value={data.summary.resolved} iconClass="bg-success/10 text-success" />
                    <StatCard icon={AlertCircle} label="Bajarilmadi" value={data.summary.unresolved} iconClass="bg-destructive/10 text-destructive" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="gov-card">
                        <div className="flex items-center gap-2 mb-3">
                            <PieChartIcon className="w-4 h-4 text-primary" />
                            <h2 className="text-sm font-semibold">Holat bo'yicha taqsimot</h2>
                        </div>
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={2}
                                >
                                    {chartData.map((item) => (
                                        <Cell key={item.name} fill={PIE_COLORS[item.name] || "#94a3b8"} />
                                    ))}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="gov-card flex flex-col items-center justify-center text-center">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-4 h-4 text-success" />
                            <h2 className="text-sm font-semibold">Bajarilish darajasi</h2>
                        </div>

                        <div className="relative w-28 h-28 mb-2">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted) / 0.3)" strokeWidth="8" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${data.summary.resolved_percent * 2.51} 251`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                                {data.summary.resolved_percent}%
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {data.summary.resolved} / {data.summary.total} bajarildi
                        </p>
                    </div>
                </div>

                <div className="gov-card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold">Murojaatlar ro'yxati</h2>
                    </div>

                    <div className="max-h-[420px] overflow-auto rounded-lg border border-border/60 pr-1 [scrollbar-width:thin] [scrollbar-color:hsl(var(--primary))_hsl(var(--muted))] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-muted/70 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:border [&::-webkit-scrollbar-thumb]:border-card [&::-webkit-scrollbar-thumb:hover]:bg-primary/80">
                    <table className="w-full min-w-[820px] text-sm">
                        <thead>
                            <tr className="text-left border-b border-border text-muted-foreground bg-card sticky top-0 z-10">
                                <th className="py-2 pr-4">ID</th>
                                <th className="py-2 pr-4">Kategoriya</th>
                                <th className="py-2 pr-4">Tavsif</th>
                                <th className="py-2 pr-4">Sana</th>
                                <th className="py-2">Holat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.complaints.map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => setSelectedComplaint(item)}
                                    className="border-b border-border/70 last:border-0 cursor-pointer hover:bg-muted/30 transition-colors"
                                >
                                    <td className="py-3 pr-4 font-medium">MH-{item.id}</td>
                                    <td className="py-3 pr-4">{item.category || "-"}</td>
                                    <td className="py-3 pr-4 max-w-[260px] truncate" title={item.text}>
                                        {item.text || "-"}
                                    </td>
                                    <td className="py-3 pr-4">{item.date || "-"}</td>
                                    <td className="py-3">
                                        <span
                                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                                                STATUS_COLORS[item.status] || "bg-muted text-foreground border-border"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {!data.complaints.length && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                        Shikoyatlar topilmadi
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>

                {selectedComplaint && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <button
                            type="button"
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setSelectedComplaint(null)}
                        />
                        <div className="relative w-full max-w-lg max-h-[85vh] rounded-2xl border border-border bg-card p-5 shadow-xl overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setSelectedComplaint(null)}
                                className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <h3 className="mb-1 text-base font-semibold text-foreground">
                                Murojaat tafsiloti (MH-{selectedComplaint.id})
                            </h3>
                            <p className="mb-4 text-xs text-muted-foreground">
                                {selectedComplaint.category || "Kategoriya yo'q"} • {selectedComplaint.date || "Sana yo'q"}
                            </p>

                            <div className="max-h-[55vh] overflow-y-auto rounded-xl bg-muted/40 p-4 text-sm leading-6 text-foreground whitespace-pre-wrap">
                                {selectedComplaint.text || "Tavsif mavjud emas"}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DepartmentDetail;
