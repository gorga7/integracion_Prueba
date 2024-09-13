document.addEventListener("DOMContentLoaded", function () {


    document.getElementById("agregarPaquete").addEventListener("click", function () {
        const paqueteDiv = document.createElement("div");
        paqueteDiv.classList.add("paqueteDiv");

        const tipoInput = document.createElement("input");
        tipoInput.type = "text";
        tipoInput.placeholder = "Tipo de paquete";
        tipoInput.classList.add("form-control");

        const cantidadInput = document.createElement("input");
        cantidadInput.type = "number";
        cantidadInput.placeholder = "Cantidad de etiquetas";
        cantidadInput.classList.add("form-control");

        paqueteDiv.appendChild(tipoInput);
        paqueteDiv.appendChild(cantidadInput);

        const hr = document.createElement("hr");
        paqueteDiv.appendChild(hr);

        document.getElementById("paquetesContainer").appendChild(paqueteDiv);
    });

    // Obtiene los paquetes ingresados
    function getPaquetes() {
        const paquetesDivs = document.querySelectorAll(".paqueteDiv");
        let paquetes = [];

        paquetesDivs.forEach((div) => {
            const tipoInput = div.querySelector(".form-control[type='text']");
            const cantidadInput = div.querySelector(".form-control[type='number']");

            const tipo = tipoInput ? tipoInput.value.trim() : "";
            const cantidad = cantidadInput ? parseInt(cantidadInput.value, 10) : 0;

            if (tipo && !isNaN(cantidad) && cantidad > 0) {
                paquetes.push({
                    Tipo: tipo,
                    Cantidad: cantidad
                });
            }
        });

        return paquetes;
    }


    

    // Maneja el envío del formulario
    document.getElementById("jsonForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario

        let formData = {
            "ID_Sesion": localStorage.getItem("ID_Session") || "",
            "K_Tipo_Guia": document.getElementById("K_Tipo_Guia").value || "",
            "K_Tipo_Envio": document.getElementById("K_Tipo_Envio").value || "",
            "K_Cliente_Remitente": document.getElementById("K_Cliente_Remitente").value || "",
            "K_Cliente_Destinatario": document.getElementById("K_Cliente_Destinatario").value || "",
            "Direccion_Destinatario": document.getElementById("Direccion_Destinatario").value || "",
            "K_Oficina_Destino": document.getElementById("K_Oficina_Destino") ? document.getElementById("K_Oficina_Destino").value : "601",
            "Entrega": document.getElementById("Entrega").value || "",
            "Paquetes_Ampara": document.getElementById("Paquetes_Ampara").value || 4,
            "Detalle_Paquetes": JSON.stringify(getPaquetes()),
            "esRecoleccion": document.getElementById("esRecoleccion").value || "0",
            "usaBolsa": document.getElementById("usaBolsa").value || "0"
        };

        console.log("Enviando datos:", formData);

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

            const data = await response.json();
            document.getElementById("Respuesta").textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            console.error("Error al obtener el costo:", error);
            document.getElementById("Respuesta").textContent = `Error al obtener el costo. Verifique la consola para más detalles. ${error.message}`;
        }
    });
});
