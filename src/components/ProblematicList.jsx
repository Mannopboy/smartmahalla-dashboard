import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";

const getColor = (count) =>
    count >= 70
        ? "hsl(0, 84%, 60%)"
        : count >= 40
            ? "hsl(38, 92%, 50%)"
            : "hsl(142, 71%, 45%)";

const ProblematicList = () => {
    const navigate = useNavigate();

    const { data } = useApiData(api.getDashboard, {
        top_mahallas: [],
    });

    return (
        <div className="gov-card h-full flex flex-col">
            <h2 className="text-lg font-semibold text-foreground mb-4">
                Eng Muammoli Mahallalar
            </h2>

            <div className="flex-1 space-y-3 overflow-y-auto">
                {data.top_mahallas?.map((item, index) => (
                    <div
                        key={item.name}
                        onClick={() => navigate(`/mahallalar/${item.id}`)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: getColor(item.complaints) }}
                        >
                            {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {item.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {item.complaints} ta shikoyat
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProblematicList;