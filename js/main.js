let sable = document.querySelector(".sable");
new IntersectionObserver(function (entradas, obs) {
    if (entradas[0].isIntersecting) {
        sable.classList.add("encendido");
        obs.disconnect();
    }
}, {threshold: 0.6}).observe(sable);

let audio = document.querySelector(".caja-audio audio");
let lienzoVis = document.getElementById("visualizador");
let ctx = lienzoVis.getContext("2d");
let analizador, datos;

function ajustar() {
    lienzoVis.width = lienzoVis.clientWidth * devicePixelRatio;
    lienzoVis.height = lienzoVis.clientHeight * devicePixelRatio;
}

ajustar();
addEventListener("resize", ajustar);

audio.addEventListener("play", function () {
    if (analizador) return;
    let ac = new (window.AudioContext || window.webkitAudioContext)();
    let fuente = ac.createMediaElementSource(audio);
    analizador = ac.createAnalyser();
    analizador.fftSize = 128;
    datos = new Uint8Array(analizador.frequencyBinCount);
    fuente.connect(analizador);
    analizador.connect(ac.destination);
});

function dibujar() {
    requestAnimationFrame(dibujar);
    let w = lienzoVis.width, h = lienzoVis.height, n = 48;
    let ancho = w / n;
    ctx.clearRect(0, 0, w, h);
    if (analizador && !audio.paused) analizador.getByteFrequencyData(datos);
    for (let i = 0; i < n; i++) {
        let v = (analizador && !audio.paused) ? datos[i] / 255 : 0.04;
        let alto = Math.max(3, v * h);
        ctx.fillStyle = "#f9dc4a";
        ctx.fillRect(i * ancho + 2, (h - alto) / 2, ancho - 4, alto);
    }
}

dibujar();