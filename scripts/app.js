// app.js

function calcularProteccionSupuesta() {
    let atenuacionMediaInputs = Array.from(document.querySelectorAll("#filaAtenuacion input"));
    let desviacionStandardInputs = Array.from(document.querySelectorAll("#filaDesviacion input"));
    let proteccionSupuestaInputs = Array.from(document.querySelectorAll("#filaProteccion input"));

    let datosCompletos = true;

    for (let i = 0; i < atenuacionMediaInputs.length; i++) {
        if (i === 0) continue; // Omitir la primera columna (frecuencia)

        let valorAtenuacion = atenuacionMediaInputs[i].value.trim();
        let valorDesviacion = desviacionStandardInputs[i].value.trim();

        if (valorAtenuacion === "" || valorDesviacion === "") {
            datosCompletos = false;
            break;
        }
    }

    if (!datosCompletos) {
        alert("Por favor, llene todos los datos. La columna de la frecuencia 63 Hz es optativa.");
        return;
    }

    for (let i = 0; i < atenuacionMediaInputs.length; i++) {
        let valorAtenuacion = atenuacionMediaInputs[i].value.trim();
        let valorDesviacion = desviacionStandardInputs[i].value.trim();

        if (valorAtenuacion === "" || valorDesviacion === "") {
            proteccionSupuestaInputs[i].value = "";
        } else {
            proteccionSupuestaInputs[i].value = (parseFloat(valorAtenuacion) - parseFloat(valorDesviacion)).toFixed(1);
        }
    }

    let espectroMedidoInputs = Array.from(document.querySelectorAll("#filaEspectroMedido input"));
    let espectroProtegidoInputs = Array.from(document.querySelectorAll("#filaEspectroProtegido input"));

    for (let i = 0; i < espectroMedidoInputs.length; i++) {
        let valorMedido = espectroMedidoInputs[i].value.trim();
        let valorSupuesta = proteccionSupuestaInputs[i].value.trim();

        if (valorMedido === "" || valorSupuesta === "") {
            espectroProtegidoInputs[i].value = "";
        } else {
            espectroProtegidoInputs[i].value = (parseFloat(valorMedido) - parseFloat(valorSupuesta)).toFixed(1);
        }
    }

    return espectroProtegidoInputs;
}

function calcularEspectro(filaId) {
    let ponderacionA = [-26.0, -16.0, -9.0, -3.0, 0, 1.0, 1.0, -1.0];
    let lA = [];
    let espectroInputs = Array.from(document.querySelectorAll(`#${filaId} input`));

    for (let i = 0; i < espectroInputs.length; i++) {
        let valorMedido = espectroInputs[i].value.trim();

        if (valorMedido === "" || isNaN(parseFloat(valorMedido))) {
            console.error(`Valor no numérico o vacío en #${filaId}:`, valorMedido);
            continue;
        }

        lA.push(parseFloat(valorMedido) + ponderacionA[i]);
    }

    return lA;
}

function calcularLeq(listaDecibelios) {
    let sumaPotencia = 0;

    for (let i = 0; i < listaDecibelios.length; i++) {
        let decibelio = listaDecibelios[i];
        let potencia = Math.pow(10, decibelio / 10);
        sumaPotencia += potencia;
    }

    let leq = 10 * Math.log10(sumaPotencia);
    return leq;
}

