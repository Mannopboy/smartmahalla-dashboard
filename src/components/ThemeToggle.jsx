import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
const ThemeToggle = () => {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark]);
    return (<button onClick={() => setDark(!dark)} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-secondary transition-colors" aria-label="Toggle dark mode">
        {dark ? <Sun className="w-4 h-4 text-muted-foreground"/> : <Moon className="w-4 h-4 text-muted-foreground"/>}
    </button>);
};
export default ThemeToggle;
