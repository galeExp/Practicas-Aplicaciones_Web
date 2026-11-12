// 1. Función global para cargar e inyectar cualquier apartado HTML
async function cargarVista(nombreVista) {
    const contenedor = document.getElementById("contenedor-vistas");
    if (!contenedor) return;

    try {
        const respuesta = await fetch(`/Practica04.2/HTML/${nombreVista}.html`);

        if (!respuesta.ok) {
            throw new Error(`Error al cargar /Practica04.2/HTML/${nombreVista}.html`);
        }

        const html = await respuesta.text();
        contenedor.innerHTML = html;

        // Ejecuta la lógica específica del apartado recién cargado
        inicializarLogicaVista(nombreVista);

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `<p>No se pudo cargar la sección solicitada.</p>`;
    }
}

// 2. Distribuidor de lógica según la vista activa
function inicializarLogicaVista(vista) {
    switch (vista) {
        case "registro":
            iniciarRegistro();
            break;
        case "citas":
            iniciarCitas();
            break;
        case "nueva-cita":
            iniciarNuevaCita();
            break;
        case "configuracion":
            iniciarConfiguracion();
            break;
    }
}

// ==========================================
// 3. LÓGICA INDEPENDIENTE DE CADA APARTADO
// ==========================================

function iniciarRegistro() {
    const formRegistro = document.getElementById("formRegistro");
    const checkTerminos = document.getElementById("validado");
    const btnEnviar = document.getElementById("btnEnviar");

    // Habilitar / deshabilitar botón Enviar según checkbox
    if (checkTerminos && btnEnviar) {
        checkTerminos.addEventListener("change", () => {
            btnEnviar.disabled = !checkTerminos.checked;
        });
    }

    // Capturar envío del formulario sin recargar la página
    if (formRegistro) {
        formRegistro.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("¡Usuario registrado correctamente!");
        });
    }

    // Aquí agregas el resto de tu JS de registro (cálculo de edad, vista previa WhatsApp, etc.)
}

