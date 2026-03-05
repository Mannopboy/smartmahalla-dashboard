import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const BackButton = () => {
    const navigate = useNavigate();
    return (<button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shrink-0">
        <ArrowLeft className="w-5 h-5 text-foreground"/>
    </button>);
};
export default BackButton;
