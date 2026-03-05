import {useState, useMemo} from "react";
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
    Play
} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,} from "@dnd-kit/core";
import {useDroppable} from "@dnd-kit/core";
import {useDraggable} from "@dnd-kit/core";
import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import AssignTaskModal from "@/components/AssignTaskModal";
import {allProblems, categoryColors, priorityColors, organizations,} from "@/data/mahallas";

const sourceIcons = {
    "Telegram Bot": <Bot className="w-3.5 h-3.5"/>,
    "Landing Page": <Globe className="w-3.5 h-3.5"/>,
    "AI": <Sparkles className="w-3.5 h-3.5"/>,
};
const sourceColors = {
    "Telegram Bot": "bg-primary/10 text-primary",
    "Landing Page": "bg-success/10 text-success",
    "AI": "bg-warning/10 text-warning",
};
const columnConfig = [
    {
        status: "Yangi",
        label: "Yangi",
        icon: <AlertCircle className="w-4 h-4"/>,
        accent: "border-t-destructive",
        headerBg: "bg-destructive/5",
    },
    {
        status: "Yuklandi",
        label: "Yuklandi",
        icon: <Upload className="w-4 h-4"/>,
        accent: "border-t-primary",
        headerBg: "bg-primary/5",
    },
    {
        status: "Jarayonda",
        label: "Jarayonda",
        icon: <Clock className="w-4 h-4"/>,
        accent: "border-t-warning",
        headerBg: "bg-warning/5",
    },
    {
        status: "Bajarildi",
        label: "Bajarildi",
        icon: <CheckCircle2 className="w-4 h-4"/>,
        accent: "border-t-success",
        headerBg: "bg-success/5",
    },
];

function DroppableColumn({id, children, config, count,}) {
    const {setNodeRef, isOver} = useDroppable({id});
    return (<div ref={setNodeRef}
                 className={`flex flex-col rounded-2xl border border-border border-t-4 ${config.accent} transition-all duration-200 min-h-[420px] ${isOver ? "ring-2 ring-primary/30 bg-primary/[0.02]" : "bg-card/50"}`}>
        <div className={`flex items-center gap-2.5 px-3 py-3 rounded-t-xl ${config.headerBg}`}>
            <span className="text-muted-foreground">{config.icon}</span>
            <h3 className="text-xs font-bold text-foreground">{config.label}</h3>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {count}
        </span>
        </div>
        <div className="flex-1 p-1.5 space-y-1.5 overflow-y-auto max-h-[60vh]">
            {children}
        </div>
    </div>);
}

function DraggableCard({problem, showSource, onStart,}) {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: `problem-${problem.id}`,
        data: {problem},
    });
    const style = transform
        ? {transform: `translate(${transform.x}px, ${transform.y}px)`}
        : undefined;
    const Icon = problem.icon;
    return (<div ref={setNodeRef} style={style}
                 className={`group relative rounded-xl border border-border bg-card p-3 cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-md ${isDragging ? "opacity-40 scale-95" : "opacity-100"}`} {...listeners} {...attributes}>
        <div className="absolute top-2.5 right-2 opacity-0 group-hover:opacity-40 transition-opacity">
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground"/>
        </div>

        <div className="flex items-start gap-2">
            <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${categoryColors[problem.category] || "bg-muted"}`}>
                <Icon className="w-3.5 h-3.5"/>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-bold text-foreground leading-snug truncate">{problem.title}</h4>
                <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">{problem.description}</p>
            </div>
        </div>

        <div className="flex items-center gap-1 mt-2 flex-wrap">
        <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-semibold ${priorityColors[problem.priority]}`}>
          {problem.priority}
        </span>
            <span
                className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground truncate max-w-[80px]">
          {problem.mahalla}
        </span>
            {showSource && problem.source && (<span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-semibold ${sourceColors[problem.source]}`}>
            {sourceIcons[problem.source]}
                {problem.source}
          </span>)}
            {problem.org && (<span
                className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary truncate max-w-[80px]">
            {problem.org}
          </span>)}
        </div>

        <div className="flex items-center justify-between mt-1.5">
        <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded ${categoryColors[problem.category]}`}>
          {problem.category}
        </span>
            <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-muted-foreground">{problem.date}</span>
                {onStart && (<button onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onStart();
                }} onPointerDown={(e) => e.stopPropagation()}
                                     className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-warning/15 text-warning text-[8px] font-bold hover:bg-warning/25 transition-colors">
                    <Play className="w-2.5 h-2.5"/>
                    Boshlash
                </button>)}
            </div>
        </div>
    </div>);
}

