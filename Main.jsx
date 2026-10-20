import React from "react";
import {createRoot} from "react-dom/client";
import BotonTamano from "./components/botonTamano";
import BotonCambiaPanel from "./components/panelExplicativoAudio";
import IntroStarWars from "./components/sinopsisStarWars";
import LectorPantalla from "./components/lectorPantalla";

createRoot(document.getElementById("botonTamano")).render(
    <BotonTamano/>
);

createRoot(document.getElementById("panelAudio")).render(
    <BotonCambiaPanel/>
);

createRoot(document.getElementById("sinopsis")).render(
    <IntroStarWars/>
);


createRoot(document.getElementById("lectorPantalla")).render(<LectorPantalla/>);