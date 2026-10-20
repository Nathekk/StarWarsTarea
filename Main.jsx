import React from "react";
import { createRoot } from "react-dom/client";
import BotonTamano from "./components/botonTamano";
import BotonCambiaPanel from "./components/panelExplicativoAudio";
import IntroStarWars from "./components/sinopsisStarWars";

createRoot(document.getElementById("botonTamano")).render(
    <BotonTamano />
);

createRoot(document.getElementById("panelAudio")).render(
    <BotonCambiaPanel />
);

createRoot(document.getElementById("sinopsis")).render(
    <IntroStarWars />
);