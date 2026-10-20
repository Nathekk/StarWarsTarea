import { useEffect, useState } from "react";

function BotonCambiaPanel() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const audio = document.querySelector(".caja-audio audio");
        const cajaAudio = document.querySelector(".caja-audio");

        function mostrarTexto() {
            setVisible(true);
            cajaAudio.classList.add("audio-reproduciendo");
        }

        audio.addEventListener("play", mostrarTexto);

        return () => {
            audio.removeEventListener("play", mostrarTexto);
        };
    }, []);

    return (
        <>
            {visible && (
                <p className="textoAudio">
                    George Lucas quería que la música tuviera la grandeza de las
                    bandas sonoras clásicas de aventuras y películas épicas, por
                    lo que la colaboración con Williams fue fundamental para
                    crear una identidad sonora reconocible que acompaña a la
                    saga desde 1977. Por eso, incluirla en nuestra web permite
                    a los fans conectar con la historia y revivir la emoción
                    de Star Wars.
                </p>
            )}
        </>
    );
}

export default BotonCambiaPanel;