import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";
import { motion } from "framer-motion";

import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Building2,
    PieChart as PieChartIcon,
    Activity,
    TrendingUp,
} from "lucide-react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const COLORS = ["#2f80ed", "#27ae60", "#f2c94c", "#eb5757", "#56ccf2"];

const StatCard = ({ icon: Icon, label, value, iconBg }) => (
    <div className="bg-card rounded-xl border border-border shadow-sm p-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className="w-6 h-6" />
        </div>

        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const Shikoyatlar = () => {

    const { data } = useApiData(api.getMahallaOverview, {
        mahalla: { name: "Barcha mahallalar" },
        summary: {
            active_issues: 0,
            resolved_count: 0,
            resolved_percent: 0,
            total_complaints: 0,
        },
        category_chart: [],
        organization_chart: [],
        departments: [],
    });

    const unresolved =
        data.summary.total_complaints -
        data.summary.resolved_count -
        data.summary.active_issues;

    const completionText = `${data.summary.resolved_count} / ${data.summary.total_complaints} bajarildi`;

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* HEADER */}

                <div className="flex items-center gap-3">
                    <BackButton />
                    <div>
                        <h1 className="text-2xl font-bold">Shikoyatlar statistikasi</h1>
                        <p className="text-sm text-muted-foreground">
                            {data.mahalla?.name}
                        </p>
                    </div>
                </div>

                {/* STAT CARDS */}

                <div className="grid md:grid-cols-4 gap-5">

                    <StatCard
                        icon={FileText}
                        label="Jami murojaatlar"
                        value={data.summary.total_complaints}
                        iconBg="bg-blue-100 text-blue-600"
                    />

                    <StatCard
                        icon={Clock}
                        label="Jarayonda"
                        value={data.summary.active_issues}
                        iconBg="bg-blue-100 text-blue-600"
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label="Bajarildi"
                        value={data.summary.resolved_count}
                        iconBg="bg-green-100 text-green-600"
                    />

                    <StatCard
                        icon={AlertCircle}
                        label="Bajarilmadi"
                        value={unresolved}
                        iconBg="bg-red-100 text-red-600"
                    />

                </div>

                {/* CHARTS */}

                <div className="grid xl:grid-cols-3 gap-6">

                    {/* PIE */}

                    <div className="bg-card border rounded-xl p-5 shadow-sm">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-blue-500" />
                            Kategoriya bo'yicha
                        </h2>

                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>

                                <Pie
                                    data={data.category_chart}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={70}
                                    outerRadius={100}
                                >
                                    {data.category_chart.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>

                                <Legend />
                                <Tooltip />

                            </PieChart>
                        </ResponsiveContainer>

                    </div>

                    {/* BAR */}

                    <div className="bg-card border rounded-xl p-5 shadow-sm">

                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-green-500" />
                            Bo'lim bo'yicha
                        </h2>

                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={data.organization_chart} layout="vertical">

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} />

                                <Bar
                                    dataKey="value"
                                    fill="#2D9CDB"
                                    radius={[8,8,8,8]}
                                />

                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                    {/* PROGRESS */}

                    <div className="bg-card border rounded-xl p-5 shadow-sm text-center">

                        <h2 className="font-semibold mb-6 flex items-center gap-2 justify-center">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            Bajarilish darajasi
                        </h2>

                        <div className="relative w-40 h-40 mx-auto">

                            <svg viewBox="0 0 100 100">

                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="10"
                                />

                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#27ae60"
                                    strokeWidth="10"
                                    strokeDasharray={`${data.summary.resolved_percent * 2.51} 251`}
                                    strokeLinecap="round"
                                />

                            </svg>

                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                                {data.summary.resolved_percent}%
                            </div>

                        </div>

                        <p className="text-sm text-muted-foreground mt-4">
                            {completionText}
                        </p>

                    </div>

                </div>

                {/* DEPARTMENTS */}

                <div>

                    <h2 className="text-xl font-bold mb-4">
                        Bo'limlar bo'yicha statistika
                    </h2>

                    <div className="grid md:grid-cols-3 gap-5">

                        {data.departments.map((d) => (

                            <div key={d.id} className="bg-card border rounded-xl p-5 shadow-sm">

                                <div className="flex justify-between mb-4">

                                    <h3 className="font-semibold">{d.name}</h3>

                                    <span className="text-green-600 font-semibold">
                    {Math.round(d.resolved_percent)}%
                  </span>

                                </div>

                                <div className="space-y-2 text-sm">

                                    <p className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Jarayonda
                    </span>
                                        {d.active}
                                    </p>

                                    <p className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Bajarildi
                    </span>
                                        {d.resolved}
                                    </p>

                                    <p className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Bajarilmadi
                    </span>
                                        {d.total - d.active - d.resolved}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
};

export default Shikoyatlar;