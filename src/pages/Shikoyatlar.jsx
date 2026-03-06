import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";
import {
    categoryColors,
    priorityColors,
    statusColors,
} from "@/lib/constants";

const Shikoyatlar = () => {
    const [search, setSearch] = useState("");

    const { data: problems } = useApiData(api.getAllProblems, []);

    const filtered = useMemo(() => {
        return problems.filter((p) =>
            [p.title, p.mahalla, p.description]
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [problems, search]);

    return (
        <DashboardLayout>
            <div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <BackButton />

                    <div>
                        <h1 className="text-xl font-extrabold">
                            Shikoyatlar Boshqaruvi
                        </h1>
                    </div>
                </div>

                {/* Search */}
                <div className="gov-card mb-4 !p-2.5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                        <input
                            type="text"
                            placeholder="Muammo yoki mahalla qidirish..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-9 pl-9 pr-4 rounded-xl bg-muted border-0 text-sm"
                        />
                    </div>
                </div>

                {/* Problems grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filtered.map((problem) => (
                        <div
                            key={problem.id}
                            className="rounded-xl border border-border bg-card p-3"
                        >
                            <h4 className="text-sm font-bold">
                                {problem.title}
                            </h4>

                            <p className="text-xs text-muted-foreground mt-1">
                                {problem.description}
                            </p>

                            <div className="flex flex-wrap gap-1 mt-2">
                <span
                    className={`px-2 py-0.5 rounded text-xs ${statusColors[problem.status]}`}
                >
                  {problem.status}
                </span>

                                <span
                                    className={`px-2 py-0.5 rounded text-xs ${priorityColors[problem.priority]}`}
                                >
                  {problem.priority}
                </span>

                                <span
                                    className={`px-2 py-0.5 rounded text-xs ${
                                        categoryColors[problem.category] || "bg-muted"
                                    }`}
                                >
                  {problem.category}
                </span>
                            </div>

                            <p className="text-xs text-muted-foreground mt-2">
                                {problem.mahalla} • {problem.date}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Shikoyatlar;