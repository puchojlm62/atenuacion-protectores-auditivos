function informeHML() {
    const modalPlantillaHML = document.getElementById('modalPlantillaHML');
    const botonGenerarInformeModalHML = document.getElementById('boton-generarInformeModalHML');
    const botonCancelarInformeModalHML = document.getElementById('boton-cancelarInformeModalHML');

    // Función para abrir el modal (ahora solo llama a mostrar el modal)
    window.abrirModalPlantillaHML = function() {
        modalPlantillaHML.style.display = "block";
    }

    // Función para cerrar el modal
    function cerrarModalHML() {
        modalPlantillaHML.style.display = "none";
    }

    // Cerrar el modal al hacer clic en el botón "Cancelar" dentro del modal
    botonCancelarInformeModalHML.onclick = cerrarModalHML;

    // Evento onclick para el botón "Generar Informe" DENTRO DEL MODAL
    botonGenerarInformeModalHML.onclick = function() {
        cerrarModalHML(); // Cerrar el modal después de iniciar la generación del informe
        generarInformeDesdeModalHML(); // Llamar a la función para generar el informe
    };
}

function generarInformeDesdeModalHML() {
    const plantillaSeleccionada = document.querySelector('input[name="plantillaModalSeleccionHML"]:checked').value;
    let plantillaPromise; // Variable para almacenar la promesa de la plantilla

    if (plantillaSeleccionada === 'default') {
        // Usar plantilla predeterminada del servidor
        plantillaPromise = fetch("./plantillas/Informe_atenuaHLM.docx")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar la plantilla predeterminada: ${response.status} ${response.statusText}`);
                }
                return response.arrayBuffer();
            });
    } else if (plantillaSeleccionada === 'subir') {
        // Usar plantilla subida por el usuario
        const plantillaUploadInputHML = document.getElementById('plantillaModalUploadHML');
        const archivoPlantilla = plantillaUploadInputHML.files[0];

        if (!archivoPlantilla) {
            alert("Por favor, selecciona un archivo de plantilla.");
            return Promise.reject("No se seleccionó ningún archivo de plantilla."); // Rechazar promesa para detener el proceso
        }

        plantillaPromise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                resolve(event.target.result); // Resolver promesa con el ArrayBuffer del archivo
            };
            reader.onerror = function(error) {
                reject(`Error al leer el archivo de plantilla: ${error}`); // Rechazar promesa en caso de error de lectura
            };
            reader.readAsArrayBuffer(archivoPlantilla); // Leer el archivo como ArrayBuffer
        });
    } else {
        alert("Opción de plantilla no válida.");
        return;
    }

    plantillaPromise.then(data => { // Usar .then() para procesar la promesa resuelta (ya sea fetch o FileReader)
        let zip;
        try {
            zip = new JSZip(data);
        } catch (error) {
            console.error("Error al cargar el ZIP con JSZip:", error);
            alert("Error al procesar la plantilla Word (JSZip).");
            return;
        }

        let doc = new window.docxtemplater().loadZip(zip);

        let valores = {
            leqAo: sessionStorage.getItem("hml_dbA_protegido") || "", // Clave sessionStorage CORRECTA: hml_dbA_protegido
            H: sessionStorage.getItem("hml_H") || "",             // Clave sessionStorage CORRECTA: hml_H
            M: sessionStorage.getItem("hml_M") || "",             // Clave sessionStorage CORRECTA: hml_M
            L: sessionStorage.getItem("hml_L") || "",             // Clave sessionStorage CORRECTA: hml_L
            leqC: sessionStorage.getItem("hml_dbC") || "",          // Clave sessionStorage CORRECTA: hml_dbC
            leqA: sessionStorage.getItem("hml_dbA") || "",          // Clave sessionStorage CORRECTA: hml_dbA
            indice: sessionStorage.getItem("hml_indiceProteccion") || "", // Clave sessionStorage CORRECTA: hml_indiceProteccion
            pa: sessionStorage.getItem("hml_protectorAuditivo") || "",    // Clave sessionStorage CORRECTA: hml_protectorAuditivo
            sph: sessionStorage.getItem("hml_lugarRuido") || ""         // Clave sessionStorage CORRECTA: hml_lugarRuido
        };

        doc.setData(valores);

        try {
            doc.render();
            let out = doc.getZip().generate({ type: "blob" });
            saveAs(out, "Informe_HML.docx");
        } catch (error) {
            console.error("Error generando el documento:", error);
            alert("Hubo un error al generar el informe.");
        }
    }).catch(error => { // Capturar errores de la promesa plantillaPromise
        console.error("Error al cargar la plantilla:", error);
            alert("No se pudo cargar la plantilla del informe: " + error); // Mostrar mensaje de error al usuario
    });
}

// Función para abrir el modal (ahora solo llama a mostrar el modal)
window.abrirModalPlantillaHML = function() {
    const modalPlantillaHML = document.getElementById('modalPlantillaHML');
    modalPlantillaHML.style.display = "block";
}

// Función para cerrar el modal
function cerrarModalHML() {
    const modalPlantillaHML = document.getElementById('modalPlantillaHML');
    modalPlantillaHML.style.display = "none";
}

// Event listeners para el Modal (mover desde el script inline del HTML)
document.addEventListener('DOMContentLoaded', () => {
    const modalPlantillaHML = document.getElementById('modalPlantillaHML');
    const botonInforme = document.getElementById('boton-informe');
    const spanCerrarModalPlantillaHML = document.getElementById('cerrarModalPlantillaHML');
    const botonGenerarInformeModalHML = document.getElementById('boton-generarInformeModalHML');
    const botonCancelarInformeModalHML = document.getElementById('boton-cancelarInformeModalHML');
    const radioSubirPlantillaModalHML = document.querySelector('input[name="plantillaModalSeleccionHML"][value="subir"]');
    const plantillaModalUploadHML = document.getElementById('plantillaModalUploadHML');

    // Evento para abrir el modal al hacer clic en el botón "Generar Informe" (fuera del modal)
    botonInforme.onclick = abrirModalPlantillaHML; // Llama a la función global para abrir el modal

    // Cerrar el modal al hacer clic en la "x"
    spanCerrarModalPlantillaHML.onclick = cerrarModalHML;

    // Cerrar el modal al hacer clic en el botón "Cancelar" dentro del modal
    botonCancelarInformeModalHML.onclick = cerrarModalHML;

    // Evento onclick para el botón "Generar Informe" DENTRO DEL MODAL
    botonGenerarInformeModalHML.onclick = generarInformeDesdeModalHML;

    // Cerrar el modal al hacer clic fuera del modal
    window.onclick = function(event) {
        if (event.target == modalPlantillaHML) {
            cerrarModalHML();
        }
    }

    // Mostrar/ocultar input de archivo en el modal
    radioSubirPlantillaModalHML.addEventListener('change', function() {
        if (this.checked) {
            plantillaModalUploadHML.style.display = 'block';
        } else {
            plantillaModalUploadHML.style.display = 'none';
        }
    });
});