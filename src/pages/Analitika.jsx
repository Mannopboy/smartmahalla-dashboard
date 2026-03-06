import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];

const Analitika = () => {
  const { data } = useApiData(api.getAnalytics, {
    by_category: {},
    monthly_trend: [],
    by_mahalla: [],
  });

  const byCategory = Object.entries(data.by_category).map(([name, value]) => ({
    name,
    value,
  }));

  return (
      <DashboardLayout>
        <div>
          <div className="flex items-center gap-3 mb-6">
            <BackButton />
            <h1 className="text-2xl font-bold">Analitika</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Monthly trend */}
            <div className="gov-card">
              <h2 className="text-lg font-semibold mb-4">
                Oylar bo'yicha trend
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.monthly_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category pie chart */}
            <div className="gov-card">
              <h2 className="text-lg font-semibold mb-4">
                Kategoriya bo'yicha
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                      data={byCategory}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                  >
                    {byCategory.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </DashboardLayout>
  );
};

export default Analitika;