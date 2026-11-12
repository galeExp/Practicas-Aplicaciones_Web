const contenedor = document.getElementById("contenedor-vistas");

// ==========================================================================
// 1. NAVEGACIÓN Y CARGA DE VISTAS
// ==========================================================================
async function cargarVista(nombreVista) {
    if (!contenedor) return;
    try {
        const res = await fetch(`/Practica04.2/HTML/${nombreVista}.html`);
        if (!res.ok) throw new Error(`No se encontró ${nombreVista}.html`);

        contenedor.innerHTML = await res.text();
        prepararVista(nombreVista);
    } catch (err) {
        console.error(err);
        contenedor.innerHTML = `<p>Error al cargar el apartado: ${nombreVista}</p>`;
    }
}

function prepararVista(vista) {
    if (vista === "registro") {
        contenedor.querySelectorAll(".social-row").forEach(fila => {
            const check = fila.querySelector('input[type="checkbox"]');
            const campo = fila.querySelector('input[type="url"], input[type="file"]');
            if (check && campo) campo.disabled = !check.checked;
        });
    }

    if (vista === "nueva-cita") {
        const inputFecha = document.getElementById("dateAppoiment");
        if (inputFecha) {
            const ahora = new Date();
            ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
            inputFecha.min = ahora.toISOString().slice(0, 16);
        }
    }

    if (vista === "citas") {
        cargarTablaCitas();
    }
}

// ==========================================================================
// 2. DELEGACIÓN DE EVENTOS GLOBALES
// ==========================================================================
if (contenedor) {
    let volumenAnterior = 80;

    // Validaciones y cambios en tiempo real
    contenedor.addEventListener("input", (e) => {
        const el = e.target;

        if (el.id === "FNacimiento") validarFechaNacimiento(el);
        if (el.id === "contrasena" || el.id === "confirmarCont") validarPasswords();
        if (el.id === "placasVehiculo") el.value = el.value.toUpperCase();

        // Configuración en vivo
        if (el.id === "fontColor") document.body.style.color = el.value;
        if (el.id === "backgroundColor") document.body.style.backgroundColor = el.value;
        if (el.id === "soundsVolume") {
            const txt = document.getElementById("volumeValue");
            if (txt) txt.textContent = `${el.value}%`;
        }
    });

    // Checkboxes, radios y carga de archivos
    contenedor.addEventListener("change", (e) => {
        const el = e.target;

        // Habilitar botón Enviar en Registro
        if (el.id === "validado") {
            const btnEnviar = document.getElementById("btnEnviar");
            if (btnEnviar) btnEnviar.disabled = !el.checked;
        }

        // Activar/desactivar inputs de Redes Sociales
        if (el.closest(".social-row") && el.type === "checkbox") {
            const campo = el.closest(".social-row").querySelector('input[type="url"], input[type="file"]');
            if (campo) {
                campo.disabled = !el.checked;
                campo.required = el.checked;
                if (!el.checked) campo.value = "";
            }
        }

        // Vista previa de imágenes (WhatsApp y Foto de perfil)
        if (el.type === "file" && el.files[0]) {
            const imgId = el.id === "imagenWhatsApp" ? "vistaPreviaWhatsApp" : "previewUserPhoto";
            const img = document.getElementById(imgId);
            if (img) {
                img.src = URL.createObjectURL(el.files[0]);
                img.style.display = "block";
            }
        }

        // Filtro Mes / Semana en Citas
        if (el.name === "appimentFilter") {
            const mes = document.getElementById("inputMes");
            const sem = document.getElementById("inputSemana");
            if (mes && sem) {
                mes.disabled = el.value !== "Month";
                sem.disabled = el.value !== "Week";
            }
        }
    });

    // Clics en botones auxiliares
    contenedor.addEventListener("click", (e) => {
        const el = e.target;

        if (el.id === "verCita") filtrarTablaCitas();

        if (el.id === "muteSounds") {
            const slider = document.getElementById("soundsVolume");
            const txt = document.getElementById("volumeValue");
            if (slider && txt) {
                if (slider.value !== "0") {
                    volumenAnterior = slider.value;
                    slider.value = 0;
                    txt.textContent = "0%";
                    el.textContent = "Activar";
                } else {
                    slider.value = volumenAnterior;
                    txt.textContent = `${volumenAnterior}%`;
                    el.textContent = "Silenciar";
                }
            }
        }

        if (el.id === "buttonNext") {
            e.preventDefault();
            alert("Avanzando al siguiente paso de configuración...");
        }
    });

    // Envío de formularios
    contenedor.addEventListener("submit", (e) => {
        e.preventDefault();
        if (e.target.id === "formRegistro") enviarRegistro(e.target);
        if (e.target.id === "formNuevaCita") enviarNuevaCita(e.target);
        if (e.target.id === "formConfiguracion") alert("Configuración guardada correctamente.");
    });

    // Limpieza al resetear formularios
    contenedor.addEventListener("reset", (e) => {
        if (e.target.id === "formRegistro") {
            setTimeout(() => {
                const btn = document.getElementById("btnEnviar");
                const msgEdad = document.getElementById("edadResultado");
                const msgPass = document.getElementById("passFeedback");
                const prevWA = document.getElementById("vistaPreviaWhatsApp");

                if (btn) btn.disabled = true;
                if (msgEdad) {
                    msgEdad.textContent = "Ingresa tu fecha de nacimiento para calcular tu edad.";
                    msgEdad.className = "field-feedback";
                }
                if (msgPass) msgPass.textContent = "";
                if (prevWA) prevWA.style.display = "none";

                e.target.querySelectorAll(".input-error, .input-ok").forEach(i => {
                    i.classList.remove("input-error", "input-ok");
                });
                e.target.querySelectorAll('.social-row input[type="url"], .social-row input[type="file"]').forEach(el => {
                    el.disabled = true;
                    el.required = false;
                });
            }, 0);
        }

        if (e.target.id === "formConfiguracion") {
            setTimeout(() => {
                document.body.style.color = "";
                document.body.style.backgroundColor = "";
                const txt = document.getElementById("volumeValue");
                const btnMute = document.getElementById("muteSounds");
                const prevFoto = document.getElementById("previewUserPhoto");
                if (txt) txt.textContent = "80%";
                if (btnMute) btnMute.textContent = "Silenciar";
                if (prevFoto) prevFoto.style.display = "none";
            }, 0);
        }
    });
}

