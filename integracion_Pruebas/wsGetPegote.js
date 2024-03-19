document.addEventListener("DOMContentLoaded", function () {


  //WEBSERVICE GETPEGOTE PARA OBTENER EL PEGOTE DEL ENVÍO CREADO

  // Función asíncrona para obtener el Pegote
  async function obtenerPegote() {
    try {
      // Obtiene los parámetros necesarios para obtener el pegote
      const K_Oficina = document.getElementById("K_Oficina").value;
      const K_Guia = document.getElementById("K_Guia").value;
      const CodigoPedido = document.getElementById("CodigoPedidoPegote").value; // Obtener CodigoPedido
      const ID_Sesion = localStorage.getItem("ID_Session");

      // Configura la petición para obtener el pegote
      const getPegoteUrl =
        "https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsGetPegote";
      const getPegoteParams = {
        K_Oficina: document.getElementById("K_Oficina").value,
        K_Guia: document.getElementById("K_Guia").value,
        CodigoPedido: document.getElementById("CodigoPedidoPegote").value,
        ID_Sesion: localStorage.getItem("ID_Session"),
      };
      const getPegoteOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Host: "altis-ws.grupoagencia.com",
        },
        mode: "cors",
        body: JSON.stringify(getPegoteParams), // Envía el objeto JSON como cuerpo de la solicitud
      };

      // Realiza la petición para obtener el pegote
      const pegoteResponse = await fetch(getPegoteUrl, getPegoteOptions);

      // Verifica la respuesta del servidor
      if (!pegoteResponse.ok) {
        throw new Error(`HTTP error! Status: ${pegoteResponse.status}`);
      }

      // Obtiene los datos de la respuesta del servidor
      const pegoteData = await pegoteResponse.json();

      // Muestra la respuesta en la consola
      console.log("Respuesta de wsGetPegote:", pegoteData);

      // Verifica si pegoteData es undefined o si no contiene datos válidos
      if (!pegoteData || !pegoteData.data || !pegoteData.data.Pegote) {
        throw new Error("La respuesta del servidor no contiene datos válidos.");
      }

      // Obtiene el código del pegote y quita las comillas al principio y al final
      const pegoteCode = pegoteData.data.Pegote.replace(/^"|"$/g, "");

      // Convierte el código del pegote a un archivo PDF
      const byteCharacters = atob(pegoteCode);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Crea una URL para el PDF
      const pdfUrl = URL.createObjectURL(blob);

      // Crea un enlace de descarga para el PDF
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = pegoteData.data.Nombre || "pegote.pdf"; // Usa el campo "Nombre" si está disponible, de lo contrario, usa "pegote.pdf" como nombre predeterminado
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // Maneja errores al obtener el Pegote
      console.error("Error al obtener PEGOTÍN:", error.message);
    }
  }

  // Agrega un evento al botón con el ID 'btnObtenerPegote' que llama a la función obtenerPegote cuando se hace clic
  document
    .getElementById("btnObtenerPegote")
    .addEventListener("click", obtenerPegote);
});