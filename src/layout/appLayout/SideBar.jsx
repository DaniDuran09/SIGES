import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useState } from "react";
import {Colors} from "../../assets/Colors.js";
import {CiHome} from "react-icons/ci";
import {HiOutlineClipboardDocumentList} from "react-icons/hi2";
import {PiBuildingsBold} from "react-icons/pi";
import {AiOutlineLaptop} from "react-icons/ai";
import  {LuUsers} from "react-icons/lu";
import {HiOutlineDocumentText} from "react-icons/hi";
import {BsGear} from "react-icons/bs";
// import "react-pro-sidebar/dist/css/styles.css";

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
                    height: "100vh"
                }}
            >

                <Menu menuItemStyles={{
                    button: ({ active }) => ({
                        backgroundColor: active && "#B19CD9",
                        "&:hover": {
                            collapsed
                        }
                       // color: active ? "#fff" : "#cbd5e1",
                       // borderRadius: "8px",
                        // margin: "4px 8px",
                    }),

                }}>

                    <MenuItem active={true}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <CiHome/>
                            {!collapsed && (<p>Inicio</p>)}
                        </div>
                    </MenuItem>

                    <MenuItem >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <HiOutlineClipboardDocumentList/>
                            {!collapsed && (<p>Solicitudes</p>)}
                        </div>
                    </MenuItem>

                    <MenuItem>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <PiBuildingsBold/>
                            {!collapsed && (<p>Espacios</p>)}
                        </div>
                    </MenuItem>

                    <MenuItem>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <AiOutlineLaptop/>
                            {!collapsed && (<p>Equipos</p>)}
                        </div>
                    </MenuItem>

                    <MenuItem>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <LuUsers/>
                            {!collapsed && (<p>Usuarios</p>)}
                        </div>
                    </MenuItem>

                    <MenuItem>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <HiOutlineDocumentText/>
                            {!collapsed && (<p>Historial</p>)}
                        </div>
                    </MenuItem>

                    <MenuItem>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <BsGear/>
                            {!collapsed && (<p>Configuración</p>)}
                        </div>
                    </MenuItem>

                </Menu>

            </Sidebar>

        </>

    );

}

export default SideBar;
