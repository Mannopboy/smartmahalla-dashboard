import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import { mahallasData, allProblems } from "@/data/mahallas";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";

const trendData = [
    { month: "Yan", count: 120 },
    { month: "Fev", count: 190 },
    { month: "Mar", count: 160 },
    { month: "Apr", count: 230 },
    { month: "May", count: 200 },
    { month: "Iyn", count: 280 },
    { month: "Iyl", count: 250 },
    { month: "Avg", count: 310 },
    { month: "Sen", count: 270 },
    { month: "Okt", count: 340 },
    { month: "Noy", count: 290 },
    { month: "Dek", count: 320 },
];

const categoryMap = {};

allProblems.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
});

const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
}));

const COLORS = [
    "hsl(221, 83%, 53%)",
    "hsl(38, 92%, 50%)",
    "hsl(142, 71%, 45%)",
    "hsl(0, 84%, 60%)",
    "hsl(280, 70%, 50%)",
];

const mahallaData = [...mahallasData]
    .sort((a, b) => b.complaints - a.complaints)
    .map((m) => ({
        name: m.name,
        complaints: m.complaints,
    }));

const Analitika = () => {
    return (
        <DashboardLayout>
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <BackButton />
                    <h1 className="text-2xl font-bold text-foreground">Analitika</h1>
                </div>

                {/* Trend */}
                <div className="gov-card mb-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Shikoyat tendensiyasi
                    </h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(214, 32%, 91%)"
                            />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12 }}
                                stroke="hsl(215, 16%, 47%)"
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="hsl(215, 16%, 47%)"
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 12,
                                    border: "1px solid hsl(214, 32%, 91%)",
                                    boxShadow: "0 4px 12px hsl(0 0% 0% / 0.08)",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="hsl(221, 83%, 53%)"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: "hsl(221, 83%, 53%)" }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie */}
                <div className="gov-card mb-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Muammo turlari
                    </h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={4}
                                dataKey="value"
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {categoryData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>

                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Mahalla bar chart */}
                <div className="gov-card">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Mahallalar bo'yicha shikoyatlar
                    </h2>

                    <div className="overflow-x-auto">
                        <div style={{ minWidth: mahallaData.length * 60 }}>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart
                                    data={mahallaData}
                                    margin={{ left: 10, right: 10, top: 5, bottom: 80 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(214, 32%, 91%)"
                                    />

                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10, fill: "hsl(215, 16%, 47%)" }}
                                        stroke="hsl(215, 16%, 47%)"
                                        interval={0}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        stroke="hsl(215, 16%, 47%)"
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: "1px solid hsl(214, 32%, 91%)",
                                            boxShadow: "0 4px 12px hsl(0 0% 0% / 0.08)",
                                        }}
                                    />

                                    <Bar
                                        dataKey="complaints"
                                        fill="hsl(221, 83%, 53%)"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analitika;