function iniciarCitas() {
    const tbody = document.querySelector("table tbody");
    const radioMes = document.getElementById("appoimentByMonth");
    const radioSemana = document.getElementById("appoimentByWeek");
    const inputMes = document.getElementById("inputMes");
    const inputSemana = document.getElementById("inputSemana");
    const btnMostrar = document.getElementById("verCita");
    const tituloTabla = document.getElementById("tituloTablaCitas");

    const mesesCortos = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    // 1. Cargar las citas nuevas guardadas desde "Nueva Cita"
    const citasGuardadas = JSON.parse(localStorage.getItem("citasMecaGest")) || [];
    if (tbody && citasGuardadas.length > 0) {
        let numeroFila = tbody.rows.length + 1;

        citasGuardadas.forEach(cita => {
            // Formatear "2026-10-15 10:30" a "15/Oct/2026 10:30" para igualar la tabla
            let fechaFormateada = cita.fecha;
            if (cita.fecha && cita.fecha.includes("-")) {
                const [fechaParte, horaParte] = cita.fecha.split(" ");
                const [anio, mes, dia] = fechaParte.split("-");
                const nombreMes = mesesCortos[parseInt(mes, 10) - 1] || mes;
                fechaFormateada = `${dia}/${nombreMes}/${anio}${horaParte ? " " + horaParte : ""}`;
            }

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${numeroFila++}</td>
                <td><strong>${cita.cliente}</strong><br><small>${cita.vehiculo} ${cita.anio} (${cita.placas || "S/P"})</small></td>
                <td><strong>${cita.servicio}:</strong> ${cita.descripcion}<br><small>Sucursal: ${cita.sucursal}</small></td>
                <td>${fechaFormateada}</td>
                <td><span class="badge badge-programada">${cita.estatus}</span></td>
            `;
            tbody.appendChild(fila);
        });
    }

    // 2. Habilitar o deshabilitar los selectores según el radio elegido
    if (radioMes && radioSemana && inputMes && inputSemana) {
        radioMes.addEventListener("change", () => {
            inputMes.disabled = false;
            inputSemana.disabled = true;
        });

        radioSemana.addEventListener("change", () => {
            inputMes.disabled = true;
            inputSemana.disabled = false;
        });
    }

    // 3. Filtrar las filas de la tabla y actualizar el título al dar clic en "Mostrar"
    if (btnMostrar && tituloTabla && tbody) {
        btnMostrar.addEventListener("click", () => {
            const filas = tbody.querySelectorAll("tr");

            if (radioMes.checked) {
                const valorMes = inputMes.value; // Ej. "2026-10"
                tituloTabla.textContent = valorMes
                    ? `Citas Programadas en el mes (${valorMes})`
                    : "Citas Programadas en el mes";

                filas.forEach(fila => {
                    if (!valorMes) {
                        fila.style.display = "";
                        return;
                    }
                    const [anio, mesNum] = valorMes.split("-");
                    const textoBusqueda = `${mesesCortos[parseInt(mesNum, 10) - 1]}/${anio}`;
                    const celdaFecha = fila.cells[3]?.textContent || "";
                    fila.style.display = celdaFecha.includes(textoBusqueda) ? "" : "none";
                });
            } else {
                const valorSemana = inputSemana.value;
                tituloTabla.textContent = valorSemana
                    ? `Citas Programadas en la semana (${valorSemana})`
                    : "Citas Programadas en la semana";

                filas.forEach(fila => fila.style.display = "");
            }
        });
    }
}

function iniciarNuevaCita() {
    const formNuevaCita = document.getElementById("formNuevaCita");
    const inputFecha = document.getElementById("dateAppoiment");
    const inputPlacas = document.getElementById("placasVehiculo");
    const inputSucursal = document.getElementById("locations");
    const listaSucursales = document.getElementById("locationsList");
    const tbody = document.querySelector("table tbody");
    const citasGuardadas = JSON.parse(localStorage.getItem("citasMecaGest")) || [];

    if (tbody && citasGuardadas.length > 0) {
     let numeroFila = tbody.rows.length + 1;

    citasGuardadas.forEach(cita => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${numeroFila++}</td>
            <td><strong>${cita.cliente}</strong><br><small>${cita.vehiculo} ${cita.anio} (${cita.placas || "S/P"})</small></td>
            <td><strong>${cita.servicio}:</strong> ${cita.descripcion}<br><small>Sucursal: ${cita.sucursal}</small></td>
            <td>${cita.fecha}</td>
            <td><span class="badge badge-programada">${cita.estatus}</span></td>
        `;
        tbody.appendChild(fila);
    });
}

    if (!formNuevaCita) return;

    // 1. Evitar que se seleccionen fechas u horas anteriores a este momento
    if (inputFecha) {
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        inputFecha.min = ahora.toISOString().slice(0, 16);
    }

    // 2. Convertir placas a mayúsculas mientras se escriben
    if (inputPlacas) {
        inputPlacas.addEventListener("input", () => {
            inputPlacas.value = inputPlacas.value.toUpperCase();
        });
    }

    // 3. Validar y procesar el envío del formulario
    formNuevaCita.addEventListener("submit", (e) => {
        e.preventDefault();

        // Verificar que la sucursal escrita exista en el datalist
        if (inputSucursal && listaSucursales) {
            const sucursalesValidas = Array.from(listaSucursales.options).map(opt => opt.value.trim());
            if (!sucursalesValidas.includes(inputSucursal.value.trim())) {
                alert("Selecciona una sucursal válida de la lista desplegable.");
                inputSucursal.focus();
                return;
            }
        }

        const selectServicio = document.getElementById("tipoServicio");

        // Recopilar datos de la cita
        const nuevaCita = {
            cliente: document.getElementById("clienteCita").value.trim(),
            telefono: document.getElementById("telCita").value.trim(),
            vehiculo: document.getElementById("vehiculoCita").value.trim(),
            anio: document.getElementById("anioVehiculo").value.trim(),
            placas: inputPlacas ? inputPlacas.value.trim() : "",
            servicio: selectServicio.options[selectServicio.selectedIndex].text,
            sucursal: inputSucursal.value.trim(),
            fecha: inputFecha.value.replace("T", " "),
            descripcion: document.getElementById("descriptionText").value.trim(),
            estatus: "Programada"
        };

        // Guardar en localStorage para que no se pierda al cambiar de vista
        const citasGuardadas = JSON.parse(localStorage.getItem("citasMecaGest")) || [];
        citasGuardadas.push(nuevaCita);
        localStorage.setItem("citasMecaGest", JSON.stringify(citasGuardadas));

        alert(`¡Cita agendada con éxito!\nCliente: ${nuevaCita.cliente}\nUnidad: ${nuevaCita.vehiculo} ${nuevaCita.anio}\nSucursal: ${nuevaCita.sucursal}`);

        // Cambiar el estado activo en la barra de navegación y abrir Citas
        document.querySelectorAll("[data-vista]").forEach(enlace => {
            enlace.classList.toggle("activo", enlace.getAttribute("data-vista") === "citas");
        });
        cargarVista("citas");
    });
}
function iniciarConfiguracion() {
    // Aquí irá el JS exclusivo de configuracion.html
}

// ==========================================
// 4. ARRANQUE DE LA APLICACIÓN Y MENÚ
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const botonesMenu = document.querySelectorAll("[data-vista]");

    botonesMenu.forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            const vista = boton.getAttribute("data-vista");
            cargarVista(vista);
        });
    });

    // Vista inicial al abrir index.html
    cargarVista("registro");
});