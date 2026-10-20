import React from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import  BotonTamano from "./components/botonTamano";
import IntroStarWars from "./components/sinopsisStarWars";

const App = () => {
    return(
        <>
            <div className="App">
                <header className="App-header">
                    <BotonTamano />
                    <panelExplicativoAudio />
                    <IntroStarWars />
                </header>
            </div>
        </>
    )
}

export default App;
