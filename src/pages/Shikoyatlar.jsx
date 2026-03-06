import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Filter,
    Bot,
    Globe,
    Sparkles,
    GripVertical,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    Upload,
    Play,
    Wrench,
    Droplets,
    Car,
    TreePine,
    Building,
    AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    useDraggable,
} from "@dnd-kit/core";

import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import AssignTaskModal from "@/components/AssignTaskModal";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";
import { categoryColors, priorityColors } from "@/lib/constants";

/* ================= SOURCE ================= */

const sourceIcons = {
    "Telegram Bot": <Bot className="w-3.5 h-3.5" />,
    "Landing Page": <Globe className="w-3.5 h-3.5" />,
    AI: <Sparkles className="w-3.5 h-3.5" />,
};

const sourceColors = {
    "Telegram Bot": "bg-primary/10 text-primary",
    "Landing Page": "bg-success/10 text-success",
    AI: "bg-warning/10 text-warning",
};

/* ================= COLUMNS ================= */

const columnConfig = [
    {
        status: "Yangi",
        label: "Yangi",
        icon: <AlertCircle className="w-4 h-4" />,
        accent: "border-t-destructive",
        headerBg: "bg-destructive/5",
    },
    {
        status: "Yuklandi",
        label: "Yuklandi",
        icon: <Upload className="w-4 h-4" />,
        accent: "border-t-primary",
        headerBg: "bg-primary/5",
    },
    {
        status: "Jarayonda",
        label: "Jarayonda",
        icon: <Clock className="w-4 h-4" />,
        accent: "border-t-warning",
        headerBg: "bg-warning/5",
    },
    {
        status: "Bajarildi",
        label: "Bajarildi",
        icon: <CheckCircle2 className="w-4 h-4" />,
        accent: "border-t-success",
        headerBg: "bg-success/5",
    },
];

/* ================= CATEGORY ICONS ================= */

const iconByCategory = {
    Kommunal: Wrench,
    "Yo'l": Car,
    Ekologiya: TreePine,
    Adliya: Building,
    Ijtimoiy: Droplets,
};

/* ================= HELPERS ================= */

const getTaskSource = (task) => {
    const s = String(task.source || "").toLowerCase();
    if (s.includes("telegram")) return "Telegram Bot";
    if (s.includes("landing")) return "Landing Page";
    return "AI";
};

const toProblemFromTask = (task) => {
    const category = task.category || "Kommunal";
    const priority = task.priority || "O'rta";
    const Icon = iconByCategory[category] || AlertTriangle;

    return {
        id: task.id,
        title: task.name || task.title || "Vazifa",
        description: task.description || task.comment || "",
        category,
        priority,
        date: task.deadline || task.created_at || "-",
        mahalla: task.mahalla || "Noma'lum",
        source: getTaskSource(task),
        org: task.org || "",
        icon: Icon,
        status: "Yangi",
    };
};

/* ================= DROPPABLE COLUMN ================= */

function DroppableColumn({ id, children, config, count }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col rounded-2xl border border-border border-t-4 ${config.accent} min-h-[420px] ${
                isOver ? "ring-2 ring-primary/30 bg-primary/[0.02]" : "bg-card/50"
            }`}
        >
            <div className={`flex items-center gap-2 px-3 py-3 ${config.headerBg}`}>
                {config.icon}
                <h3 className="text-xs font-bold">{config.label}</h3>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-muted">
          {count}
        </span>
            </div>

            <div className="flex-1 p-1.5 space-y-1.5 overflow-y-auto max-h-[60vh]">
                {children}
            </div>
        </div>
    );
}

/* ================= DRAGGABLE CARD ================= */

function DraggableCard({ problem, showSource, onStart }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: `problem-${problem.id}`,
            data: { problem },
        });

    const style = transform
        ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
        : undefined;

    const Icon = problem.icon;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`group relative rounded-xl border border-border bg-card p-3 cursor-grab active:cursor-grabbing ${
                isDragging ? "opacity-40 scale-95" : ""
            }`}
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-40">
                <GripVertical className="w-3.5 h-3.5" />
            </div>

            <div className="flex items-start gap-2">
                <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        categoryColors[problem.category] || "bg-muted"
                    }`}
                >
                    <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1">
                    <h4 className="text-[11px] font-bold truncate">{problem.title}</h4>
                    <p className="text-[9px] text-muted-foreground truncate">
                        {problem.description}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1 mt-2 flex-wrap">
        <span
            className={`px-1.5 py-0.5 rounded text-[8px] ${
                priorityColors[problem.priority]
            }`}
        >
          {problem.priority}
        </span>

                <span className="px-1.5 py-0.5 rounded text-[8px] bg-muted">
          {problem.mahalla}
        </span>

                {showSource && (
                    <span
                        className={`px-1.5 py-0.5 rounded text-[8px] ${
                            sourceColors[problem.source]
                        }`}
                    >
            {sourceIcons[problem.source]} {problem.source}
          </span>
                )}
            </div>

            {onStart && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onStart();
                    }}
                    className="mt-2 text-[8px] px-2 py-0.5 rounded bg-warning/15 text-warning"
                >
                    <Play className="w-2.5 h-2.5 inline" /> Boshlash
                </button>
            )}
        </div>
    );
}

