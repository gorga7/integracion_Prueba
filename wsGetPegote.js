document.addEventListener("DOMContentLoaded", function () {
  async function obtenerPegote() {
      const messageContainer = document.getElementById("EtiquetaMessage");
      try {
          const K_Oficina = document.getElementById("K_Oficina").value;
          const K_Guia = document.getElementById("K_Guia").value;
          const CodigoPedido = document.getElementById("CodigoPedidoPegote").value;
          const ID_Sesion = localStorage.getItem("ID_Session");

          const getPegoteUrl =
              "https://altis-ws.grupoagencia.com:444/JAgenciaQA/JAgencia.asmx/wsGetPegote";
          const getPegoteParams = {
              K_Oficina,
              K_Guia,
              CodigoPedido,
              ID_Sesion,
          };

          const getPegoteOptions = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Host: "altis-ws.grupoagencia.com",
              },
              mode: "cors",
              body: JSON.stringify(getPegoteParams),
          };

          const pegoteResponse = await fetch(getPegoteUrl, getPegoteOptions);

          if (!pegoteResponse.ok) {
              throw new Error(`HTTP error! Status: ${pegoteResponse.status}`);
          }

          const pegoteData = await pegoteResponse.json();
          console.log("Respuesta de wsGetPegote:", pegoteData);

          if (!pegoteData || !pegoteData.data || !pegoteData.data.Pegote) {
              throw new Error("La respuesta del servidor no contiene datos válidos.");
          }

          const pegoteCode = pegoteData.data.Pegote.replace(/^"|"$/g, "");
          const byteCharacters = atob(pegoteCode);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });

          const pdfUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = pdfUrl;
          link.download = pegoteData.data.Nombre || "pegote.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Mostrar mensaje de éxito
          messageContainer.textContent = "Etiqueta generada y descargada con éxito.";
          messageContainer.className = "alert alert-success";
          messageContainer.classList.remove("d-none");
      } catch (error) {
          console.error("Error al obtener PEGOTÍN:", error.message);
          // Mostrar mensaje de error
          messageContainer.textContent = `Error: ${error.message}`;
          messageContainer.className = "alert alert-danger";
          messageContainer.classList.remove("d-none");
      }
  }

  document
      .getElementById("btnObtenerPegote")
      .addEventListener("click", obtenerPegote);
});