function OverlayCard({problem}) {
    const Icon = problem.icon;
    return (<div className="rounded-xl border-2 border-primary/30 bg-card p-3 shadow-2xl rotate-2 scale-105 w-[240px]">
        <div className="flex items-start gap-2">
            <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${categoryColors[problem.category] || "bg-muted"}`}>
                <Icon className="w-3.5 h-3.5"/>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-bold text-foreground truncate">{problem.title}</h4>
                <p className="text-[9px] text-muted-foreground mt-0.5">{problem.mahalla}</p>
            </div>
        </div>
    </div>);
}

const Shikoyatlar = () => {
    const [problems, setProblems] = useState(() => allProblems);
    const [search, setSearch] = useState("");
    const [orgFilter, setOrgFilter] = useState("Barcha");
    const [showFilters, setShowFilters] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [draggedProblem, setDraggedProblem] = useState(null);
    const [pendingProblemId, setPendingProblemId] = useState(null);
    const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 8}}));
    const filtered = useMemo(() => {
        return problems.filter((p) => {
            const matchSearch = !search ||
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.mahalla.toLowerCase().includes(search.toLowerCase());
            const matchOrg = orgFilter === "Barcha" || p.org === orgFilter;
            return matchSearch && matchOrg;
        });
    }, [problems, search, orgFilter]);
    const columns = useMemo(() => {
        return {
            Yangi: filtered.filter((p) => p.status === "Yangi"),
            Yuklandi: filtered.filter((p) => p.status === "Yuklandi"),
            Jarayonda: filtered.filter((p) => p.status === "Jarayonda"),
            Bajarildi: filtered.filter((p) => p.status === "Bajarildi"),
        };
    }, [filtered]);
    const handleDragStart = (event) => {
        const problem = event.active.data.current?.problem;
        setDraggedProblem(problem);
    };
    const handleDragEnd = (event) => {
        const {active, over} = event;
        setDraggedProblem(null);
        if (!over)
            return;
        const problem = active.data.current?.problem;
        const targetStatus = over.id;
        if (!problem || !["Yangi", "Yuklandi", "Jarayonda", "Bajarildi"].includes(targetStatus))
            return;
        if (problem.status === targetStatus)
            return;
        // Yangi → Yuklandi: open modal
        if (problem.status === "Yangi" && targetStatus === "Yuklandi") {
            setPendingProblemId(problem.id);
            setModalOpen(true);
            return;
        }
        // Jarayonda → Bajarildi: direct move
        if (problem.status === "Jarayonda" && targetStatus === "Bajarildi") {
            setProblems((prev) => prev.map((p) => (p.id === problem.id ? {...p, status: "Bajarildi"} : p)));
        }
    };
    const handleStartTask = (problemId) => {
        setProblems((prev) => prev.map((p) => (p.id === problemId ? {...p, status: "Jarayonda"} : p)));
    };
    const handleModalSubmit = () => {
        if (pendingProblemId !== null) {
            setProblems((prev) => prev.map((p) => p.id === pendingProblemId ? {...p, status: "Yuklandi"} : p));
            setPendingProblemId(null);
        }
        setModalOpen(false);
    };
    const handleModalClose = () => {
        setPendingProblemId(null);
        setModalOpen(false);
    };
    return (<DashboardLayout>
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
                <BackButton/>
                <div>
                    <h1 className="text-xl font-extrabold text-foreground tracking-tight">Shikoyatlar Boshqaruvi</h1>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Drag & drop orqali muammolarni
                        boshqaring</p>
                </div>
            </div>

            <div className="gov-card mb-4 !p-2.5">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                        <input type="text" placeholder="Muammo yoki mahalla qidirish..." value={search}
                               onChange={(e) => setSearch(e.target.value)}
                               className="w-full h-9 pl-9 pr-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"/>
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)}
                            className={`h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-medium transition-all ${showFilters ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        <Filter className="w-3.5 h-3.5"/>
                        Filtr
                        <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`}/>
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div initial={{height: 0, opacity: 0}} animate={{height: "auto", opacity: 1}}
                                    exit={{height: 0, opacity: 0}} transition={{duration: 0.2}}
                                    className="overflow-hidden">
                            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
                                <span className="text-xs font-medium text-muted-foreground">Tashkilot:</span>
                                <select value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)}
                                        className="h-8 px-2.5 rounded-lg bg-muted border-0 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none">
                                    <option value="Barcha">Barcha tashkilotlar</option>
                                    {organizations.map((o) => (<option key={o} value={o}>{o}</option>))}
                                </select>
                            </div>
                        </motion.div>)}
                </AnimatePresence>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                    {columnConfig.map((col) => (<DroppableColumn key={col.status} id={col.status} config={col}
                                                                 count={columns[col.status].length}>
                        <AnimatePresence mode="popLayout">
                            {columns[col.status].map((problem) => (
                                <motion.div key={problem.id} layout initial={{opacity: 0, scale: 0.9}}
                                            animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.9}}
                                            transition={{duration: 0.2}}>
                                    <DraggableCard problem={problem} showSource={col.status === "Yangi"}
                                                   onStart={col.status === "Yuklandi" ? () => handleStartTask(problem.id) : undefined}/>
                                </motion.div>))}
                        </AnimatePresence>
                        {columns[col.status].length === 0 && (
                            <div className="flex-1 flex items-center justify-center py-12">
                                <p className="text-xs text-muted-foreground/50 font-medium">Bo'sh</p>
                            </div>)}
                    </DroppableColumn>))}
                </div>

                <DragOverlay dropAnimation={{duration: 200, easing: "ease"}}>
                    {draggedProblem ? <OverlayCard problem={draggedProblem}/> : null}
                </DragOverlay>
            </DndContext>
        </div>

        <AssignTaskModal open={modalOpen} onClose={handleModalClose} onSubmit={handleModalSubmit}/>
    </DashboardLayout>);
};
export default Shikoyatlar;
