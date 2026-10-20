import { useEffect, useRef, useState } from "react";
import "./lectorPantalla.css";

const SELECTORES =
    "#sinopsisTitulo, .introStarWars .content p, .coleccion h2, .video-card p, .textoAudio";

const VEL_MIN = 0.5;
const VEL_MAX = 2;
const PASO = 0.25;

function LectorPantalla() {
    const [abierto, setAbierto] = useState(false);
    const [estado, setEstado] = useState("parado");
    const [velocidad, setVelocidad] = useState(1);

    const contenedor = useRef(null);
    const textoRef = useRef("");
    const posRef = useRef(0);
    const tokenRef = useRef(0);

    const soportado = "speechSynthesis" in window;

    useEffect(() => {
        function alPulsarTecla(e) {
            if (e.key === "Escape") setAbierto(false);
        }
        function alHacerClic(e) {
            if (contenedor.current && !contenedor.current.contains(e.target)) {
                setAbierto(false);
            }
        }
        document.addEventListener("keydown", alPulsarTecla);
        document.addEventListener("mousedown", alHacerClic);
        return () => {
            document.removeEventListener("keydown", alPulsarTecla);
            document.removeEventListener("mousedown", alHacerClic);
            window.speechSynthesis?.cancel();
        };
    }, []);

    if (!soportado) return null;

    function obtenerTexto() {
        const seleccion = window.getSelection().toString().trim();
        if (seleccion) return seleccion;

        return [...document.querySelectorAll(SELECTORES)]
            .map((el) => el.textContent.trim())
            .filter(Boolean)
            .join(". ");
    }

    function hablar(texto, desde, rate) {
        const synth = window.speechSynthesis;
        synth.cancel();
        const token = ++tokenRef.current;

        const voz = new SpeechSynthesisUtterance(texto.slice(desde));
        voz.lang = "es-ES";
        voz.rate = rate;
        voz.onboundary = (e) => {
            posRef.current = desde + e.charIndex;
        };
        voz.onend = voz.onerror = () => {
            if (token === tokenRef.current) setEstado("parado");
        };

        synth.speak(voz);
        setEstado("leyendo");
    }

    // Un solo botón: leer → pausar → reanudar
    function alternar() {
        const synth = window.speechSynthesis;

        if (estado === "parado") {
            textoRef.current = obtenerTexto();
            posRef.current = 0;
            hablar(textoRef.current, 0, velocidad);
        } else if (estado === "leyendo") {
            synth.pause();
            setEstado("pausado");
        } else {
            synth.resume();
            setEstado("leyendo");
        }
    }

    // Parar y volver al principio
    function detener() {
        tokenRef.current++;
        window.speechSynthesis.cancel();
        posRef.current = 0;
        setEstado("parado");
    }

    function cambiarVelocidad(nueva) {
        const v = Math.min(VEL_MAX, Math.max(VEL_MIN, Math.round(nueva * 100) / 100));
        setVelocidad(v);
        // Si está hablando (o en pausa), continúa desde donde iba con la nueva velocidad
        if (estado !== "parado") hablar(textoRef.current, posRef.current, v);
    }

    const etiquetaPlay =
        estado === "parado" ? "Leer la página en voz alta"
            : estado === "leyendo" ? "Pausar lectura"
                : "Reanudar lectura";

    return (
        <div className="lector" ref={contenedor}>
            <div className="lector-barra">
                <button onClick={alternar} aria-label={etiquetaPlay}>
                    <span aria-hidden="true">{estado === "leyendo" ? "⏸" : "▶"}</span>
                </button>

                <button
                    onClick={detener}
                    disabled={estado === "parado"}
                    aria-label="Detener y volver al principio"
                >
                    <span aria-hidden="true">⏹</span>
                </button>

                <button
                    onClick={() => setAbierto(!abierto)}
                    aria-expanded={abierto}
                    aria-controls="panelLector"
                    aria-label="Ajustes de velocidad de lectura"
                >
                    <span aria-hidden="true">{abierto ? "✕" : "☰"}</span>
                </button>
            </div>

            {abierto && (
                <div id="panelLector" className="lector-panel" role="group" aria-label="Velocidad de lectura">
                    <div className="lector-fila lector-velocidad">
                        <button
                            onClick={() => cambiarVelocidad(velocidad - PASO)}
                            disabled={velocidad <= VEL_MIN}
                            aria-label="Más lento"
                        >
                            🐢 −
                        </button>
                        <span aria-live="polite">
                            Velocidad: <strong>{velocidad.toFixed(2)}x</strong>
                        </span>
                        <button
                            onClick={() => cambiarVelocidad(velocidad + PASO)}
                            disabled={velocidad >= VEL_MAX}
                            aria-label="Más rápido"
                        >
                            🐇 +
                        </button>
                    </div>

                    <p className="lector-ayuda">
                        Selecciona un texto para leer solo ese fragmento.
                    </p>
                </div>
            )}
        </div>
    );
}

export default LectorPantalla;