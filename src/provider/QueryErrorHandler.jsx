import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export function QueryErrorHandler() {
    const queryClient = useQueryClient();
    const { logout } = useAuth();

    useEffect(() => {
        const handleError = (error) => {
            if (error?.status === 403) {
                logout();
            }
        };

        const unsubscribeQueries = queryClient.getQueryCache().subscribe((event) => {
            const error = event?.query?.state?.error;
            if (error) handleError(error);
        });

        const unsubscribeMutations = queryClient.getMutationCache().subscribe((event) => {
            const error = event?.mutation?.state?.error;
            if (error) handleError(error);
        });

        return () => {
            unsubscribeQueries();
            unsubscribeMutations();
        };
    }, [queryClient, logout]);

    return null;
}