/* ================= MAIN PAGE ================= */

const Shikoyatlar = () => {
    const [problems, setProblems] = useState([]);
    const [search, setSearch] = useState("");
    const [orgFilter, setOrgFilter] = useState("Barcha");
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingProblemId, setPendingProblemId] = useState(null);
    const [draggedProblem, setDraggedProblem] = useState(null);

    const { data: tasks = [] } = useApiData(api.getTasks, []);
    const { data: organizations = [] } = useApiData(api.getOrganizations, []);

    useEffect(() => {
        setProblems(tasks.map(toProblemFromTask));
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const filtered = useMemo(() => {
        return problems.filter((p) => {
            const matchSearch =
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.mahalla.toLowerCase().includes(search.toLowerCase());

            const matchOrg = orgFilter === "Barcha" || p.org === orgFilter;

            return matchSearch && matchOrg;
        });
    }, [problems, search, orgFilter]);

    const columns = {
        Yangi: filtered.filter((p) => p.status === "Yangi"),
        Yuklandi: filtered.filter((p) => p.status === "Yuklandi"),
        Jarayonda: filtered.filter((p) => p.status === "Jarayonda"),
        Bajarildi: filtered.filter((p) => p.status === "Bajarildi"),
    };

    const handleDragStart = (event) => {
        setDraggedProblem(event.active.data.current?.problem);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setDraggedProblem(null);

        if (!over) return;

        const problem = active.data.current?.problem;
        const target = over.id;

        if (problem.status === "Yangi" && target === "Yuklandi") {
            setPendingProblemId(problem.id);
            setModalOpen(true);
            return;
        }

        if (problem.status === "Jarayonda" && target === "Bajarildi") {
            setProblems((prev) =>
                prev.map((p) =>
                    p.id === problem.id ? { ...p, status: "Bajarildi" } : p
                )
            );
        }
    };

    const handleModalSubmit = () => {
        setProblems((prev) =>
            prev.map((p) =>
                p.id === pendingProblemId ? { ...p, status: "Yuklandi" } : p
            )
        );
        setModalOpen(false);
        setPendingProblemId(null);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                    <BackButton />
                    <h1 className="text-xl font-bold">Shikoyatlar Boshqaruvi</h1>
                </div>

                <div className="gov-card mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            className="w-full h-9 pl-9 pr-4 rounded-xl bg-muted border-0 text-sm"
                            placeholder="Qidirish..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                        {columnConfig.map((col) => (
                            <DroppableColumn
                                key={col.status}
                                id={col.status}
                                config={col}
                                count={columns[col.status].length}
                            >
                                {columns[col.status].map((problem) => (
                                    <DraggableCard key={problem.id} problem={problem} />
                                ))}
                            </DroppableColumn>
                        ))}
                    </div>

                    <DragOverlay>
                        {draggedProblem && <DraggableCard problem={draggedProblem} />}
                    </DragOverlay>
                </DndContext>
            </div>

            <AssignTaskModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
        </DashboardLayout>
    );
};

export default Shikoyatlar;