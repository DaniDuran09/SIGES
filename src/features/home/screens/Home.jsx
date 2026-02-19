import { IoMdNotificationsOutline } from "react-icons/io";

const options = [
    {
        name: 'SOLICITUDES PENDIENTES',
        number: 5,
        stats: '20%',
        type: 'positive'
    },
    {
        name: 'ESPACIOS DISPONIBLES',
        number: 8 / 5,
        stats: '+3 DESDE AYER',
        type: 'positive'
    },
    {
        name: 'ESPACIOS DISPONIBLES',
        number: 8 / 5,
        stats: '+3 DESDE AYER',
        type: 'positive'
    },
    {
        name: 'ESPACIOS DISPONIBLES',
        number: 8 / 5,
        stats: '-3 DESDE AYER',
        type: 'negative'
    },
]

function Home() {
    return (
        <div style={{ width: '100%', height: '100%' }}>

            <h4>Buenos dias</h4>
            {/*TOP BAR*/}

            <div style={{ display: 'flex', padding: '10px' }}>
                <div style={{ flex: 2 }}>
                    <h1 style={{ fontSize: '40px' }}>Panel de control</h1>
                </div>
                <div style={{ width: '10%', display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                    <button style={{ backgroundColor: 'white', border: '1px solid', borderRadius: 20, width: '60px', height: '60px', position: 'relative' }}>
                        {/*NOTIFICATIONS */}
                        {true && (
                            <div style={{ width: '20px', height: '20px', backgroundColor: '#FF9B85', borderRadius: 50, position: 'absolute', top: '0', right: '0' }} />
                        )}
                        <IoMdNotificationsOutline style={{ width: '30px', height: '30px' }} />
                    </button>
                    <div>
                        <button style={{ backgroundColor: '#6B5B95', borderRadius: 20 }}>
                            <h3 style={{ color: 'white', fontSize: '20px' }}>+ Nueva Solicitud</h3>
                        </button>
                    </div>
                </div>
            </div>

            {/* OPTIONS*/}
            <div style={{ display: 'flex', padding: '10px', justifyContent: 'space-between' }}>
                {options.map((option, index) => (
                    <div key={index} style={{ width: '20%', borderRadius: 10, border: '1px solid', padding: '10px' }} >
                        <h3>{option.name}</h3>
                        <h1>{option.number}</h1>
                        <p style={{ color: option.type === 'positive' ? 'green' : 'red' }} >{option.stats}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}
export default Home;