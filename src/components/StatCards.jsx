import {
    Building2,
    MessageSquareWarning,
    CheckCircle2,
    ListTodo,
    ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";

const StatCards = () => {
    const navigate = useNavigate();

    const { data } = useApiData(api.getDashboard, {
        total_mahallas: 0,
        total_complaints: 0,
        resolved_percent: 0,
        open_tasks: 0,
    });

    const stats = [
        {
            label: "Jami Mahalla",
            value: String(data.total_mahallas),
            icon: Building2,
            gradient: "from-primary/20 to-primary/5",
            iconBg: "bg-primary/15",
            iconColor: "text-primary",
            link: "/mahallalar",
            ring: "ring-primary/20",
        },
        {
            label: "Jami Shikoyat",
            value: String(data.total_complaints),
            icon: MessageSquareWarning,
            gradient: "from-destructive/15 to-destructive/5",
            iconBg: "bg-destructive/15",
            iconColor: "text-destructive",
            link: "/shikoyatlar",
            ring: "ring-destructive/20",
        },
        {
            label: "Hal Qilingan",
            value: `${data.resolved_percent}%`,
            icon: CheckCircle2,
            gradient: "from-success/15 to-success/5",
            iconBg: "bg-success/15",
            iconColor: "text-success",
            link: "/hal-qilingan",
            ring: "ring-success/20",
        },
        {
            label: "Faol Vazifalar",
            value: String(data.open_tasks),
            icon: ListTodo,
            gradient: "from-warning/15 to-warning/5",
            iconBg: "bg-warning/15",
            iconColor: "text-warning",
            link: "/vazifalar",
            ring: "ring-warning/20",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    onClick={() => navigate(stat.link)}
                    className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${stat.gradient} p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ring-1 ${stat.ring}`}
                >
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-card/30 to-transparent opacity-60" />

                    <div className="relative flex items-start justify-between">
                        <div className="flex-1">
                            <div
                                className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                            >
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>

                            <p className="text-2xl font-extrabold text-foreground">
                                {stat.value}
                            </p>

                            <p className="text-xs font-medium text-muted-foreground mt-1.5 uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>

                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StatCards;