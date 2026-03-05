import { Bell, MessageSquareWarning, Clock, AlertTriangle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const notifications = [
  {
    icon: MessageSquareWarning,
    message: "Yangi shikoyat qo'shildi",
    time: "5 daqiqa oldin",
    color: "text-destructive",
  },
  {
    icon: Clock,
    message: "Vazifa muddati yaqinlashmoqda",
    time: "1 soat oldin",
    color: "text-warning",
  },
  {
    icon: AlertTriangle,
    message: "Mahalla muammo darajasi oshdi",
    time: "3 soat oldin",
    color: "text-destructive",
  },
  {
    icon: MessageSquareWarning,
    message: "Kommunal xizmatdan javob keldi",
    time: "5 soat oldin",
    color: "text-primary",
  },
];

const NotificationDropdown = () => {
  return (
      <Popover>
        <PopoverTrigger asChild>
          <button className="relative w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-secondary transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">
              Bildirishnomalar
            </h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n, i) => (
                <div
                    key={i}
                    className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b border-border last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <n.icon className={`w-4 h-4 ${n.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {n.time}
                    </p>
                  </div>
                </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
  );
};

export default NotificationDropdown;