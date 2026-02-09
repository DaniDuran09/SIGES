import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {useState} from "react";
//import "react-pro-sidebar/dist/css/styles.css";

function SideBar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <button onClick={()=> setCollapsed(!collapsed)}>{collapsed?'mostrar':'ocultar'}</button>
            <Sidebar collapsed={collapsed}>
                <Menu>
                    <MenuItem>Inicio</MenuItem>
                    <MenuItem>Solicitudes</MenuItem>
                    <MenuItem>Espacios</MenuItem>
                    <MenuItem>Equipos</MenuItem>
                    <MenuItem>Usuarios</MenuItem>
                    <MenuItem>Historial</MenuItem>
                    <MenuItem>Configuración</MenuItem>
                </Menu>
            </Sidebar>
        </>

    );
}

export default SideBar;