import { Toaster } from "@/components/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index.jsx";
import Mahallalar from "./pages/Mahallalar.jsx";
import MahallaDetail from "./pages/MahallaDetail.jsx";
import Shikoyatlar from "./pages/Shikoyatlar.jsx";
import Vazifalar from "./pages/Vazifalar.jsx";
import Analitika from "./pages/Analitika.jsx";
import HalQilingan from "./pages/HalQilingan.jsx";
import Tashkilotlar from "./pages/Tashkilotlar.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/mahallalar" element={<Mahallalar />} />
                    <Route path="/mahallalar/:id" element={<MahallaDetail />} />
                    <Route path="/shikoyatlar" element={<Shikoyatlar />} />
                    <Route path="/vazifalar" element={<Vazifalar />} />
                    <Route path="/analitika" element={<Analitika />} />
                    <Route path="/hal-qilingan" element={<HalQilingan />} />
                    <Route path="/tashkilotlar" element={<Tashkilotlar />} />

                    {/* 404 page */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;