document.addEventListener("DOMContentLoaded", function () {

    // Obtiene los paquetes ingresados
    function getPaquetes() {
        const paquetesDivs = document.querySelectorAll(".paqueteDiv");
        let paquetes = [];

        paquetesDivs.forEach((div) => {
            const tipoInput = div.querySelector("input[type='text']");
            const cantidadInput = div.querySelector("input[type='number']");

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

    // Maneja el clic en el botón Calcular Costo
    document.getElementById("btnCalcularCosto").addEventListener("click", async function () {
        console.log("Botón 'Calcular Costo' clicado.");  // Asegúrate de que esto se muestra en la consola

        // Verifica si los elementos existen antes de acceder a sus valores
        const kTipoGuia = document.getElementById("K_Tipo_Guia");
        const kTipoEnvio = document.getElementById("K_Tipo_Envio");
        const kClienteRemitente = document.getElementById("K_Cliente_Remitente");
        const kClienteDestinatario = document.getElementById("K_Cliente_Destinatario");
        const direccionDestinatario = document.getElementById("Direccion_Destinatario");
        const kOficinaDestino = document.getElementById("K_Oficina_Destino");
        const entrega = document.getElementById("Entrega");
        const paquetesAmpara = document.getElementById("Paquetes_Ampara");
        const esRecoleccion = document.getElementById("esRecoleccion");
        const usaBolsa = document.getElementById("usaBolsa");

        let formData = {
            "ID_Sesion": localStorage.getItem("ID_Session") || "",
            "K_Tipo_Guia": kTipoGuia ? kTipoGuia.value : "",
            "K_Tipo_Envio": kTipoEnvio ? kTipoEnvio.value : "",
            "K_Cliente_Remitente": kClienteRemitente ? kClienteRemitente.value : "",
            "K_Cliente_Destinatario": kClienteDestinatario ? kClienteDestinatario.value : "",
            "Direccion_Destinatario": direccionDestinatario ? direccionDestinatario.value : "",
            "K_Oficina_Destino": kOficinaDestino ? kOficinaDestino.value : "601",
            "Entrega": entrega ? entrega.value : "",
            "Paquetes_Ampara": paquetesAmpara ? paquetesAmpara.value : 4,
            "Detalle_Paquetes": JSON.stringify(getPaquetes()),
            "esRecoleccion": esRecoleccion ? esRecoleccion.value : "0",
            "usaBolsa": usaBolsa ? usaBolsa.value : "0"
        };

        console.log("Datos del formulario:", formData);  // Para asegurarte de que se están capturando los datos correctos

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
