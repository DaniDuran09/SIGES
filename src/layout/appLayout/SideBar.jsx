import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useState, useEffect } from "react";
import { Colors } from "../../assets/Colors.js";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { PiBuildingsBold } from "react-icons/pi";
import { AiOutlineLaptop } from "react-icons/ai";
import { LuUsers } from "react-icons/lu";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsGear } from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiLogOut, FiGrid } from "react-icons/fi";
import styles from "./SideBar.module.css";
import { useAuth } from "../../context/AuthContext.jsx";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";

function SideBar() {
    const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const { data: b_user } = useQuery({
        queryKey: ["GetUser"],
        queryFn: () =>
            apiFetch(`/users/me`, {
                method: "GET",
            }),
        retry: (failureCount, error) => error.status !== 404,
    });

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        const handleResize = () => {
            setCollapsed(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const first_name_only = b_user?.firstName ? b_user.firstName.split(' ')[0] : "Cargando...";
    const last_name_only = b_user?.lastName ? b_user.lastName.split(' ')[0] : "";

    return (
        <Sidebar
            collapsed={collapsed}
            width="190px"
            collapsedWidth="65px"
            rootStyles={{
                backgroundColor: Colors.primaryColor,
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                ".ps-sidebar-container": {
                    backgroundColor: Colors.primaryColor,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }
            }}
        >
            <div
                style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap: "10px"
                }}
            >
                <FaBuilding size={28} />
                {!collapsed && (
                    <div>
                        <h3 style={{ margin: 0 }}>SIGES</h3>
                        <p style={{ margin: 0, fontSize: "12px" }}>
                            Sistema de Gestión
                        </p>
                    </div>
                )}
            </div>

            <div style={{ flex: 1 }}>
                <Menu
                    menuItemStyles={{
                        button: ({ active }) => ({
                            backgroundColor: active && "#B19CD9",
                        }),
                    }}
                >
                    <MenuItem active={location.pathname === "/"} onClick={() => navigate("/")}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FiHome className={styles.icon} />
                            {!collapsed && <p>Inicio</p>}
                        </div>
                    </MenuItem>

                    <MenuItem active={location.pathname === "/requests"} onClick={() => navigate("/requests")}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <HiOutlineClipboardDocumentList className={styles.icon} />
                            {!collapsed && <p>Solicitudes</p>}
                        </div>
                    </MenuItem>

                    <MenuItem active={location.pathname === "/spaces"} onClick={() => navigate("/spaces")}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <PiBuildingsBold className={styles.icon} />
                            {!collapsed && <p>Espacios</p>}
                        </div>
                    </MenuItem>

                    <MenuItem active={location.pathname === "/equipment"} onClick={() => navigate("/equipment")}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <AiOutlineLaptop className={styles.icon} />
                            {!collapsed && <p>Equipos</p>}
                        </div>
                    </MenuItem>

                    <MenuItem active={location.pathname === "/users"} onClick={() => navigate("/users")}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <LuUsers className={styles.icon} />
                            {!collapsed && <p>Usuarios</p>}
                        </div>
                    </MenuItem>

                    <MenuItem active={location.pathname === "/history"} onClick={() => navigate("/history")}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <HiOutlineDocumentText className={styles.icon} />
                            {!collapsed && <p>Historial</p>}
                        </div>
                    </MenuItem>

                    <MenuItem active={location.pathname === "/configuration"} onClick={() => navigate("/configuration")}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <BsGear className={styles.icon} />
                            {!collapsed && <p>Configuración</p>}
                        </div>
                    </MenuItem>
                    
                    <MenuItem active={location.pathname === "/catalogue"} onClick={() => navigate("/catalogue")}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FiGrid className={styles.icon} />
                            {!collapsed && <p>Catálogo</p>}
                        </div>
                    </MenuItem>
                </Menu>
            </div>

            <div
                style={{
                    padding: "15px 12px",
                    backgroundColor: "#D6D6E7",
                    margin: "10px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    flexDirection: collapsed ? "column" : "row",
                    gap: collapsed ? "8px" : "12px",
                }}
            >
                <img
                    src={b_user?.profilePictureUrl || "https://i.pravatar.cc/40"}
                    alt="usuario"
                    style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover"
                    }}
                />

                {!collapsed && (
                    <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                            <p
                                title={b_user?.firstName}
                                style={{
                                    margin: 0,
                                    fontWeight: "bold",
                                    fontSize: "11px",
                                    color: "#333",
                                    lineHeight: "1.1",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}
                            >
                                {first_name_only}
                            </p>
                            <p
                                title={b_user?.lastName}
                                style={{
                                    margin: 0,
                                    fontWeight: "bold",
                                    fontSize: "11px",
                                    color: "#333",
                                    lineHeight: "1.1",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}
                            >
                                {last_name_only}
                            </p>
                        </div>
                        <p style={{ margin: "3px 0 0 0", fontSize: "11px", color: "#666", textTransform: "capitalize" }}>
                            {b_user?.role?.toLowerCase() || ""}
                        </p>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    style={{
                        border: "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px",
                        width: "auto",
                        minWidth: "24px"
                    }}
                >
                    <FiLogOut style={{ width: "20px", height: "20px", color: "#333" }} />
                </button>
            </div>
        </Sidebar>
    );
}

export default SideBar;