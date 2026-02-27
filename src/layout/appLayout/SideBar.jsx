import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useState, useEffect } from "react";
import { Colors } from "../../assets/Colors.js";
import { CiHome } from "react-icons/ci";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { PiBuildingsBold } from "react-icons/pi";
import { AiOutlineLaptop } from "react-icons/ai";
import { LuUsers } from "react-icons/lu";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsGear } from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Building_04 from "../../assets/icons/Building_04.svg"
import { FiHome } from "react-icons/fi";
import styles from "./SideBar.module.css"

function SideBar() {
    const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Sidebar
            collapsed={collapsed}
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
            {/* Logo */}
            <div
                style={{
                    padding: "20px",
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

            {/* Menu */}
            <div style={{ flex: 1 }}>
                <Menu
                    menuItemStyles={{
                        button: ({ active }) => ({
                            backgroundColor: active ? "#B19CD9" : undefined,
                        }),
                    }}
                >

                    <MenuItem
                        active={location.pathname === "/"}
                        onClick={() => navigate("/")}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FiHome className={styles.icon} />
                            {!collapsed && <p>Inicio</p>}
                        </div>
                    </MenuItem>

                    <MenuItem
                        active={location.pathname === "/requests"}
                        onClick={() => navigate("/requests")}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <HiOutlineClipboardDocumentList className={styles.icon} />
                            {!collapsed && <p>Solicitudes</p>}
                        </div>
                    </MenuItem>

                    <MenuItem
                        active={location.pathname === "/spaces"}
                        onClick={() => navigate("/spaces")}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <PiBuildingsBold className={styles.icon} />
                            {!collapsed && <p>Espacios</p>}
                        </div>
                    </MenuItem>

                    <MenuItem
                        active={location.pathname === "/equipment"}
                        onClick={() => navigate("/equipment")}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <AiOutlineLaptop className={styles.icon} />
                            {!collapsed && <p>Equipos</p>}
                        </div>
                    </MenuItem>

                    <MenuItem
                        active={location.pathname === "/users"}
                        onClick={() => navigate("/users")}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <LuUsers className={styles.icon} />
                            {!collapsed && <p>Usuarios</p>}
                        </div>
                    </MenuItem>

                    <MenuItem
                        active={location.pathname === "/history"}
                        onClick={() => navigate("/history")}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <HiOutlineDocumentText className={styles.icon} />
                            {!collapsed && <p>Historial</p>}
                        </div>
                    </MenuItem>

                    <MenuItem
                        active={location.pathname === "/configuration"}
                        onClick={() => navigate("/configuration")}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <BsGear className={styles.icon} />
                            {!collapsed && <p>Configuración</p>}
                        </div>
                    </MenuItem>

                </Menu>
            </div>

            {/* User Info */}
            <div
                style={{
                    padding: "15px",
                    backgroundColor: "#D6D6E7",
                    margin: "10px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    justifyContent: collapsed ? "center" : "flex-start",

                }}
            >
                <img
                    src="https://i.pravatar.cc/40"
                    alt="usuario"
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%"
                    }}
                />

                {!collapsed && (
                    <div>
                        <p style={{ margin: 0, fontWeight: "bold" }}>
                            José Domínguez
                        </p>
                        <p style={{ margin: 0, fontSize: "12px" }}>
                            Administrador
                        </p>
                    </div>
                )}
            </div>

        </Sidebar>
    );
}

export default SideBar;
