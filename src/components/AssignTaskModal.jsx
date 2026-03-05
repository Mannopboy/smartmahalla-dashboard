import { useState } from "react";
import { X } from "lucide-react";
const organizations = [
    "Kommunal xizmati",
    "Yo'l Tashkiloti",
    "Maktab",
    "Axloq Vakili",
];
const AssignTaskModal = ({ open, onClose, onSubmit }) => {
    const [org, setOrg] = useState("");
    const [deadline, setDeadline] = useState("");
    const [comment, setComment] = useState("");
    if (!open)
        return null;
    const handleSubmit = () => {
        onSubmit?.();
        onClose();
    };
    return (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay */}
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose}/>

        {/* Modal */}
        <div className="relative bg-card rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Vazifa Yuklash</h3>
                <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                    <X className="w-4 h-4 text-muted-foreground"/>
                </button>
            </div>

            <div className="space-y-4">
                {/* Organization */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                        Tashkilot
                    </label>
                    <select value={org} onChange={(e) => setOrg(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none">
                        <option value="">Tashkilotni tanlang</option>
                        {organizations.map((o) => (<option key={o} value={o}>{o}</option>))}
                    </select>
                </div>

                {/* Deadline */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                        Muddat
                    </label>
                    <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"/>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                        Izoh
                    </label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Izoh yozing..." rows={3} className="w-full px-3 py-2.5 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"/>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={onClose} className="h-10 px-5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    Bekor qilish
                </button>
                <button onClick={handleSubmit} className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    Yuborish
                </button>
            </div>
        </div>
    </div>);
};
export default AssignTaskModal;
