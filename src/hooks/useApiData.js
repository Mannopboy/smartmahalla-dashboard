import { useEffect, useState, useRef } from "react";

export const useApiData = (fetcher, initialData, deps = []) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isFirstMount = useRef(true);
    const prevDepsRef = useRef(deps);

    const refetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const next = await fetcher();
            setData(next);
        } catch (e) {
            setError(e.message || "Xatolik");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            refetch();
            return;
        }

        const depsChanged = JSON.stringify(deps) !== JSON.stringify(prevDepsRef.current);
        prevDepsRef.current = deps;

        if (depsChanged) {
            refetch();
        }
    }, deps);

    return { data, loading, error, refetch };
};
