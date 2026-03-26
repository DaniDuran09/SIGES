import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export function QueryErrorHandler() {
    const queryClient = useQueryClient();
    const { logout } = useAuth();

    useEffect(() => {
        const unsubscribe = queryClient.getQueryCache().subscribe(event => {
            const error = event?.query?.state?.error;
                if(error.status === 401) {
                    logout();
                }
        });

        return unsubscribe;
    }, [queryClient, logout]);

    return null;
}