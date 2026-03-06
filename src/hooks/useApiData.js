import { useCallback, useEffect, useState } from "react";

export const useApiData = (fetcher, initialData) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
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
    }, [fetcher]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, loading, error, refetch };
};
