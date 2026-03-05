import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import { mahallasData } from "@/data/mahallas";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = mahallasData
    .map((m) => ({
      name: m.name,
      resolved: m.resolved,
    }))
    .sort((a, b) => b.resolved - a.resolved);

const getBarColor = (val) => {
  if (val >= 80) return "hsl(142, 71%, 45%)";
  if (val >= 60) return "hsl(38, 92%, 50%)";
  return "hsl(0, 84%, 60%)";
};

const HalQilingan = () => {
  return (
      <DashboardLayout>
        <div>
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
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(214, 32%, 91%)"
                />

                <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    stroke="hsl(215, 16%, 47%)"
                />

                <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11 }}
                    stroke="hsl(215, 16%, 47%)"
                    width={110}
                />

                <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(214, 32%, 91%)",
                      boxShadow: "0 4px 12px hsl(0 0% 0% / 0.08)",
                    }}
                    formatter={(value) => [`${value}%`, "Hal qilingan"]}
                />

                <Bar dataKey="resolved" radius={[0, 8, 8, 0]}>
                  {data.map((entry, i) => (
                      <Cell key={i} fill={getBarColor(entry.resolved)} />
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