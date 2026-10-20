import React, { useState } from 'react';
import "./botonTamano.css";

function BotonTamano() {
    const [fontSize, setFontSize] = useState(16);

    function cambiarTamano(nuevoTamano) {
        setFontSize(nuevoTamano);
        document.documentElement.style.fontSize = `${nuevoTamano}px`;
    }

    return (
        <>
            <button className='MasTamano' onClick={() => cambiarTamano(fontSize + 1)}>+</button>
            <button className='MenosTamano' onClick={() => cambiarTamano(fontSize - 1)}>-</button>
        </>
    );
}

export default BotonTamano;