// Nieve navideña
function crearCopo() {
    const copo = document.createElement("span");
    copo.className = "copo";
    copo.textContent = "❄";
    copo.style.left = Math.random() * 100 + "vw";
    copo.style.fontSize = 10 + Math.random() * 14 + "px";
    copo.style.opacity = 0.5 + Math.random() * 0.5;
    const duracion = 6 + Math.random() * 6;
    copo.style.animationDuration = duracion + "s";
    document.body.appendChild(copo);
    setTimeout(() => copo.remove(), duracion * 1000);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(crearCopo, 500);
}

// Cuenta atrás hasta Nochebuena
function actualizarCuentaAtras() {
    const el = document.getElementById("countdown");
    if (!el) return;
    const ahora = new Date();
    let nochebuena = new Date(ahora.getFullYear(), 11, 24, 21, 0, 0);
    if (ahora > new Date(ahora.getFullYear(), 11, 26)) {
        nochebuena = new Date(ahora.getFullYear() + 1, 11, 24, 21, 0, 0);
    }
    const dif = nochebuena - ahora;
    if (dif <= 0) {
        el.textContent = "🎅 ¡Feliz Navidad!";
        return;
    }
    const dias = Math.floor(dif / 86400000);
    const horas = Math.floor((dif % 86400000) / 3600000);
    el.textContent = `🎁 Faltan ${dias} días y ${horas} h para Nochebuena`;
}
actualizarCuentaAtras();
setInterval(actualizarCuentaAtras, 60000);

// Formulario de reserva
const form = document.getElementById("form-reserva");
const mensaje = document.getElementById("mensaje-reserva");
const fecha = document.getElementById("fecha");

if (fecha) fecha.min = new Date().toISOString().split("T")[0];

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const comensales = document.getElementById("comensales").value;

        if (!nombre || !fecha.value) {
            mensaje.className = "mt-3 mb-0 text-center fw-semibold error";
            mensaje.textContent = "Escribe tu nombre y elige una fecha.";
            return;
        }
        // Martes a domingo: el lunes está cerrado
        if (new Date(fecha.value + "T12:00").getDay() === 1) {
            mensaje.className = "mt-3 mb-0 text-center fw-semibold error";
            mensaje.textContent = "Los lunes cerramos. Elige otro día.";
            return;
        }
        mensaje.className = "mt-3 mb-0 text-center fw-semibold ok";
        mensaje.textContent = `🎄 ¡Gracias, ${nombre}! Mesa para ${comensales} reservada el ${fecha.value}.`;
        form.reset();
    });
}
