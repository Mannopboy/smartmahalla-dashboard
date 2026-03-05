import { Search, User, Sparkles, MapPin } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationDropdown from "@/components/NotificationDropdown";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const DashboardHeader = () => {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
      hour < 12 ? "Xayrli tong" : hour < 18 ? "Xayrli kun" : "Xayrli kech";

  return (
      <header className="sticky top-0 z-50 border-b border-border overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-warning to-success" />

        <div className="bg-card/80 backdrop-blur-xl">
          <div className="px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">

            {/* Left */}
            <div className="flex items-center gap-3 shrink-0">
              <SidebarTrigger className="h-10 w-10 rounded-xl bg-muted/60 hover:bg-muted transition-colors" />

              <div className="hidden sm:flex flex-col">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium text-muted-foreground">
                  {greeting}
                </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">
                  Chirchiq shahri
                </span>
                </motion.div>
              </div>

              <span className="text-lg font-bold text-foreground sm:hidden">
              SmartMahalla
            </span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg hidden sm:block">
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-warning/20 opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />

                  <input
                      type="text"
                      placeholder="Mahalla, muammo yoki tashkilot qidirish..."
                      className="w-full h-11 pl-10 pr-4 rounded-2xl bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-card transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5 shrink-0">
              <ThemeToggle />
              <NotificationDropdown />

              <div className="ml-1 relative group cursor-pointer">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-warning opacity-75 blur-sm group-hover:opacity-100 transition-opacity" />

                <button className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center ring-2 ring-card">
                  <User className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>
  );
};

export default DashboardHeader;