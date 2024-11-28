document.addEventListener('DOMContentLoaded', (event) => {
  let btnEnviar = document.getElementById("Enviar");
  let Respuesta = document.getElementById("Respuesta");
  let Contrasenia = document.getElementById("Contrasenia");

  // Función para manejar el envío de datos
  async function enviarDatos() {
      const login = document.getElementById("Login").value;
      const Contrasenia = document.getElementById("Contrasenia").value;

      // Verificar si los campos de login y contraseña no están vacíos
      if (login.trim() === "" || Contrasenia.trim() === "") {
          alert("Por favor, ingrese el usuario y la contraseña.");
          return;
      }

      const url =
          "https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsLogin";
      const data = {
          Login: login,
          Contrasenia: Contrasenia,
      };

      const requestOptions = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify(data),
      };

      try {
          const response = await fetch(url, requestOptions);

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const responseData = await response.json();

          // Verificar si la propiedad 'result' es 1 (error)
          if (responseData.result === 1) {
              console.log("Error:", responseData.data);
              alert("Usuario y/o contraseña incorrecto");
          } else {
              alert("Logueado correctamente");
              console.log(responseData);
              localStorage.setItem("ID_Session", responseData.data[0].ID_Session);
              localStorage.setItem("Nombre", responseData.data[0].D_Cliente);
              window.location.href = "inicio.html";
          }
      } catch (error) {
          // Manejar errores de red y otros errores
          console.error("Error:", error.message);
          Respuesta.innerText = "Error desconocido";
      }
  }

  // Maneja el clic en el botón de enviar
  btnEnviar.addEventListener("click", async function (e) {
      e.preventDefault(); // Evita el envío del formulario para manejarlo manualmente
      await enviarDatos();
  });

  // Maneja el evento de presionar Enter en el formulario
  Contrasenia.addEventListener('keypress', async function (e) {
      if (e.key === 'Enter') {
          e.preventDefault(); // Evita el comportamiento predeterminado del Enter
         await enviarDatos();
      }
  });
});