document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById('movable-button');
    const speed = 3; // Ajusta la velocidad de movimiento
    const amplitude = 20; // Amplitud del movimiento en porcentaje de viewport
    const frequency = 0.02; // Frecuencia del movimiento

    let angle = 0; // Ángulo para la animación sinusoidal

    function moveButton(timestamp) {
        // Calcula la nueva posición del botón usando una función sinusoidal para movimiento suave
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonWidth = button.offsetWidth;
        const buttonHeight = button.offsetHeight;

        angle += speed;

        const x = (viewportWidth - buttonWidth) / 2 + (viewportWidth * amplitude / 100) * Math.sin(frequency * angle);
        const y = (viewportHeight - buttonHeight) / 2 + (viewportHeight * amplitude / 100) * Math.cos(frequency * angle);

        button.style.left = `${Math.min(Math.max(0, x), viewportWidth - buttonWidth)}px`;
        button.style.top = `${Math.min(Math.max(0, y), viewportHeight - buttonHeight)}px`;

        // Continúa la animación
        requestAnimationFrame(moveButton);
    }

    // Inicia la animación
    requestAnimationFrame(moveButton);



    //Actualizar fecha en tiempo real
    function actualizarFechaHora() {
        var fechaHoraActual1 = new Date();
        var fechaHoraString1 = fechaHoraActual1.toLocaleString();
        document.getElementById("fecha-horaAjustes").innerHTML = fechaHoraString1;
    }

    // Actualizar la fecha y hora cada segundo
    setInterval(actualizarFechaHora, 1000);

    // Llamar a la función inicialmente para evitar un retraso de un segundo
    actualizarFechaHora();



})


function openSettings(option) {
    // Simplemente para este ejemplo, mostraremos un mensaje indicando qué opción fue seleccionada
    let settingsContent = document.getElementById("settings-content");
    settingsContent.innerHTML =
        "<p>Seleccionaste la opción " +
        option +
        ". Los detalles de la configuración se mostrarían aquí.</p>";
}

function exitSettings() {
    // Simplemente para este ejemplo, mostraremos un mensaje de despedida
    let settingsContent = document.getElementById("settings-content");
    settingsContent.innerHTML =
        "<p>¡Hasta luego! Gracias por usar nuestro sistema de ajustes.</p>";
}