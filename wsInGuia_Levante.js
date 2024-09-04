document.addEventListener("DOMContentLoaded", function () {

    // Actualizar fecha y hora
    function actualizarFechaHora() {
      var fechaHoraActual = new Date();
      var fechaHoraString = fechaHoraActual.toLocaleString();
      document.getElementById('fecha-horaEnvio').innerHTML = fechaHoraString;
    }
  
    // Actualizar la fecha y hora cada segundo
    setInterval(actualizarFechaHora, 1000);
    actualizarFechaHora();
  
    let btnCrearEnvio = document.getElementById("btnCrearEnvio");
    let Respuesta = document.getElementById("Respuesta");
    let paquetes = [];
  
    btnCrearEnvio.addEventListener("click", async function (event) {
      event.preventDefault();
  
      try {
          // Obtiene el ID de sesión
          const ID_Sesion = localStorage.getItem("ID_Session");
          if (!ID_Sesion) {
              console.error("ID_Sesion no encontrado en localStorage.");
              return;
          }
  
          // Obtiene los valores del formulario
          const K_Tipo_Guia = document.querySelector('select[name="K_Tipo_Guia"]').value;
          const K_Tipo_Envio = document.querySelector('select[name="K_Tipo_Envio"]').value;
          const F_Recoleccion = document.getElementById("F_Recoleccion").value;
          const K_Domicilio_Recoleccion = document.getElementById("K_Domicilio_Recoleccion").value.trim(); // No es obligatorio
          const D_Cliente_Remitente = document.getElementById("D_Cliente_Remitente").value;
          const Telefono_Remitente = document.getElementById("Telefono_Remitente").value;
          const K_Cliente_Destinatario = document.getElementById("K_Cliente_Destinatario").value;
          const Cliente_Destinatario = document.getElementById("Cliente_Destinatario").value;
          const Direccion_Destinatario = document.getElementById("Direccion_Destinatario").value.trim();
          const Telefono = document.getElementById("Telefono").value;
          const RUT = document.getElementById("RUT").value;
  
          // Obtiene el valor de la sucursal seleccionada
          const sucursalesSelect = document.getElementById('sucursales');
          let K_Oficina_Destino = sucursalesSelect ? sucursalesSelect.value : "";
  
          // Obtiene el valor de 'Entrega'
          const Entrega = document.querySelector('select[name="Entrega"]').value;
  
          // Validaciones y ajuste de valores
          if (Entrega == 1) {
              // Entrega = 1: K_Oficina_Destino debe tener un valor
              if (!K_Oficina_Destino) {
                  console.error("Debe seleccionar una agencia para Entrega = 1.");
                  Respuesta.innerText = "Debe seleccionar una agencia para Entrega = 1.";
                  return;
              }
  
              // Entrega = 1: Direccion_Destinatario debe estar vacío
              if (Direccion_Destinatario) {
                  console.error("Para Entrega = 1, la dirección del destinatario debe estar vacía.");
                  Respuesta.innerText = "Para Entrega = 1, la dirección del destinatario debe estar vacía.";
                  return;
              }
          } else if (Entrega == 2) {
              // Entrega = 2: K_Oficina_Destino debe ser una cadena vacía
              K_Oficina_Destino = "";
                      
              // Entrega = 2: Direccion_Destinatario debe tener un valor
              if (!Direccion_Destinatario) {
                  console.error("Debe indicar una dirección de destinatario válida para Entrega = 2.");
                  Respuesta.innerText = "Debe indicar una dirección de destinatario válida para Entrega = 2.";
                  return;
              }
  
              // Deshabilitar el select de sucursales
              sucursalesSelect.disabled = true;
          } else {
              console.error("Valor de Entrega inválido.");
              Respuesta.innerText = "Valor de Entrega inválido.";
              return;
          }
  
          const Paquetes_Ampara = document.getElementById("Paquetes_Ampara").value;
          const CodigoPedido = document.getElementById("CodigoPedido").value;
  
          const jsonData = {
              ID_Sesion,
              K_Tipo_Guia,
              K_Tipo_Envio,
              F_Recoleccion,
              K_Domicilio_Recoleccion, // No es obligatorio
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
              Observaciones: document.getElementById("Observaciones").value,
              CostoMercaderia: document.getElementById("CostoMercaderia").value,
              Referencia_Pago: document.getElementById("Referencia_Pago").value,
              CodigoPedido,
              Serv_DDF: document.getElementById("Serv_DDF").value,
              Serv_Cita: document.getElementById("Serv_Cita").value,
              Latitud_Destino: document.getElementById("Latitud_Destino").value,
              Longitud_Destino: document.getElementById("Longitud_Destino").value,
          };
  
          const url = "https://altis-ws.grupoagencia.com:444/JAgenciaQA/JAgencia.asmx/wsInGuia_Levante";
          const requestOptions = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Host: "altis-ws.grupoagencia.com",
              },
              mode: "cors",
              body: JSON.stringify(jsonData),
          };
  
          const response = await fetch(url, requestOptions);
  
          if (!response.ok) {
              const errorDetails = await response.text();
              throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails}`);
          }
  
          const responseData = await response.json();
  
          if (responseData.result === 0) {
              Respuesta.innerText = JSON.stringify(responseData.data, null, 2);
          } else {
              console.error("Error en el servidor:", responseData.data);
              Respuesta.innerText = "Error en el servidor: " + responseData.data;
          }
      } catch (error) {
          if (error instanceof TypeError && error.message.includes("500")) {
              console.error("Error en el servidor (500 Internal Server Error). Detalles:", error.message);
          } else {
              console.error("Error:", error.message);
              Respuesta.innerText = "Error desconocido: " + error.message;
          }
      }
      handleResponse();
    });
  
    async function handleResponse() {
      try {
          // Aquí iría el código para manejar la respuesta
      } catch (error) {
          console.error("Error:", error.message);
          Respuesta.innerText = "Error desconocido: " + error.message;
      }
    }
  
    document.getElementById("agregarPaquete").addEventListener("click", function () {
      const paqueteDiv = document.createElement("div");
      paqueteDiv.classList.add("paqueteDiv");
  
      const tipoInput = document.createElement("input");
      tipoInput.type = "text";
      tipoInput.placeholder = "Tipo";
      tipoInput.classList.add("tipoPaquete");
  
      const cantidadInput = document.createElement("input");
      cantidadInput.type = "number";
      cantidadInput.placeholder = "Cantidad";
      cantidadInput.classList.add("cantidadPaquete");
  
      paqueteDiv.appendChild(tipoInput);
      paqueteDiv.appendChild(cantidadInput);
  
      document.getElementById("paquetesContainer").appendChild(paqueteDiv);
    });
  
    function getPaquetes() {
      const paquetesDivs = document.querySelectorAll(".paqueteDiv");
      paquetes = [];
  
      paquetesDivs.forEach((div) => {
          const tipoInput = div.querySelector(".tipoPaquete");
          const cantidadInput = div.querySelector(".cantidadPaquete");
  
          const tipo = tipoInput ? tipoInput.value.trim() : "";
          const cantidad = cantidadInput ? parseInt(cantidadInput.value, 10) : 0;
  
          if (tipo && !isNaN(cantidad) && cantidad > 0) {
              paquetes.push({
                  tipo,
                  cantidad
              });
          }
      });
  
      return paquetes;
    }
  
    // Habilitar el select de sucursales cuando Entrega cambie
    document.querySelector('select[name="Entrega"]').addEventListener('change', function () {
      const sucursalesSelect = document.getElementById('sucursales');
      if (this.value == 2) {
          sucursalesSelect.disabled = true;
          Direccion_Destinatario.disabled = false;
      } else if (this.value==1) {
        Direccion_Destinatario.disabled = true;
        sucursalesSelect.disabled = false
      }
      else {
          sucursalesSelect.disabled = false;
      }
    });
  
  });