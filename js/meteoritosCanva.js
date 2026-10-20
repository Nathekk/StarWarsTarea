const canvas = document.getElementById("espacio");

if (!canvas) {
    console.error("No se encuentra el canvas con id espacio");
} else {
    const ctx = canvas.getContext("2d");

    const nave = {
        x: 0,
        y: 0,
        objetivoX: 0,
        objetivoY: 0,
        tamano: 35,
        velocidad: 0.08
    };

    const estrellas = [];
    const meteoritos = [];
    const laseres = [];

    let ultimoDisparo = 0;

    const imagenNave = new Image();
    imagenNave.src = "./image/naveCanvas.png";

    function ajustarCanvas() {
        const rect = canvas.getBoundingClientRect();
        const escala = window.devicePixelRatio || 1;

        if (rect.width === 0 || rect.height === 0) {
            console.error("El canvas no tiene dimensiones visibles", rect);
            return;
        }

        canvas.width = rect.width * escala;
        canvas.height = rect.height * escala;

        ctx.setTransform(escala, 0, 0, escala, 0, 0);

        nave.x = rect.width / 2;
        nave.y = rect.height / 2;

        if (estrellas.length === 0) {
            for (let i = 0; i < 150; i++) {
                estrellas.push({
                    x: Math.random() * rect.width,
                    y: Math.random() * rect.height,
                    tamano: Math.random() * 1.5 + 0.5,
                    alpha: Math.random()
                });
            }
        }
    }

    function dibujarEstrellas() {
        estrellas.forEach(estrella => {
            ctx.globalAlpha = estrella.alpha;
            ctx.fillStyle = "#eeeeee";
            ctx.beginPath();
            ctx.arc(
                estrella.x,
                estrella.y,
                estrella.tamano,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });

        ctx.globalAlpha = 1;
    }

    function crearMeteorito() {
        return {
            x: Math.random() * canvas.clientWidth,
            y: -Math.random() * canvas.clientHeight,
            radio: Math.random() * 10 + 8,
            velocidad: Math.random() * 1.5 + 0.5,
            rotacion: Math.random() * Math.PI * 2,
            giro: (Math.random() - 0.5) * 0.03,
            vertices: Array.from(
                { length: 9 },
                () => Math.random() * 0.3 + 0.7
            )
        };
    }

    for (let i = 0; i < 10; i++) {
        meteoritos.push(crearMeteorito());
    }

    canvas.addEventListener("mousemove", e => {
        const rect = canvas.getBoundingClientRect();

        nave.objetivoX = e.clientX - rect.left;
        nave.objetivoY = e.clientY - rect.top;
    });

    function dispararLaser() {
        laseres.push({
            x: nave.x,
            y: nave.y - nave.tamano / 2,
            velocidad: 5
        });
    }

    function dibujarMeteorito(meteorito) {
        ctx.save();
        ctx.translate(meteorito.x, meteorito.y);
        ctx.rotate(meteorito.rotacion);

        ctx.fillStyle = "#777";
        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 1.5;

        ctx.beginPath();

        meteorito.vertices.forEach((vertice, i) => {
            const angulo = i * Math.PI * 2 / meteorito.vertices.length;
            const x = Math.cos(angulo) * meteorito.radio * vertice;
            const y = Math.sin(angulo) * meteorito.radio * vertice;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    function dibujarLaser(laser) {
        ctx.save();
        ctx.strokeStyle = "#00ffff";
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.x, laser.y - 12);
        ctx.stroke();

        ctx.restore();
    }

    function dibujarNave() {
        if (imagenNave.complete && imagenNave.naturalWidth > 0) {
            ctx.save();
            ctx.translate(nave.x, nave.y);
            ctx.rotate(Math.PI / 2);

            ctx.drawImage(
                imagenNave,
                -nave.tamano / 2,
                -nave.tamano / 2,
                nave.tamano,
                nave.tamano
            );

            ctx.restore();
        } else {
            ctx.fillStyle = "#f9dc4a";
            ctx.beginPath();
            ctx.moveTo(nave.x, nave.y - nave.tamano / 2);
            ctx.lineTo(nave.x - nave.tamano / 2, nave.y + nave.tamano / 2);
            ctx.lineTo(nave.x + nave.tamano / 2, nave.y + nave.tamano / 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function actualizarMeteoritos() {
        meteoritos.forEach(meteorito => {
            meteorito.y += meteorito.velocidad;
            meteorito.rotacion += meteorito.giro;

            if (meteorito.y - meteorito.radio > canvas.clientHeight) {
                Object.assign(meteorito, crearMeteorito());
            }
        });
    }

    function actualizarLaseres() {
        for (let i = laseres.length - 1; i >= 0; i--) {
            const laser = laseres[i];
            laser.y -= laser.velocidad;

            if (laser.y < 0) {
                laseres.splice(i, 1);
                continue;
            }

            for (let j = meteoritos.length - 1; j >= 0; j--) {
                const meteorito = meteoritos[j];

                if (
                    Math.hypot(
                        laser.x - meteorito.x,
                        laser.y - meteorito.y
                    ) < meteorito.radio
                ) {
                    meteoritos.splice(j, 1);
                    meteoritos.push(crearMeteorito());
                    laseres.splice(i, 1);
                    break;
                }
            }
        }
    }

    function animar() {
        const ancho = canvas.clientWidth;
        const alto = canvas.clientHeight;

        ctx.clearRect(0, 0, ancho, alto);

        dibujarEstrellas();

        nave.x += (nave.objetivoX - nave.x) * nave.velocidad;
        nave.y += (nave.objetivoY - nave.y) * nave.velocidad;

        nave.x = Math.max(nave.tamano / 2, Math.min(ancho - nave.tamano / 2, nave.x));
        nave.y = Math.max(nave.tamano / 2, Math.min(alto - nave.tamano / 2, nave.y));

        if (Date.now() - ultimoDisparo > 250) {
            dispararLaser();
            ultimoDisparo = Date.now();
        }

        actualizarMeteoritos();
        actualizarLaseres();

        meteoritos.forEach(dibujarMeteorito);
        laseres.forEach(dibujarLaser);
        dibujarNave();

        requestAnimationFrame(animar);
    }

    ajustarCanvas();

    nave.objetivoX = canvas.clientWidth / 2;
    nave.objetivoY = canvas.clientHeight / 2;

    window.addEventListener("resize", ajustarCanvas);

    animar();
}