function calcularTodo() {
    calcularProteccionSupuesta();

    let lAMedido = calcularEspectro("filaEspectroMedido");
    let lAAtenuado = calcularEspectro("filaEspectroProtegido");
    let indiceProteccion = "";

    console.log("Valores de lA (medido):", lAMedido);
    console.log("Valores de lA (atenuado):", lAAtenuado);

    let leqMedido = calcularLeq(lAMedido);
    let leqAtenuado = calcularLeq(lAAtenuado);

    const checkbox = document.getElementById("cbox2");
    const sumar4 = checkbox.checked;

    if (sumar4) {
        leqAtenuado += 4;
    }

    document.querySelector("#filaRuidoMedido .leq-resultado input").value = leqMedido.toFixed(1);
    document.querySelector("#filaRuidoAtenuado .leq-resultado input").value = leqAtenuado.toFixed(1);

    if (leqAtenuado < 70.0) {
        indiceProteccion = "SOBREPROTEGIDO";
        document.getElementById("indice-proteccionBo").style.backgroundColor = "orange";
    } else if (leqAtenuado < 80.0) {
        indiceProteccion = "BUENA";
        document.getElementById("indice-proteccionBo").style.backgroundColor = "lightgreen";
    } else if (leqAtenuado > 85.0) {
        indiceProteccion = "INSUFICIENTE";
        document.getElementById("indice-proteccionBo").style.backgroundColor = "red";
    } else {
        indiceProteccion = "ACEPTABLE";
        document.getElementById("indice-proteccionBo").style.backgroundColor = "lightyellow";
    }

    document.getElementById("indice-proteccionBo").style.color = "black";
    document.getElementById("indice-proteccionBo").textContent = indiceProteccion;

    guardarEnSessionStorageBandasOctava(); // Guardar al calcular
}

function borrarTodoBo() {
    const inputs = document.querySelectorAll('input[type="text"]'); // Select only text inputs

    inputs.forEach(input => {
        input.value = '';
    });

    document.getElementById("cbox2").checked = false;
    document.getElementById("indice-proteccionBo").textContent = "";
    document.getElementById("indice-proteccionBo").style.backgroundColor = "transparent";

    // Eliminar solo los datos específicos de esta página
    const prefix = "bo_";
   // Get all keys in sessionStorage
    const keys = Object.keys(sessionStorage);

    // Iterate over the keys and remove those with the prefix
    keys.forEach(key => {
        if (key.startsWith(prefix)) {
            sessionStorage.removeItem(key);
        }
    });
}

const checkbox = document.getElementById("cbox2");

checkbox.addEventListener('change', function () {
    calcularTodo();
});

function guardarEnSessionStorageBandasOctava() {
     // Save all data, including results
    sessionStorage.setItem("bo_nombreProtector", document.getElementById("nombre-protector").value);
    sessionStorage.setItem("bo_lugarRuido", document.getElementById("lugar-ruido").value);
    sessionStorage.setItem("bo_cbox2", document.getElementById("cbox2").checked);
    sessionStorage.setItem("bo_indiceProteccion", document.getElementById("indice-proteccionBo").textContent);
    sessionStorage.setItem("bo_indiceProteccionColor", document.getElementById("indice-proteccionBo").style.backgroundColor);
    sessionStorage.setItem("bo_leqMedido", document.querySelector("#filaRuidoMedido .leq-resultado input").value);
    sessionStorage.setItem("bo_leqAtenuado", document.querySelector("#filaRuidoAtenuado .leq-resultado input").value);

    guardarValoresTabla("filaAtenuacion", "bo_");
    guardarValoresTabla("filaDesviacion", "bo_");
    guardarValoresTabla("filaProteccion", "bo_");
    guardarValoresTabla("filaEspectroMedido", "bo_");
    guardarValoresTabla("filaEspectroProtegido", "bo_");
}

function guardarValoresTabla(filaId, prefix = "") { // Parámetro prefix
    const inputs = document.querySelectorAll(`#${filaId} input`);
    const valores = Array.from(inputs).map(input => input.value);
    sessionStorage.setItem(prefix + filaId, JSON.stringify(valores)); // Usar prefijo
}

function saveAllData() {
     sessionStorage.setItem("bo_nombreProtector", document.getElementById("nombre-protector").value);
    sessionStorage.setItem("bo_lugarRuido", document.getElementById("lugar-ruido").value);
    sessionStorage.setItem("bo_cbox2", document.getElementById("cbox2").checked);
     guardarValoresTabla("filaAtenuacion", "bo_");
    guardarValoresTabla("filaDesviacion", "bo_");
    guardarValoresTabla("filaEspectroMedido", "bo_");
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosDesdeSessionStorage();

   // Add event listeners to input elements to save data on change
    document.getElementById("nombre-protector").addEventListener("input", saveAllData);
    document.getElementById("lugar-ruido").addEventListener("input", saveAllData);

    // Attach event listeners to the table inputs
    const tableRows = ["filaAtenuacion", "filaDesviacion", "filaEspectroMedido"];
    tableRows.forEach(rowId => {
        const inputs = document.querySelectorAll(`#${rowId} input`);
        inputs.forEach(input => {
            input.addEventListener("input", saveAllData);
        });
    });
});