// ==========================================================================
// 3. FUNCIONES DE VALIDACIÓN DE REGISTRO
// ==========================================================================
function validarFechaNacimiento(input) {
    const feedback = document.getElementById("edadResultado");
    if (!input.value) return false;

    const [anio, mes, dia] = input.value.split("-").map(Number);
    const fechaNac = new Date(anio, mes - 1, dia);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaNac > hoy) {
        marcarCampo(input, false);
        if (feedback) {
            feedback.textContent = "Error: No puedes ingresar una fecha futura.";
            feedback.className = "field-feedback msg-error";
        }
        return false;
    }

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const difMes = hoy.getMonth() - fechaNac.getMonth();
    if (difMes < 0 || (difMes === 0 && hoy.getDate() < fechaNac.getDate())) edad--;

    if (edad < 18) {
        marcarCampo(input, false);
        if (feedback) {
            feedback.textContent = `Tienes ${edad} años. No eres mayor de edad (se requiere tener 18 años o más).`;
            feedback.className = "field-feedback msg-error";
        }
        return false;
    }

    marcarCampo(input, true);
    if (feedback) {
        feedback.textContent = `Tienes ${edad} años. Eres mayor de edad.`;
        feedback.className = "field-feedback msg-ok";
    }
    return true;
}

function validarPasswords() {
    const p1 = document.getElementById("contrasena");
    const p2 = document.getElementById("confirmarCont");
    if (!p1 || !p2) return false;

    let msg = document.getElementById("passFeedback");
    if (!msg) {
        msg = document.createElement("small");
        msg.id = "passFeedback";
        p2.insertAdjacentElement("afterend", msg);
    }

    if (p1.value.length < 6) {
        marcarCampo(p1, false);
        msg.textContent = "La contraseña debe tener al menos 6 caracteres.";
        msg.className = "field-feedback msg-error";
        return false;
    }

    if (p1.value !== p2.value) {
        marcarCampo(p2, false);
        msg.textContent = "Las contraseñas no coinciden.";
        msg.className = "field-feedback msg-error";
        return false;
    }

    marcarCampo(p1, true);
    marcarCampo(p2, true);
    msg.textContent = "Las contraseñas coinciden.";
    msg.className = "field-feedback msg-ok";
    return true;
}

function marcarCampo(input, esValido) {
    input.classList.toggle("input-ok", esValido);
    input.classList.toggle("input-error", !esValido);
}

