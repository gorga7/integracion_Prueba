// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {


  let divNombre = document.getElementById("divNombre");
  let pNombre = document.getElementById("pNombre");
  pNombre.innerHTML = `Bienvenido, ${localStorage.getItem("Nombre")}`;
  divNombre.appendChild(pNombre);



  function isLoggedIn() {
    let IDSession = localStorage.getItem("ID_Session");

    if (IDSession) {
      return true;
    } else {
      return false;
    }
  }

  window.addEventListener("load", function () {
    if (!isLoggedIn()) {
      window.location.href = "index.html";
    }
  });





});