function cargarDatosDesdeSessionStorage() {
    const prefix = "bo_";

    document.getElementById("nombre-protector").value = sessionStorage.getItem("bo_nombreProtector") || "";
    document.getElementById("lugar-ruido").value = sessionStorage.getItem("bo_lugarRuido") || "";
    document.querySelector("#filaRuidoMedido .leq-resultado input").value = sessionStorage.getItem("bo_leqMedido") || "";
    document.querySelector("#filaRuidoAtenuado .leq-resultado input").value = sessionStorage.getItem("bo_leqAtenuado") || "";
    document.getElementById("cbox2").checked = sessionStorage.getItem("bo_cbox2") === "true";
    document.getElementById("indice-proteccionBo").textContent = sessionStorage.getItem("bo_indiceProteccion") || "";
    const storedColor = sessionStorage.getItem("bo_indiceProteccionColor");
    document.getElementById("indice-proteccionBo").style.backgroundColor = storedColor || "";

    cargarValoresTabla("filaAtenuacion", "bo_");
    cargarValoresTabla("filaDesviacion", "bo_");
    cargarValoresTabla("filaProteccion", "bo_");
    cargarValoresTabla("filaEspectroMedido", "bo_");
    cargarValoresTabla("filaEspectroProtegido", "bo_");
}

function cargarValoresTabla(filaId, prefix = "") { // Parámetro prefix
    const valoresGuardados = sessionStorage.getItem(prefix + filaId); // Usar prefijo
    if (valoresGuardados) {
        const valores = JSON.parse(valoresGuardados);
        const inputs = document.querySelectorAll(`#${filaId} input`);
        inputs.forEach((input, index) => {
            input.value = valores[index] || "";
        });
    }
}

function informeBo() {
    fetch("./plantillas/informe_bandasOctava.docx") // Asegúrate de que el nombre de tu plantilla .docx sea correcto y esté en la carpeta 'plantillas'
        .then(response => response.arrayBuffer())
        .then(data => {
            let zip;

            try {
                zip = new JSZip(data);
            } catch (error) {
                console.error("Error al cargar el ZIP con JSZip:", error);
                alert("Error al procesar la plantilla Word (JSZip).");
                return;
            }

            let doc = new window.docxtemplater().loadZip(zip);

            // Recopilar valores de los inputs y checkbox de la página 'bandasoctava.html'
            let valores = {
                pa: document.getElementById("nombre-protector").value || "", // Nombre protector auditivo
                sph: document.getElementById("lugar-ruido").value || "",   // Lugar de ruido
                leqA: document.querySelector("#filaRuidoMedido .leq-resultado input").value || "", // LeqA medido
                leqAo: document.querySelector("#filaRuidoAtenuado .leq-resultado input").value || "", // LeqA atenuado
                indice: document.getElementById("indice-proteccionBo").textContent || "", // Índice de protección
                // ... (marcadores de posición para las tablas) ...
            };

            // Recopilar valores de la tabla de Atenuación del Protector Auditivo (Sección 1)
            valores.mf63 = document.querySelector("#filaAtenuacion td:nth-child(2) input").value || "";
            valores.mf125 = document.querySelector("#filaAtenuacion td:nth-child(3) input").value || "";
            valores.mf250 = document.querySelector("#filaAtenuacion td:nth-child(4) input").value || "";
            valores.mf500 = document.querySelector("#filaAtenuacion td:nth-child(5) input").value || "";
            valores.mf1000 = document.querySelector("#filaAtenuacion td:nth-child(6) input").value || "";
            valores.mf2000 = document.querySelector("#filaAtenuacion td:nth-child(7) input").value || "";
            valores.mf4000 = document.querySelector("#filaAtenuacion td:nth-child(8) input").value || "";
            valores.mf8000 = document.querySelector("#filaAtenuacion td:nth-child(9) input").value || "";

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