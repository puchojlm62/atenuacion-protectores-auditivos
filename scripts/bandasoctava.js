function informeBo() {
    const modalPlantilla = document.getElementById('modalPlantilla');
    const botonGenerarInformeModal = document.getElementById('boton-generarInformeModal');
    const botonCancelarInformeModal = document.getElementById('boton-cancelarInformeModal');

    // Función para abrir el modal (ahora solo llama a mostrar el modal)
    window.abrirModalPlantilla = function() {
        modalPlantilla.style.display = "block";
    }

    // Función para cerrar el modal
    function cerrarModal() {
        modalPlantilla.style.display = "none";
    }

    // Cerrar el modal al hacer clic en el botón "Cancelar" dentro del modal
    botonCancelarInformeModal.onclick = function() {
        cerrarModal();
    }

    // Evento onclick para el botón "Generar Informe" DENTRO DEL MODAL
    botonGenerarInformeModal.onclick = function() {
        cerrarModal(); // Cerrar el modal después de iniciar la generación del informe
        generarInformeDesdeModal(); // Llamar a la función para generar el informe
    };
}

function generarInformeDesdeModal() {
    const plantillaSeleccionada = document.querySelector('input[name="plantillaModalSeleccion"]:checked').value;
    let plantillaPromise; // Variable para almacenar la promesa de la plantilla

    if (plantillaSeleccionada === 'default') {
        // Usar plantilla predeterminada del servidor
        plantillaPromise = fetch("./plantillas/informe_bandasOctava.docx")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar la plantilla predeterminada: ${response.status} ${response.statusText}`);
                }
                return response.arrayBuffer();
            });
    } else if (plantillaSeleccionada === 'subir') {
        // Usar plantilla subida por el usuario
        const plantillaUploadInput = document.getElementById('plantillaModalUpload');
        const archivoPlantilla = plantillaUploadInput.files[0];

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

        // ... (resto del código de informeBo() para recopilar datos y renderizar - ¡NO CAMBIAR ESTO!) ...
        let valores = {
            pa: document.getElementById("nombre-protector").value || "", // Nombre protector auditivo
            sph: document.getElementById("lugar-ruido").value || "",   // Lugar de ruido
            leqA: document.querySelector("#filaRuidoMedido .leq-resultado input").value || "", // LeqA medido
            leqAo: document.querySelector("#filaRuidoAtenuado .leq-resultado input").value || "", // LeqA atenuado
            indice: document.getElementById("indice-proteccionBo").textContent || "", // Índice de protección
            // ... (marcadores de posición para las tablas) ...
        };

        // Recopilar valores de la Tabla del Protector Auditivo (Sección 1)
        valores.mf63 = document.querySelector("#filaAtenuacion td:nth-child(2) input").value || "";
        valores.mf125 = document.querySelector("#filaAtenuacion td:nth-child(3) input").value || "";
        valores.mf250 = document.querySelector("#filaAtenuacion td:nth-child(4) input").value || "";
        valores.mf500 = document.querySelector("#filaAtenuacion td:nth-child(5) input").value || "";
        valores.mf1000 = document.querySelector("#filaAtenuacion td:nth-child(6) input").value || "";
        valores.mf2000 = document.querySelector("#filaAtenuacion td:nth-child(7) input").value || "";
        valores.mf4000 = document.querySelector("#filaAtenuacion td:nth-child(8) input").value || "";
        valores.mf8000 = document.querySelector("#filaEspectroMedido td:nth-child(9) input").value || "";

        valores.ds63 = document.querySelector("#filaDesviacion td:nth-child(2) input").value || "";
        valores.ds125 = document.querySelector("#filaDesviacion td:nth-child(3) input").value || "";
        valores.ds250 = document.querySelector("#filaDesviacion td:nth-child(4) input").value || "";
        valores.ds500 = document.querySelector("#filaDesviacion td:nth-child(5) input").value || "";
        valores.ds1000 = document.querySelector("#filaDesviacion td:nth-child(6) input").value || "";
        valores.ds2000 = document.querySelector("#filaDesviacion td:nth-child(7) input").value || "";
        valores.ds4000 = document.querySelector("#filaDesviacion td:nth-child(8) input").value || "";
        valores.ds8000 = document.querySelector("#filaDesviacion td:nth-child(9) input").value || "";

        // Recopilar valores de la tabla de Espectro Medido (Sección 2)
        valores.lf63 = document.querySelector("#filaEspectroMedido td:nth-child(2) input").value || "";
        valores.lf125 = document.querySelector("#filaEspectroMedido td:nth-child(3) input").value || "";
        valores.lf250 = document.querySelector("#filaEspectroMedido td:nth-child(4) input").value || "";
        valores.lf500 = document.querySelector("#filaEspectroMedido td:nth-child(5) input").value || "";
        valores.lf1000 = document.querySelector("#filaEspectroMedido td:nth-child(6) input").value || "";
        valores.lf2000 = document.querySelector("#filaEspectroMedido td:nth-child(7) input").value || "";
        valores.lf4000 = document.querySelector("#filaEspectroMedido td:nth-child(8) input").value || "";
        valores.lf8000 = document.querySelector("#filaEspectroMedido td:nth-child(9) input").value || "";


        doc.setData(valores);

        try {
            doc.render();
            let out = doc.getZip().generate({ type: "blob" });
            saveAs(out, "Informe_BandasOctava.docx"); // Puedes cambiar el nombre del archivo de salida si quieres
        } catch (error) {
            console.error("Error generando el documento:", error);
            alert("Hubo un error al generar el informe.");
        }
    })
    .catch(error => {
        console.error("Error cargando la plantilla:", error);
        alert("No se pudo cargar la plantilla del informe.");
    });
}

// Función para abrir el modal (ahora solo llama a mostrar el modal)
window.abrirModalPlantilla = function() {
    modalPlantilla.style.display = "block";
}

// Función para cerrar el modal
function cerrarModal() {
    modalPlantilla.style.display = "none";
}

// Event listeners para el Modal (mover desde el script inline del HTML)
document.addEventListener('DOMContentLoaded', () => {
    const modalPlantilla = document.getElementById('modalPlantilla');
    const botonInformeBo = document.getElementById('boton-informeBo');
    const spanCerrarModalPlantilla = document.getElementById('cerrarModalPlantilla');
    const botonGenerarInformeModal = document.getElementById('boton-generarInformeModal');
    const botonCancelarInformeModal = document.getElementById('boton-cancelarInformeModal');
    const radioSubirPlantillaModal = document.querySelector('input[name="plantillaModalSeleccion"][value="subir"]');
    const plantillaModalUploadInput = document.getElementById('plantillaModalUpload');

    // Evento para abrir el modal al hacer clic en el botón "Generar Informe" (fuera del modal)
    botonInformeBo.onclick = abrirModalPlantilla; // Llama a la función global para abrir el modal

    // Cerrar el modal al hacer clic en la "x"
    spanCerrarModalPlantilla.onclick = cerrarModal;

    // Cerrar el modal al hacer clic en el botón "Cancelar" dentro del modal
    botonCancelarInformeModal.onclick = cerrarModal;

    // Evento onclick para el botón "Generar Informe" DENTRO DEL MODAL
    botonGenerarInformeModal.onclick = generarInformeDesdeModal;

    // Cerrar el modal al hacer clic fuera del modal
    window.onclick = function(event) {
        if (event.target == modalPlantilla) {
            cerrarModal();
        }
    }

    // Mostrar/ocultar input de archivo en el modal
    radioSubirPlantillaModal.addEventListener('change', function() {
        if (this.checked) {
            plantillaModalUploadInput.style.display = 'block';
        } else {
            plantillaModalUploadInput.style.display = 'none';
        }
    });
});