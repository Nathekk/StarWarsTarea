import { useEffect, useState } from "react";
import "./IntroStarWars.css";

function IntroStarWars() {
    const [estrellas, setEstrellas] = useState([]);
    const [reinicio, setReinicio] = useState(0);

    useEffect(() => {
        const numStars = 100;
        const nuevasEstrellas = [];

        for (let i = 0; i < numStars; i++) {
            nuevasEstrellas.push({
                top: Math.floor(Math.random() * window.innerHeight),
                left: Math.floor(Math.random() * window.innerWidth)
            });
        }

        setEstrellas(nuevasEstrellas);
    }, []);

    return (
        <>
            <button onClick={() => setReinicio(reinicio + 1)}>
                Reiniciar intro
            </button>

            <div key={reinicio} className="introStarWars">
                {estrellas.map((estrella, i) => (
                    <div
                        key={i}
                        className="star"
                        style={{
                            top: `${estrella.top}px`,
                            left: `${estrella.left}px`
                        }}
                    />
                ))}

                <section className="intro">
                    <p>long time ago, in a galaxy far, </p>
                    <br />
                    <p>far away....</p>
                </section>

                <div className="board">
                    <div className="content">
                        <h2 className="title">Episode III</h2>
                        <h3 className="subtitle">LA VENGANZA DE LOS SITH</h3>
                        <br />
                        <p>
                            ¡Guerra! La República se desmorona bajo los ataques del despiadado Conde Dooku, señor de los Sith. Hay héroes en ambos bandos. El mal está por doquier.
                            En una maniobra audaz, el diabólico líder droide, general Grievous, ha entrado a la capital de la República y secuestrado al canciller Palpatine, líder del Senado Galáctico.
                            Mientras el Ejército Droide Separatista trata de huir de la asediada capital con su valioso rehén, dos caballeros Jedi dirigen una misión desesperada para rescatar al canciller cautivo... 
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default IntroStarWars;