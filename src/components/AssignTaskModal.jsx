import { useState } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";

const AssignTaskModal = ({ open, onClose, onSubmit }) => {
    const [org, setOrg] = useState("");
    const [deadline, setDeadline] = useState("");
    const [comment, setComment] = useState("");

    const { data: organizations = [] } = useApiData(api.getOrganizations, []);

    if (!open) return null;

    const handleSubmit = () => {
        onSubmit?.({ org, deadline, comment });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-card rounded-2xl w-full max-w-md p-6 shadow-xl">

                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Vazifa Yuklash</h3>
                    <button onClick={onClose}>
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Tashkilot</label>
                        <select
                            value={org}
                            onChange={(e) => setOrg(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-muted border-0 text-sm"
                        >
                            <option value="">Tashkilotni tanlang</option>
                            {organizations.map((o) => (
                                <option key={o.id} value={o.name}>
                                    {o.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Muddat</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-muted border-0 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Izoh</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2.5 rounded-xl bg-muted border-0 text-sm"
                        />
                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="h-10 px-5 rounded-xl border">
                        Bekor qilish
                    </button>
                    <button onClick={handleSubmit} className="h-10 px-5 rounded-xl bg-primary text-primary-foreground">
                        Yuborish
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AssignTaskModal;