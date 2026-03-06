import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    Cell,
} from "recharts";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";

const getBarColor = (value) =>
    value >= 70 ? "#10b981" : value >= 40 ? "#f59e0b" : "#ef4444";

const HalQilingan = () => {
    const { data: mahallasData } = useApiData(api.getMahallalar, []);

    const data = [...mahallasData].sort((a, b) => b.resolved - a.resolved);

    return (
        <DashboardLayout>
            <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                    <BackButton />
                    <h1 className="text-2xl font-bold text-foreground">
                        Hal Qilinganlar
                    </h1>
                </div>

                <div className="gov-card">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Mahallalar bo'yicha hal qilinganlik darajasi (%)
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={Math.max(400, data.length * 28)}
                    >
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ left: 120, right: 20, top: 5, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis type="number" domain={[0, 100]} />

                            <YAxis
                                dataKey="name"
                                type="category"
                                width={110}
                            />

                            <Tooltip
                                formatter={(value) => [`${value}%`, "Hal qilingan"]}
                            />

                            <Bar dataKey="resolved" radius={[0, 8, 8, 0]}>
                                {data.map((entry, i) => (
                                    <Cell
                                        key={i}
                                        fill={getBarColor(entry.resolved)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HalQilingan;