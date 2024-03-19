document.addEventListener("DOMContentLoaded", function () {




  //WEBSERVICE PARA RASTREAR UN ENVÍO
  document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Obtener los valores de los campos del formulario
    const K_Oficina_Origen = document.getElementById("K_Oficina_Origen").value;
    const K_GuiaRastreo = document.getElementById("K_GuiaRastreo").value;
    const Referencia = document.getElementById("Referencia").value;
    const ID_Sesion = localStorage.getItem("ID_Session");

    // Construir el objeto con los datos del formulario
    const requestData = {
      K_Oficina_Origen: K_Oficina_Origen,
      K_Guia: K_GuiaRastreo,
      Referencia: Referencia,
      ID_Sesion: ID_Sesion,
    };

    console.log("Datos enviados al servidor:", requestData); // Agregar console.log para mostrar los datos enviados

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Host: "altis-ws.grupoagencia.com",
      },
      mode: "cors",
      body: JSON.stringify(requestData), // Convierte el objeto JSON a string
    };

    // Realizar la solicitud fetch al endpoint proporcionado
    fetch(
      "https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsRastreoGuia",
      requestOptions
    )
      .then((response) => {
        // Verificar si la respuesta no es satisfactoria (código HTTP diferente a 200)
        if (!response.ok) {
          // Si la respuesta no es satisfactoria, lanzar un error con el código de estado HTTP
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Convertir la respuesta del servidor a formato JSON y retornarla
        return response.json();
      })
      .then((data) => {
        document.getElementById("d-tipo-guia").textContent =
          data.data.D_Tipo_Guia;
        document.getElementById("d-tipo-envio").textContent =
          data.data.D_Tipo_Envio;
        document.getElementById("d-tipo-entrega").textContent =
          data.data.D_Tipo_Entrega;
        document.getElementById("cliente-remitente").textContent =
          data.data.Cliente_Remitente;
        document.getElementById("oficina-destino").textContent =
          data.data.Oficina_Destino;
        document.getElementById("destinatario").textContent =
          data.data.Destinatario;
        document.getElementById("estado-guia").textContent =
          data.data.Estado_de_la_Guia;
        document.getElementById("cantidad-paquetes").textContent =
          data.data.Paquetes_Ampara;

        const estadoGuia = document.getElementById("estado-guia");
        estadoGuia.addEventListener("click", () => {
          mostrarHistorial(data.dataHistoria);
        });
      })
      .catch((error) => {
        // Manejar los errores de red y otros errores aquí
        console.error("Error:", error.message);
        // No podemos acceder a 'data' aquí, ya que está fuera del alcance
        // console.log(data)
        // Podríamos mostrar un mensaje de error en algún elemento del DOM si es necesario
        // document.getElementById('respuesta').innerText = 'Error desconocido';
      });
  });

  function showResponse(responseData) {
    // Llenar los datos en la tabla
    document.getElementById("cliente-remitente").textContent =
      responseData.clienteRemitente;
    document.getElementById("destinatario").textContent =
      responseData.destinatario;
    document.getElementById("d-tipo-guia").textContent = responseData.dTipoGuia;
    document.getElementById("d-tipo-envio").textContent = responseData.dTipoEnvio;
    document.getElementById("cantidad-paquetes").textContent =
      responseData.cantidadPaquetes;
    document.getElementById("d-tipo-entrega").textContent =
      responseData.dTipoEntrega;
    document.getElementById("oficina-destino").textContent =
      responseData.oficinaDestino;
    document.getElementById("estado-guia").textContent = responseData.estadoGuia;
  }

  function mostrarHistorial(dataHistoria) {
    // Suponiendo que tienes un elemento HTML donde mostrarás el historial de movimientos de estado
    const historialContainer = document.getElementById("historial-container");
    historialContainer.innerHTML = ""; // Limpiar cualquier contenido previo

    // Crear una tabla para el historial
    const historialTable = document.createElement("table");
    historialTable.classList.add("historial-table");

    // Crear el encabezado de la tabla
    const headerRow = document.createElement("tr");
    const headers = ["Estado", "Oficina", "Fecha y Hora"];
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    historialTable.appendChild(headerRow);

    // Iterar sobre cada movimiento en el historial y agregarlo a la tabla
    dataHistoria.forEach((movimiento) => {
      const row = document.createElement("tr");
      const estadoCell = document.createElement("td");
      estadoCell.textContent = movimiento.D_Estado_Guia;
      const oficinaCell = document.createElement("td");
      oficinaCell.textContent = movimiento.D_Oficina;
      const fechaHoraCell = document.createElement("td");
      fechaHoraCell.textContent = movimiento.F_Historia;
      row.appendChild(estadoCell);
      row.appendChild(oficinaCell);
      row.appendChild(fechaHoraCell);
      historialTable.appendChild(row);
    });

    // Agregar la tabla de historial al contenedor
    historialContainer.appendChild(historialTable);
  }
})