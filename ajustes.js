document.addEventListener("DOMContentLoaded", function () {
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