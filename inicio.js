//HORA Y FECHA

document.addEventListener('DOMContentLoaded', function () {



    function actualizarFechaHora() {
        var fechaHoraActual = new Date();
        var fechaHoraString = fechaHoraActual.toLocaleString();
        document.getElementById('fecha-horaInicio').innerHTML = fechaHoraString;
    }

    // Actualizar la fecha y hora cada segundo
    setInterval(actualizarFechaHora, 1000);

    // Llamar a la función inicialmente para evitar un retraso de un segundo
    actualizarFechaHora();

})
