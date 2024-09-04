/*########ATENCION##############################  
  ESTE WEBSERVICE ESTÁ DESARROLLADO PARA UTILIZARLO EN UN SELECT COMO EL QUE ESTÁ A CONTINUACION:
  SE PUEDE ADAPTAR A LO QUE SE REQUIERA, PERO FUNCIONA BIEN ASÍ


 </div>

      <select class="form-select" aria-label="Default select example" id="sucursales">
        <option selected disabled>Seleccione Sucursal</option>
        
      </select>

    </div>
  */
  
  // Función para obtener las agencias   



  addEventListener("DOMContentLoaded", (event) => {

    async function cargarSucursales() {
        const idSesion = localStorage.getItem("ID_Session");
        // Reemplaza con el ID de sesión real
    
        if (!idSesion) {
            console.error('ID_Session no encontrado en el localStorage');
            return;
        }
    
        try {
            const url = "https://altis-ws.grupoagencia.com:444/JAgenciaQA/JAgencia.asmx/wsOficina";
            const data = {
                K_Oficina: 0, // Traer todas las agencias
                ID_Sesion: idSesion
            };
    
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "cors",
                body: JSON.stringify(data),
            };
    
            const response = await fetch(url, requestOptions);
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const responseData = await response.json();
    
            // Muestra en consola para depuración
            console.log('Respuesta del web service (JSON):', responseData);
    
            const sucursales = document.getElementById('sucursales');
            if (responseData.result === 0 && responseData.data) {
                sucursales.innerHTML = '<option selected disabled>Seleccione Sucursal</option>';
                responseData.data.forEach(agencia => {
                    const option = document.createElement('option');
                    option.value = agencia.K_Oficina;
                    option.textContent = agencia.D_Oficina;
                    sucursales.appendChild(option);
                });
    
                // Agregar evento para almacenar la selección
                sucursales.addEventListener('change', (e) => {
                    const K_Oficina_Destino = e.target.value;
                    localStorage.setItem('K_Oficina_Destino', K_Oficina_Destino);
                });
            } else {
                console.error('No se encontraron datos válidos.');
            }
        } catch (error) {
            console.error('Error al cargar las sucursales:', error);
        }
    }
    
    // Llama a la función para cargar las sucursales cuando la página se cargue
    
        cargarSucursales();


});