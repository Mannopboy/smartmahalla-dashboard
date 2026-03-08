import { Toaster } from "@/components/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index.jsx";
import Mahallalar from "./pages/Mahallalar.jsx";
import MahallaDetail from "./pages/MahallaDetail.jsx";
import Shikoyatlar from "./pages/Shikoyatlar.jsx";
import Vazifalar from "./pages/Vazifalar.jsx";
import Analitika from "./pages/Analitika.jsx";
import HalQilingan from "./pages/HalQilingan.jsx";
import Tashkilotlar from "./pages/Tashkilotlar.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AppErrorBoundary from "@/components/AppErrorBoundary.jsx";
import { getUser } from "@/lib/api.js";

const ProtectedRoute = ({ children }) => {
    const user = getUser();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
            <AppErrorBoundary>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />

                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            
                            <Route path="/" element={
                                <ProtectedRoute><Index /></ProtectedRoute>
                            } />
                            <Route path="/mahallalar" element={
                                <ProtectedRoute><Mahallalar /></ProtectedRoute>
                            } />
                            <Route path="/mahallalar/:id" element={
                                <ProtectedRoute><MahallaDetail /></ProtectedRoute>
                            } />
                            <Route path="/shikoyatlar" element={
                                <ProtectedRoute><Shikoyatlar /></ProtectedRoute>
                            } />
                            <Route path="/vazifalar" element={
                                <ProtectedRoute><Vazifalar /></ProtectedRoute>
                            } />
                            <Route path="/analitika" element={
                                <ProtectedRoute><Analitika /></ProtectedRoute>
                            } />
                            <Route path="/hal-qilingan" element={
                                <ProtectedRoute><HalQilingan /></ProtectedRoute>
                            } />
                            <Route path="/tashkilotlar" element={
                                <ProtectedRoute><Tashkilotlar /></ProtectedRoute>
                            } />
                            <Route path="/register" element={
                                <ProtectedRoute><Register /></ProtectedRoute>
                            } />

                            {/* 404 page */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
        </TooltipProvider>
    </AppErrorBoundary>
</QueryClientProvider>
);

export default App;