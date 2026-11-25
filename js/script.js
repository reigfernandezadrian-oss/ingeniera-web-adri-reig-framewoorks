// ---------- Menú móvil ----------
const toggle = document.getElementById("toggle-menu");
const menu = document.getElementById("menu-principal");

function cerrarMenu() {
    menu.classList.remove("abierto");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
}

if (toggle && menu) {
    toggle.addEventListener("click", () => {
        const abierto = menu.classList.toggle("abierto");
        toggle.setAttribute("aria-expanded", abierto);
        toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", cerrarMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });
}

// ---------- Menú de Nochebuena: plegable solo en móvil ----------
const grupos = document.querySelectorAll(".carta-menu .grupo");
const escritorio = window.matchMedia("(min-width: 768px)");

function ajustarCarta() {
    grupos.forEach((g, i) => { g.open = escritorio.matches || i === 0; });
}
ajustarCarta();
escritorio.addEventListener("change", ajustarCarta);

// ---------- Nieve navideña ----------
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
    setInterval(crearCopo, 700);
}

// ---------- Cuenta atrás hasta Nochebuena ----------
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

// ---------- Formulario de reserva ----------
const form = document.getElementById("form-reserva");
const mensaje = document.getElementById("mensaje-reserva");
const fecha = document.getElementById("fecha");
const tipo = document.getElementById("tipo");
const comensalesSel = document.getElementById("comensales");

function fechaLocalISO(d) {
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
const hoy = fechaLocalISO(new Date());
if (fecha) fecha.min = hoy;

// Botones y tarjetas que preseleccionan fecha, ocasión y comensales
document.querySelectorAll("[data-fecha], [data-tipo], [data-comensales]").forEach((el) => {
    el.addEventListener("click", () => {
        if (el.dataset.comensales && comensalesSel) comensalesSel.value = el.dataset.comensales;
        if (el.dataset.tipo && tipo) tipo.value = el.dataset.tipo;
        if (el.dataset.fecha && fecha) {
            const [mes, dia] = el.dataset.fecha.split("-").map(Number);
            let anio = new Date().getFullYear();
            if (fechaLocalISO(new Date(anio, mes - 1, dia)) < hoy) anio++;
            fecha.value = fechaLocalISO(new Date(anio, mes - 1, dia));
        }
    });
});

function error(texto, campo) {
    mensaje.className = "mt-3 mb-0 text-center fw-semibold error";
    mensaje.textContent = texto;
    if (campo) {
        campo.classList.add("invalido");
        campo.focus();
    }
    return false;
}

if (form) {
    form.addEventListener("input", (e) => e.target.classList.remove("invalido"));

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre");
        const telefono = document.getElementById("telefono");
        const email = document.getElementById("email");
        const hora = document.getElementById("hora");
        const privacidad = document.getElementById("privacidad");
        form.querySelectorAll(".invalido").forEach((c) => c.classList.remove("invalido"));

        if (!nombre.value.trim()) return error("Escribe tu nombre completo.", nombre);
        const tel = telefono.value.replace(/[\s.-]/g, "");
        if (!/^(\+34)?[6-9]\d{8}$/.test(tel)) return error("Revisa el teléfono: debe tener 9 cifras, por ejemplo 600 123 456.", telefono);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) return error("Revisa el email: parece incompleto.", email);
        if (!fecha.value) return error("Elige una fecha.", fecha);
        if (fecha.value < hoy) return error("Elige una fecha a partir de hoy.", fecha);
        // Martes a domingo: el lunes está cerrado
        if (new Date(fecha.value + "T12:00").getDay() === 1) return error("Los lunes cerramos. Elige otro día.", fecha);
        if (!privacidad.checked) return error("Acepta el uso de tus datos para poder reservar.", privacidad);

        const comensales = comensalesSel.value;
        const [y, m, d] = fecha.value.split("-");
        mensaje.className = "mt-3 mb-0 text-center fw-semibold ok";
        mensaje.textContent = `🎄 ¡Gracias, ${nombre.value.trim()}! Mesa para ${comensales} el ${d}/${m}/${y} a las ${hora.value}. Te confirmaremos por email y teléfono.`;
        form.reset();
    });
}
