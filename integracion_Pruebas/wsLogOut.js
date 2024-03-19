document.addEventListener("DOMContentLoaded", function () {

  //WEBSERVICE PARA CERRAR SESION

  btncerrarSesion = document.getElementById("btncerrarSesion");

  btncerrarSesion.addEventListener("click", () => {
    let IDSession = localStorage.getItem("ID_Session");

    if (IDSession) {
      fetch(
        "https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsLogOut",
        {
          method: "POST",
          body: JSON.stringify({ ID_Sesion: IDSession }), // Asegúrate de que el nombre del parámetro sea correcto
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          window.alert(`Has cerrado Sesion`);
          localStorage.removeItem("ID_Session"); // Remover el ID de sesión del almacenamiento local
          console.log(data);
          window.location.href = "../../index.html";
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.error("No se encontró el ID de sesión en el almacenamiento local");
    }


  })


});
