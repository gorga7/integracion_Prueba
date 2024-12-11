// wsArticulo.js

// Definir la función cargarArticulos y hacerla global
window.cargarArticulosDesdeWSArticulo = async function () {
    const idSesion = localStorage.getItem("ID_Session");
    if (!idSesion) {
        console.error('ID_Session no encontrado en el localStorage');
        return []; // Retorna un array vacío en caso de error
    }

    // Verificar si ya se han cargado los artículos (caché)
    if (window.articulosCache && Array.isArray(window.articulosCache)) {
        console.log('Retornando artículos desde caché.');
        return window.articulosCache;
    }

    try {
        const url = "https://altis-ws.grupoagencia.com:444/JAgenciaQA/JAgencia.asmx/wsArticulo"; // URL del servicio wsArticulo
        const data = {
            K_Articulo: 0, // Traer todos los artículos
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
        console.log('Respuesta del web service WSArticulo (JSON):', responseData);

        if (responseData.result === 0 && Array.isArray(responseData.data)) {
            window.articulosCache = responseData.data; // Cachear los artículos
            return responseData.data; // Retorna el array de artículos
        } else {
            console.error('No se encontraron datos válidos en WSArticulo.');
            return []; // Retorna un array vacío si no hay datos válidos
        }
    } catch (error) {
        console.error('Error al cargar los artículos desde WSArticulo:', error);
        return []; // Retorna un array vacío en caso de error
    }
}

// (Opcional) Función para cargar artículos en un select específico
document.addEventListener("DOMContentLoaded", (event) => {
    async function cargarArticulos() {
        const articulos = await window.cargarArticulosDesdeWSArticulo();
        const articulosSelect = document.getElementById('articulos'); // Asegúrate de que exista este elemento en tu HTML
        if (articulos.length > 0) {
            crearOpcionesSelect(articulosSelect, articulos.map(a => ({
                value: a.K_Articulo,
                text: a.D_Articulo
            })), "Seleccione Artículo");

            // Agregar evento para almacenar la selección
            articulosSelect.addEventListener('change', (e) => {
                const K_Articulo_Destino = e.target.value;
                localStorage.setItem('K_Articulo_Destino', K_Articulo_Destino);
            });
        } else {
            crearOpcionesSelect(articulosSelect, [], "No se encontraron artículos");
        }
    }

    // Llama a la función para cargar los artículos cuando la página se cargue
    cargarArticulos();
});

// Función para crear opciones en un select
function crearOpcionesSelect(selectElement, opciones, defaultText = "Seleccione") {
    selectElement.innerHTML = ''; // Limpiar opciones existentes

    // Agregar opción predeterminada
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = defaultText;
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);

    // Agregar opciones dinámicas
    opciones.forEach(opcion => {
        const option = document.createElement("option");
        option.value = opcion.value;
        option.text = opcion.text;
        selectElement.appendChild(option);
    });
}
