function informeSNR() {
    const modalPlantillaSNR = document.getElementById('modalPlantillaSNR');
    const botonGenerarInformeModalSNR = document.getElementById('boton-generarInformeModalSNR');
    const botonCancelarInformeModalSNR = document.getElementById('boton-cancelarInformeModalSNR');

    // Función para abrir el modal (ahora solo llama a mostrar el modal)
    window.abrirModalPlantillaSNR = function() {
        modalPlantillaSNR.style.display = "block";
    }

    // Función para cerrar el modal
    function cerrarModalSNR() {
        modalPlantillaSNR.style.display = "none";
    }

    // Cerrar el modal al hacer clic en el botón "Cancelar" dentro del modal
    botonCancelarInformeModalSNR.onclick = cerrarModalSNR;

    // Evento onclick para el botón "Generar Informe" DENTRO DEL MODAL
    botonGenerarInformeModalSNR.onclick = function() {
        cerrarModalSNR(); // Cerrar el modal después de iniciar la generación del informe
        generarInformeDesdeModalSNR(); // Llamar a la función para generar el informe
    };
}

function generarInformeDesdeModalSNR() {
    const plantillaSeleccionada = document.querySelector('input[name="plantillaModalSeleccionSNR"]:checked').value;
    let plantillaPromise; // Variable para almacenar la promesa de la plantilla

    if (plantillaSeleccionada === 'default') {
        // Usar plantilla predeterminada del servidor
        plantillaPromise = fetch("./plantillas/Informe_atenuaSNR.docx")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar la plantilla predeterminada: ${response.status} ${response.statusText}`);
                }
                return response.arrayBuffer();
            });
    } else if (plantillaSeleccionada === 'subir') {
        // Usar plantilla subida por el usuario
        const plantillaUploadInputSNR = document.getElementById('plantillaModalUploadSNR');
        const archivoPlantilla = plantillaUploadInputSNR.files[0];

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
            leqAo: sessionStorage.getItem("snr_dbA_protegido") || "", // Clave sessionStorage CORRECTA: snr_dbA_protegido
            SNR: sessionStorage.getItem("snr_SNR") || "",             // Clave sessionStorage CORRECTA: snr_SNR
            leqC: sessionStorage.getItem("snr_dbC") || "",              // Clave sessionStorage CORRECTA: snr_dbC
             indice: sessionStorage.getItem("snr_indiceProteccion") || "", // Clave sessionStorage CORRECTA: snr_indiceProteccion
            pa: sessionStorage.getItem("snr_protectorAuditivo") || "",    // Clave sessionStorage CORRECTA: snr_protectorAuditivo
            sph: sessionStorage.getItem("snr_lugarRuido") || ""         // Clave sessionStorage CORRECTA: snr_lugarRuido
        };

        doc.setData(valores);

        try {
            doc.render();
            let out = doc.getZip().generate({ type: "blob" });
            saveAs(out, "Informe_SNR.docx");
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
window.abrirModalPlantillaSNR = function() {
    const modalPlantillaSNR = document.getElementById('modalPlantillaSNR');
    modalPlantillaSNR.style.display = "block";
}

// Función para cerrar el modal
function cerrarModalSNR() {
    const modalPlantillaSNR = document.getElementById('modalPlantillaSNR');
    modalPlantillaSNR.style.display = "none";
}

// Event listeners para el Modal (mover desde el script inline del HTML)
document.addEventListener('DOMContentLoaded', () => {
    const modalPlantillaSNR = document.getElementById('modalPlantillaSNR');
    const botonInforme = document.getElementById('boton-informe');
    const spanCerrarModalPlantillaSNR = document.getElementById('cerrarModalPlantillaSNR');
    const botonGenerarInformeModalSNR = document.getElementById('boton-generarInformeModalSNR');
    const botonCancelarInformeModalSNR = document.getElementById('boton-cancelarInformeModalSNR');
    const radioSubirPlantillaModalSNR = document.querySelector('input[name="plantillaModalSeleccionSNR"][value="subir"]');
    const plantillaModalUploadSNR = document.getElementById('plantillaModalUploadSNR');

    // Evento para abrir el modal al hacer clic en el botón "Generar Informe" (fuera del modal)
    botonInforme.onclick = abrirModalPlantillaSNR; // Llama a la función global para abrir el modal

    // Cerrar el modal al hacer clic en la "x"
    spanCerrarModalPlantillaSNR.onclick = cerrarModalSNR;

    // Cerrar el modal al hacer clic en el botón "Cancelar" dentro del modal
    botonCancelarInformeModalSNR.onclick = cerrarModalSNR;

    // Evento onclick para el botón "Generar Informe" DENTRO DEL MODAL
    botonGenerarInformeModalSNR.onclick = generarInformeDesdeModalSNR;

    // Cerrar el modal al hacer clic fuera del modal
    window.onclick = function(event) {
        if (event.target == modalPlantillaSNR) {
            cerrarModalSNR();
        }
    }

    // Mostrar/ocultar input de archivo en el modal
    radioSubirPlantillaModalSNR.addEventListener('change', function() {
        if (this.checked) {
            plantillaModalUploadSNR.style.display = 'block';
        } else {
            plantillaModalUploadSNR.style.display = 'none';
        }
    });
});