document.addEventListener("DOMContentLoaded", function () {
    function getPaquetes() {
        const paquetesDivs = document.querySelectorAll(".paqueteDiv");
        let paquetes = [];
        paquetesDivs.forEach((div) => {
            const tipoInput = div.querySelector("input[type='text']");
            const cantidadInput = div.querySelector("input[type='number']");
            const tipo = tipoInput ? tipoInput.value.trim() : "";
            const cantidad = cantidadInput ? parseInt(cantidadInput.value, 10) : 0;

            if (tipo && !isNaN(cantidad) && cantidad > 0) {
                paquetes.push({ Tipo: tipo, Cantidad: cantidad });
            }
        });
        return paquetes;
    }

    function renderResponse(data) {
        // Crear un formato profesional para los datos
        return `
            <div class="card p-4">
                <h2 class="text-success text-center mb-4">Detalles del Costo</h2>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Valor del Flete</strong>
                        <span>$${data.Valor_Felte.toFixed(2)}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Comisión</strong>
                        <span>$${data.Valor_Comision.toFixed(2)}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>IVA</strong>
                        <span>$${data.Valor_IVA.toFixed(2)}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Tasa</strong>
                        <span>$${data.Valor_Tasa.toFixed(2)}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Servicios</strong>
                        <span>$${data.Valor_Servicios.toFixed(2)}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Mercadería</strong>
                        <span>$${data.Valor_Mercaderia.toFixed(2)}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Origen</strong>
                        <span>$${data.Valor_Origen.toFixed(2)}</span>
                    </li>
                    <li class="list-group-item list-group-item-success d-flex justify-content-between align-items-center">
                        <strong>Total de la Guía</strong>
                        <span class="fw-bold">$${data.Total_Guia.toFixed(2)}</span>
                    </li>
                </ul>
            </div>
        `;
    }

    document.getElementById("btnCalcularCosto").addEventListener("click", async function () {
        const formData = {
            "ID_Sesion": localStorage.getItem("ID_Session") || "",
            "K_Tipo_Guia": document.getElementById("K_Tipo_Guia")?.value || "",
            "K_Tipo_Envio": document.getElementById("K_Tipo_Envio")?.value || "",
            "K_Cliente_Remitente": document.getElementById("K_Cliente_Remitente")?.value || "",
            "K_Cliente_Destinatario": document.getElementById("K_Cliente_Destinatario")?.value || "",
            "Direccion_Destinatario": document.getElementById("Direccion_Destinatario")?.value || "",
            "K_Oficina_Destino": document.getElementById("K_Oficina_Destino")?.value || "601",
            "Entrega": document.getElementById("Entrega")?.value || "",
            "Paquetes_Ampara": document.getElementById("Paquetes_Ampara")?.value || 4,
            "Detalle_Paquetes": JSON.stringify(getPaquetes()),
            "esRecoleccion": document.getElementById("esRecoleccion")?.value || "0",
            "usaBolsa": document.getElementById("usaBolsa")?.value || "0"
        };

        const respuestaDiv = document.getElementById("Respuesta");

        try {
            const response = await fetch("https://altis-ws.grupoagencia.com:444/JAgenciaQA/JAgencia.asmx/wsObtieneCosto_Nuevo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Host": "altis-ws.grupoagencia.com",
                },
                mode: "cors",
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error en la respuesta del servidor: ${errorText}`);
            }

            const result = await response.json();

            // Log de la respuesta para depuración
            console.log("Respuesta completa del servidor:", result);

            const data = result.data; // Extraer el atributo "data"

            // Validar si los datos están disponibles
            if (!data) {
                throw new Error("Los datos no se encontraron en la respuesta del servidor.");
            }

            // Mostrar respuesta formateada
            respuestaDiv.innerHTML = renderResponse(data);
            respuestaDiv.style.display = "block";
            respuestaDiv.className = "mt-4";
        } catch (error) {
            console.error("Error al obtener el costo:", error);
            respuestaDiv.innerHTML = `<p class="text-danger">Error al obtener el costo: ${error.message}</p>`;
            respuestaDiv.style.display = "block";
            respuestaDiv.className = "alert alert-danger mt-4";
        }
    });
});
