function calcularTodoHML() {
    let dbA = parseFloat(document.querySelector("#dbA input").value) || null;
    let dbC = parseFloat(document.querySelector("#dbC input").value) || null;
    let H = parseFloat(document.querySelector("#filaH input").value) || null;
    let M = parseFloat(document.querySelector("#filaM input").value) || null;
    let L = parseFloat(document.querySelector("#filaL input").value) || null;

    if ([dbA, dbC, H, M, L].includes(null)) {
        alert("Por favor, ingrese todos los valores antes de calcular.");
        return;
    }

    let diferencia = dbC - dbA;
    let atenuacion;
    if (diferencia <= 2) {
        atenuacion = M - (H - M) / 4 * (diferencia - 2);
    } else {
        atenuacion = M - (M - L) / 8 * (diferencia - 2);
    }

    let dbA_protegido = dbA - atenuacion;
    if (document.querySelector("#cbox3").checked) {
        dbA_protegido += 4;
    }

    const dbA_protegido_fixed = dbA_protegido.toFixed(1);
    document.querySelector("#filaRuidoAtenuadoHML input").value = dbA_protegido_fixed;

    let indiceProteccion;
    let indiceProteccionColor;
    if (dbA_protegido < 70.0) {
        indiceProteccion = "SOBREPROTEGIDO";
        indiceProteccionColor = "orange";
    } else if (dbA_protegido < 80.0) {
        indiceProteccion = "BUENA";
        indiceProteccionColor = "lightgreen";
    } else if (dbA_protegido > 85.0) {
        indiceProteccion = "INSUFICIENTE";
        indiceProteccionColor = "red";
    } else {
        indiceProteccion = "ACEPTABLE";
        indiceProteccionColor = "lightyellow";
    }

    document.getElementById("indice-proteccionHML").style.color = "black";
    document.getElementById("indice-proteccionHML").textContent = indiceProteccion;
    document.getElementById("indice-proteccionHML").style.backgroundColor = indiceProteccionColor;

    // Guardar los resultados del cálculo.
    sessionStorage.setItem("hml_dbA_protegido", dbA_protegido_fixed); // Clave sessionStorage específica de HML
    sessionStorage.setItem("hml_indiceProteccion", indiceProteccion); // Clave sessionStorage específica de HML
    sessionStorage.setItem("hml_indiceProteccionColor", indiceProteccionColor); // Clave sessionStorage específica de HML
}

function borrarTodoHML() { // Renombrado a borrarTodoHML()
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });
    document.querySelector("#cbox3").checked = false;
    document.getElementById("indice-proteccionHML").textContent = "";
    document.getElementById("indice-proteccionHML").style.backgroundColor = "transparent";

    // Limpiar sessionStorage (claves sessionStorage específicas de HML)
    sessionStorage.removeItem("hml_protectorAuditivo");
    sessionStorage.removeItem("hml_H");
    sessionStorage.removeItem("hml_M");
    sessionStorage.removeItem("hml_L");
    sessionStorage.removeItem("hml_lugarRuido");
    sessionStorage.removeItem("hml_dbA");
    sessionStorage.removeItem("hml_dbC");
    sessionStorage.removeItem("hml_cbox3");
    sessionStorage.removeItem("hml_dbA_protegido");
    sessionStorage.removeItem("hml_indiceProteccion");
    sessionStorage.removeItem("hml_indiceProteccionColor"); // Remove the color
}

const checkbox = document.getElementById("cbox3");

checkbox.addEventListener('change', function () {
    calcularTodoHML();
    saveAllDataHML(); // Usar saveAllDataHML() para guardar con claves específicas de HML
});

// Guardar los datos en sessionStorage (claves sessionStorage específicas de HML)
function saveAllDataHML() {
    sessionStorage.setItem("hml_protectorAuditivo", document.getElementById("protector-auditivo").value); // Clave sessionStorage específica de HML
    sessionStorage.setItem("hml_H", document.querySelector("#filaH input").value); // Clave sessionStorage específica de HML
    sessionStorage.setItem("hml_M", document.querySelector("#filaM input").value); // Clave sessionStorage específica de HML
    sessionStorage.setItem("hml_L", document.querySelector("#filaL input").value); // Clave sessionStorage específica de HML
    sessionStorage.setItem("hml_lugarRuido", document.getElementById("ruido").value); // Clave sessionStorage específica de HML
    sessionStorage.setItem("hml_dbC", document.querySelector("#dbC input").value); // Clave sessionStorage específica de HML
    sessionStorage.setItem("hml_dbA", document.querySelector("#dbA input").value); // Clave sessionStorage específica de HML
    sessionStorage.setItem("hml_cbox3", document.querySelector("#cbox3").checked); // Clave sessionStorage específica de HML
}

// Agregar event listeners a los inputs
document.getElementById("protector-auditivo").addEventListener("input", saveAllDataHML); // Usar saveAllDataHML()
document.querySelector("#filaH input").addEventListener("input", saveAllDataHML); // Usar saveAllDataHML()
document.querySelector("#filaM input").addEventListener("input", saveAllDataHML); // Usar saveAllDataHML()
document.querySelector("#filaL input").addEventListener("input", saveAllDataHML); // Usar saveAllDataHML()
document.getElementById("ruido").addEventListener("input", saveAllDataHML); // Usar saveAllDataHML()
document.querySelector("#dbA input").addEventListener("input", saveAllDataHML); // Usar saveAllDataHML()
document.querySelector("#dbC input").addEventListener("input", saveAllDataHML); // Usar saveAllDataHML()

// Cargar los valores de sessionStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("protector-auditivo").value = sessionStorage.getItem("hml_protectorAuditivo") || ""; // Clave sessionStorage específica de HML
    document.querySelector("#filaH input").value = sessionStorage.getItem("hml_H") || ""; // Clave sessionStorage específica de HML
    document.querySelector("#filaM input").value = sessionStorage.getItem("hml_M") || ""; // Clave sessionStorage específica de HML
    document.querySelector("#filaL input").value = sessionStorage.getItem("hml_L") || ""; // Clave sessionStorage específica de HML
    document.getElementById("ruido").value = sessionStorage.getItem("hml_lugarRuido") || ""; // Clave sessionStorage específica de HML
    document.querySelector("#dbA input").value = sessionStorage.getItem("hml_dbA") || ""; // Clave sessionStorage específica de HML
    document.querySelector("#dbC input").value = sessionStorage.getItem("hml_dbC") || ""; // Clave sessionStorage específica de HML
    document.getElementById("cbox3").checked = sessionStorage.getItem("hml_cbox3") === "true"; // Clave sessionStorage específica de HML

    document.querySelector("#filaRuidoAtenuadoHML input").value = sessionStorage.getItem("hml_dbA_protegido") || ""; // Clave sessionStorage específica de HML
    document.getElementById("indice-proteccionHML").textContent = sessionStorage.getItem("hml_indiceProteccion") || ""; // Clave sessionStorage específica de HML
    document.getElementById("indice-proteccionHML").style.backgroundColor = sessionStorage.getItem("hml_indiceProteccionColor") || "transparent"; // Clave sessionStorage específica de HML
});