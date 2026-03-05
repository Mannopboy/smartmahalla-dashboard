import { SidebarProvider } from "@/components/ui/sidebar.jsx";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";

const DashboardLayout = ({ children }) => {
  return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <DashboardHeader />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
  );
};

export default DashboardLayout;