import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import { motion } from "framer-motion";
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
  Legend,
} from "recharts";
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity } from "lucide-react";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-xl">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-primary font-semibold">
          {payload[0].value} ta
        </p>
      </div>
    );
  }
  return null;
};

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

  const totalComplaints = byCategory.reduce((sum, item) => sum + item.value, 0);

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analitika</h1>
            <p className="text-sm text-muted-foreground">Umumiy statistika va tahlillar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="gov-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Oylar bo'yicha trend</h2>
                <p className="text-xs text-muted-foreground">Oxirgi 6 oy ichidagi shikoyatlar soni</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthly_trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="gov-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
                <PieChartIcon className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Kategoriya bo'yicha</h2>
                <p className="text-xs text-muted-foreground">Jami {totalComplaints} ta shikoyat</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex-1 space-y-2">
                {byCategory.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
                {byCategory.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Ma'lumot yo'q</p>
                )}
              </div>
            </div>
          </motion.div>

          {data.by_mahalla && data.by_mahalla.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="gov-card lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Mahallalar bo'yicha</h2>
                  <p className="text-xs text-muted-foreground">Har bir mahalladagi shikoyatlar soni</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.by_mahalla} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hBarGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    width={70}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
                  <Bar dataKey="count" fill="url(#hBarGradient)" radius={[0, 6, 6, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analitika;
