// wsInGuia_Levante.js

document.addEventListener("DOMContentLoaded", function () {

    // Función para actualizar fecha y hora
    function actualizarFechaHora() {
        const fechaHoraActual = new Date();
        const fechaHoraString = fechaHoraActual.toLocaleString();
        document.getElementById('fecha-horaEnvio').innerHTML = fechaHoraString;
    }

    // Actualizar la fecha y hora cada segundo
    setInterval(actualizarFechaHora, 1000);
    actualizarFechaHora();

    let btnCrearEnvio = document.getElementById("btnCrearEnvio");
    let Respuesta = document.getElementById("Respuesta");
    const agregarPaqueteBtn = document.getElementById("agregarPaquete");
    const tipoEnvioSelect = document.querySelector('select[name="K_Tipo_Envio"]');

    // Verificar si cargarArticulosDesdeWSArticulo está definida
    if (typeof window.cargarArticulosDesdeWSArticulo !== 'function') {
        console.error('La función cargarArticulosDesdeWSArticulo no está definida en el objeto window.');
    } else {
        console.log('La función cargarArticulosDesdeWSArticulo está correctamente definida.');
    }

    // Habilitar o deshabilitar el botón "Agregar Paquete" basado en la selección de K_Tipo_Envio
    tipoEnvioSelect.addEventListener('change', function () {
        if (this.value) {
            agregarPaqueteBtn.disabled = false;
        } else {
            agregarPaqueteBtn.disabled = true;
        }

        // Limpiar mensajes anteriores al cambiar la selección
        Respuesta.innerHTML = "";
        Respuesta.style.display = 'none';
    });

    btnCrearEnvio.addEventListener("click", async function (event) {
        event.preventDefault();

        try {
            // Validar si existe ID de sesión
            const ID_Sesion = localStorage.getItem("ID_Session");
            if (!ID_Sesion) {
                console.error("ID_Sesion no encontrado en localStorage.");
                Respuesta.innerHTML = `
                    <div class="alert alert-danger">
                        <strong>Error:</strong> ID de sesión no encontrado. Por favor, inicie sesión nuevamente.
                    </div>`;
                Respuesta.style.display = 'block';
                return;
            }

            // Obtener valores del formulario
            const K_Tipo_Guia = document.querySelector('select[name="K_Tipo_Guia"]').value;
            const K_Tipo_Envio = tipoEnvioSelect.value;
            const F_Recoleccion = document.getElementById("F_Recoleccion").value;
            const K_Domicilio_Recoleccion = document.getElementById("K_Domicilio_Recoleccion").value.trim();
            const D_Cliente_Remitente = document.getElementById("D_Cliente_Remitente").value;
            const Telefono_Remitente = document.getElementById("Telefono_Remitente").value;
            const K_Cliente_Destinatario = document.getElementById("K_Cliente_Destinatario").value;
            const Cliente_Destinatario = document.getElementById("Cliente_Destinatario").value;
            const Direccion_Destinatario = document.getElementById("Direccion_Destinatario").value.trim();
            const Telefono = document.getElementById("Telefono").value;
            const RUT = document.getElementById("RUT").value;

            const sucursalesSelect = document.getElementById('sucursales');
            let K_Oficina_Destino = sucursalesSelect ? sucursalesSelect.value : "";

            const Entrega = document.querySelector('select[name="Entrega"]').value;

            // Validaciones según el tipo de entrega
            if (Entrega == 1) {
                if (!K_Oficina_Destino) {
                    console.error("Debe seleccionar una agencia para Entrega = 1.");
                    Respuesta.innerHTML = `
                        <div class="alert alert-warning">
                            <strong>Atención:</strong> Debe seleccionar una agencia para Entrega en Agencia.
                        </div>`;
                    Respuesta.style.display = 'block';
                    return;
                }
                if (Direccion_Destinatario) {
                    console.error("Para Entrega en Agencia, la dirección del destinatario debe estar vacía.");
                    Respuesta.innerHTML = `
                        <div class="alert alert-warning">
                            <strong>Atención:</strong> La dirección del destinatario debe estar vacía para Entrega en Agencia.
                        </div>`;
                    Respuesta.style.display = 'block';
                    return;
                }
            } else if (Entrega == 2) {
                K_Oficina_Destino = "";
                if (!Direccion_Destinatario) {
                    console.error("Debe indicar una dirección de destinatario válida para Entrega a Domicilio.");
                    Respuesta.innerHTML = `
                        <div class="alert alert-warning">
                            <strong>Atención:</strong> Debe indicar una dirección válida para Entrega a Domicilio.
                        </div>`;
                    Respuesta.style.display = 'block';
                    return;
                }
                sucursalesSelect.disabled = true;
            } else {
                console.error("Valor de Entrega inválido.");
                Respuesta.innerHTML = `
                    <div class="alert alert-danger">
                        <strong>Error:</strong> Valor de Entrega inválido. Seleccione una opción válida.
                    </div>`;
                Respuesta.style.display = 'block';
                return;
            }

            const jsonData = {
                ID_Sesion,
                K_Tipo_Guia,
                K_Tipo_Envio,
                F_Recoleccion,
                K_Domicilio_Recoleccion,
                D_Cliente_Remitente,
                Telefono_Remitente,
                K_Cliente_Destinatario,
                Cliente_Destinatario,
                Direccion_Destinatario,
                Telefono,
                RUT,
                K_Oficina_Destino,
                Entrega,
                Paquetes_Ampara: document.getElementById("Paquetes_Ampara").value,
                Detalle_Paquetes: JSON.stringify(getPaquetes()),
                Observaciones: document.getElementById("Observaciones").value,
                CostoMercaderia: document.getElementById("CostoMercaderia").value,
                Referencia_Pago: document.getElementById("Referencia_Pago").value,
                CodigoPedido: document.getElementById("CodigoPedido").value,
                Serv_DDF: document.getElementById("Serv_DDF").value,
                Serv_Cita: document.getElementById("Serv_Cita").value,
                Latitud_Destino: document.getElementById("Latitud_Destino").value,
                Longitud_Destino: document.getElementById("Longitud_Destino").value,
            };

            const response = await fetch("https://altis-ws.grupoagencia.com:444/JAgenciaQA/JAgencia.asmx/wsInGuia_Levante", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Host: "altis-ws.grupoagencia.com",
                },
                mode: "cors",
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails}`);
            }

            const responseData = await response.json();

            console.log("Respuesta del servidor:", responseData);

            handleResponse(responseData);

        } catch (error) {
            console.error("Error:", error.message);
            Respuesta.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error al generar el envío:</strong><br>
                    ${error.message}
                </div>`;
            Respuesta.style.display = 'block';
        }
    });

    function handleResponse(responseData) {
        if (responseData.result === 0) {
            Respuesta.innerHTML = `
                <div class="card p-4">
                    <h2 class="text-success text-center mb-4">¡Envío Generado Exitosamente!</h2>
                    <ul class="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Número de Guía</strong>
                            <span>${responseData.data.K_Guia}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Oficina de Destino</strong>
                            <span>${responseData.data.K_Oficina_Destino}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Código de Rastreo</strong>
                            <span>${responseData.data.Codigo_Rastreo}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Código de Barras</strong>
                            <span>${responseData.data.Codigo_Barras || "No disponible"}</span>
                        </li>
                    </ul>
                </div>`;
            Respuesta.style.display = 'block';
        } else {
            console.error("Error en el servidor:", responseData.data);
            Respuesta.innerHTML = `
                <div class="alert alert-warning">
                    <strong>Error:</strong> ${responseData.data || "Ocurrió un problema al generar el envío."}
                </div>`;
            Respuesta.style.display = 'block';
        }
    }

    document.getElementById("agregarPaquete").addEventListener("click", async function () {
        // Obtener el valor actual de K_Tipo_Envio
        const K_Tipo_Envio = tipoEnvioSelect.value;
        console.log("Al agregar paquete, K_Tipo_Envio es:", K_Tipo_Envio);

        // **Verificación Adicional: Asegurarse de que se ha seleccionado un Tipo de Envío**
        if (!K_Tipo_Envio) {
            console.error("Debe seleccionar un Tipo de Envío antes de agregar paquetes.");
            Respuesta.innerHTML = `
                <div class="alert alert-warning">
                    <strong>Atención:</strong> Debe seleccionar un Tipo de Envío antes de agregar paquetes.
                </div>`;
            Respuesta.style.display = 'block';
            return; // Salir de la función para no agregar el paquete
        }

        const paqueteDiv = document.createElement("div");
        paqueteDiv.classList.add("paqueteDiv");

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.classList.add('remove-package-btn');
        removeButton.innerHTML = '&times;';
        removeButton.onclick = function () {
            this.parentElement.remove();
        };
        paqueteDiv.appendChild(removeButton);

        let tipoElement;

        if (K_Tipo_Envio == "1") { // Usar '==' para una comparación flexible
            // Crear el elemento <select> con las opciones especificadas
            tipoElement = document.createElement("select");
            // No asignar un ID para evitar duplicados
            tipoElement.name = "paquete"; // Asignar name si es necesario
            tipoElement.classList.add("tipoPaquete");

            const opcionesPaquete = [
                { value: "", text: "- Elige el paquete -" },
                { value: "1", text: "2kg" },
                { value: "2", text: "5kg" },
                { value: "3", text: "10kg" },
                { value: "4", text: "15kg" },
                { value: "5", text: "20kg" },
                { value: "6", text: "25kg" },
                { value: "7", text: "30kg" },
                { value: "8", text: "40kg" },
                { value: "9", text: "50kg" }
            ];

            opcionesPaquete.forEach(opcion => {
                const option = document.createElement("option");
                option.value = opcion.value;
                option.text = opcion.text;
                tipoElement.appendChild(option);
            });
        } else if (K_Tipo_Envio == "2" || K_Tipo_Envio == "3") { // Nuevas condiciones para 2 y 3
            // Crear el elemento <input> con valor predefinido 1 y no editable
            tipoElement = document.createElement("input");
            tipoElement.type = "number"; // Asumiendo que el valor es numérico
            tipoElement.value = "1"; // Valor predefinido
            tipoElement.classList.add("tipoPaquete");
            tipoElement.readOnly = true; // Hacer que el input no sea editable
            tipoElement.style.backgroundColor = "#e9ecef"; // Opcional: Indicar visualmente que es de solo lectura
        } else if (K_Tipo_Envio == "4") { // Nueva condición para 4
            // Crear el elemento <select> con opciones obtenidas desde WSArticulo
            tipoElement = document.createElement("select");
            tipoElement.name = "paquete"; // Asignar name si es necesario
            tipoElement.classList.add("tipoPaquete");

            // Agregar una opción de carga
            const loadingOption = document.createElement("option");
            loadingOption.value = "";
            loadingOption.text = "Cargando...";
            tipoElement.appendChild(loadingOption);

            // Realizar la llamada a la función de wsArticulo.js
            try {
                const articulos = await window.cargarArticulosDesdeWSArticulo(); // Llamada a la función definida en wsArticulo.js
                tipoElement.innerHTML = ""; // Eliminar la opción de carga

                if (articulos.length > 0) {
                    // Agregar una opción predeterminada
                    const defaultOption = document.createElement("option");
                    defaultOption.value = "";
                    defaultOption.text = "- Selecciona un artículo -";
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    tipoElement.appendChild(defaultOption);

                    // Agregar las opciones desde articulos
                    articulos.forEach(articulo => {
                        const option = document.createElement("option");
                        option.value = articulo.K_Articulo; // Asegúrate de que 'K_Articulo' sea el identificador correcto
                        option.text = articulo.D_Articulo; // Asegúrate de que 'D_Articulo' sea el nombre correcto
                        tipoElement.appendChild(option);
                    });
                } else {
                    const errorOption = document.createElement("option");
                    errorOption.value = "";
                    errorOption.text = "No se encontraron artículos";
                    errorOption.disabled = true;
                    errorOption.selected = true;
                    tipoElement.appendChild(errorOption);
                }
            } catch (error) {
                console.error("Error al obtener artículos desde WSArticulo:", error);
                tipoElement.innerHTML = ""; // Eliminar la opción de carga

                const errorOption = document.createElement("option");
                errorOption.value = "";
                errorOption.text = "Error al cargar artículos";
                errorOption.disabled = true;
                errorOption.selected = true;
                tipoElement.appendChild(errorOption);
            }

        } else { // Cualquier otro valor
            // Crear el elemento <input> de tipo texto
            tipoElement = document.createElement("input");
            tipoElement.type = "text";
            tipoElement.placeholder = "Tipo de paquete";
            tipoElement.classList.add("tipoPaquete");
        }

        paqueteDiv.appendChild(tipoElement);

        const cantidadInput = document.createElement("input");
        cantidadInput.type = "number";
        cantidadInput.placeholder = "Cantidad de etiquetas";
        cantidadInput.classList.add("cantidadPaquete");

        paqueteDiv.appendChild(cantidadInput);

        const hr = document.createElement("hr");
        paqueteDiv.appendChild(hr);

        document.getElementById("paquetesContainer").appendChild(paqueteDiv);
    });

    function getPaquetes() {
        const paquetesDivs = document.querySelectorAll(".paqueteDiv");
        let paquetes = [];

        paquetesDivs.forEach((div) => {
            const tipoInput = div.querySelector(".tipoPaquete");
            const cantidadInput = div.querySelector(".cantidadPaquete");

            const tipo = tipoInput ? tipoInput.value.trim() : "";
            const cantidad = cantidadInput ? parseInt(cantidadInput.value, 10) : 0;

            if (tipo && !isNaN(cantidad) && cantidad > 0) {
                paquetes.push({ tipo, cantidad });
            }
        });

        return paquetes;
    }

    document.querySelector('select[name="Entrega"]').addEventListener('change', function () {
        const sucursalesSelect = document.getElementById('sucursales');
        const Direccion_Destinatario = document.getElementById('Direccion_Destinatario');

        if (this.value == 2) {
            sucursalesSelect.disabled = true;
            Direccion_Destinatario.disabled = false;
        } else if (this.value == 1) {
            Direccion_Destinatario.disabled = true;
            sucursalesSelect.disabled = false;
        } else {
            sucursalesSelect.disabled = false;
            Direccion_Destinatario.disabled = false;
        }

        // Opcional: Limpiar paquetes si cambias el tipo de entrega
        // document.getElementById("paquetesContainer").innerHTML = "";
    });
});
