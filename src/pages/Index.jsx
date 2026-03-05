import { useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import StatCards from "@/components/StatCards";
import HeatmapCard from "@/components/HeatmapCard";
import ProblematicList from "@/components/ProblematicList";
import ProblemDetailCard from "@/components/ProblemDetailCard";
import AssignTaskModal from "@/components/AssignTaskModal";

const Index = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <DashboardLayout>
            {/* Stat Cards */}
            <StatCards />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <HeatmapCard />
                </div>

                <div className="lg:col-span-1">
                    <ProblematicList />
                </div>
            </div>

            {/* Problem detail */}
            <ProblemDetailCard onAssign={() => setModalOpen(true)} />

            {/* Assign task modal */}
            <AssignTaskModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </DashboardLayout>
    );
};

export default Index;