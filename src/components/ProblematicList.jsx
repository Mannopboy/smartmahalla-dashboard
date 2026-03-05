import { useNavigate } from "react-router-dom";
import { topMahallas } from "@/data/mahallas";
const getColor = (count) => {
    if (count >= 70)
        return "hsl(0, 84%, 60%)";
    if (count >= 40)
        return "hsl(38, 92%, 50%)";
    return "hsl(142, 71%, 45%)";
};
const ProblematicList = () => {
    const navigate = useNavigate();
    return (<div className="gov-card h-full flex flex-col">
        <h2 className="text-lg font-semibold text-foreground mb-4">Eng Muammoli Mahallalar</h2>
        <div className="flex-1 space-y-3 overflow-y-auto">
            {topMahallas.map((item) => (<div key={item.id} onClick={() => navigate(`/mahallalar/${item.id}`)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: getColor(item.complaints) }}/>
                <span className="flex-1 text-sm font-medium text-foreground truncate">
              {item.name}
            </span>
                <span className="text-sm font-semibold text-muted-foreground">
              {item.complaints}
            </span>
            </div>))}
        </div>
    </div>);
};
export default ProblematicList;
