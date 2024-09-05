document.addEventListener("DOMContentLoaded", function () {
    //HORA Y FECHA

    function actualizarFechaHora() {
        var fechaHoraActual = new Date();
        var fechaHoraString = fechaHoraActual.toLocaleString();
        document.getElementById('fecha-horaRastreo').innerHTML = fechaHoraString;
    }

    // Actualizar la fecha y hora cada segundo
    setInterval(actualizarFechaHora, 1000);

    // Llamar a la función inicialmente para evitar un retraso de un segundo
    actualizarFechaHora();


    // WEBSERVICE PARA BUSCAR GUIAS POR FECHA
    document.getElementById("ID_Sesion").value =
        localStorage.getItem("ID_Session") || "";

    document.getElementById("enviar").addEventListener("click", function (event) {
        event.preventDefault(); // Evitar la recarga de la página

        // Obtener el valor de ID_Sesion actualizado del localStorage
        const ID_Sesion = localStorage.getItem("ID_Session") || "";

        // Verificar si se obtuvo correctamente el valor de ID_Sesion
        if (ID_Sesion) {
            const formData = {
                K_Cliente: document.getElementById("K_Cliente").value,
                Busqueda: document.getElementById("Busqueda").value,
                FI: document.getElementById("FI").value,
                FF: document.getElementById("FF").value,
                RUT: document.getElementById("RUTObtieneCostoCliente").value,
                ID_Sesion: ID_Sesion, // Usar el valor de ID_Sesion obtenido del localStorage
            };

            console.log("Datos a enviar:", formData); // Agregar un console.log para ver los datos antes de enviarlos

            fetch(
                "https://altis-ws.grupoagencia.com:444/JAgenciaQA/JAgencia.asmx/wsObtieneGuiasCliente",
                {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    // Manejar la respuesta del servidor
                    console.log(data);
                    // Aquí puedes hacer lo que necesites con la respuesta, como mostrarla en la página

                    // Verificar si data.result es 0, indicando una respuesta exitosa
                    if (data.result === 0) {
                        // Mostrar la respuesta en la tabla
                        const tablaDatos = document.getElementById("tablaDatos");
                        tablaDatos.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas filas

                        // Crear filas para cada objeto en la respuesta del servidor
                        data.data.forEach((item) => {
                            const fila = document.createElement("tr");
                            fila.innerHTML = `
              <td>${item.D_Oficina_Origen}</td>
              <td>${item.K_Guia}</td>
              <td>${item.D_Tipo_Guia}</td>
              <td>${item.D_Tipo_Envio}</td>
              <td>${item.F_Documentacion}</td>
              <td>${item.D_Estado_Guia}</td>
              <!-- Agrega más celdas según las propiedades que desees mostrar -->
            `;
                            tablaDatos.appendChild(fila);
                        });
                    } else {
                        // Mostrar el mensaje de error en la tabla
                        const tablaDatos = document.getElementById("tablaDatos");
                        tablaDatos.innerHTML = `<tr><td colspan="5">${data.data}</td></tr>`;
                    }
                })
                .catch((error) => {
                    console.error("Error al enviar la solicitud:", error);
                    // Manejar el error, por ejemplo, mostrar un mensaje al usuario
                });
        } else {
            console.error("No se pudo obtener el valor de ID_Sesion del localStorage");
            // Manejar el caso en que no se pudo obtener el valor de ID_Sesion del localStorage
        }
    });





    
});