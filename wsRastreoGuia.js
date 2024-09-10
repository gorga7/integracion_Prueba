document.addEventListener("DOMContentLoaded", function () {
  // WEBSERVICE PARA RASTREAR UN ENVÍO
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
      "https://altis-ws.grupoagencia.com:444/JAgenciaQA/JAgencia.asmx/wsRastreoGuia",
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
          // Toggle visibility
          const historialContainer = document.getElementById("historial-container");
          if (historialContainer.style.display === "block") {
            // Hide the container
            historialContainer.style.display = "none";
          } else {
            // Show the container and populate it
            mostrarHistorial(data.dataHistoria);
            historialContainer.style.display = "block";
          }
        });
      })
      .catch((error) => {
        // Manejar los errores de red y otros errores aquí
        console.error("Error:", error.message);
      });
  });

  function mostrarHistorial(dataHistoria) {
    const historialContainer = document.getElementById("historial-container");

    if (!historialContainer) {
      console.error("El contenedor de historial no existe en el DOM.");
      return;
    }

    // Limpiar cualquier contenido previo
    historialContainer.innerHTML = "";

    const historialTable = document.createElement("table");
    historialTable.classList.add("historial-table");

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

  document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault();
    // Lógica para procesar los datos aquí
    console.log('Formulario de rastreo enviado');
  });

  document.getElementById('enviar').addEventListener('click', function(event) {
    event.preventDefault();
    // Lógica para procesar los datos aquí
    console.log('Formulario de obtención de guías enviado');
  });
});
