import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useState } from "react";
import { Colors } from "../../assets/Colors.js";
import { CiHome } from "react-icons/ci";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { PiBuildingsBold } from "react-icons/pi";
import { AiOutlineLaptop } from "react-icons/ai";
import { LuUsers } from "react-icons/lu";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsGear } from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";

function SideBar() {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <>
            <Sidebar
                onMouseEnter={() => setCollapsed(false)}
                onMouseLeave={() => setCollapsed(true)}
                collapsed={collapsed}
                rootStyles={{
                    backgroundColor: Colors.primaryColor,
                    height: "100vh",
                    ".ps-sidebar-container": {
                        display: "flex",
                        flexDirection: "column",
                        height: "100%"
                    }
                }}
            >


                <div style={{ //Logo
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap: "10px"
                }}>
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
                                "&:hover": {
                                    collapsed
                                }
                            }),
                        }}
                    >

                        <MenuItem active={true}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <CiHome />
                                {!collapsed && (<p>Inicio</p>)}
                            </div>
                        </MenuItem>

                        <MenuItem>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <HiOutlineClipboardDocumentList />
                                {!collapsed && (<p>Solicitudes</p>)}
                            </div>
                        </MenuItem>

                        <MenuItem>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <PiBuildingsBold />
                                {!collapsed && (<p>Espacios</p>)}
                            </div>
                        </MenuItem>

                        <MenuItem>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <AiOutlineLaptop />
                                {!collapsed && (<p>Equipos</p>)}
                            </div>
                        </MenuItem>

                        <MenuItem>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <LuUsers />
                                {!collapsed && (<p>Usuarios</p>)}
                            </div>
                        </MenuItem>

                        <MenuItem>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <HiOutlineDocumentText />
                                {!collapsed && (<p>Historial</p>)}
                            </div>
                        </MenuItem>

                        <MenuItem>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <BsGear />
                                {!collapsed && (<p>Configuración</p>)}
                            </div>
                        </MenuItem>

                    </Menu>
                </div>


                <div style={{ //User info
                    padding: "15px",
                    backgroundColor: "#D6D6E7",
                    margin: "10px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    justifyContent: collapsed ? "center" : "flex-start"
                }}>

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
        </>
    );
}

export default SideBar;
