import {LayoutDashboard, BarChart3, Settings, Landmark, Sparkles,} from "lucide-react";
import {NavLink} from "@/components/NavLink";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

const items = [
    {title: "Dashboard", url: "/", icon: LayoutDashboard},
    {title: "Tashkilotlar", url: "/tashkilotlar", icon: Landmark},
    {title: "Analitika", url: "/analitika", icon: BarChart3},
    {title: "Sozlamalar", url: "/sozlamalar", icon: Settings},
];

export function AppSidebar() {
    const {state} = useSidebar();
    const collapsed = state === "collapsed";
    return (<Sidebar collapsible="icon" className="border-r ">
        <SidebarContent className="pt-4">
            {!collapsed ? (<div className="px-4 pb-4 mb-2 border-b ">
                <div className="flex items-center gap-2.5">
                    <div className="relative">
                        <div
                            className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary to-warning opacity-75 blur-sm"/>
                        <div
                            className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-primary-foreground"/>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span
                            className="text-base font-extrabold text-foreground tracking-tight leading-none">Smart</span>
                        <span className="text-xs font-semibold text-primary tracking-widest uppercase">Mahalla</span>
                    </div>
                </div>

            </div>) : (<div className="flex justify-center pb-4 mb-2 border-b ">
                <div className="relative">
                    <div
                        className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary to-warning opacity-75 blur-sm"/>
                    <div
                        className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary-foreground"/>
                    </div>
                </div>

            </div>)}

            <SidebarGroup>
                <SidebarGroupLabel
                    className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold">
                    Asosiy
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item) => (<SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <NavLink to={item.url} end={item.url === "/"}
                                         className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted transition-all duration-200"
                                         activeClassName="bg-primary/10 text-primary font-semibold shadow-sm">
                                    <item.icon className="h-[18px] w-[18px] shrink-0"/>
                                    {!collapsed && <span className="text-sm">{item.title}</span>}
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>);
}