
//Este código valida que solo se ingresen numeros
// js/validacionDecimal.js
function validarNumeroReal(input) {
  let valor = input.value;

  // Eliminar caracteres no válidos
  valor = valor.replace(/[^0-9.,-]/g, '');

  // Permitir solo un signo menos al principio
  if (valor.indexOf('-') > 0) {
    valor = valor.replace(/-/g, '');
  }
  if (valor.startsWith('-') && valor.indexOf('-') !== valor.length -1) {
    valor = valor.replace(/-/g, '');
    valor = "-" + valor;
  }
  // Permitir solo una coma o punto
  const comaIndex = valor.indexOf(',');
  const puntoIndex = valor.indexOf('.');

  if (comaIndex !== -1 && puntoIndex !== -1) {
    // Si hay ambos, eliminar el segundo
    valor = valor.slice(0, Math.max(comaIndex, puntoIndex)) + valor.slice(Math.max(comaIndex, puntoIndex) + 1);
  } else if (comaIndex !== -1) {
    // Si hay coma, reemplazarla por punto
    valor = valor.replace(',', '.');
  }

  // Limitar a dos decimales
  const puntoIndexFinal = valor.indexOf('.');
  if (puntoIndexFinal !== -1 && valor.length > puntoIndexFinal + 3) {
    valor = valor.slice(0, puntoIndexFinal + 3);
  }

  // Eliminar números negativos y el cero
  if (parseFloat(valor) <= 0 || valor == "-" || valor == "-."){
    valor = "";
  }

  input.value = valor;
}


function toggleMenu() {
    const menu = document.querySelector(".menu");
    menu.classList.toggle("activo");
}

/* para abrir y cerrar el modal acerca de */
document.addEventListener("DOMContentLoaded", function () {
  // Get the modal "Acerca de"
  const modalAcerca = document.getElementById("modalAcerca");

  // Get the link that opens the "Acerca de" modal
  const openModal = document.getElementById("openModal");

  // Get the <span> element that closes the "Acerca de" modal - **CORRECTED SELECTOR HERE**
  const spanCerrarModalAcerca = modalAcerca.querySelector(".close"); // Use modalAcerca.querySelector()


  // Abrir el modal al hacer clic en el enlace "Acerca de"
  if (openModal) { // Check if openModal element exists
      openModal.addEventListener("click", function (event) {
          event.preventDefault(); // Evita que el enlace recargue la página
          modalAcerca.style.display = "block";
      });
  }


  // Cerrar el modal al hacer clic en la "X" (inside "Acerca de" modal)
  if (spanCerrarModalAcerca) { // Check if spanCerrarModalAcerca exists
      spanCerrarModalAcerca.onclick = function() {
          modalAcerca.style.display = "none";
      }
  }


  // Cerrar el modal si el usuario hace clic fuera del contenido del modal
  window.onclick = function(event) {
      if (event.target == modalAcerca) {
          modalAcerca.style.display = "none";
      }
  }
});