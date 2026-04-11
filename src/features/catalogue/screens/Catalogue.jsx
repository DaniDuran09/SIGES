import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/client.js";
import styles from "../styles/Catalogue.module.css";
import CatalogueTable from "../components/CatalogueTable";
import EditCatalogueModal from "../components/EditCatalogueModal";
import { Alert, Snackbar } from "@mui/material";

const Catalogue = () => {
    const [activeTab, setActiveTab] = useState("buildings");
    const [editModal, setEditModal] = useState({ isOpen: false, item: null, isNew: false });
    const [errorSnackbar, setErrorSnackbar] = useState({ isOpen: false, message: "" });
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

    // CREATE Mutation
    const createMutation = useMutation({
        mutationFn: (data) =>
            apiFetch(currentTab.mutationEndpoint, {
                method: "POST",
                body: JSON.stringify(data)
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [currentTab.queryKey] });
            setEditModal({ isOpen: false, item: null, isNew: false });
        },
        onError: (err) => {
            alert("Error al crear: " + err.message);
        }
    });

    // UPDATE Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }) =>
            apiFetch(`${currentTab.mutationEndpoint}/${id}`, {
                method: "PUT",
                body: JSON.stringify(data)
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [currentTab.queryKey] });
            setEditModal({ isOpen: false, item: null, isNew: false });
        },
        onError: (err) => {
            alert("Error al actualizar: " + err.message);
        }
    });

    // DELETE Mutation (using deactivate)
    const deleteMutation = useMutation({
        mutationFn: (item) => {
            return apiFetch(`${currentTab.mutationEndpoint}/${item.id}/deactivate`, {
                method: "PATCH",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [currentTab.queryKey] });
        },
        onError: (err) => {
            if (err.status === 409 || (err.message && err.message.includes("409"))) {
                let msg = "No se puede eliminar porque tiene elementos asociados activos.";
                if (activeTab === "buildings") msg = "No se puede eliminar el edificio. Aún tiene espacios vinculados a él. Desactive esos espacios o reubíquelos a otro edificio.";
                if (activeTab === "spaceTypes") msg = "No se puede eliminar el tipo de espacio. Aún tiene espacios vinculados a él. Desactive esos espacios o cambie su tipo.";
                if (activeTab === "equipmentTypes") msg = "No se puede eliminar el tipo de equipo. Aún tiene equipos vinculados a él. Desactive esos equipos o cambie su tipo.";
                setErrorSnackbar({ isOpen: true, message: msg });
            } else {
                setErrorSnackbar({ isOpen: true, message: "Error al eliminar: " + err.message });
            }
        }
    });

    const handleEditSave = (data) => {
        if (editModal.isNew) {
            createMutation.mutate(data);
        } else if (editModal.item) {
            updateMutation.mutate({ id: editModal.item.id, ...data });
        }
    };

    const handleDelete = (item) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar ${item.name}?`)) {
            deleteMutation.mutate(item);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h4>ADMINISTRACIÓN</h4>
                    <h1>Catálogo</h1>
                </div>
                <button
                    className={styles.newButton}
                    onClick={() => setEditModal({ isOpen: true, item: null, isNew: true })}
                    style={{
                        padding: "10px 20px", backgroundColor: "#7F56D9", color: "white",
                        border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
                    }}
                >
                    + Nuevo
                </button>
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
                    onEdit={(item) => setEditModal({ isOpen: true, item, isNew: false })}
                    onDelete={handleDelete}
                />
            )}

            <EditCatalogueModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, item: null, isNew: false })}
                onSave={handleEditSave}
                initialData={editModal.item}
                isSaving={updateMutation.isPending || createMutation.isPending}
                isNew={editModal.isNew}
                hasDescription={activeTab !== "buildings"}
            />

            <Snackbar
                open={errorSnackbar.isOpen}
                autoHideDuration={6000}
                onClose={() => setErrorSnackbar({ ...errorSnackbar, isOpen: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setErrorSnackbar({ ...errorSnackbar, isOpen: false })} severity="error" sx={{ width: '100%' }}>
                    {errorSnackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Catalogue;
