import { useState } from "react";

import DashboardLayout from "@/components/DashboardLayout.jsx";
import StatCards from "@/components/StatCards.jsx";
import HeatmapCard from "@/components/HeatmapCard.jsx";
import ProblematicList from "@/components/ProblematicList.jsx";
import ProblemDetailCard from "@/components/ProblemDetailCard.jsx";
import AssignTaskModal from "@/components/AssignTaskModal.jsx";

const Index = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <DashboardLayout>
            <StatCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <HeatmapCard />
                </div>
                <div className="lg:col-span-1">
                    <ProblematicList />
                </div>
            </div>

            <ProblemDetailCard onAssign={() => setModalOpen(true)} />

            <AssignTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </DashboardLayout>
    );
};

export default Index;