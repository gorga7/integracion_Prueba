//CARGAR EL DOM
document.addEventListener("DOMContentLoaded", function () {

  //HORA Y FECHA

  function actualizarFechaHora() {
    var fechaHoraActual = new Date();
    var fechaHoraString = fechaHoraActual.toLocaleString();
    document.getElementById('fecha-horaEnvio').innerHTML = fechaHoraString;
  }

  // Actualizar la fecha y hora cada segundo
  setInterval(actualizarFechaHora, 1000);

  // Llamar a la función inicialmente para evitar un retraso de un segundo
  actualizarFechaHora();



  //WEBSERVICE INGUIA_LEVANTE PARA CREAR ENVÍO

  // Selecciona el botón con el ID 'btnCrearEnvio'
  let btnCrearEnvio = document.getElementById("btnCrearEnvio");
  // Selecciona el elemento con el ID 'Respuesta'
  let Respuesta = document.getElementById("Respuesta");
  // Declara un array vacío para almacenar los paquetes
  let paquetes = [];


  // Agrega un event listener al botón de crear envío
  btnCrearEnvio.addEventListener("click", async function (event) {
    // Previene el comportamiento por defecto del evento click (enviar un formulario)
    event.preventDefault();
    try {
      // Obtiene el ID de sesión almacenado en el localStorage
      const ID_Sesion = localStorage.getItem("ID_Session");
      // Obtiene los valores de diferentes campos del formulario
      const K_Tipo_Guia = document.querySelector(
        'select[name="K_Tipo_Guia"]'
      ).value;
      const K_Tipo_Envio = document.querySelector(
        'select[name="K_Tipo_Envio"]'
      ).value;
      const F_Recoleccion = document.getElementById(
        "F_Recoleccion"
      ).value;
      const K_Domicilio_Recoleccion = document.getElementById(
        "K_Domicilio_Recoleccion"
      ).value;
      const D_Cliente_Remitente = document.getElementById(
        "D_Cliente_Remitente"
      ).value;
      const Telefono_Remitente = document.getElementById(
        "Telefono_Remitente"
      ).value;
      const K_Cliente_Destinatario = document.getElementById(
        "K_Cliente_Destinatario"
      ).value;
      const Cliente_Destinatario = document.getElementById(
        "Cliente_Destinatario"
      ).value;
      const Direccion_Destinatario = document.getElementById(
        "Direccion_Destinatario"
      ).value;
      const Telefono = document.getElementById(
        "Telefono"
      ).value;
      const RUT = document.getElementById(
        "RUT"
      ).value;
      const K_Oficina_Destino = document.getElementById(
        "K_Oficina_Destino"
      ).value;
      const Entrega = document.querySelector(
        'select[name="Entrega"]'
      ).value;
      const Paquetes_Ampara = document.getElementById(
        "Paquetes_Ampara"
      ).value;
      const CodigoPedido = document.getElementById(
        "CodigoPedido"
      ).value; // Obtener CodigoPedido

      // Objeto JSON con los datos del formulario y otros datos necesarios
      const jsonData = {
        ID_Sesion,
        K_Tipo_Guia,
        K_Tipo_Envio,
        F_Recoleccion,
        K_Domicilio_Recoleccion,
        D_Cliente_Remitente,
        Telefono_Remitente,
        K_Cliente_Destinatario,
        Cliente_Destinatario,
        Direccion_Destinatario,
        Telefono,
        RUT,
        K_Oficina_Destino,
        Entrega,
        Paquetes_Ampara,
        Detalle_Paquetes: JSON.stringify(getPaquetes()),

        //Campos no obligatorios para generar envíos, por eso los coloqué acá con .value
        Observaciones: document.getElementById("Observaciones").value,
        CostoMercaderia: document.getElementById("CostoMercaderia").value,
        Referencia_Pago: document.getElementById("Referencia_Pago").value,
        CodigoPedido, // Agregar CodigoPedido
        Serv_DDF: document.getElementById("Serv_DDF").value,
        Serv_Cita: document.getElementById("Serv_Cita").value,
        Latitud_Destino: document.getElementById("Latitud_Destino").value,
        Longitud_Destino: document.getElementById("Longitud_Destino").value,
      };

      // URL de la API a la que se enviarán los datos
      const url =
        "https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsInGuia_Levante";

      // Opciones para la solicitud fetch
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Host: "altis-ws.grupoagencia.com",
        },
        mode: "cors",
        body: JSON.stringify(jsonData), // Convierte el objeto JSON a string
      };

      // Realiza la solicitud fetch a la URL con las opciones proporcionadas
      const response = await fetch(url, requestOptions);

      // Verifica si la respuesta no es satisfactoria (código de estado diferente a 200)
      if (!response.ok) {
        // Obtiene los detalles del error en texto
        const errorDetails = await response.text();
        // Lanza un error con detalles específicos del error HTTP
        throw new Error(
          `HTTP error! Status: ${response.status}. Details: ${errorDetails}`
        );
      }

      // Parsea la respuesta JSON
      const responseData = await response.json();

      // Verifica si el resultado de la respuesta es 0 (éxito)
      if (responseData.result === 0) {
        // Muestra la respuesta formateada en el elemento con ID 'Respuesta'
        Respuesta.innerText = JSON.stringify(responseData.data, null, 2);
      } else {
        // Muestra un mensaje de error si la respuesta no es exitosa
        console.error("Error en el servidor:", responseData.data);
        Respuesta.innerText = "Error en el servidor: " + responseData.data;
      }
    } catch (error) {
      // Captura errores y los maneja
      if (error instanceof TypeError && error.message.includes("500")) {
        // Maneja errores de servidor interno
        console.error(
          "Error en el servidor (500 Internal Server Error). Detalles:",
          error.message
        );
      } else {
        // Maneja otros errores
        console.error("Error:", error.message);
        Respuesta.innerText = "Error desconocido: " + error.message;
      }
    }
    // Llama a la función handleResponse después de manejar la respuesta
    handleResponse();
  });

  // Función asíncrona para manejar la respuesta
  async function handleResponse() {
    try {
      // El código para enviar la solicitud y manejar la respuesta va aquí
    } catch (error) {
      // Maneja errores en la función asíncrona
      console.error("Error:", error.message);
      Respuesta.innerText = "Error desconocido: " + error.message;
    }
  }

  //FUNCION PARA AGREGAR INPUTS PARA LA SOLICITUD DE CANTIDAD DE PAQUETES

  // Agrega un event listener al botón con el ID 'agregarPaquete'
  document
    .getElementById("agregarPaquete")
    .addEventListener("click", function () {
      // Crea un nuevo div para el paquete
      const paqueteDiv = document.createElement("div");
      paqueteDiv.classList.add("paqueteDiv"); // Agrega una clase al div

      // Crea un input para el tipo de paquete
      const tipoInput = document.createElement("input");
      tipoInput.type = "text";
      tipoInput.placeholder = "Tipo"; // Placeholder del input
      tipoInput.classList.add("tipoPaquete"); // Agrega una clase al input

      // Crea un input para la cantidad de paquetes
      const cantidadInput = document.createElement("input");
      cantidadInput.type = "number";
      cantidadInput.placeholder = "Cantidad"; // Placeholder del input
      cantidadInput.classList.add("cantidadPaquete"); // Agrega una clase al input

      // Agrega los inputs al div del paquete
      paqueteDiv.appendChild(tipoInput);
      paqueteDiv.appendChild(cantidadInput);

      // Agrega el div del paquete al contenedor de paquetes
      document.getElementById("paquetesContainer").appendChild(paqueteDiv);
    });

  //FUNCION PARA OBTENER LOS PAQUETES DE FORMA QUE LO PIDE EL WEBSERVICE

  // Define una función llamada getPaquetes que recopila la información de los paquetes del formulario
  function getPaquetes() {
    // Obtiene todos los divs con la clase 'paqueteDiv'
    const paquetesDivs = document.querySelectorAll(".paqueteDiv");
    // Inicializa la variable 'paquetes' como un array vacío
    paquetes = [];

    // Itera sobre cada div de paquete
    paquetesDivs.forEach((div) => {
      // Obtiene el input de tipo y cantidad dentro de cada div de paquete
      const tipoInput = div.querySelector(".tipoPaquete");
      const cantidadInput = div.querySelector(".cantidadPaquete");

      // Obtiene el valor de tipo y cantidad, asegurándose de que estén presentes y eliminando espacios adicionales
      const tipo = tipoInput ? tipoInput.value.trim() : ""; // Valor del tipo de paquete
      const cantidad = cantidadInput ? parseInt(cantidadInput.value, 10) : 0; // Valor de la cantidad de paquetes

      // Imprime en la consola el tipo y cantidad de cada paquete
      console.log("Tipo:", tipo, "Cantidad:", cantidad);

      // Si la cantidad es un número válido y mayor que cero, crea un objeto de paquete y lo agrega al array 'paquetes'
      if (!isNaN(cantidad) && cantidad > 0) {
        const paquete = { Cantidad: cantidad }; // Objeto de paquete con cantidad

        // Si se proporciona un tipo, lo agrega al objeto del paquete
        if (tipo !== "") {
          paquete.Tipo = tipo; // Agrega el tipo de paquete al objeto
        }

        // Agrega el paquete al array 'paquetes'
        paquetes.push(paquete); // Agrega el paquete al array
      }
    });

    // Calcula el total de paquetes sumando las cantidades de todos los paquetes
    console.log(
      "Total de paquetes:",
      paquetes.reduce((total, paquete) => total + paquete.Cantidad, 0)
    );

    // Obtiene la cantidad amparada del input 'Paquetes_Ampara'
    const cantidadAmpara = parseInt(
      document.getElementById("Paquetes_Ampara").value,
      10
    ); // Cantidad amparada

    // Calcula el total de paquetes obtenidos por la función
    const totalPaquetes = paquetes.reduce(
      (total, paquete) => total + paquete.Cantidad,
      0
    );
    console.log("Total de paquetes obtenido por la función:", totalPaquetes);

    // Comprueba si el total de paquetes coincide con la cantidad amparada
    if (totalPaquetes !== cantidadAmpara) {
      console.error(
        'Error: La cantidad de paquetes no coincide con el valor de "Ampara".'
      );
    }

    // Retorna el array 'paquetes' con la información recopilada
    return paquetes;
  }


})