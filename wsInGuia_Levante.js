document.addEventListener("DOMContentLoaded", function () {

    // Actualizar fecha y hora
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
            const K_Tipo_Envio = document.querySelector('select[name="K_Tipo_Envio"]').value;
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

    document.getElementById("agregarPaquete").addEventListener("click", function () {
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

        const tipoInput = document.createElement("input");
        tipoInput.type = "text";
        tipoInput.placeholder = "Tipo de paquete";
        tipoInput.classList.add("tipoPaquete");

        const cantidadInput = document.createElement("input");
        cantidadInput.type = "number";
        cantidadInput.placeholder = "Cantidad de etiquetas";
        cantidadInput.classList.add("cantidadPaquete");

        paqueteDiv.appendChild(tipoInput);
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
    });
});
