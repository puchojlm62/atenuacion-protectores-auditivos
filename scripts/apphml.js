// apphml.js

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

    // Guardar the results of the calculation.
     sessionStorage.setItem("dbA_protegido", dbA_protegido_fixed);
    sessionStorage.setItem("indiceProteccion", indiceProteccion);
    sessionStorage.setItem("indiceProteccionColor", indiceProteccionColor);
}

function borrarTodo() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });
    document.querySelector("#cbox3").checked = false;
    document.getElementById("indice-proteccionHML").textContent = "";
    document.getElementById("indice-proteccionHML").style.backgroundColor = "transparent";

    // Limpiar sessionStorage
    sessionStorage.removeItem("protectorAuditivo");
    sessionStorage.removeItem("H");
    sessionStorage.removeItem("M");
    sessionStorage.removeItem("L");
    sessionStorage.removeItem("lugarRuido");
    sessionStorage.removeItem("dbA");
    sessionStorage.removeItem("dbC");
    sessionStorage.removeItem("cbox3");
    sessionStorage.removeItem("dbA_protegido");
    sessionStorage.removeItem("indiceProteccion");
    sessionStorage.removeItem("indiceProteccionColor"); // Remove the color
}

const checkbox = document.getElementById("cbox3");

checkbox.addEventListener('change', function () {
        calcularTodoHML();
     saveAllData();
});

// Function to save input data to sessionStorage (excluding results)
function saveAllData() {
    sessionStorage.setItem("protectorAuditivo", document.getElementById("protector-auditivo").value);
    sessionStorage.setItem("H", document.querySelector("#filaH input").value);
    sessionStorage.setItem("M", document.querySelector("#filaM input").value);
    sessionStorage.setItem("L", document.querySelector("#filaL input").value);
    sessionStorage.setItem("lugarRuido", document.getElementById("ruido").value);
    sessionStorage.setItem("dbA", document.querySelector("#dbA input").value);
    sessionStorage.setItem("dbC", document.querySelector("#dbC input").value);
    sessionStorage.setItem("cbox3", document.querySelector("#cbox3").checked);
}

// Add event listeners to input elements to save data on change
document.getElementById("protector-auditivo").addEventListener("input", saveAllData);
document.querySelector("#filaH input").addEventListener("input", saveAllData);
document.querySelector("#filaM input").addEventListener("input", saveAllData);
document.querySelector("#filaL input").addEventListener("input", saveAllData);
document.getElementById("ruido").addEventListener("input", saveAllData);
document.querySelector("#dbA input").addEventListener("input", saveAllData);
document.querySelector("#dbC input").addEventListener("input", saveAllData);

// Load values from sessionStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("protector-auditivo").value = sessionStorage.getItem("protectorAuditivo") || "";
    document.querySelector("#filaH input").value = sessionStorage.getItem("H") || "";
    document.querySelector("#filaM input").value = sessionStorage.getItem("M") || "";
    document.querySelector("#filaL input").value = sessionStorage.getItem("L") || "";
    document.getElementById("ruido").value = sessionStorage.getItem("lugarRuido") || "";
    document.querySelector("#dbA input").value = sessionStorage.getItem("dbA") || "";
    document.querySelector("#dbC input").value = sessionStorage.getItem("dbC") || "";
    document.getElementById("cbox3").checked = sessionStorage.getItem("cbox3") === "true";

    // Load calculated results
    document.querySelector("#filaRuidoAtenuadoHML input").value = sessionStorage.getItem("dbA_protegido") || "";
    document.getElementById("indice-proteccionHML").textContent = sessionStorage.getItem("indiceProteccion") || "";
    const storedColor = sessionStorage.getItem("indiceProteccionColor");
    document.getElementById("indice-proteccionHML").style.backgroundColor = storedColor || "transparent";
});