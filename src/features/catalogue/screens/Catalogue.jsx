import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client.js";
import styles from "../styles/Catalogue.module.css";
import CatalogueTable from "../components/CatalogueTable";
import EditCatalogueModal from "../components/EditCatalogueModal";
import { Alert } from "@mui/material";

const Catalogue = () => {
    const [activeTab, setActiveTab] = useState("buildings");
    const [editModal, setEditModal] = useState({ isOpen: false, item: null });
    const queryClient = useQueryClient();

    const tabs = [
        { id: "buildings", label: "Edificios", endpoint: "/buildings", mutationEndpoint: "/buildings", queryKey: "getBuildings" },
        { id: "spaceTypes", label: "Tipos de Espacios", endpoint: "/space-types", mutationEndpoint: "/space-types", queryKey: "getSpaceTypes" },
        { id: "equipmentTypes", label: "Tipos de Equipos", endpoint: "/equipment-types", mutationEndpoint: "/equipment-types", queryKey: "getEquipmentTypes" },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);

    // GET Query
    const { data: b_data, isLoading, isError, error } = useQuery({
        queryKey: [currentTab.queryKey],
        queryFn: () => apiFetch(currentTab.endpoint, { method: "GET" }),
    });

    // UPDATE Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, name }) =>
            apiFetch(`${currentTab.mutationEndpoint}/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ name })
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [currentTab.queryKey] });
            setEditModal({ isOpen: false, item: null });
        },
        onError: (err) => {
            alert("Error al actualizar: " + err.message);
        }
    });

    // TOGGLE STATUS Mutation
    const toggleStatusMutation = useMutation({
        mutationFn: (item) => {
            const action = item.deletedAt === null ? "deactivate" : "activate";
            return apiFetch(`${currentTab.mutationEndpoint}/${item.id}/${action}`, {
                method: "PATCH",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [currentTab.queryKey] });
        },
        onError: (err) => {
            alert("Error al cambiar estado: " + err.message);
        }
    });

    const handleEditSave = (newName) => {
        if (editModal.item) {
            updateMutation.mutate({ id: editModal.item.id, name: newName });
        }
    };

    const handleToggleStatus = (item) => {
        toggleStatusMutation.mutate(item);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4>ADMINISTRACIÓN</h4>
                <h1>Catálogo</h1>
            </div>

            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            {isError ? (
                <Alert severity="error" style={{ marginBottom: "20px" }}>
                    Error al cargar datos: {error.message}
                </Alert>
            ) : (
                <CatalogueTable
                    data={b_data?.content ? b_data.content : b_data}
                    isLoading={isLoading}
                    onEdit={(item) => setEditModal({ isOpen: true, item })}
                    onDelete={handleToggleStatus}
                />
            )}

            <EditCatalogueModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, item: null })}
                onSave={handleEditSave}
                initialData={editModal.item}
                isSaving={updateMutation.isPending}
            />
        </div>
    );
};

export default Catalogue;