function enviarRegistro(form) {
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("APaterno");
    const fecha = document.getElementById("FNacimiento");
    const tel = document.getElementById("numTel");
    const hInicio = document.getElementById("horarioInicio");
    const hFin = document.getElementById("horarioFin");
    const cp = document.getElementById("codigoPostal");

    const soloLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!soloLetras.test(nombre.value.trim()) || !soloLetras.test(apellido.value.trim())) {
        alert("El nombre y apellido solo deben contener letras.");
        nombre.focus();
        return;
    }

    if (!validarFechaNacimiento(fecha)) {
        alert("Verifica tu fecha de nacimiento: no puede ser futura y debes ser mayor de edad.");
        fecha.focus();
        return;
    }

    if (tel.value.trim() && tel.value.replace(/\D/g, "").length < 10) {
        alert("El teléfono debe contener al menos 10 dígitos.");
        tel.focus();
        return;
    }

    if (hInicio.value && hFin.value && hFin.value <= hInicio.value) {
        alert("La hora final debe ser posterior a la hora inicial.");
        hFin.focus();
        return;
    }

    if (!validarPasswords()) {
        alert("Revisa que las contraseñas coincidan y tengan al menos 6 caracteres.");
        document.getElementById("confirmarCont").focus();
        return;
    }

    if (cp.value.trim() && !/^\d{5}$/.test(cp.value.trim())) {
        alert("El código postal debe tener exactamente 5 números.");
        cp.focus();
        return;
    }

    alert(`¡Registro completado con éxito para ${nombre.value.trim()}!`);
    form.reset();
}

// ==========================================================================
// 4. FUNCIONES DE CITAS Y NUEVA CITA
// ==========================================================================
function enviarNuevaCita(form) {
    const sucursal = document.getElementById("locations");
    const lista = document.getElementById("locationsList");
    const validas = Array.from(lista.options).map(o => o.value.trim());

    if (!validas.includes(sucursal.value.trim())) {
        alert("Selecciona una sucursal válida de la lista desplegable.");
        sucursal.focus();
        return;
    }

    const selectServ = document.getElementById("tipoServicio");
    const cita = {
        cliente: document.getElementById("clienteCita").value.trim(),
        vehiculo: document.getElementById("vehiculoCita").value.trim(),
        anio: document.getElementById("anioVehiculo").value.trim(),
        placas: document.getElementById("placasVehiculo").value.trim(),
        servicio: selectServ.options[selectServ.selectedIndex].text,
        sucursal: sucursal.value.trim(),
        fecha: document.getElementById("dateAppoiment").value.replace("T", " "),
        descripcion: document.getElementById("descriptionText").value.trim(),
        estatus: "Programada"
    };

    const guardadas = JSON.parse(localStorage.getItem("citasMecaGest")) || [];
    guardadas.push(cita);
    localStorage.setItem("citasMecaGest", JSON.stringify(guardadas));

    alert("¡Cita agendada correctamente!");
    document.querySelectorAll("[data-vista]").forEach(a => a.classList.toggle("activo", a.dataset.vista === "citas"));
    cargarVista("citas");
}

function cargarTablaCitas() {
    const tbody = contenedor.querySelector("table tbody");
    const guardadas = JSON.parse(localStorage.getItem("citasMecaGest")) || [];
    if (!tbody || !guardadas.length) return;

    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    let num = tbody.rows.length + 1;

    guardadas.forEach(c => {
        let f = c.fecha;
        if (f && f.includes("-")) {
            const [fp, hp] = f.split(" ");
            const [a, m, d] = fp.split("-");
            f = `${d}/${meses[Number(m) - 1]}/${a}${hp ? " " + hp : ""}`;
        }
        tbody.insertAdjacentHTML("beforeend", `
            <tr>
                <td>${num++}</td>
                <td><strong>${c.cliente}</strong><br><small>${c.vehiculo} ${c.anio} (${c.placas || "S/P"})</small></td>
                <td><strong>${c.servicio}:</strong> ${c.descripcion}<br><small>Sucursal: ${c.sucursal}</small></td>
                <td>${f}</td>
                <td><span class="badge badge-programada">${c.estatus}</span></td>
            </tr>
        `);
    });
}

function filtrarTablaCitas() {
    const radioMes = document.getElementById("appoimentByMonth");
    const inputMes = document.getElementById("inputMes");
    const titulo = document.getElementById("tituloTablaCitas");
    const filas = contenedor.querySelectorAll("table tbody tr");
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    if (!titulo) return;

    if (radioMes?.checked) {
        const val = inputMes?.value;
        titulo.textContent = val ? `Citas Programadas en el mes (${val})` : "Citas Programadas en el mes";
        filas.forEach(fila => {
            if (!val) return (fila.style.display = "");
            const [a, m] = val.split("-");
            const filtro = `${meses[Number(m) - 1]}/${a}`;
            fila.style.display = fila.cells[3]?.textContent.includes(filtro) ? "" : "none";
        });
    } else {
        const sem = document.getElementById("inputSemana")?.value;
        titulo.textContent = sem ? `Citas Programadas en la semana (${sem})` : "Citas Programadas en la semana";
        filas.forEach(fila => (fila.style.display = ""));
    }
}

// ==========================================================================
// 5. ARRANQUE INICIAL Y MENÚ ACTIVO
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const botonesMenu = document.querySelectorAll("[data-vista]");

    botonesMenu.forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            botonesMenu.forEach(b => b.classList.remove("activo"));
            boton.classList.add("activo");
            cargarVista(boton.dataset.vista);
        });
    });

    cargarVista("registro");
});