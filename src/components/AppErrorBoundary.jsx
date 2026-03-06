import { Component } from "react";

class AppErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("UI crash captured by ErrorBoundary:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-muted px-6">
                    <div className="max-w-lg text-center space-y-3">
                        <h1 className="text-2xl font-bold text-foreground">Sahifada xatolik yuz berdi</h1>
                        <p className="text-muted-foreground">
                            Ma&apos;lumot formati kutilganidan farq qilgani uchun sahifa to&apos;liq ochilmadi.
                            Iltimos sahifani yangilang yoki administratorga murojaat qiling.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundary;
